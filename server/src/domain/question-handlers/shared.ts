import type { LiveAnswerPayload, LiveQuestion } from '../../types/realtime.ts';
import type { NormalizedLiveAnswer } from './types.ts';

export function getCorrectOptionIds(question: LiveQuestion): string[] {
  return question.correctOptionIds ?? (question.correctOptionId ? [question.correctOptionId] : []);
}

export function assertOptionIdsExist(question: LiveQuestion, optionIds: string[]) {
  const validIds = new Set(question.options.map((option) => option.id));
  const invalidOptionId = optionIds.find((optionId) => !validIds.has(optionId));

  if (invalidOptionId) {
    throw new Error('Opção inválida para esta pergunta.');
  }
}

export function assertCorrectOptionsExist(question: LiveQuestion) {
  const correctOptionIds = getCorrectOptionIds(question);

  if (!correctOptionIds.length) {
    throw new Error(`Pergunta sem resposta correta configurada: ${question.text}`);
  }

  assertOptionIdsExist(question, correctOptionIds);
}

export function normalizeSingleAnswer(question: LiveQuestion, payload: LiveAnswerPayload): NormalizedLiveAnswer {
  const optionIds = payload.optionIds ?? (payload.optionId ? [payload.optionId] : []);
  const uniqueOptionIds = [...new Set(optionIds)];

  if (uniqueOptionIds.length !== 1) {
    throw new Error('Selecione exatamente uma opção.');
  }

  assertOptionIdsExist(question, uniqueOptionIds);
  return { optionIds: uniqueOptionIds };
}

export function normalizeMultipleAnswer(question: LiveQuestion, payload: LiveAnswerPayload): NormalizedLiveAnswer {
  const optionIds = payload.optionIds ?? (payload.optionId ? [payload.optionId] : []);
  const uniqueOptionIds = [...new Set(optionIds)];

  if (!uniqueOptionIds.length) {
    throw new Error('Selecione pelo menos uma opção.');
  }

  assertOptionIdsExist(question, uniqueOptionIds);
  return { optionIds: uniqueOptionIds };
}

export function sameOptionSet(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  const rightSet = new Set(right);
  return left.every((optionId) => rightSet.has(optionId));
}
