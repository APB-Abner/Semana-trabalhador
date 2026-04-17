import type { LiveAnswerPayload, LiveQuestion, LiveQuestionType, PlayerAnswer } from '../../types/realtime.ts';
import { multipleChoiceHandler } from './multipleChoice.ts';
import { multipleSelectHandler } from './multipleSelect.ts';
import { pollHandler } from './poll.ts';
import { qnaHandler } from './qna.ts';
import { rankingHandler } from './ranking.ts';
import { scaleHandler } from './scale.ts';
import { trueFalseHandler } from './trueFalse.ts';
import { wordCloudHandler } from './wordCloud.ts';
import type { NormalizedLiveAnswer, QuestionHandler } from './types.ts';

const handlers: Record<LiveQuestionType, QuestionHandler> = {
  multiple_choice: multipleChoiceHandler,
  true_false: trueFalseHandler,
  multiple_select: multipleSelectHandler,
  poll: pollHandler,
  word_cloud: wordCloudHandler,
  scale: scaleHandler,
  ranking: rankingHandler,
  qna: qnaHandler,
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
  const handler = getQuestionHandler(question.type);

  if (!handler.isCorrect) {
    return false;
  }

  return handler.isCorrect(question, answer);
}

export function isCompetitiveQuestion(question: LiveQuestion): boolean {
  return getQuestionHandler(question.type).mode === 'competitive';
}

export function createAggregatedResult(question: LiveQuestion, answers: PlayerAnswer[]) {
  const handler = getQuestionHandler(question.type);

  if (!handler.aggregateResult) {
    return null;
  }

  return handler.aggregateResult(question, answers);
}

export type { NormalizedLiveAnswer, QuestionHandler };
