import { getPigeonAccessoryById, hasAccessoryConflict, isAccessoryAllowedInSlot } from './accessories';
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
  PigeonPresetId,
} from './types';

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_PATTERN.test(value);
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
    unlocks: source.unlocks,
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

export function createPigeonAvatarState(overrides?: Partial<PigeonAvatarState>): PigeonAvatarState {
  return normalizePigeonAvatarState({
    ...DEFAULT_PIGEON_AVATAR_STATE,
    ...overrides,
    palette: { ...DEFAULT_PIGEON_AVATAR_STATE.palette, ...overrides?.palette },
    equipped: { ...DEFAULT_PIGEON_AVATAR_STATE.equipped, ...overrides?.equipped },
    details: { ...DEFAULT_PIGEON_AVATAR_STATE.details, ...overrides?.details },
  });
}
