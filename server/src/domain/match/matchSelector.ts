import type {
  LiveQuestion,
  MatchGame,
  MatchRoundInternal,
  PriorityOrderScenario,
  WorkSituation,
} from '../../types/realtime.ts';
import {
  buildPriorityOrderGame,
  PRIORITY_ORDER_ROUNDS_PER_MATCH,
  priorityOrderDefinition,
  validatePriorityOrderScenario,
} from './minigames/priorityOrder.ts';
import { getPriorityOrderCatalog } from './minigames/priorityOrderCatalog.ts';
import { buildQuickQuizGame, quickQuizDefinition } from './minigames/quickQuiz.ts';
import {
  buildWorkSituationGame,
  WORK_SITUATION_ROUNDS_PER_MATCH,
  validateWorkSituation,
  workSituationDefinition,
} from './minigames/workSituation.ts';
import { getWorkSituationCatalog } from './minigames/workSituationCatalog.ts';
import {
  orderContentForOpeningVariety,
  selectDiverseContent,
  type MatchContentMetadata,
} from './contentDiversity.ts';

export const MATCH_GAME_COUNT = 3;

const QUICK_QUIZ_ROUNDS_PER_MATCH = 4;
const QUICK_ONLY_SIZES = [4, 3, 3];

export const matchMiniGameDefinitions = [
  quickQuizDefinition,
  workSituationDefinition,
  priorityOrderDefinition,
] as const;

export type MatchSessionSelectionOptions = {
  questions: LiveQuestion[];
  workSituations?: WorkSituation[];
  priorityOrderScenarios?: PriorityOrderScenario[];
};

export type MatchSessionSelection = {
  selectedGames: MatchGame[];
  rounds: MatchRoundInternal[];
};

function toQuickQuizRounds(questions: LiveQuestion[]): MatchRoundInternal[] {
  return questions.map((question) => ({
    id: question.id,
    gameType: 'quick_quiz',
    question,
  }));
}

function toWorkSituationRounds(situations: WorkSituation[]): MatchRoundInternal[] {
  return situations.map((situation) => ({
    id: situation.id,
    gameType: 'work_situation',
    situation,
  }));
}

function shufflePriorityOrderItems(scenario: PriorityOrderScenario) {
  return [...scenario.items]
    .sort(() => Math.random() - 0.5)
    .map(({ id, text }) => ({ id, text }));
}

function toPriorityOrderRounds(scenarios: PriorityOrderScenario[]): MatchRoundInternal[] {
  return scenarios.map((scenario) => ({
    id: scenario.id,
    gameType: 'priority_order',
    scenario,
    publicItems: shufflePriorityOrderItems(scenario),
  }));
}

function splitQuestionsForQuickOnlyGames(questions: LiveQuestion[]) {
  const chunks: LiveQuestion[][] = [];
  let cursor = 0;

  QUICK_ONLY_SIZES.forEach((size) => {
    const chunk = questions.slice(cursor, cursor + size);
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    cursor += size;
  });

  if (cursor < questions.length && chunks.length > 0) {
    chunks[chunks.length - 1].push(...questions.slice(cursor));
  }

  return chunks;
}

function shuffleWorkSituations(situations: WorkSituation[]) {
  return [...situations].sort(() => Math.random() - 0.5);
}

function shufflePriorityOrderScenarios(scenarios: PriorityOrderScenario[]) {
  return [...scenarios].sort(() => Math.random() - 0.5);
}

function isQuickQuizCompetitiveQuestion(question: LiveQuestion) {
  return question.type === 'multiple_choice'
    || question.type === 'true_false'
    || question.type === 'multiple_select';
}

function selectQuickQuizQuestionsForMatch(questions: LiveQuestion[]) {
  const competitiveQuestions = questions.filter(isQuickQuizCompetitiveQuestion);
  const sourceQuestions = competitiveQuestions.length >= QUICK_QUIZ_ROUNDS_PER_MATCH
    ? competitiveQuestions
    : questions;

  return orderContentForOpeningVariety(
    selectDiverseContent({
      items: sourceQuestions,
      count: QUICK_QUIZ_ROUNDS_PER_MATCH,
    }),
  );
}

function selectWorkSituationsForMatch(situations: WorkSituation[], usedItems: MatchContentMetadata[]) {
  return selectDiverseContent({
    items: shuffleWorkSituations(situations),
    count: WORK_SITUATION_ROUNDS_PER_MATCH,
    usedItems,
  });
}

