import { findTheMistakeCases, type FindTheMistakeCase } from '../../../../../src/content/games/findTheMistake.ts';
import type {
  FindTheMistakeReveal,
  LiveAnswerPayload,
  PlayerAnswer,
  PublicFindTheMistakeCase,
} from '../../../types/realtime.ts';
import { normalizeContentKey, type MatchContentMetadata } from '../contentDiversity.ts';
import type { BuildFindTheMistakeGameOptions, BuiltMatchGame, MiniGameDefinition } from './types.ts';

export type FindTheMistakeCatalogEntry = FindTheMistakeCase & MatchContentMetadata;

export const findTheMistakeDefinition: MiniGameDefinition = {
  type: 'find_the_mistake',
  title: 'Caça-erros',
  description: 'Identifique problemas em mensagens, currículos e atitudes profissionais.',
  active: true,
};

export const FIND_THE_MISTAKE_ROUNDS_PER_MATCH = 3;
export const FIND_THE_MISTAKE_MAX_BASE_POINTS = 1000;
export const FIND_THE_MISTAKE_SPEED_BONUS = 200;

function toCatalogEntry(caseItem: FindTheMistakeCase): FindTheMistakeCatalogEntry {
  const contentGroup = caseItem.contentGroup ?? normalizeContentKey(caseItem.topic);

  return {
    ...caseItem,
    difficulty: caseItem.difficulty ?? 'medium',
    contentGroup,
    sessionTags: caseItem.sessionTags ?? [contentGroup, normalizeContentKey(caseItem.title)],
  };
}

export function getFindTheMistakeCatalog(): FindTheMistakeCatalogEntry[] {
  return findTheMistakeCases.map(toCatalogEntry);
}

export function buildFindTheMistakeGame({
  id,
  title = findTheMistakeDefinition.title,
  description = findTheMistakeDefinition.description,
  cases,
}: BuildFindTheMistakeGameOptions): BuiltMatchGame {
  return {
    id,
    type: findTheMistakeDefinition.type,
    title,
    description,
    roundIds: cases.map((caseItem) => caseItem.id),
    roundCount: cases.length,
    maxScore: cases.length * (FIND_THE_MISTAKE_MAX_BASE_POINTS + FIND_THE_MISTAKE_SPEED_BONUS),
    active: findTheMistakeDefinition.active,
  };
}

export function validateFindTheMistakeCase(caseItem: FindTheMistakeCase) {
  if (!caseItem.id || !caseItem.topic || !caseItem.title || !caseItem.prompt || !caseItem.sample) {
    throw new Error(`Caso de Caça-erros incompleto: ${caseItem.id}`);
  }

  if (caseItem.options.length < 3) {
    throw new Error(`Caso de Caça-erros precisa ter ao menos 3 opções: ${caseItem.id}`);
  }

  const optionIds = new Set(caseItem.options.map((option) => option.id));

  if (optionIds.size !== caseItem.options.length) {
    throw new Error(`Caso de Caça-erros tem opções duplicadas: ${caseItem.id}`);
  }

  if (!caseItem.options.some((option) => option.isMistake)) {
    throw new Error(`Caso de Caça-erros precisa ter pelo menos um erro real: ${caseItem.id}`);
  }
}

export function getPublicFindTheMistakeCase(caseItem: FindTheMistakeCase): PublicFindTheMistakeCase {
  return {
    id: caseItem.id,
    topic: caseItem.topic,
    title: caseItem.title,
    prompt: caseItem.prompt,
    sample: caseItem.sample,
    options: caseItem.options.map(({ id, label }) => ({ id, label })),
  };
}

export function normalizeFindTheMistakeAnswer(caseItem: FindTheMistakeCase, payload: LiveAnswerPayload) {
  const optionIds = payload.optionIds ?? (payload.optionId ? [payload.optionId] : []);
  const expectedIds = new Set(caseItem.options.map((option) => option.id));
  const submittedIds = new Set(optionIds);

  if (submittedIds.size !== optionIds.length) {
    throw new Error('A análise enviada tem itens repetidos.');
  }

  if (!optionIds.every((optionId) => expectedIds.has(optionId))) {
    throw new Error('A análise enviada contém opção inválida.');
  }

  return {
    optionIds,
  };
}

export function calculateFindTheMistakeScore({
  optionIds,
  caseItem,
  responseMs,
  limitMs,
}: {
  optionIds: string[];
  caseItem: FindTheMistakeCase;
  responseMs: number;
  limitMs: number;
}) {
  const selected = new Set(optionIds);
  const mistakes = caseItem.options.filter((option) => option.isMistake);
  const correctMarked = mistakes.filter((option) => selected.has(option.id)).length;
  const falsePositives = caseItem.options.filter((option) => !option.isMistake && selected.has(option.id)).length;
  const rawScore = Math.max(0, correctMarked - falsePositives);
  const qualityFactor = mistakes.length > 0 ? rawScore / mistakes.length : 0;
  const basePoints = Math.round(FIND_THE_MISTAKE_MAX_BASE_POINTS * qualityFactor);
  const speedFactor = Math.max(0, 1 - Math.max(0, responseMs) / limitMs);
  const speedBonus = basePoints > 0 ? Math.round(speedFactor * FIND_THE_MISTAKE_SPEED_BONUS) : 0;

  return {
    basePoints,
    speedBonus,
    points: basePoints + speedBonus,
    isPerfect: correctMarked === mistakes.length && falsePositives === 0,
  };
}

export function createFindTheMistakeReveal(caseItem: FindTheMistakeCase, answers: PlayerAnswer[]): FindTheMistakeReveal {
  const totalResponses = answers.length;

  return {
    totalResponses,
    mistakeCount: caseItem.options.filter((option) => option.isMistake).length,
    options: caseItem.options.map((option) => {
      const count = answers.filter((answer) => answer.optionIds.includes(option.id)).length;

      return {
        optionId: option.id,
        label: option.label,
        isMistake: option.isMistake,
        explanation: option.explanation,
        count,
        percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
      };
    }),
  };
}
