import { describe, expect, it } from 'vitest';
import {
  createAggregatedResult,
  isLiveAnswerCorrect,
  normalizeLiveAnswer,
  validateLiveQuestion,
} from '../src/domain/question-handlers/index.ts';
import { liveQuestionsFixture } from './fixtures.ts';
import type { LiveQuestion } from '../src/types/realtime.ts';

describe('live question handlers', () => {
  it('validates all supported live question types', () => {
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

  it('rejects invalid poll and word_cloud configuration', () => {
    expect(() => validateLiveQuestion({
      ...liveQuestionsFixture[3],
      options: [{ id: 'q4-a', text: 'Curriculo' }],
    })).toThrow(/pelo menos 2/);

    expect(() => validateLiveQuestion({
      ...liveQuestionsFixture[4],
      options: [{ id: 'q5-a', text: 'Opcao indevida' }],
    })).toThrow(/resposta/);
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
    })).toThrow(/inv/);
  });

  it('aggregates poll votes by option with percentages', () => {
    const question = liveQuestionsFixture[3];
    const firstAnswer = normalizeLiveAnswer(question, { optionId: 'q4-a' });
    const secondAnswer = normalizeLiveAnswer(question, { optionId: 'q4-b' });
    const thirdAnswer = normalizeLiveAnswer(question, { optionId: 'q4-a' });

    expect(isLiveAnswerCorrect(question, firstAnswer)).toBe(false);

    const result = createAggregatedResult(question, [
      { ...firstAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
      { ...secondAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
      { ...thirdAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
    ]);

    expect(result?.type).toBe('poll');
    if (result?.type !== 'poll') return;

    expect(result.totalResponses).toBe(3);
    expect(result.options.find((option) => option.optionId === 'q4-a')).toMatchObject({
      count: 2,
      percentage: 67,
    });
    expect(result.options.find((option) => option.optionId === 'q4-b')).toMatchObject({
      count: 1,
      percentage: 33,
    });
  });

  it('normalizes and aggregates word_cloud answers without exposing raw lowercase display', () => {
    const question = liveQuestionsFixture[4];
    const firstAnswer = normalizeLiveAnswer(question, { text: '  trabalho   em equipe ' });
    const secondAnswer = normalizeLiveAnswer(question, { text: 'Trabalho em equipe' });
    const thirdAnswer = normalizeLiveAnswer(question, { text: 'Pontualidade' });

    expect(firstAnswer.normalizedText).toBe('trabalho em equipe');
    expect(firstAnswer.displayText).toBe('Trabalho em equipe');

    const result = createAggregatedResult(question, [
      { ...firstAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
      { ...secondAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
      { ...thirdAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
    ]);

    expect(result?.type).toBe('word_cloud');
    if (result?.type !== 'word_cloud') return;

    expect(result.totalResponses).toBe(3);
    expect(result.entries[0]).toMatchObject({
      text: 'Trabalho em equipe',
      normalizedText: 'trabalho em equipe',
      count: 2,
    });
    expect(result.entries[1]).toMatchObject({
      text: 'Pontualidade',
      count: 1,
    });
    expect(() => normalizeLiveAnswer(question, { text: '   ' })).toThrow(/resposta curta/);
  });
});
