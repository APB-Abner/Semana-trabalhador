import {
  getPigeonAccessoriesBySlot,
  getPigeonAccessoryById,
  hasAccessoryConflict,
  isAccessoryAllowedInSlot,
} from './accessories';
import { DEFAULT_PIGEON_AVATAR_STATE, createEmptyPigeonEquipment } from './defaultAvatar';
import { isPigeonExpressionId, isPigeonPatternId } from './options';
import { getPigeonPresetById } from './presets';
import { PIGEON_ACCESSORY_SLOTS } from './types';
import type {
  EquippedPigeonAccessories,
  PigeonAccessoryId,
  PigeonAccessorySlot,
  PigeonAvatarPalette,
  PigeonAvatarState,
  PigeonExpressionId,
  PigeonUnlockMetadata,
  PigeonPatternId,
  PigeonPresetId,
} from './types';

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const RANDOM_ACCESSORY_LIMIT = 4;
const UNLOCK_SOURCE_IDS = new Set<PigeonUnlockMetadata['source']>(['default', 'progression', 'event', 'admin']);
const RANDOM_SLOT_CHANCES: Record<PigeonAccessorySlot, number> = {
  head: 0.78,
  face: 0.74,
  neck: 0.55,
  body: 0.66,
  hand: 0.5,
  extra: 0.34,
};

const RANDOM_PALETTES: PigeonAvatarPalette[] = [
  { primary: '#D7DBE3', secondary: '#596273', chest: '#F7F8FA', beak: '#F2A13A', accent: '#8FA3B8' },
  { primary: '#C7D8E6', secondary: '#3F5F79', chest: '#F4F8FB', beak: '#EFA13D', accent: '#2FA7B3' },
  { primary: '#C9CED4', secondary: '#7F8794', chest: '#F8F8F3', beak: '#EFA13D', accent: '#F05AA6' },
  { primary: '#D5D8DE', secondary: '#596273', chest: '#F3F5F7', beak: '#EFA13D', accent: '#8C7B55' },
  { primary: '#AEB7C3', secondary: '#566173', chest: '#F6F4EE', beak: '#ECA13A', accent: '#D8DEE9' },
  { primary: '#EEF1F5', secondary: '#15181E', chest: '#FFFFFF', beak: '#EFA13D', accent: '#C9B36A' },
];

const RANDOM_PATTERN_IDS: PigeonPatternId[] = ['solid', 'wing-bars', 'speckles', 'chest-dots'];
const RANDOM_EXPRESSION_IDS: PigeonExpressionId[] = ['bright', 'happy', 'focused', 'wink', 'sleepy'];

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_PATTERN.test(value);
}

function pickRandom<T>(items: T[], rng: () => number): T {
  return items[Math.min(Math.floor(rng() * items.length), items.length - 1)];
}

function shuffleSlots(rng: () => number): PigeonAccessorySlot[] {
  const slots = [...PIGEON_ACCESSORY_SLOTS];

  for (let index = slots.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [slots[index], slots[swapIndex]] = [slots[swapIndex], slots[index]];
  }

  return slots;
}

function isAccessoryUnlocked(avatar: PigeonAvatarState, accessoryId: PigeonAccessoryId) {
  const unlockedIds = avatar.unlocks?.unlockedAccessoryIds;

  return !unlockedIds?.length || unlockedIds.includes(accessoryId);
}

function sanitizePalette(value: unknown): PigeonAvatarPalette {
  const palette = typeof value === 'object' && value !== null ? value as Partial<PigeonAvatarPalette> : {};
  const fallback = DEFAULT_PIGEON_AVATAR_STATE.palette;

  return {
    primary: isHexColor(palette.primary) ? palette.primary : fallback.primary,
    secondary: isHexColor(palette.secondary) ? palette.secondary : fallback.secondary,
    chest: isHexColor(palette.chest) ? palette.chest : fallback.chest,
    beak: isHexColor(palette.beak) ? palette.beak : fallback.beak,
    accent: isHexColor(palette.accent) ? palette.accent : fallback.accent,
  };
}

function sanitizeEquipment(value: unknown): EquippedPigeonAccessories {
  const incoming = typeof value === 'object' && value !== null ? value as EquippedPigeonAccessories : {};
  const equipped = createEmptyPigeonEquipment();

  PIGEON_ACCESSORY_SLOTS.forEach((slot) => {
    const accessoryId = incoming[slot];

    if (typeof accessoryId !== 'string' || !isAccessoryAllowedInSlot(slot, accessoryId)) {
      equipped[slot] = null;
      return;
    }

    if (hasAccessoryConflict(accessoryId, equipped)) {
      equipped[slot] = null;
      return;
    }

    equipped[slot] = accessoryId;
  });

  return equipped;
}

function sanitizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const entries = value
    .filter((item): item is string => typeof item === 'string' && item.length > 0 && item.length <= 80)
    .slice(0, 100);

  return entries.length ? [...new Set(entries)] : undefined;
}

