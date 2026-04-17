import { describe, expect, it } from 'vitest';
import { adaptQuizQuestion, adaptQuizQuestions, getLiveOnlyQuestions, getLiveQuestions } from '../src/domain/questions.ts';
import type { QuizQuestion } from '../../src/shared/types/learning.ts';

const baseQuestion: QuizQuestion = {
  tema: 'Direitos',
  pergunta: 'Qual é um direito do jovem aprendiz?',
  opcoes: ['Férias', 'Trabalho voluntário obrigatório'],
  resposta: 'Férias',
  explicacao: 'O contrato formal garante férias.',
};

describe('live quiz question adapter', () => {
  it('preserves multiple choice questions by default', () => {
    const adapted = adaptQuizQuestion(baseQuestion, 0);

    expect(adapted.type).toBe('multiple_choice');
    expect(adapted.correctOptionId).toBe('q1-o1');
    expect(adapted.options).toHaveLength(2);
  });

  it('converts true_false questions with two options', () => {
    const adapted = adaptQuizQuestion({
      ...baseQuestion,
      tipo: 'true_false',
      pergunta: 'Jovem aprendiz tem carteira assinada desde o início?',
      opcoes: ['Verdadeiro', 'Falso'],
      resposta: 'Verdadeiro',
    }, 1);

    expect(adapted.type).toBe('true_false');
    expect(adapted.options.map((option) => option.text)).toEqual(['Verdadeiro', 'Falso']);
    expect(adapted.correctOptionId).toBe('q2-o1');
  });

  it('rejects invalid true_false questions without exactly two options', () => {
    expect(() => adaptQuizQuestion({
      ...baseQuestion,
      tipo: 'true_false',
      opcoes: ['Verdadeiro', 'Falso', 'Depende'],
      resposta: 'Verdadeiro',
    }, 0)).toThrow(/exatamente 2/);
  });

  it('rejects questions without a valid correct answer', () => {
    expect(() => adaptQuizQuestion({
      ...baseQuestion,
      tipo: 'true_false',
      opcoes: ['Verdadeiro', 'Falso'],
      resposta: 'Resposta ausente',
    }, 0)).toThrow(/resposta correta/);
  });

  it('adapts the configured quiz content, including a true_false question', () => {
    const adapted = adaptQuizQuestions();

    expect(adapted.some((question) => question.type === 'true_false')).toBe(true);
  });

  it('adds a live-only multiple_select question to the live question set', () => {
    const liveQuestions = getLiveQuestions();
    const multipleSelectQuestion = liveQuestions.find((question) => question.type === 'multiple_select');

    expect(multipleSelectQuestion).toBeTruthy();
    expect(multipleSelectQuestion?.correctOptionIds).toHaveLength(3);
  });

  it('adds live-only participatory questions to the live question set', () => {
    const liveQuestions = getLiveQuestions();
    const pollQuestion = liveQuestions.find((question) => question.type === 'poll');
    const wordCloudQuestion = liveQuestions.find((question) => question.type === 'word_cloud');
    const scaleQuestion = liveQuestions.find((question) => question.type === 'scale');
    const rankingQuestion = liveQuestions.find((question) => question.type === 'ranking');
    const qnaQuestion = liveQuestions.find((question) => question.type === 'qna');

    expect(pollQuestion).toBeTruthy();
    expect(pollQuestion?.correctOptionId).toBeUndefined();
    expect(pollQuestion?.options.length).toBeGreaterThanOrEqual(2);
    expect(wordCloudQuestion).toBeTruthy();
    expect(wordCloudQuestion?.options).toEqual([]);
    expect(scaleQuestion).toBeTruthy();
    expect(scaleQuestion?.scale).toMatchObject({ min: 1, max: 5, step: 1 });
    expect(rankingQuestion).toBeTruthy();
    expect(rankingQuestion?.options.length).toBeGreaterThanOrEqual(2);
    expect(qnaQuestion).toBeTruthy();
    expect(qnaQuestion?.options).toEqual([]);
  });

  it('provides a broader live-only question bank by type', () => {
    const questions = getLiveOnlyQuestions();
    const countByType = questions.reduce<Record<string, number>>((counts, question) => ({
      ...counts,
      [question.type]: (counts[question.type] ?? 0) + 1,
    }), {});

    expect(countByType.multiple_select).toBeGreaterThanOrEqual(4);
    expect(countByType.true_false).toBeGreaterThanOrEqual(2);
    expect(countByType.poll).toBeGreaterThanOrEqual(4);
    expect(countByType.word_cloud).toBeGreaterThanOrEqual(4);
    expect(countByType.scale).toBeGreaterThanOrEqual(4);
    expect(countByType.ranking).toBeGreaterThanOrEqual(4);
    expect(countByType.qna).toBeGreaterThanOrEqual(4);
  });
});
