import type { LiveAnswerPayload, LiveQuestion } from '../../types/realtime.ts';
import { aggregateTextEntries, normalizeTextAnswer } from './textAnswers.ts';
import type { NormalizedLiveAnswer, QuestionHandler } from './types.ts';

const MAX_WORD_CLOUD_TEXT_LENGTH = 40;

export function normalizeWordCloudAnswer(payload: LiveAnswerPayload): NormalizedLiveAnswer {
  return normalizeTextAnswer(payload, {
    emptyMessage: 'Informe uma palavra ou termo curto.',
    maxLength: MAX_WORD_CLOUD_TEXT_LENGTH,
  });
}

export const wordCloudHandler: QuestionHandler = {
  type: 'word_cloud',
  mode: 'participatory',
  validateQuestion(question: LiveQuestion) {
    if (question.options.length > 0) {
      throw new Error(`Nuvem de palavras nao deve ter opcoes de resposta: ${question.text}`);
    }
  },
  normalizeAnswer: (_question, payload) => normalizeWordCloudAnswer(payload),
  aggregateResult(_question, answers) {
    return {
      type: 'word_cloud',
      totalResponses: answers.length,
      entries: aggregateTextEntries(answers),
    };
  },
};
