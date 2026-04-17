import type { LiveQuestion } from '../../types/realtime.ts';
import {
  assertCorrectOptionsExist,
  getCorrectOptionIds,
  normalizeSingleAnswer,
  sameOptionSet,
} from './shared.ts';
import type { QuestionHandler } from './types.ts';

export const multipleChoiceHandler: QuestionHandler = {
  type: 'multiple_choice',
  mode: 'competitive',
  validateQuestion(question: LiveQuestion) {
    assertCorrectOptionsExist(question);

    if (getCorrectOptionIds(question).length !== 1) {
      throw new Error(`Pergunta de múltipla escolha precisa ter exatamente uma resposta correta: ${question.text}`);
    }
  },
  normalizeAnswer: normalizeSingleAnswer,
  isCorrect(question, answer) {
    return sameOptionSet(answer.optionIds, getCorrectOptionIds(question));
  },
};
