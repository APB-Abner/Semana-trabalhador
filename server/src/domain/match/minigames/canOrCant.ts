import { canOrCantItems, type CanOrCantAnswer, type CanOrCantItem } from '../../../../../src/content/games/canOrCant.ts';
import type {
  CanOrCantReveal,
  LiveAnswerPayload,
  PlayerAnswer,
  PublicCanOrCantItem,
} from '../../../types/realtime.ts';
import { normalizeContentKey, type MatchContentMetadata } from '../contentDiversity.ts';
import type { BuildCanOrCantGameOptions, BuiltMatchGame, MiniGameDefinition } from './types.ts';

export type CanOrCantCatalogEntry = CanOrCantItem & MatchContentMetadata;

export const canOrCantDefinition: MiniGameDefinition = {
  type: 'can_or_cant',
  title: 'Pode / Não Pode',
  description: 'Classifique atitudes profissionais com resposta rápida e feedback direto.',
  active: true,
};

export const CAN_OR_CANT_ROUNDS_PER_MATCH = 4;
export const CAN_OR_CANT_BASE_POINTS = 800;
export const CAN_OR_CANT_SPEED_BONUS = 100;
export const CAN_OR_CANT_MAX_POINTS = CAN_OR_CANT_BASE_POINTS + CAN_OR_CANT_SPEED_BONUS;

export const canOrCantOptions: Array<{ id: CanOrCantAnswer; text: string }> = [
  { id: 'can', text: 'Pode' },
  { id: 'cant', text: 'Não pode' },
];

function toCatalogEntry(item: CanOrCantItem): CanOrCantCatalogEntry {
  const contentGroup = item.contentGroup ?? normalizeContentKey(item.topic);

  return {
    ...item,
    difficulty: item.difficulty ?? 'easy',
    contentGroup,
    sessionTags: item.sessionTags ?? [contentGroup, normalizeContentKey(item.title)],
  };
}

export function getCanOrCantCatalog(): CanOrCantCatalogEntry[] {
  return canOrCantItems.map(toCatalogEntry);
}

export function buildCanOrCantGame({
  id,
  title = canOrCantDefinition.title,
  description = canOrCantDefinition.description,
  items,
}: BuildCanOrCantGameOptions): BuiltMatchGame {
  return {
    id,
    type: canOrCantDefinition.type,
    title,
    description,
    roundIds: items.map((item) => item.id),
    roundCount: items.length,
    maxScore: items.length * CAN_OR_CANT_MAX_POINTS,
    active: canOrCantDefinition.active,
  };
}

export function validateCanOrCantItem(item: CanOrCantItem) {
  if (!item.id || !item.topic || !item.title || !item.situation || !item.explanation) {
    throw new Error(`Item Pode / Não Pode incompleto: ${item.id}`);
  }

  if (item.answer !== 'can' && item.answer !== 'cant') {
    throw new Error(`Item Pode / Não Pode com resposta inválida: ${item.id}`);
  }
}

export function getPublicCanOrCantItem(item: CanOrCantItem): PublicCanOrCantItem {
  return {
    id: item.id,
    topic: item.topic,
    title: item.title,
    situation: item.situation,
    options: canOrCantOptions,
  };
}

export function normalizeCanOrCantAnswer(item: CanOrCantItem, payload: LiveAnswerPayload) {
  const optionId = payload.optionId ?? payload.optionIds?.[0];

  if (optionId !== 'can' && optionId !== 'cant') {
    throw new Error('Escolha Pode ou Não pode para esta rodada.');
  }

  return {
    optionId,
    optionIds: [optionId],
    isCorrect: optionId === item.answer,
  };
}

export function calculateCanOrCantScore({
  isCorrect,
  submittedAt,
  startedAt,
  limitMs,
}: {
  isCorrect: boolean;
  submittedAt: number;
  startedAt: number;
  limitMs: number;
}) {
  if (!isCorrect || limitMs <= 0) {
    return 0;
  }

  const responseMs = Math.max(0, submittedAt - startedAt);
  const speedFactor = Math.max(0, 1 - responseMs / limitMs);

  return CAN_OR_CANT_BASE_POINTS + Math.round(speedFactor * CAN_OR_CANT_SPEED_BONUS);
}

export function createCanOrCantReveal(item: CanOrCantItem, answers: PlayerAnswer[]): CanOrCantReveal {
  const totalResponses = answers.length;

  return {
    correctAnswer: item.answer,
    explanation: item.explanation,
    totalResponses,
    options: canOrCantOptions.map((option) => {
      const count = answers.filter((answer) => answer.optionIds[0] === option.id).length;

      return {
        optionId: option.id,
        text: option.text,
        count,
        percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
      };
    }),
  };
}
