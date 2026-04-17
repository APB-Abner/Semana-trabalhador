import type {
  AggregatedResult,
  LiveAnswerPayload,
  LiveQuestion,
  LiveQuestionType,
  PlayerAnswer,
} from '../../types/realtime.ts';

export type QuestionMode = 'competitive' | 'participatory';

export type NormalizedLiveAnswer = {
  optionIds: string[];
  text?: string;
  normalizedText?: string;
  displayText?: string;
  value?: number;
};

export type QuestionHandler = {
  type: LiveQuestionType;
  mode: QuestionMode;
  validateQuestion: (question: LiveQuestion) => void;
  normalizeAnswer: (question: LiveQuestion, payload: LiveAnswerPayload) => NormalizedLiveAnswer;
  isCorrect?: (question: LiveQuestion, answer: NormalizedLiveAnswer) => boolean;
  aggregateResult?: (question: LiveQuestion, answers: PlayerAnswer[]) => AggregatedResult;
};
