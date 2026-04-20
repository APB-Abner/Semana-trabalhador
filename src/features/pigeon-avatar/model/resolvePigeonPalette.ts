import type { PigeonAvatarPalette } from './types';

type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type ResolvedPigeonPalette = {
  contour: string;
  ink: string;
  headBase: string;
  headMid: string;
  headShadow: string;
  headDeepShadow: string;
  bodyBase: string;
  bodyShadow: string;
  bodyDeepShadow: string;
  faceFeather: string;
  chestFeather: string;
  chestShadow: string;
  wingLight: string;
  wingBase: string;
  wingDark: string;
  tailDark: string;
  beakBase: string;
  beakLight: string;
  beakShadow: string;
  feet: string;
  feetLight: string;
  feetShadow: string;
  accentMain: string;
  accentShadow: string;
  accentDeepShadow: string;
  blush: string;
};

const CONTOUR = '#0E0C13';
const INK = '#121E2E';
const WHITE = '#FFFFFF';
const FALLBACK_PALETTE: PigeonAvatarPalette = {
  primary: '#9A99B1',
  secondary: '#524E80',
  chest: '#F0EAF2',
  beak: '#C53E35',
  accent: '#3D7A75',
};

function normalizeHex(color: string | undefined, fallback: string) {
  if (!color || !/^#[0-9a-f]{6}$/i.test(color)) {
    return fallback;
  }

  return color.toUpperCase();
}

function hexToRgb(hex: string): Rgb {
  const normalized = hex.slice(1);

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function componentToHex(component: number) {
  return Math.round(Math.max(0, Math.min(255, component))).toString(16).padStart(2, '0').toUpperCase();
}

function rgbToHex({ r, g, b }: Rgb) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function mix(from: string, to: string, amount: number) {
  const source = hexToRgb(from);
  const target = hexToRgb(to);
  const ratio = Math.max(0, Math.min(1, amount));

  return rgbToHex({
    r: source.r + (target.r - source.r) * ratio,
    g: source.g + (target.g - source.g) * ratio,
    b: source.b + (target.b - source.b) * ratio,
  });
}

function lighten(color: string, amount: number) {
  return mix(color, WHITE, amount);
}

function darken(color: string, amount: number) {
  return mix(color, INK, amount);
}

export function resolvePigeonPalette(palette: PigeonAvatarPalette): ResolvedPigeonPalette {
  const principal = normalizeHex(palette.primary, FALLBACK_PALETTE.primary);
  const wings = normalizeHex(palette.secondary, FALLBACK_PALETTE.secondary);
  const chest = normalizeHex(palette.chest, FALLBACK_PALETTE.chest);
  const beak = normalizeHex(palette.beak, FALLBACK_PALETTE.beak);
  const accent = normalizeHex(palette.accent, FALLBACK_PALETTE.accent);

  return {
    contour: CONTOUR,
    ink: INK,
    headBase: principal,
    headMid: mix(principal, chest, 0.26),
    headShadow: darken(principal, 0.34),
    headDeepShadow: darken(principal, 0.5),
    bodyBase: mix(principal, chest, 0.18),
    bodyShadow: darken(principal, 0.36),
    bodyDeepShadow: darken(principal, 0.54),
    faceFeather: mix(chest, principal, 0.12),
    chestFeather: chest,
    chestShadow: mix(chest, principal, 0.24),
    wingLight: lighten(wings, 0.36),
    wingBase: wings,
    wingDark: darken(wings, 0.48),
    tailDark: darken(wings, 0.64),
    beakBase: beak,
    beakLight: lighten(beak, 0.34),
    beakShadow: darken(beak, 0.54),
    feet: beak,
    feetLight: lighten(beak, 0.38),
    feetShadow: darken(beak, 0.5),
    accentMain: accent,
    accentShadow: darken(accent, 0.46),
    accentDeepShadow: darken(accent, 0.62),
    blush: '#F2A6C4',
  };
}
