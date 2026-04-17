import type { PigeonExpressionId, PigeonPatternId } from './types';

export type PigeonVisualOption<TId extends string> = {
  id: TId;
  label: string;
};

export const PIGEON_EXPRESSIONS: PigeonVisualOption<PigeonExpressionId>[] = [
  { id: 'bright', label: 'Olhar vivo' },
  { id: 'happy', label: 'Feliz' },
  { id: 'focused', label: 'Focado' },
  { id: 'wink', label: 'Piscadela' },
  { id: 'sleepy', label: 'Calmo' },
];

export const PIGEON_PATTERNS: PigeonVisualOption<PigeonPatternId>[] = [
  { id: 'solid', label: 'Liso' },
  { id: 'wing-bars', label: 'Faixas nas asas' },
  { id: 'speckles', label: 'Pintinhas' },
  { id: 'chest-dots', label: 'Peito marcado' },
];

export function isPigeonExpressionId(value: unknown): value is PigeonExpressionId {
  return typeof value === 'string' && PIGEON_EXPRESSIONS.some((option) => option.id === value);
}

export function isPigeonPatternId(value: unknown): value is PigeonPatternId {
  return typeof value === 'string' && PIGEON_PATTERNS.some((option) => option.id === value);
}