function sanitizeUnlocks(value: unknown): PigeonUnlockMetadata | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const source = value as Partial<PigeonUnlockMetadata>;
  const unlockedAccessoryIds = sanitizeStringList(source.unlockedAccessoryIds);
  const unlockedPresetIds = sanitizeStringList(source.unlockedPresetIds) as PigeonUnlockMetadata['unlockedPresetIds'];
  const unlockSource = UNLOCK_SOURCE_IDS.has(source.source) ? source.source : undefined;

  if (!unlockedAccessoryIds && !unlockedPresetIds && !unlockSource) {
    return undefined;
  }

  return {
    ...(unlockedAccessoryIds ? { unlockedAccessoryIds } : {}),
    ...(unlockedPresetIds ? { unlockedPresetIds } : {}),
    ...(unlockSource ? { source: unlockSource } : {}),
  };
}

export function normalizePigeonAvatarState(value?: Partial<PigeonAvatarState> | null): PigeonAvatarState {
  const source = value ?? DEFAULT_PIGEON_AVATAR_STATE;
  const selectedPresetId = source.selectedPresetId && getPigeonPresetById(source.selectedPresetId)
    ? source.selectedPresetId
    : null;

  return {
    baseId: 'official-pigeon',
    palette: sanitizePalette(source.palette),
    patternId: isPigeonPatternId(source.patternId) ? source.patternId : DEFAULT_PIGEON_AVATAR_STATE.patternId,
    expressionId: isPigeonExpressionId(source.expressionId) ? source.expressionId : DEFAULT_PIGEON_AVATAR_STATE.expressionId,
    equipped: sanitizeEquipment(source.equipped),
    selectedPresetId,
    unlocks: sanitizeUnlocks(source.unlocks),
    details: {
      blush: typeof source.details?.blush === 'boolean' ? source.details.blush : DEFAULT_PIGEON_AVATAR_STATE.details.blush,
    },
  };
}

export function equipPigeonAccessory(
  currentState: PigeonAvatarState,
  slot: PigeonAccessorySlot,
  accessoryId: PigeonAccessoryId | null,
): PigeonAvatarState {
  const nextEquipment = { ...currentState.equipped, [slot]: null };

  if (accessoryId) {
    const accessory = getPigeonAccessoryById(accessoryId);

    if (accessory?.slot === slot && !hasAccessoryConflict(accessoryId, nextEquipment)) {
      nextEquipment[slot] = accessoryId;
    }
  }

  return normalizePigeonAvatarState({ ...currentState, equipped: nextEquipment, selectedPresetId: null });
}

export function applyPigeonPreset(currentState: PigeonAvatarState, presetId: PigeonPresetId): PigeonAvatarState {
  const preset = getPigeonPresetById(presetId);

  if (!preset) {
    return normalizePigeonAvatarState(currentState);
  }

  return normalizePigeonAvatarState({
    ...currentState,
    palette: preset.palette,
    patternId: preset.patternId,
    expressionId: preset.expressionId,
    equipped: { ...createEmptyPigeonEquipment(), ...preset.equipped },
    selectedPresetId: preset.id,
    details: { ...currentState.details, ...preset.details },
  });
}

export function randomizePigeonAvatarState(
  currentState: PigeonAvatarState,
  rng: () => number = Math.random,
): PigeonAvatarState {
  const normalized = normalizePigeonAvatarState(currentState);
  let nextAvatar = normalizePigeonAvatarState({
    ...normalized,
    palette: pickRandom(RANDOM_PALETTES, rng),
    patternId: pickRandom(RANDOM_PATTERN_IDS, rng),
    expressionId: pickRandom(RANDOM_EXPRESSION_IDS, rng),
    equipped: createEmptyPigeonEquipment(),
    selectedPresetId: null,
    details: {
      ...normalized.details,
      blush: rng() > 0.16,
    },
  });

  shuffleSlots(rng).forEach((slot) => {
    const equippedCount = Object.values(nextAvatar.equipped).filter(Boolean).length;

    if (equippedCount >= RANDOM_ACCESSORY_LIMIT || rng() > RANDOM_SLOT_CHANCES[slot]) {
      return;
    }

    const availableAccessories = getPigeonAccessoriesBySlot(slot)
      .filter((accessory) => isAccessoryUnlocked(normalized, accessory.id));

    if (!availableAccessories.length) {
      return;
    }

    nextAvatar = equipPigeonAccessory(nextAvatar, slot, pickRandom(availableAccessories, rng).id);
  });

  return normalizePigeonAvatarState(nextAvatar);
}

export function createPigeonAvatarState(overrides?: Partial<PigeonAvatarState>): PigeonAvatarState {
  return normalizePigeonAvatarState({
    ...DEFAULT_PIGEON_AVATAR_STATE,
    ...overrides,
    palette: { ...DEFAULT_PIGEON_AVATAR_STATE.palette, ...overrides?.palette },
    equipped: { ...DEFAULT_PIGEON_AVATAR_STATE.equipped, ...overrides?.equipped },
    details: { ...DEFAULT_PIGEON_AVATAR_STATE.details, ...overrides?.details },
  });
}
