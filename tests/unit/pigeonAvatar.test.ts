import { describe, expect, it } from 'vitest';
import {
  applyPigeonPreset,
  createPigeonAvatarState,
  DEFAULT_PIGEON_AVATAR_STATE,
  normalizePigeonAvatarState,
  PIGEON_PRESETS,
  randomizePigeonAvatarState,
} from '../../src/features/pigeon-avatar';
import { isAccessoryAllowedInSlot } from '../../src/features/pigeon-avatar/model/accessories';
import { PIGEON_ACCESSORY_SLOTS, type PigeonAccessorySlot } from '../../src/features/pigeon-avatar/model/types';

describe('pigeon avatar model', () => {
  it('normalizes invalid payloads back to the official pigeon base', () => {
    const avatar = normalizePigeonAvatarState({
      baseId: 'robot' as never,
      palette: {
        primary: 'blue',
        secondary: '#123456',
      } as never,
      patternId: 'scales' as never,
      expressionId: 'angry' as never,
      equipped: {
        head: 'round-glasses',
        face: 'missing-item',
      },
    });

    expect(avatar.baseId).toBe('official-pigeon');
    expect(avatar.palette.primary).toBe(DEFAULT_PIGEON_AVATAR_STATE.palette.primary);
    expect(avatar.palette.secondary).toBe('#123456');
    expect(avatar.patternId).toBe(DEFAULT_PIGEON_AVATAR_STATE.patternId);
    expect(avatar.expressionId).toBe(DEFAULT_PIGEON_AVATAR_STATE.expressionId);
    expect(avatar.equipped.head).toBeNull();
    expect(avatar.equipped.face).toBeNull();
  });

  it('builds every preset as a loadout of the same pigeon', () => {
    const baseAvatar = createPigeonAvatarState();

    PIGEON_PRESETS.forEach((preset) => {
      const avatar = applyPigeonPreset(baseAvatar, preset.id);

      expect(avatar.baseId).toBe('official-pigeon');
      expect(avatar.selectedPresetId).toBe(preset.id);
      expect(avatar.palette).toEqual(preset.palette);
    });
  });

  it('randomizes only valid unlocked accessories through the current slot rules', () => {
    const unlockedAccessoryIds = ['rally-cap', 'round-glasses', 'office-tie'];
    const randomizedAvatar = randomizePigeonAvatarState(
      createPigeonAvatarState({
        selectedPresetId: 'gamer',
        unlocks: {
          source: 'progression',
          unlockedAccessoryIds,
        },
      }),
      () => 0.1,
    );

    expect(randomizedAvatar.baseId).toBe('official-pigeon');
    expect(randomizedAvatar.selectedPresetId).toBeNull();
    expect(Object.values(randomizedAvatar.equipped).filter(Boolean)).toHaveLength(3);

    PIGEON_ACCESSORY_SLOTS.forEach((slot: PigeonAccessorySlot) => {
      const accessoryId = randomizedAvatar.equipped[slot];

      if (!accessoryId) {
        return;
      }

      expect(isAccessoryAllowedInSlot(slot, accessoryId)).toBe(true);
      expect(unlockedAccessoryIds).toContain(accessoryId);
    });
  });
});
