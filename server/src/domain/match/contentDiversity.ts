import type { LiveQuestionDifficulty } from '../../types/realtime.ts';

export type MatchContentMetadata = {
  topic?: string;
  difficulty?: LiveQuestionDifficulty;
  contentGroup?: string;
  sessionTags?: string[];
};

export type ContentDiversityProfile = {
  topics: Set<string>;
  groups: Set<string>;
  tags: Set<string>;
  difficulties: Map<LiveQuestionDifficulty, number>;
};

type DiversityLevel = {
  avoidUsedGroups: boolean;
  avoidSelectedGroups: boolean;
  avoidUsedTopics: boolean;
  avoidSelectedTopics: boolean;
  avoidUsedTags: boolean;
  balanceDifficulty: boolean;
};

export const DIVERSITY_FALLBACK_LEVELS: DiversityLevel[] = [
  {
    avoidUsedGroups: true,
    avoidSelectedGroups: true,
    avoidUsedTopics: true,
    avoidSelectedTopics: true,
    avoidUsedTags: true,
    balanceDifficulty: true,
  },
  {
    avoidUsedGroups: true,
    avoidSelectedGroups: true,
    avoidUsedTopics: true,
    avoidSelectedTopics: true,
    avoidUsedTags: true,
    balanceDifficulty: false,
  },
  {
    avoidUsedGroups: true,
    avoidSelectedGroups: true,
    avoidUsedTopics: true,
    avoidSelectedTopics: true,
    avoidUsedTags: false,
    balanceDifficulty: false,
  },
  {
    avoidUsedGroups: true,
    avoidSelectedGroups: true,
    avoidUsedTopics: false,
    avoidSelectedTopics: true,
    avoidUsedTags: false,
    balanceDifficulty: false,
  },
  {
    avoidUsedGroups: false,
    avoidSelectedGroups: true,
    avoidUsedTopics: false,
    avoidSelectedTopics: true,
    avoidUsedTags: false,
    balanceDifficulty: false,
  },
  {
    avoidUsedGroups: false,
    avoidSelectedGroups: false,
    avoidUsedTopics: false,
    avoidSelectedTopics: false,
    avoidUsedTags: false,
    balanceDifficulty: false,
  },
];

export function normalizeContentKey(value?: string) {
  return value?.trim().replace(/\s+/g, '-').toLocaleLowerCase('pt-BR') ?? '';
}

export function getContentGroup(item: MatchContentMetadata) {
  return normalizeContentKey(item.contentGroup ?? item.topic);
}

export function getContentTopic(item: MatchContentMetadata) {
  return normalizeContentKey(item.topic);
}

export function getContentTags(item: MatchContentMetadata) {
  const contentTags = item.sessionTags ?? [];
  return contentTags.map(normalizeContentKey).filter(Boolean);
}

export function createDiversityProfile(items: MatchContentMetadata[] = []): ContentDiversityProfile {
  const profile: ContentDiversityProfile = {
    topics: new Set<string>(),
    groups: new Set<string>(),
    tags: new Set<string>(),
    difficulties: new Map<LiveQuestionDifficulty, number>(),
  };

  items.forEach((item) => {
    const topic = getContentTopic(item);
    const group = getContentGroup(item);

    if (topic) {
      profile.topics.add(topic);
    }

    if (group) {
      profile.groups.add(group);
    }

    getContentTags(item).forEach((tag) => profile.tags.add(tag));

    if (item.difficulty) {
      profile.difficulties.set(item.difficulty, (profile.difficulties.get(item.difficulty) ?? 0) + 1);
    }
  });

  return profile;
}

function hasTagOverlap(item: MatchContentMetadata, profile: ContentDiversityProfile) {
  return getContentTags(item).some((tag) => profile.tags.has(tag));
}

function exceedsDifficultyBalance(item: MatchContentMetadata, selectedProfile: ContentDiversityProfile, count: number) {
  if (!item.difficulty || count < 3) {
    return false;
  }

  return (selectedProfile.difficulties.get(item.difficulty) ?? 0) >= 2;
}

function fitsDiversityLevel(
  item: MatchContentMetadata,
  selectedProfile: ContentDiversityProfile,
  usedProfile: ContentDiversityProfile,
  level: DiversityLevel,
  count: number,
) {
  const topic = getContentTopic(item);
  const group = getContentGroup(item);

  if (level.avoidUsedGroups && group && usedProfile.groups.has(group)) {
    return false;
  }

  if (level.avoidSelectedGroups && group && selectedProfile.groups.has(group)) {
    return false;
  }

  if (level.avoidUsedTopics && topic && usedProfile.topics.has(topic)) {
    return false;
  }

  if (level.avoidSelectedTopics && topic && selectedProfile.topics.has(topic)) {
    return false;
  }

  if (level.avoidUsedTags && hasTagOverlap(item, usedProfile)) {
    return false;
  }

  if (level.balanceDifficulty && exceedsDifficultyBalance(item, selectedProfile, count)) {
    return false;
  }

  return true;
}

export function selectDiverseContent<T extends { id: string } & MatchContentMetadata>({
  items,
  count,
  usedItems = [],
}: {
  items: T[];
  count: number;
  usedItems?: MatchContentMetadata[];
}) {
  const selected: T[] = [];
  const selectedIds = new Set<string>();
  const usedProfile = createDiversityProfile(usedItems);

  for (let index = 0; index < count; index += 1) {
    let picked: T | null = null;

    for (const level of DIVERSITY_FALLBACK_LEVELS) {
      const selectedProfile = createDiversityProfile(selected);
      picked = items.find((item) => (
        !selectedIds.has(item.id)
        && fitsDiversityLevel(item, selectedProfile, usedProfile, level, count)
      )) ?? null;

      if (picked) {
        break;
      }
    }

    if (!picked) {
      break;
    }

    selected.push(picked);
    selectedIds.add(picked.id);
  }

  return selected;
}

export function orderContentForOpeningVariety<T extends MatchContentMetadata>(items: T[]) {
  const remaining = [...items];
  const ordered: T[] = [];

  while (remaining.length > 0) {
    const previous = ordered[ordered.length - 1];
    const nextIndex = previous
      ? remaining.findIndex((item) => (
          getContentTopic(item) !== getContentTopic(previous)
          && item.difficulty !== previous.difficulty
        ))
      : 0;
    const fallbackIndex = nextIndex >= 0
      ? nextIndex
      : Math.max(0, remaining.findIndex((item) => getContentTopic(item) !== getContentTopic(previous)));
    const [next] = remaining.splice(fallbackIndex >= 0 ? fallbackIndex : 0, 1);
    ordered.push(next);
  }

  return ordered;
}
