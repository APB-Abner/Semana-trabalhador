import type { PigeonPresetDefinition, PigeonPresetId } from './types';

export const PIGEON_PRESETS: PigeonPresetDefinition[] = [
  {
    id: 'gamer',
    name: 'Pombo Gamer',
    label: 'Gamer',
    description: 'Headphone grande, visor neon e controle.',
    palette: { primary: '#9AD8FF', secondary: '#3B49B8', chest: '#F0F9FF', beak: '#FFB13B', accent: '#22D3EE' },
    patternId: 'wing-bars',
    expressionId: 'focused',
    equipped: { head: 'neon-headphones', face: 'visor-glasses', body: 'gamer-hoodie', hand: 'game-controller' },
    details: { blush: true },
  },
  {
    id: 'professor-office',
    name: 'Pombo Professor',
    label: 'Professor',
    description: 'Oculos marcados, gravata, cardigan e caderno.',
    palette: { primary: '#AEB7C3', secondary: '#566173', chest: '#F6F4EE', beak: '#ECA13A', accent: '#D8DEE9' },
    patternId: 'chest-dots',
    expressionId: 'bright',
    equipped: { face: 'round-glasses', neck: 'office-tie', body: 'professor-cardigan', hand: 'lesson-book', extra: 'chalk-stars' },
    details: { blush: false },
  },
  {
    id: 'fashion-pop',
    name: 'Pombo Fashion Pop',
    label: 'Fashion',
    description: 'Chifre pop, oculos coracao e peito felpudo.',
    palette: { primary: '#C9CED4', secondary: '#7F8794', chest: '#F8F8F3', beak: '#EFA13D', accent: '#F05AA6' },
    patternId: 'speckles',
    expressionId: 'wink',
    equipped: { head: 'pop-crown', face: 'heart-glasses', body: 'pop-jacket', extra: 'sparkle-burst' },
    details: { blush: true },
  },
  {
    id: 'pirate',
    name: 'Pombo Pirata',
    label: 'Pirata',
    description: 'Bandana, tapa-olho, faixa e mapa do tesouro.',
    palette: { primary: '#9FB1D1', secondary: '#334155', chest: '#F8FAFC', beak: '#F97316', accent: '#DC2626' },
    patternId: 'wing-bars',
    expressionId: 'focused',
    equipped: { head: 'pirate-bandana', face: 'eye-patch', neck: 'gold-chain', body: 'pirate-sash', hand: 'treasure-map' },
    details: { blush: true },
  },
  {
    id: 'explorer',
    name: 'Pombo Explorador',
    label: 'Explorador',
    description: 'Chapeu largo, colete com bolsos e lupa.',
    palette: { primary: '#D5D8DE', secondary: '#596273', chest: '#F3F5F7', beak: '#EFA13D', accent: '#8C7B55' },
    patternId: 'speckles',
    expressionId: 'bright',
    equipped: { head: 'explorer-hat', neck: 'explorer-bandana', body: 'explorer-vest', hand: 'compass', extra: 'map-pin' },
    details: { blush: true },
  },
  {
    id: 'gala-social',
    name: 'Pombo Gala',
    label: 'Gala',
    description: 'Oculos escuros, borboleta, smoking e taca.',
    palette: { primary: '#EEF1F5', secondary: '#15181E', chest: '#FFFFFF', beak: '#EFA13D', accent: '#C9B36A' },
    patternId: 'solid',
    expressionId: 'happy',
    equipped: { face: 'monocle', neck: 'bow-tie', body: 'gala-jacket', hand: 'gala-cane', extra: 'sparkle-burst' },
    details: { blush: false },
  },
];

export const PIGEON_PRESETS_BY_ID: Record<PigeonPresetId, PigeonPresetDefinition> =
  Object.fromEntries(PIGEON_PRESETS.map((preset) => [preset.id, preset])) as Record<PigeonPresetId, PigeonPresetDefinition>;

export function getPigeonPresetById(id: PigeonPresetId | null | undefined) {
  return id ? PIGEON_PRESETS_BY_ID[id] ?? null : null;
}
