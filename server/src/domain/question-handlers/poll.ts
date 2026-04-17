import type { LiveQuestion } from '../../types/realtime.ts';
import { normalizeSingleAnswer } from './shared.ts';
import type { QuestionHandler } from './types.ts';

export const pollHandler: QuestionHandler = {
  type: 'poll',
  mode: 'participatory',
  validateQuestion(question: LiveQuestion) {
    if (question.options.length < 2) {
      throw new Error(`Enquete precisa ter pelo menos 2 opções: ${question.text}`);
    }
  },
  normalizeAnswer: normalizeSingleAnswer,
  aggregateResult(question, answers) {
    const totalResponses = answers.length;

    return {
      type: 'poll',
      totalResponses,
      options: question.options.map((option) => {
        const count = answers.filter((answer) => answer.optionIds[0] === option.id).length;

        return {
          optionId: option.id,
          text: option.text,
          count,
          percentage: totalResponses ? Math.round((count / totalResponses) * 100) : 0,
        };
      }),
    };
  },
};
