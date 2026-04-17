import type { PigeonBaseDefinition } from './types';

export const PIGEON_BASE: PigeonBaseDefinition = {
  id: 'official-pigeon',
  name: 'Pombo Oficial',
  viewBox: '0 0 160 160',
  defaultPalette: {
    primary: '#B9C8FF',
    secondary: '#6B7FD7',
    chest: '#F7F4FF',
    beak: '#FFB13B',
    accent: '#34D399',
  },
  defaultExpressionId: 'bright',
  defaultPatternId: 'solid',
  designRules: [
    'A silhueta de cabeca redonda, corpo oval e asas laterais nunca muda.',
    'Acessorios ficam ancorados em slots previsiveis para nao cobrir olhos e bico ao mesmo tempo.',
    'Detalhe fino deve ser evitado: o avatar precisa funcionar em 32px no placar.',
    'Presets mudam loadout e paleta, nao trocam especie nem proporcao base.',
  ],
  slotAnchors: {
    head: { x: 42, y: 18, width: 76, height: 34 },
    face: { x: 46, y: 52, width: 68, height: 28 },
    neck: { x: 57, y: 82, width: 46, height: 28 },
    body: { x: 37, y: 92, width: 86, height: 46 },
    hand: { x: 102, y: 104, width: 42, height: 34 },
    extra: { x: 16, y: 18, width: 128, height: 120 },
  },
};
