import { describe, expect, it } from 'vitest';
import { canOrCantItems } from '../../src/content/games/canOrCant.ts';
import { findTheMistakeCases } from '../../src/content/games/findTheMistake.ts';
import { professionalCommunicationScenarios } from '../../src/content/games/professionalCommunication.ts';
import { evaluateCanOrCant } from '../../src/features/games/can-or-cant/lib/evaluateCanOrCant.js';
import { evaluateFindTheMistake } from '../../src/features/games/find-the-mistake/lib/evaluateFindTheMistake.js';
import { evaluateProfessionalCommunication } from '../../src/features/games/professional-communication/lib/evaluateProfessionalCommunication.js';

describe('solo games', () => {
  it('ships enough starter content for the three new games', () => {
    expect(canOrCantItems.length).toBeGreaterThanOrEqual(12);
    expect(findTheMistakeCases.length).toBeGreaterThanOrEqual(8);
    expect(professionalCommunicationScenarios.length).toBeGreaterThanOrEqual(10);
  });

  it('scores Pode / Não Pode answers', () => {
    const item = canOrCantItems[0];

    expect(evaluateCanOrCant(item, item.answer)).toMatchObject({
      isCorrect: true,
      score: 1,
      correctAnswer: item.answer,
    });

    expect(evaluateCanOrCant(item, item.answer === 'can' ? 'cant' : 'can')).toMatchObject({
      isCorrect: false,
      score: 0,
      correctAnswer: item.answer,
    });
  });

  it('scores professional communication with best, partial and poor options', () => {
    const scenario = professionalCommunicationScenarios[0];
    const bestOption = scenario.options.find((option) => option.quality === 'best');
    const okOption = scenario.options.find((option) => option.quality === 'ok');
    const poorOption = scenario.options.find((option) => option.quality === 'poor');

    expect(evaluateProfessionalCommunication(scenario, bestOption.id)).toMatchObject({
      isCorrect: true,
      score: 1,
      tone: 'success',
    });
    expect(evaluateProfessionalCommunication(scenario, okOption.id)).toMatchObject({
      isCorrect: false,
      score: 0.5,
      tone: 'info',
    });
    expect(evaluateProfessionalCommunication(scenario, poorOption.id)).toMatchObject({
      isCorrect: false,
      score: 0,
      tone: 'danger',
    });
  });

  it('scores Caça-erros with correct, missed and false positive selections', () => {
    const caseItem = findTheMistakeCases[0];
    const correctIds = caseItem.options.filter((option) => option.isMistake).map((option) => option.id);
    const falsePositive = caseItem.options.find((option) => !option.isMistake);

    expect(evaluateFindTheMistake(caseItem, correctIds)).toMatchObject({
      isCorrect: true,
      score: correctIds.length,
      missed: [],
      falsePositives: [],
    });

    const partial = evaluateFindTheMistake(caseItem, [correctIds[0], falsePositive.id]);
    expect(partial.isCorrect).toBe(false);
    expect(partial.correctMarked).toHaveLength(1);
    expect(partial.missed.length).toBeGreaterThan(0);
    expect(partial.falsePositives).toHaveLength(1);
    expect(partial.score).toBe(0);
  });
});
