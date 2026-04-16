import type { LiveQuestion } from '../../types/realtime.ts';
import {
  assertCorrectOptionsExist,
  getCorrectOptionIds,
  normalizeMultipleAnswer,
  sameOptionSet,
} from './shared.ts';
import type { QuestionHandler } from './types.ts';

export const multipleSelectHandler: QuestionHandler = {
  type: 'multiple_select',
  validateQuestion(question: LiveQuestion) {
    assertCorrectOptionsExist(question);

    if (question.options.length < 2) {
      throw new Error(`Pergunta de seleção múltipla precisa ter pelo menos 2 opções: ${question.text}`);
    }

    if (getCorrectOptionIds(question).length < 2) {
      throw new Error(`Pergunta de seleção múltipla precisa ter pelo menos 2 respostas corretas: ${question.text}`);
    }
  },
  normalizeAnswer: normalizeMultipleAnswer,
  isCorrect(question, answer) {
    return sameOptionSet(answer.optionIds, getCorrectOptionIds(question));
  },
};
