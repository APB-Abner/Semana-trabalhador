import type { LiveQuestion, LiveQuestionBucket, LiveQuestionType } from '../types/realtime.ts';
import { getBucketForQuestionType, validateLiveQuestionMetadata } from './live-question-catalog.ts';

export const LIVE_SESSION_SIZE = 10;
export const LIVE_SESSION_COMPETITIVE_COUNT = 4;
export const LIVE_SESSION_PARTICIPATORY_COUNT = 6;

type SessionSlot = {
  bucket: LiveQuestionBucket;
  preferredType?: LiveQuestionType;
};

export type LiveSessionSelectionOptions = {
  questions: LiveQuestion[];
  recentQuestionIds?: string[];
  sessionTemplate?: SessionSlot[];
};

const DEFAULT_SESSION_TEMPLATE: SessionSlot[] = [
  { bucket: 'competitive', preferredType: 'multiple_choice' },
  { bucket: 'competitive', preferredType: 'true_false' },
  { bucket: 'competitive', preferredType: 'multiple_select' },
  { bucket: 'participatory', preferredType: 'poll' },
  { bucket: 'participatory', preferredType: 'word_cloud' },
  { bucket: 'participatory', preferredType: 'scale' },
  { bucket: 'participatory', preferredType: 'ranking' },
  { bucket: 'participatory', preferredType: 'qna' },
  { bucket: 'participatory', preferredType: 'poll' },
  { bucket: 'competitive', preferredType: 'multiple_choice' },
];

const TYPE_LIMITS: Partial<Record<LiveQuestionType, number>> = {
  qna: 1,
  word_cloud: 1,
};

const DEFAULT_TYPE_LIMIT = 2;

function getTypeLimit(type: LiveQuestionType) {
  return TYPE_LIMITS[type] ?? DEFAULT_TYPE_LIMIT;
}

function getQuestionBucket(question: LiveQuestion): LiveQuestionBucket {
  return question.bucket ?? getBucketForQuestionType(question.type);
}

function isEnabled(question: LiveQuestion) {
  return question.enabled !== false;
}

function validateSessionTemplate(template: SessionSlot[]) {
  const competitiveCount = template.filter((slot) => slot.bucket === 'competitive').length;
  const participatoryCount = template.filter((slot) => slot.bucket === 'participatory').length;

  if (template.length !== LIVE_SESSION_SIZE) {
    throw new Error(`Sessao live precisa ter ${LIVE_SESSION_SIZE} perguntas.`);
  }

  if (competitiveCount !== LIVE_SESSION_COMPETITIVE_COUNT || participatoryCount !== LIVE_SESSION_PARTICIPATORY_COUNT) {
    throw new Error('Template live precisa ter 4 competitivas e 6 participativas.');
  }
}

function canUseQuestion(
  question: LiveQuestion,
  slot: SessionSlot,
  selectedIds: Set<string>,
  typeCounts: Map<LiveQuestionType, number>,
) {
  if (selectedIds.has(question.id)) {
    return false;
  }

  if (getQuestionBucket(question) !== slot.bucket) {
    return false;
  }

  if ((typeCounts.get(question.type) ?? 0) >= getTypeLimit(question.type)) {
    return false;
  }

  if (slot.preferredType && question.type !== slot.preferredType) {
    return false;
  }

  return true;
}

function pickQuestion(
  questions: LiveQuestion[],
  slot: SessionSlot,
  selectedIds: Set<string>,
  typeCounts: Map<LiveQuestionType, number>,
  recentQuestionIds: Set<string>,
) {
  const preferredNonRecent = questions.find((question) => (
    !recentQuestionIds.has(question.id)
    && canUseQuestion(question, slot, selectedIds, typeCounts)
  ));

  if (preferredNonRecent) {
    return preferredNonRecent;
  }

  const preferredRecent = questions.find((question) => canUseQuestion(question, slot, selectedIds, typeCounts));

  if (preferredRecent) {
    return preferredRecent;
  }

  if (!slot.preferredType) {
    return null;
  }

  const relaxedSlot: SessionSlot = { bucket: slot.bucket };
  const fallbackNonRecent = questions.find((question) => (
    !recentQuestionIds.has(question.id)
    && canUseQuestion(question, relaxedSlot, selectedIds, typeCounts)
  ));

  if (fallbackNonRecent) {
    return fallbackNonRecent;
  }

  return questions.find((question) => canUseQuestion(question, relaxedSlot, selectedIds, typeCounts)) ?? null;
}

export function selectLiveSessionQuestions({
  questions,
  recentQuestionIds = [],
  sessionTemplate = DEFAULT_SESSION_TEMPLATE,
}: LiveSessionSelectionOptions): LiveQuestion[] {
  validateSessionTemplate(sessionTemplate);

  const enabledQuestions = questions.filter(isEnabled);
  const recentSet = new Set(recentQuestionIds);
  const selectedIds = new Set<string>();
  const typeCounts = new Map<LiveQuestionType, number>();
  const selected: LiveQuestion[] = [];

  enabledQuestions.forEach(validateLiveQuestionMetadata);

  sessionTemplate.forEach((slot) => {
    const question = pickQuestion(enabledQuestions, slot, selectedIds, typeCounts, recentSet);

    if (!question) {
      throw new Error(`Nao ha perguntas suficientes para preencher o slot ${slot.bucket}/${slot.preferredType ?? 'any'}.`);
    }

    selected.push(question);
    selectedIds.add(question.id);
    typeCounts.set(question.type, (typeCounts.get(question.type) ?? 0) + 1);
  });

  return selected;
}

export function summarizeLiveQuestions(questions: LiveQuestion[]) {
  return questions.reduce((summary, question) => {
    const bucket = getQuestionBucket(question);

    summary.total += 1;
    summary.byType[question.type] = (summary.byType[question.type] ?? 0) + 1;
    summary.byBucket[bucket] = (summary.byBucket[bucket] ?? 0) + 1;

    return summary;
  }, {
    total: 0,
    byType: {} as Record<string, number>,
    byBucket: {} as Record<string, number>,
  });
}
