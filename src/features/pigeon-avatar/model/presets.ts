import type { PigeonPresetDefinition, PigeonPresetId } from './types';

export const PIGEON_PRESETS: PigeonPresetDefinition[] = [
  {
    id: 'gamer',
    name: 'Pombo Gamer',
    label: 'Gamer',
    description: 'Headphone neon, visor e controle.',
    palette: { primary: '#9AD8FF', secondary: '#3B82F6', chest: '#F0F9FF', beak: '#FFB13B', accent: '#22D3EE' },
    patternId: 'wing-bars',
    expressionId: 'focused',
    equipped: { head: 'neon-headphones', face: 'visor-glasses', body: 'gamer-hoodie', hand: 'game-controller' },
  },
  {
    id: 'professor-office',
    name: 'Pombo Professor',
    label: 'Professor',
    description: 'Oculos redondos, cardigan e livro.',
    palette: { primary: '#C7D2FE', secondary: '#64748B', chest: '#FFF7ED', beak: '#F59E0B', accent: '#2563EB' },
    patternId: 'chest-dots',
    expressionId: 'bright',
    equipped: { face: 'round-glasses', neck: 'office-tie', body: 'professor-cardigan', hand: 'lesson-book', extra: 'chalk-stars' },
  },
  {
    id: 'fashion-pop',
    name: 'Pombo Fashion Pop',
    label: 'Fashion',
    description: 'Coroa, oculos estrela, corrente e microfone.',
    palette: { primary: '#FDB4D7', secondary: '#A855F7', chest: '#FFF1F2', beak: '#FB923C', accent: '#FACC15' },
    patternId: 'speckles',
    expressionId: 'wink',
    equipped: { head: 'pop-crown', face: 'star-glasses', neck: 'gold-chain', body: 'pop-jacket', hand: 'pop-microphone', extra: 'sparkle-burst' },
  },
  {
    id: 'pirate',
    name: 'Pombo Pirata',
    label: 'Pirata',
    description: 'Bandana, tapa-olho, faixa e mapa do tesouro.',
    palette: { primary: '#A7B4C8', secondary: '#475569', chest: '#F8FAFC', beak: '#F97316', accent: '#DC2626' },
    patternId: 'wing-bars',
    expressionId: 'focused',
    equipped: { head: 'pirate-bandana', face: 'eye-patch', neck: 'gold-chain', body: 'pirate-sash', hand: 'treasure-map' },
  },
  {
    id: 'explorer',
    name: 'Pombo Explorador',
    label: 'Explorador',
    description: 'Chapeu de explorador, lenco, colete e bussola.',
    palette: { primary: '#C7D9B7', secondary: '#5F7A52', chest: '#FEF3C7', beak: '#F59E0B', accent: '#14B8A6' },
    patternId: 'speckles',
    expressionId: 'bright',
    equipped: { head: 'explorer-hat', neck: 'explorer-bandana', body: 'explorer-vest', hand: 'compass', extra: 'map-pin' },
  },
  {
    id: 'gala-social',
    name: 'Pombo Gala',
    label: 'Gala',
    description: 'Cartola, monoculo, borboleta e traje social.',
    palette: { primary: '#D8DEE9', secondary: '#111827', chest: '#FFFFFF', beak: '#FBBF24', accent: '#C4A15A' },
    patternId: 'solid',
    expressionId: 'happy',
    equipped: { head: 'gala-top-hat', face: 'monocle', neck: 'bow-tie', body: 'gala-jacket', hand: 'gala-cane', extra: 'sparkle-burst' },
    details: { blush: false },
  },
];

export const PIGEON_PRESETS_BY_ID: Record<PigeonPresetId, PigeonPresetDefinition> =
  Object.fromEntries(PIGEON_PRESETS.map((preset) => [preset.id, preset])) as Record<PigeonPresetId, PigeonPresetDefinition>;

export function getPigeonPresetById(id: PigeonPresetId | null | undefined) {
  return id ? PIGEON_PRESETS_BY_ID[id] ?? null : null;
}
