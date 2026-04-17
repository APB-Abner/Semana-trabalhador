import type { LiveAnswerPayload } from '../../types/realtime.ts';
import type { NormalizedLiveAnswer } from './types.ts';

export type TextAggregateEntry = {
  text: string;
  normalizedText: string;
  count: number;
};

function collapseSpaces(text: string) {
  return text.trim().replace(/\s+/g, ' ');
}

export function toDisplayText(text: string) {
  const collapsed = collapseSpaces(text);
  return collapsed.charAt(0).toLocaleUpperCase('pt-BR') + collapsed.slice(1);
}

export function toNormalizedText(text: string) {
  return collapseSpaces(text).toLocaleLowerCase('pt-BR');
}

export function normalizeTextAnswer(payload: LiveAnswerPayload, {
  emptyMessage,
  maxLength,
}: {
  emptyMessage: string;
  maxLength: number;
}): NormalizedLiveAnswer {
  const rawText = payload.text ?? '';
  const displayText = toDisplayText(rawText);
  const normalizedText = toNormalizedText(rawText);

  if (!normalizedText) {
    throw new Error(emptyMessage);
  }

  if (displayText.length > maxLength) {
    throw new Error(`A resposta deve ter no máximo ${maxLength} caracteres.`);
  }

  return {
    optionIds: [],
    text: displayText,
    displayText,
    normalizedText,
  };
}

export function aggregateTextEntries(answers: Array<{ normalizedText?: string; displayText?: string }>) {
  const entriesByText = new Map<string, TextAggregateEntry>();

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

  return [...entriesByText.values()].sort(
    (a, b) => b.count - a.count || a.text.localeCompare(b.text, 'pt-BR'),
  );
}
