import { describe, expect, it } from 'vitest';
import {
  isLiveAnswerCorrect,
  normalizeLiveAnswer,
  validateLiveQuestion,
} from '../src/domain/question-handlers/index.ts';
import { liveQuestionsFixture } from './fixtures.ts';
import type { LiveQuestion } from '../src/types/realtime.ts';

describe('live question handlers', () => {
  it('validates multiple_choice, true_false and multiple_select questions', () => {
    liveQuestionsFixture.forEach((question) => {
      expect(() => validateLiveQuestion(question)).not.toThrow();
    });
  });

  it('rejects invalid true_false questions', () => {
    const invalidQuestion: LiveQuestion = {
      ...liveQuestionsFixture[1],
      options: [
        ...liveQuestionsFixture[1].options,
        { id: 'q2-c', text: 'Depende' },
      ],
    };

    expect(() => validateLiveQuestion(invalidQuestion)).toThrow(/exatamente 2/);
  });

  it('rejects invalid multiple_select questions', () => {
    const invalidQuestion: LiveQuestion = {
      ...liveQuestionsFixture[2],
      correctOptionIds: ['q3-a'],
    };

    expect(() => validateLiveQuestion(invalidQuestion)).toThrow(/pelo menos 2 respostas corretas/);
  });

  it('normalizes legacy optionId payloads for single-answer questions', () => {
    const normalized = normalizeLiveAnswer(liveQuestionsFixture[0], { optionId: 'q1-a' });

    expect(normalized.optionIds).toEqual(['q1-a']);
    expect(isLiveAnswerCorrect(liveQuestionsFixture[0], normalized)).toBe(true);
  });

  it('accepts exact multiple_select sets in any order', () => {
    const normalized = normalizeLiveAnswer(liveQuestionsFixture[2], {
      optionIds: ['q3-d', 'q3-b', 'q3-a'],
    });

    expect(isLiveAnswerCorrect(liveQuestionsFixture[2], normalized)).toBe(true);
  });

  it('rejects partial, extra and invalid multiple_select answers', () => {
    const partial = normalizeLiveAnswer(liveQuestionsFixture[2], {
      optionIds: ['q3-a', 'q3-b'],
    });
    const extra = normalizeLiveAnswer(liveQuestionsFixture[2], {
      optionIds: ['q3-a', 'q3-b', 'q3-c', 'q3-d'],
    });

    expect(isLiveAnswerCorrect(liveQuestionsFixture[2], partial)).toBe(false);
    expect(isLiveAnswerCorrect(liveQuestionsFixture[2], extra)).toBe(false);
    expect(() => normalizeLiveAnswer(liveQuestionsFixture[2], {
      optionIds: ['q3-a', 'q3-x'],
    })).toThrow(/Opção inválida/);
  });
});
