import type { LiveAnswerPayload, LiveQuestion, LiveQuestionType } from '../../types/realtime.ts';
import { multipleChoiceHandler } from './multipleChoice.ts';
import { multipleSelectHandler } from './multipleSelect.ts';
import { trueFalseHandler } from './trueFalse.ts';
import type { NormalizedLiveAnswer, QuestionHandler } from './types.ts';

const handlers: Record<LiveQuestionType, QuestionHandler> = {
  multiple_choice: multipleChoiceHandler,
  true_false: trueFalseHandler,
  multiple_select: multipleSelectHandler,
};

export function getQuestionHandler(type: LiveQuestionType): QuestionHandler {
  const handler = handlers[type];

  if (!handler) {
    throw new Error(`Tipo de pergunta não suportado: ${type}`);
  }

  return handler;
}

export function validateLiveQuestion(question: LiveQuestion) {
  getQuestionHandler(question.type).validateQuestion(question);
}

export function normalizeLiveAnswer(question: LiveQuestion, payload: LiveAnswerPayload): NormalizedLiveAnswer {
  return getQuestionHandler(question.type).normalizeAnswer(question, payload);
}

export function isLiveAnswerCorrect(question: LiveQuestion, answer: NormalizedLiveAnswer): boolean {
  return getQuestionHandler(question.type).isCorrect(question, answer);
}

export type { NormalizedLiveAnswer, QuestionHandler };
