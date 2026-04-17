import { PIGEON_ACCESSORY_SLOTS } from './types';
import { PIGEON_BASE } from './pigeonBase';
import type { EquippedPigeonAccessories, PigeonAvatarState } from './types';

export function createEmptyPigeonEquipment(): EquippedPigeonAccessories {
  return PIGEON_ACCESSORY_SLOTS.reduce<EquippedPigeonAccessories>((equipment, slot) => {
    equipment[slot] = null;
    return equipment;
  }, {});
}

export const DEFAULT_PIGEON_AVATAR_STATE: PigeonAvatarState = {
  baseId: PIGEON_BASE.id,
  palette: PIGEON_BASE.defaultPalette,
  patternId: PIGEON_BASE.defaultPatternId,
  expressionId: PIGEON_BASE.defaultExpressionId,
  equipped: createEmptyPigeonEquipment(),
  selectedPresetId: null,
  unlocks: {
    source: 'default',
  },
  details: {
    blush: true,
  },
};
