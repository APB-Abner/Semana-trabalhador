import type { PigeonBaseDefinition } from './types';

export const PIGEON_BASE: PigeonBaseDefinition = {
  id: 'official-pigeon',
  name: 'Pombo Oficial',
  viewBox: '0 0 160 160',
  defaultPalette: {
    primary: '#9A99B1',
    secondary: '#524E80',
    chest: '#F0EAF2',
    beak: '#C53E35',
    accent: '#3D7A75',
  },
  defaultExpressionId: 'bright',
  defaultPatternId: 'solid',
  designRules: [
    'A base oficial e o asset vetorial Pombo_editado.svg, preservando cabeca grande, plumagem no pescoco, corpo arredondado e asa/cauda laterais.',
    'Acessorios ficam ancorados em slots previsiveis para nao cobrir olhos e bico ao mesmo tempo.',
    'Itens novos podem entrar como assets PNG/SVG por slot, sem alterar o contrato do estado salvo.',
    'Presets mudam loadout e paleta de acessorios, nao trocam especie nem proporcao base.',
  ],
  slotAnchors: {
    head: { x: 35, y: 0, width: 86, height: 56 },
    face: { x: 42, y: 20, width: 64, height: 36 },
    neck: { x: 33, y: 58, width: 86, height: 30 },
    body: { x: 22, y: 74, width: 102, height: 76 },
    hand: { x: 96, y: 82, width: 58, height: 58 },
    extra: { x: 18, y: 0, width: 145, height: 150 },
  },
};
