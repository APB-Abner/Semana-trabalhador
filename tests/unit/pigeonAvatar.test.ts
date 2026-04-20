import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  applyPigeonPreset,
  createPigeonAvatarState,
  DEFAULT_PIGEON_AVATAR_STATE,
  normalizePigeonAvatarState,
  PIGEON_PRESETS,
  resolvePigeonPalette,
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

  it('resolves the five user-facing colors into internal pigeon paint tokens', () => {
    const tokens = resolvePigeonPalette({
      primary: '#D8DBF8',
      secondary: '#9AA9FF',
      chest: '#F5F5FA',
      beak: '#F7B33A',
      accent: '#4FE0C4',
    });

    expect(tokens.headBase).toBe('#D8DBF8');
    expect(tokens.wingBase).toBe('#9AA9FF');
    expect(tokens.chestFeather).toBe('#F5F5FA');
    expect(tokens.beakBase).toBe('#F7B33A');
    expect(tokens.feet).toBe(tokens.beakBase);
    expect(tokens.accentMain).toBe('#4FE0C4');
    expect(tokens.headShadow).not.toBe(tokens.headBase);
    expect(tokens.wingDark).not.toBe(tokens.wingBase);
    expect(tokens.beakShadow).not.toBe(tokens.beakBase);
    expect(Object.values(tokens).every((color) => /^#[0-9A-F]{6}$/.test(color))).toBe(true);
  });

  it('keeps numeric SVG layer ids mapped through valid CSS selectors', () => {
    const svg = readFileSync(resolve(process.cwd(), 'src/features/pigeon-avatar/assets/pombo-base.svg'), 'utf8');

    expect(svg).not.toMatch(/#[0-9][\w-]*\s+\./);
    expect(svg).toContain('[id="02_PESCOCO_Plumagem"]');
    expect(svg).toContain('[id="03_CORPO"]');
    expect(svg).toContain('[id="04_ASA_E_CAUDA"]');
    expect(svg).toContain('[id="06_PES"]');
  });
});
