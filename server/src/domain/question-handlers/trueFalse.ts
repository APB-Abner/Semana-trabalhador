import type { LiveQuestion } from '../../types/realtime.ts';
import {
  assertCorrectOptionsExist,
  getCorrectOptionIds,
  normalizeSingleAnswer,
  sameOptionSet,
} from './shared.ts';
import type { QuestionHandler } from './types.ts';

export const trueFalseHandler: QuestionHandler = {
  type: 'true_false',
  mode: 'competitive',
  validateQuestion(question: LiveQuestion) {
    assertCorrectOptionsExist(question);

    if (question.options.length !== 2) {
      throw new Error(`Pergunta verdadeiro/falso precisa ter exatamente 2 opções: ${question.text}`);
    }

    if (getCorrectOptionIds(question).length !== 1) {
      throw new Error(`Pergunta verdadeiro/falso precisa ter exatamente uma resposta correta: ${question.text}`);
    }
  },
  normalizeAnswer: normalizeSingleAnswer,
  isCorrect(question, answer) {
    return sameOptionSet(answer.optionIds, getCorrectOptionIds(question));
  },
};