function selectPriorityOrderScenariosForMatch(
  scenarios: PriorityOrderScenario[],
  usedItems: MatchContentMetadata[],
) {
  return selectDiverseContent({
    items: shufflePriorityOrderScenarios(scenarios),
    count: PRIORITY_ORDER_ROUNDS_PER_MATCH,
    usedItems,
  });
}

function selectQuickOnlySession(questions: LiveQuestion[]): MatchSessionSelection {
  const selectedGames = splitQuestionsForQuickOnlyGames(questions).map((chunk, index) =>
    buildQuickQuizGame({
      id: `quick_quiz_${index + 1}`,
      title: `${quickQuizDefinition.title} ${index + 1}`,
      description: index === 0
        ? quickQuizDefinition.description
        : 'Novo bloco de rodadas rápidas mantendo o placar acumulado.',
      questions: chunk,
    }),
  );

  return {
    selectedGames,
    rounds: selectedGames.flatMap((game) => {
      const questionsById = new Map(questions.map((question) => [question.id, question]));
      return game.roundIds
        .map((roundId) => questionsById.get(roundId))
        .filter((question): question is LiveQuestion => Boolean(question))
        .map((question) => ({ id: question.id, gameType: 'quick_quiz', question }));
    }),
  };
}

export function selectMatchSession({
  questions,
  workSituations = getWorkSituationCatalog(),
  priorityOrderScenarios = getPriorityOrderCatalog(),
}: MatchSessionSelectionOptions): MatchSessionSelection {
  if (!questions.length) {
    throw new Error('Não há perguntas para montar o match online.');
  }

  const quickQuizCandidateCount = questions.filter(isQuickQuizCompetitiveQuestion).length;
  const canUseFullMatch = quickQuizCandidateCount >= QUICK_QUIZ_ROUNDS_PER_MATCH
    && workSituations.length >= WORK_SITUATION_ROUNDS_PER_MATCH
    && priorityOrderScenarios.length >= PRIORITY_ORDER_ROUNDS_PER_MATCH;

  if (!canUseFullMatch) {
    return selectQuickOnlySession(questions);
  }

  workSituations.forEach(validateWorkSituation);
  priorityOrderScenarios.forEach(validatePriorityOrderScenario);

  const quickQuestions = selectQuickQuizQuestionsForMatch(questions);
  const selectedWorkSituations = selectWorkSituationsForMatch(workSituations, quickQuestions);
  const selectedPriorityOrderScenarios = selectPriorityOrderScenariosForMatch(
    priorityOrderScenarios,
    [...quickQuestions, ...selectedWorkSituations],
  );

  const quickQuizGame = buildQuickQuizGame({
    id: 'quick_quiz_1',
    title: quickQuizDefinition.title,
    description: quickQuizDefinition.description,
    questions: quickQuestions,
  });
  const workSituationGame = buildWorkSituationGame({
    id: 'work_situation_1',
    title: workSituationDefinition.title,
    description: workSituationDefinition.description,
    situations: selectedWorkSituations,
  });
  const priorityOrderGame = buildPriorityOrderGame({
    id: 'priority_order_1',
    title: priorityOrderDefinition.title,
    description: priorityOrderDefinition.description,
    scenarios: selectedPriorityOrderScenarios,
  });

  return {
    selectedGames: [quickQuizGame, workSituationGame, priorityOrderGame],
    rounds: [
      ...toQuickQuizRounds(quickQuestions),
      ...toWorkSituationRounds(selectedWorkSituations),
      ...toPriorityOrderRounds(selectedPriorityOrderScenarios),
    ],
  };
}

export function selectMatchGamesForSession(questions: LiveQuestion[]): MatchGame[] {
  return selectMatchSession({ questions }).selectedGames;
}

export function findGameIndexByRoundId(selectedGames: MatchGame[], roundId: string) {
  return selectedGames.findIndex((game) => game.roundIds.includes(roundId));
}

export function getCurrentGameForRoundIndex(
  selectedGames: MatchGame[],
  rounds: Array<{ id: string }>,
  roundIndex: number,
) {
  const roundId = rounds[roundIndex]?.id;
  if (!roundId) {
    return {
      currentGame: null,
      currentGameIndex: -1,
      currentGameRoundIndex: -1,
    };
  }

  const currentGameIndex = findGameIndexByRoundId(selectedGames, roundId);
  const currentGame = currentGameIndex >= 0 ? selectedGames[currentGameIndex] : null;

  return {
    currentGame,
    currentGameIndex,
    currentGameRoundIndex: currentGame ? currentGame.roundIds.indexOf(roundId) : -1,
  };
}

export function isFirstRoundOfGame(selectedGames: MatchGame[], roundId: string) {
  return selectedGames.some((game) => game.roundIds[0] === roundId);
}
