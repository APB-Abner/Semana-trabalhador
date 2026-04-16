import { describe, expect, it } from 'vitest';
import { adaptQuizQuestion, adaptQuizQuestions } from '../src/domain/questions.ts';
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
});
