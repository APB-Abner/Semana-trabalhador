import type { LiveQuestion } from '../../types/realtime.ts';
import { assertOptionIdsExist } from './shared.ts';
import type { QuestionHandler } from './types.ts';

function getOriginalOrder(question: LiveQuestion) {
  return new Map(question.options.map((option, index) => [option.id, index]));
}

function assertCompletePermutation(question: LiveQuestion, optionIds: string[]) {
  if (optionIds.length !== question.options.length) {
    throw new Error('Ordene todos os itens antes de enviar.');
  }

  const uniqueOptionIds = new Set(optionIds);

  if (uniqueOptionIds.size !== optionIds.length) {
    throw new Error('Ranking nao pode repetir itens.');
  }

  assertOptionIdsExist(question, optionIds);
}

export const rankingHandler: QuestionHandler = {
  type: 'ranking',
  mode: 'participatory',
  validateQuestion(question: LiveQuestion) {
    if (question.options.length < 2) {
      throw new Error(`Ranking precisa ter pelo menos 2 itens: ${question.text}`);
    }

    const optionIds = question.options.map((option) => option.id);
    const uniqueOptionIds = new Set(optionIds);

    if (uniqueOptionIds.size !== optionIds.length) {
      throw new Error(`Ranking nao pode ter itens duplicados: ${question.text}`);
    }
  },
  normalizeAnswer(question, payload) {
    const optionIds = payload.optionIds ?? (payload.optionId ? [payload.optionId] : []);

    assertCompletePermutation(question, optionIds);

    return { optionIds };
  },
  aggregateResult(question, answers) {
    const totalResponses = answers.length;
    const optionCount = question.options.length;
    const originalOrder = getOriginalOrder(question);
    const results = question.options.map((option) => ({
      optionId: option.id,
      text: option.text,
      totalPoints: 0,
      positionSum: 0,
      averagePosition: null as number | null,
      firstPlaceVotes: 0,
    }));
    const resultByOptionId = new Map(results.map((result) => [result.optionId, result]));

    answers.forEach((answer) => {
      answer.optionIds.forEach((optionId, index) => {
        const result = resultByOptionId.get(optionId);

        if (!result) {
          return;
        }

        result.totalPoints += optionCount - index;
        result.positionSum += index + 1;

        if (index === 0) {
          result.firstPlaceVotes += 1;
        }
      });
    });

    return {
      type: 'ranking',
      totalResponses,
      items: results
        .map((result) => ({
          optionId: result.optionId,
          text: result.text,
          totalPoints: result.totalPoints,
          firstPlaceVotes: result.firstPlaceVotes,
          averagePosition: totalResponses ? Number((result.positionSum / totalResponses).toFixed(2)) : null,
        }))
        .sort((a, b) => (
          b.totalPoints - a.totalPoints ||
          (a.averagePosition ?? Number.MAX_SAFE_INTEGER) - (b.averagePosition ?? Number.MAX_SAFE_INTEGER) ||
          (originalOrder.get(a.optionId) ?? 0) - (originalOrder.get(b.optionId) ?? 0)
        )),
    };
  },
};
