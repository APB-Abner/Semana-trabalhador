import type { LiveAnswerPayload, LiveQuestion } from '../../types/realtime.ts';
import { aggregateTextEntries, normalizeTextAnswer } from './textAnswers.ts';
import type { NormalizedLiveAnswer, QuestionHandler } from './types.ts';

const MAX_QNA_TEXT_LENGTH = 160;

export function normalizeQnaAnswer(payload: LiveAnswerPayload): NormalizedLiveAnswer {
  return normalizeTextAnswer(payload, {
    emptyMessage: 'Escreva uma resposta curta.',
    maxLength: MAX_QNA_TEXT_LENGTH,
  });
}

export const qnaHandler: QuestionHandler = {
  type: 'qna',
  mode: 'participatory',
  validateQuestion(question: LiveQuestion) {
    if (question.options.length > 0) {
      throw new Error(`Pergunta aberta não deve ter opções de resposta: ${question.text}`);
    }
  },
  normalizeAnswer: (_question, payload) => normalizeQnaAnswer(payload),
  aggregateResult(_question, answers) {
    return {
      type: 'qna',
      totalResponses: answers.length,
      entries: aggregateTextEntries(answers),
    };
  },
};
