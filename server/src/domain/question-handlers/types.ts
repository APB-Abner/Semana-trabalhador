import type { LiveAnswerPayload, LiveQuestion, LiveQuestionType } from '../../types/realtime.ts';

export type NormalizedLiveAnswer = {
  optionIds: string[];
};

export type QuestionHandler = {
  type: LiveQuestionType;
  validateQuestion: (question: LiveQuestion) => void;
  normalizeAnswer: (question: LiveQuestion, payload: LiveAnswerPayload) => NormalizedLiveAnswer;
  isCorrect: (question: LiveQuestion, answer: NormalizedLiveAnswer) => boolean;
};
