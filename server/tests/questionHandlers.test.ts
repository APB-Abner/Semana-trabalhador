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

  it('rejects invalid scale and ranking configuration', () => {
    expect(() => validateLiveQuestion({
      ...liveQuestionsFixture[5],
      options: [{ id: 'q6-a', text: 'Opcao indevida' }],
    })).toThrow(/opcoes/);

    expect(() => validateLiveQuestion({
      ...liveQuestionsFixture[5],
      scale: { min: 5, max: 1, step: 1 },
    })).toThrow(/min e max/);

    expect(() => validateLiveQuestion({
      ...liveQuestionsFixture[6],
      options: [{ id: 'q7-a', text: 'Aprendizado' }],
    })).toThrow(/pelo menos 2/);

    expect(() => validateLiveQuestion({
      ...liveQuestionsFixture[6],
      options: [
        { id: 'q7-a', text: 'Aprendizado' },
        { id: 'q7-a', text: 'Ambiente' },
      ],
    })).toThrow(/duplicados/);
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
    expect(() => normalizeLiveAnswer(question, { text: '   ' })).toThrow(/palavra ou termo curto/);
  });

  it('normalizes and aggregates qna answers as grouped open text', () => {
    const question = liveQuestionsFixture[7];
    const firstAnswer = normalizeLiveAnswer(question, { text: '  atualizar   meu curriculo ' });
    const secondAnswer = normalizeLiveAnswer(question, { text: 'Atualizar meu curriculo' });
    const thirdAnswer = normalizeLiveAnswer(question, { text: 'Treinar entrevista' });

    expect(() => validateLiveQuestion({
      ...question,
      options: [{ id: 'q8-a', text: 'Opcao indevida' }],
    })).toThrow(/opcoes/);

    const result = createAggregatedResult(question, [
      { ...firstAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
      { ...secondAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
      { ...thirdAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
    ]);

    expect(result?.type).toBe('qna');
    if (result?.type !== 'qna') return;

    expect(result.totalResponses).toBe(3);
    expect(result.entries[0]).toMatchObject({
      text: 'Atualizar meu curriculo',
      normalizedText: 'atualizar meu curriculo',
      count: 2,
    });
    expect(result.entries[1]).toMatchObject({
      text: 'Treinar entrevista',
      count: 1,
    });
  });

  it('normalizes and aggregates scale answers by average and distribution', () => {
    const question = liveQuestionsFixture[5];
    const firstAnswer = normalizeLiveAnswer(question, { value: 2 });
    const secondAnswer = normalizeLiveAnswer(question, { value: 4 });
    const thirdAnswer = normalizeLiveAnswer(question, { value: 5 });

    expect(firstAnswer.value).toBe(2);
    expect(() => normalizeLiveAnswer(question, { value: 6 })).toThrow(/fora da escala/);

    const result = createAggregatedResult(question, [
      { ...firstAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
      { ...secondAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
      { ...thirdAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
    ]);

    expect(result?.type).toBe('scale');
    if (result?.type !== 'scale') return;

    expect(result.totalResponses).toBe(3);
    expect(result.average).toBe(3.67);
    expect(result.distribution.find((entry) => entry.value === 4)).toMatchObject({
      count: 1,
      percentage: 33,
    });
  });

  it('validates ranking as a complete permutation and aggregates with Borda count', () => {
    const question = liveQuestionsFixture[6];
    const firstAnswer = normalizeLiveAnswer(question, { optionIds: ['q7-a', 'q7-b', 'q7-c'] });
    const secondAnswer = normalizeLiveAnswer(question, { optionIds: ['q7-b', 'q7-a', 'q7-c'] });

    expect(() => normalizeLiveAnswer(question, { optionIds: ['q7-a', 'q7-b'] })).toThrow(/todos os itens/);
    expect(() => normalizeLiveAnswer(question, { optionIds: ['q7-a', 'q7-a', 'q7-b'] })).toThrow(/repetir/);
    expect(() => normalizeLiveAnswer(question, { optionIds: ['q7-a', 'q7-b', 'q7-x'] })).toThrow(/inv/);

    const result = createAggregatedResult(question, [
      { ...firstAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
      { ...secondAnswer, submittedAt: 1, responseMs: 1, isCorrect: false, points: 0 },
    ]);

    expect(result?.type).toBe('ranking');
    if (result?.type !== 'ranking') return;

    expect(result.totalResponses).toBe(2);
    expect(result.items[0]).toMatchObject({
      optionId: 'q7-a',
      totalPoints: 5,
      averagePosition: 1.5,
      firstPlaceVotes: 1,
    });
    expect(result.items[1]).toMatchObject({
      optionId: 'q7-b',
      totalPoints: 5,
      averagePosition: 1.5,
      firstPlaceVotes: 1,
    });
    expect(result.items[2]).toMatchObject({
      optionId: 'q7-c',
      totalPoints: 2,
      averagePosition: 3,
      firstPlaceVotes: 0,
    });
  });
});
