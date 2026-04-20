import type { LiveQuestion, MatchGame } from '../../types/realtime.ts';
import { buildQuickQuizGame, quickQuizDefinition } from './minigames/quickQuiz.ts';
import { priorityOrderDefinition } from './minigames/priorityOrder.ts';
import { workSituationDefinition } from './minigames/workSituation.ts';

export const MATCH_GAME_COUNT = 3;

const DEFAULT_QUICK_QUIZ_SIZES = [4, 3, 3];

export const matchMiniGameDefinitions = [
  quickQuizDefinition,
  workSituationDefinition,
  priorityOrderDefinition,
] as const;

function splitQuestionsForQuickQuizGames(questions: LiveQuestion[]) {
  const chunks: LiveQuestion[][] = [];
  let cursor = 0;

  DEFAULT_QUICK_QUIZ_SIZES.forEach((size) => {
    const chunk = questions.slice(cursor, cursor + size);
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    cursor += size;
  });

  if (cursor < questions.length) {
    const lastChunk = chunks[chunks.length - 1];
    lastChunk.push(...questions.slice(cursor));
  }

  return chunks;
}

export function selectMatchGamesForSession(questions: LiveQuestion[]): MatchGame[] {
  if (!questions.length) {
    throw new Error('Nao ha perguntas para montar o match online.');
  }

  return splitQuestionsForQuickQuizGames(questions).map((chunk, index) =>
    buildQuickQuizGame({
      id: `quick_quiz_${index + 1}`,
      title: `${quickQuizDefinition.title} ${index + 1}`,
      description: index === 0
        ? quickQuizDefinition.description
        : 'Novo bloco de rodadas rápidas mantendo o placar acumulado do match.',
      questions: chunk,
    }),
  );
}

export function findGameIndexByQuestionId(selectedGames: MatchGame[], questionId: string) {
  return selectedGames.findIndex((game) => game.roundIds.includes(questionId));
}

export function getCurrentGameForQuestionIndex(selectedGames: MatchGame[], questions: LiveQuestion[], questionIndex: number) {
  const questionId = questions[questionIndex]?.id;
  if (!questionId) {
    return {
      currentGame: null,
      currentGameIndex: -1,
      currentGameRoundIndex: -1,
    };
  }

  const currentGameIndex = findGameIndexByQuestionId(selectedGames, questionId);
  const currentGame = currentGameIndex >= 0 ? selectedGames[currentGameIndex] : null;

  return {
    currentGame,
    currentGameIndex,
    currentGameRoundIndex: currentGame ? currentGame.roundIds.indexOf(questionId) : -1,
  };
}

export function isFirstQuestionOfGame(selectedGames: MatchGame[], questionId: string) {
  return selectedGames.some((game) => game.roundIds[0] === questionId);
}
