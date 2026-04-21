import type { LiveQuestion, MatchGame, MatchRoundInternal, WorkSituation } from '../../types/realtime.ts';
import { buildQuickQuizGame, quickQuizDefinition } from './minigames/quickQuiz.ts';
import { priorityOrderDefinition } from './minigames/priorityOrder.ts';
import {
  buildWorkSituationGame,
  WORK_SITUATION_ROUNDS_PER_MATCH,
  validateWorkSituation,
  workSituationDefinition,
} from './minigames/workSituation.ts';
import { getWorkSituationCatalog } from './minigames/workSituationCatalog.ts';

export const MATCH_GAME_COUNT = 3;

const FIRST_QUICK_QUIZ_ROUNDS = 4;
const SECOND_QUICK_QUIZ_ROUNDS = 3;
const QUICK_ONLY_SIZES = [4, 3, 3];

export const matchMiniGameDefinitions = [
  quickQuizDefinition,
  workSituationDefinition,
  priorityOrderDefinition,
] as const;

export type MatchSessionSelectionOptions = {
  questions: LiveQuestion[];
  workSituations?: WorkSituation[];
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

function selectWorkSituationsForMatch(situations: WorkSituation[]) {
  return shuffleWorkSituations(situations).slice(0, WORK_SITUATION_ROUNDS_PER_MATCH);
}

function selectQuickOnlySession(questions: LiveQuestion[]): MatchSessionSelection {
  const selectedGames = splitQuestionsForQuickOnlyGames(questions).map((chunk, index) =>
    buildQuickQuizGame({
      id: `quick_quiz_${index + 1}`,
      title: `${quickQuizDefinition.title} ${index + 1}`,
      description: index === 0
        ? quickQuizDefinition.description
        : 'Novo bloco de rodadas rapidas mantendo o placar acumulado do match.',
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
}: MatchSessionSelectionOptions): MatchSessionSelection {
  if (!questions.length) {
    throw new Error('Nao ha perguntas para montar o match online.');
  }

  const canUseWorkSituation = questions.length >= FIRST_QUICK_QUIZ_ROUNDS + SECOND_QUICK_QUIZ_ROUNDS
    && workSituations.length >= WORK_SITUATION_ROUNDS_PER_MATCH;

  if (!canUseWorkSituation) {
    return selectQuickOnlySession(questions);
  }

  workSituations.forEach(validateWorkSituation);

  const firstQuickQuestions = questions.slice(0, FIRST_QUICK_QUIZ_ROUNDS);
  const secondQuickQuestions = questions.slice(
    FIRST_QUICK_QUIZ_ROUNDS,
    FIRST_QUICK_QUIZ_ROUNDS + SECOND_QUICK_QUIZ_ROUNDS,
  );
  const selectedWorkSituations = selectWorkSituationsForMatch(workSituations);

  const firstQuickGame = buildQuickQuizGame({
    id: 'quick_quiz_1',
    title: quickQuizDefinition.title,
    description: quickQuizDefinition.description,
    questions: firstQuickQuestions,
  });
  const workSituationGame = buildWorkSituationGame({
    id: 'work_situation_1',
    title: workSituationDefinition.title,
    description: workSituationDefinition.description,
    situations: selectedWorkSituations,
  });
  const secondQuickGame = buildQuickQuizGame({
    id: 'quick_quiz_2',
    title: `${quickQuizDefinition.title} Final`,
    description: 'Ultimo bloco rapido para recuperar pontos antes do podio final.',
    questions: secondQuickQuestions,
  });

  return {
    selectedGames: [firstQuickGame, workSituationGame, secondQuickGame],
    rounds: [
      ...toQuickQuizRounds(firstQuickQuestions),
      ...toWorkSituationRounds(selectedWorkSituations),
      ...toQuickQuizRounds(secondQuickQuestions),
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
