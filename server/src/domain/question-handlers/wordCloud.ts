import type { LiveAnswerPayload, LiveQuestion } from '../../types/realtime.ts';
import type { NormalizedLiveAnswer, QuestionHandler } from './types.ts';

const MAX_WORD_CLOUD_TEXT_LENGTH = 40;

function collapseSpaces(text: string) {
  return text.trim().replace(/\s+/g, ' ');
}

function toDisplayText(text: string) {
  const collapsed = collapseSpaces(text);
  return collapsed.charAt(0).toLocaleUpperCase('pt-BR') + collapsed.slice(1);
}

function toNormalizedText(text: string) {
  return collapseSpaces(text).toLocaleLowerCase('pt-BR');
}

export function normalizeWordCloudAnswer(payload: LiveAnswerPayload): NormalizedLiveAnswer {
  const rawText = payload.text ?? '';
  const displayText = toDisplayText(rawText);
  const normalizedText = toNormalizedText(rawText);

  if (!normalizedText) {
    throw new Error('Informe uma resposta curta.');
  }

  if (displayText.length > MAX_WORD_CLOUD_TEXT_LENGTH) {
    throw new Error(`A resposta deve ter no máximo ${MAX_WORD_CLOUD_TEXT_LENGTH} caracteres.`);
  }

  return {
    optionIds: [],
    text: displayText,
    displayText,
    normalizedText,
  };
}

export const wordCloudHandler: QuestionHandler = {
  type: 'word_cloud',
  mode: 'participatory',
  validateQuestion(question: LiveQuestion) {
    if (question.options.length > 0) {
      throw new Error(`Nuvem de palavras não deve ter opções de resposta: ${question.text}`);
    }
  },
  normalizeAnswer: (_question, payload) => normalizeWordCloudAnswer(payload),
  aggregateResult(_question, answers) {
    const entriesByText = new Map<string, { text: string; normalizedText: string; count: number }>();

    answers.forEach((answer) => {
      if (!answer.normalizedText || !answer.displayText) {
        return;
      }

      const existingEntry = entriesByText.get(answer.normalizedText);

      if (existingEntry) {
        existingEntry.count += 1;
        return;
      }

      entriesByText.set(answer.normalizedText, {
        text: answer.displayText,
        normalizedText: answer.normalizedText,
        count: 1,
      });
    });

    return {
      type: 'word_cloud',
      totalResponses: answers.length,
      entries: [...entriesByText.values()].sort(
        (a, b) => b.count - a.count || a.text.localeCompare(b.text, 'pt-BR'),
      ),
    };
  },
};
