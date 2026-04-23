import { describe, expect, it } from 'vitest';
import { competitiveLiveQuestions } from '../src/domain/live-question-catalog.ts';
import {
  MATCH_TEMPLATES,
  selectMatchSession,
} from '../src/domain/match/matchSelector.ts';
import { getCanOrCantCatalog } from '../src/domain/match/minigames/canOrCant.ts';
import { getFindTheMistakeCatalog } from '../src/domain/match/minigames/findTheMistake.ts';
import { getPriorityOrderCatalog } from '../src/domain/match/minigames/priorityOrderCatalog.ts';
import { getProfessionalCommunicationCatalog } from '../src/domain/match/minigames/professionalCommunication.ts';
import { getWorkSituationCatalog } from '../src/domain/match/minigames/workSituationCatalog.ts';

describe('match selector', () => {
  it('builds a fixed template with solo-derived minigames and balanced max scores', () => {
    const session = selectMatchSession({
      questions: competitiveLiveQuestions,
      matchTemplateId: 'quiz_posture_communication',
    });

    expect(session.selectedGames.map((game) => game.type)).toEqual([
      'quick_quiz',
      'can_or_cant',
      'professional_communication',
    ]);
    expect(session.selectedGames.map((game) => game.roundCount)).toEqual([4, 4, 3]);
    expect(session.selectedGames.map((game) => game.maxScore)).toEqual([3600, 3600, 3600]);
    expect(session.rounds.map((round) => round.gameType)).toEqual([
      'quick_quiz',
      'quick_quiz',
      'quick_quiz',
      'quick_quiz',
      'can_or_cant',
      'can_or_cant',
      'can_or_cant',
      'can_or_cant',
      'professional_communication',
      'professional_communication',
      'professional_communication',
    ]);
  });

  it('randomizes only between valid predefined templates when requested', () => {
    const session = selectMatchSession({
      questions: competitiveLiveQuestions,
      randomizeTemplate: true,
      random: () => 0.99,
    });
    const validTemplate = MATCH_TEMPLATES[MATCH_TEMPLATES.length - 1];

    expect(session.selectedGames.map((game) => game.type)).toEqual(validTemplate.games);
  });

  it('keeps expanded content pools large enough for rotation', () => {
    expect(competitiveLiveQuestions).toHaveLength(27);
    expect(getWorkSituationCatalog()).toHaveLength(20);
    expect(getPriorityOrderCatalog()).toHaveLength(20);
    expect(getCanOrCantCatalog()).toHaveLength(24);
    expect(getProfessionalCommunicationCatalog()).toHaveLength(20);
    expect(getFindTheMistakeCatalog()).toHaveLength(16);
  });
});
