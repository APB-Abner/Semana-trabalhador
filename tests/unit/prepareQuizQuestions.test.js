import { describe, expect, it } from 'vitest';
import { quizQuestions } from '../../src/content/quiz/questions.js';
import prepareQuizQuestions from '../../src/features/quiz-session/lib/prepareQuizQuestions.js';

describe('prepareQuizQuestions', () => {
  it('keeps every answer inside its options after shuffling', () => {
    const preparedQuestions = prepareQuizQuestions(quizQuestions);

    expect(preparedQuestions).toHaveLength(quizQuestions.length);
    preparedQuestions.forEach((question) => {
      expect(question.opcoes).toContain(question.resposta);
      expect(question.tema).toBeTruthy();
      expect(question.explicacao).toBeTruthy();
    });
  });

  it('does not lose question content while preparing the session', () => {
    const preparedQuestions = prepareQuizQuestions(quizQuestions);
    const originalQuestions = quizQuestions.map((question) => question.pergunta).sort();
    const preparedQuestionTexts = preparedQuestions.map((question) => question.pergunta).sort();

    expect(preparedQuestionTexts).toEqual(originalQuestions);
  });
});
