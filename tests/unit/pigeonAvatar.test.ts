import { describe, expect, it } from 'vitest';
import {
  applyPigeonPreset,
  createPigeonAvatarState,
  DEFAULT_PIGEON_AVATAR_STATE,
  normalizePigeonAvatarState,
  PIGEON_PRESETS,
} from '../../src/features/pigeon-avatar';

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
});
