import type { PigeonBaseDefinition } from './types';

export const PIGEON_BASE: PigeonBaseDefinition = {
  id: 'official-pigeon',
  name: 'Pombo Oficial',
  viewBox: '0 0 160 160',
  defaultPalette: {
    primary: '#D7DBE3',
    secondary: '#596273',
    chest: '#F7F8FA',
    beak: '#F2A13A',
    accent: '#8FA3B8',
  },
  defaultExpressionId: 'bright',
  defaultPatternId: 'solid',
  designRules: [
    'A silhueta de cabeca grande integrada ao corpo, peito claro recortado e asas laterais nunca muda.',
    'Acessorios ficam ancorados em slots previsiveis para preservar olhos e bico como leitura principal.',
    'Olhos, bico, pes, peito e contorno usam massas grandes: o avatar precisa funcionar em 32px no placar.',
    'Presets mudam loadout, roupa, props e paleta, nao trocam especie nem contrato de slots.',
  ],
  slotAnchors: {
    head: { x: 34, y: 14, width: 92, height: 44 },
    face: { x: 43, y: 49, width: 74, height: 30 },
    neck: { x: 53, y: 84, width: 54, height: 34 },
    body: { x: 43, y: 92, width: 74, height: 50 },
    hand: { x: 17, y: 78, width: 136, height: 64 },
    extra: { x: 16, y: 18, width: 128, height: 120 },
  },
};
