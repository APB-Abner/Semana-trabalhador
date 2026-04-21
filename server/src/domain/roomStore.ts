import { createPin, createToken } from './pin.ts';
import { calculateLiveScore } from './scoring.ts';
import { normalizePigeonAvatarState } from '../../../src/features/pigeon-avatar/model/avatarRules.ts';
import {
  createAggregatedResult,
  isCompetitiveQuestion,
  isLiveAnswerCorrect,
  normalizeLiveAnswer,
  validateLiveQuestion,
} from './question-handlers/index.ts';
import {
  getCurrentGameForRoundIndex,
  isFirstRoundOfGame,
  selectMatchSession,
} from './match/matchSelector.ts';
import { sortMatchRanking } from './match/scoring.ts';
import {
  calculateWorkSituationScore,
  createWorkSituationReveal,
  getPublicWorkSituation,
  normalizeWorkSituationAnswer,
} from './match/minigames/workSituation.ts';
import { getWorkSituationCatalog } from './match/minigames/workSituationCatalog.ts';
import type {
  LeaderboardEntry,
  LiveAnswerPayload,
  LiveQuestion,
  LiveRoomInternal,
  MatchRoundInternal,
  PlayerAnswer,
  PublicMatchRound,
  RoomEvent,
  RoomEventName,
  RoomState,
  WorkSituation,
} from '../types/realtime.ts';
import type { PigeonAvatarState } from '../../../src/shared/types/pigeonAvatar.ts';

type RoomStoreOptions = {
  questions: LiveQuestion[];
  workSituations?: WorkSituation[];
  selectQuestions?: (context: { recentQuestionIds: string[] }) => LiveQuestion[];
  recentQuestionHistorySize?: number;
  roundMs?: number;
  abandonedLobbyTtlMs?: number;
  finishedRoomTtlMs?: number;
  now?: () => number;
  onRoomEvent?: (event: RoomEvent) => void;
};

type CreateRoomResult = {
  pin: string;
  hostToken: string;
  state: RoomState;
};

type JoinPlayerResult = {
  pin: string;
  playerToken: string;
  state: RoomState;
};

export class RoomStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RoomStoreError';
  }
}

const DEFAULT_ABANDONED_LOBBY_TTL_MS = 15 * 60 * 1000;
const DEFAULT_FINISHED_ROOM_TTL_MS = 10 * 60 * 1000;

function assertQuestions(questions: LiveQuestion[]) {
  if (!questions.length) {
    throw new RoomStoreError('Nenhuma pergunta disponível para a competição.');
  }

  questions.forEach(validateLiveQuestion);
}

function toPublicQuestion(question: LiveQuestion | null, revealAnswer: boolean) {
  if (!question) {
    return null;
  }

  const publicQuestion = {
    id: question.id,
    type: question.type,
    topic: question.topic,
    text: question.text,
    options: question.options,
    scale: question.scale,
  };

  if (!revealAnswer) {
    return publicQuestion;
  }

  return {
    ...publicQuestion,
    correctOptionId: question.correctOptionId,
    correctOptionIds: question.correctOptionIds,
    explanation: question.explanation,
  };
}

function getQuickQuestion(round: MatchRoundInternal | null) {
  return round?.gameType === 'quick_quiz' ? round.question : null;
}

function toAnswerPayload(answer: string | LiveAnswerPayload): LiveAnswerPayload {
  return typeof answer === 'string' ? { optionId: answer } : answer;
}

export function createRoomStore({
  questions,
  workSituations = getWorkSituationCatalog(),
  selectQuestions,
  recentQuestionHistorySize = 30,
  roundMs = 20_000,
  abandonedLobbyTtlMs = DEFAULT_ABANDONED_LOBBY_TTL_MS,
  finishedRoomTtlMs = DEFAULT_FINISHED_ROOM_TTL_MS,
  now = () => Date.now(),
  onRoomEvent,
}: RoomStoreOptions) {
  assertQuestions(questions);

  const rooms = new Map<string, LiveRoomInternal>();
  const recentQuestionIds: string[] = [];

  function rememberSessionQuestions(sessionQuestions: LiveQuestion[]) {
    if (!recentQuestionHistorySize) {
      return;
    }

    recentQuestionIds.push(...sessionQuestions.map((question) => question.id));

    if (recentQuestionIds.length > recentQuestionHistorySize) {
      recentQuestionIds.splice(0, recentQuestionIds.length - recentQuestionHistorySize);
    }
  }

  function getSessionQuestions() {
    const sessionQuestions = selectQuestions
      ? selectQuestions({ recentQuestionIds: [...recentQuestionIds] })
      : questions;

    assertQuestions(sessionQuestions);
    rememberSessionQuestions(sessionQuestions);

    return sessionQuestions;
  }

  function requireRoom(pin: string): LiveRoomInternal {
    const room = rooms.get(pin);

    if (!room) {
      throw new RoomStoreError('Sala não encontrada.');
    }

    return room;
  }

  function requireHostToken(room: LiveRoomInternal, hostToken: string) {
    if (!hostToken || room.hostToken !== hostToken) {
      throw new RoomStoreError('Host inválido para esta sala.');
    }
  }

  function requireConnectedHost(room: LiveRoomInternal, hostToken: string) {
    requireHostToken(room, hostToken);

    if (!room.hostConnected) {
      throw new RoomStoreError('Host desconectado desta sala.');
    }
  }

  function getMatchProgress(room: LiveRoomInternal) {
    return getCurrentGameForRoundIndex(room.selectedGames, room.rounds, room.currentQuestionIndex);
  }

  function syncMatchProgress(room: LiveRoomInternal) {
    const { currentGameIndex, currentGameRoundIndex } = getMatchProgress(room);
    room.currentGameIndex = currentGameIndex;
    room.currentGameRoundIndex = currentGameRoundIndex;
  }

  function getCurrentRound(room: LiveRoomInternal) {
    return room.rounds[room.currentQuestionIndex] ?? null;
  }

  function toPublicMatchRound(
    matchRound: MatchRoundInternal | null,
    revealAnswer: boolean,
    answers: PlayerAnswer[] = [],
  ): PublicMatchRound | null {
    if (!matchRound) {
      return null;
    }

    if (matchRound.gameType === 'quick_quiz') {
      return {
        id: matchRound.id,
        gameType: 'quick_quiz',
        question: toPublicQuestion(matchRound.question, revealAnswer),
      };
    }

    return {
      id: matchRound.id,
      gameType: 'work_situation',
      situation: getPublicWorkSituation(matchRound.situation),
      ...(revealAnswer
        ? { reveal: createWorkSituationReveal(matchRound.situation, answers) }
        : {}),
    };
  }

  function sanitizeRoom(room: LiveRoomInternal): RoomState {
    const currentRound = getCurrentRound(room);
    const currentQuestion = getQuickQuestion(currentRound);
    const revealAnswer = room.status === 'round_revealed' || room.status === 'finished';
    const { currentGame, currentGameIndex, currentGameRoundIndex } = getMatchProgress(room);
    const answers = room.round ? [...room.round.answers.values()] : [];

    return {
      pin: room.pin,
      status: room.status,
      match: {
        selectedGames: room.selectedGames,
        currentGameIndex,
        currentRoundIndex: currentGameRoundIndex,
        status: room.status,
      },
      selectedGames: room.selectedGames,
      currentGame,
      currentGameIndex,
      currentGameRoundIndex,
      currentRound: toPublicMatchRound(currentRound, revealAnswer, answers),
      hostConnected: room.hostConnected,
      serverNow: now(),
      players: [...room.players.values()].map(({ token: _token, ...player }) => player),
      currentQuestionIndex: room.currentQuestionIndex,
      totalQuestions: room.rounds.length,
      currentQuestion: toPublicQuestion(currentQuestion, revealAnswer),
      startedAt: room.round?.startedAt ?? null,
      closesAt: room.round?.closesAt ?? null,
      answeredCount: room.round?.answers.size ?? 0,
      leaderboard: room.leaderboard,
      finalRanking: room.finalRanking,
      aggregatedResult: room.aggregatedResult,
    };
  }

  function emit(room: LiveRoomInternal, event: RoomEventName) {
    onRoomEvent?.({
      pin: room.pin,
      event,
      state: sanitizeRoom(room),
    });
  }

  function clearRoundTimer(room: LiveRoomInternal) {
    if (room.roundTimer) {
      clearTimeout(room.roundTimer);
      room.roundTimer = null;
    }
  }

  function clearLobbyExpirationTimer(room: LiveRoomInternal) {
    if (room.lobbyExpirationTimer) {
      clearTimeout(room.lobbyExpirationTimer);
      room.lobbyExpirationTimer = null;
    }
  }

  function clearFinishedExpirationTimer(room: LiveRoomInternal) {
    if (room.finishedExpirationTimer) {
      clearTimeout(room.finishedExpirationTimer);
      room.finishedExpirationTimer = null;
    }
  }

  function clearRoomTimers(room: LiveRoomInternal) {
    clearRoundTimer(room);
    clearLobbyExpirationTimer(room);
    clearFinishedExpirationTimer(room);
  }

  function deleteRoom(pin: string) {
    const room = rooms.get(pin);

    if (!room) {
      return;
    }

    clearRoomTimers(room);
    rooms.delete(pin);
  }

  function scheduleLobbyExpiration(room: LiveRoomInternal) {
    clearLobbyExpirationTimer(room);

    if (room.status !== 'lobby' || room.hostConnected) {
      return;
    }

    room.lobbyExpirationTimer = setTimeout(() => {
      deleteRoom(room.pin);
    }, abandonedLobbyTtlMs);
  }

  function scheduleFinishedExpiration(room: LiveRoomInternal) {
    clearFinishedExpirationTimer(room);
    room.finishedExpirationTimer = setTimeout(() => {
      deleteRoom(room.pin);
    }, finishedRoomTtlMs);
  }

  function createRoundLeaderboard(room: LiveRoomInternal): LeaderboardEntry[] {
    const { currentGame } = getMatchProgress(room);
    const currentGameId = currentGame?.id;

    return [...room.players.values()]
      .map((player) => {
        const answer = room.round?.answers.get(player.id);
        const gameScores = { ...player.gameScores };

        return {
          playerId: player.id,
          name: player.name,
          avatar: player.avatar,
          score: player.score,
          gameScore: currentGameId ? gameScores[currentGameId] ?? 0 : 0,
          gameScores,
          roundPoints: answer?.points ?? 0,
          lastAnswerCorrect: answer?.isCorrect ?? false,
          responseMs: answer?.responseMs ?? null,
        };
      })
      .sort(
        (a, b) =>
          b.roundPoints - a.roundPoints ||
          b.score - a.score ||
          (a.responseMs ?? Number.MAX_SAFE_INTEGER) - (b.responseMs ?? Number.MAX_SAFE_INTEGER) ||
          a.name.localeCompare(b.name),
      );
  }

  function finishGame(room: LiveRoomInternal) {
    clearRoundTimer(room);
    room.status = 'finished';
    room.aggregatedResult = null;
    room.finalRanking = sortMatchRanking(createRoundLeaderboard(room));
    room.leaderboard = room.finalRanking;
    emit(room, 'game:finished');
    scheduleFinishedExpiration(room);
  }

  function revealRound(room: LiveRoomInternal) {
    if (room.status !== 'round_open') {
      return;
    }

    clearRoundTimer(room);
    room.status = 'round_revealed';
    const currentRound = getCurrentRound(room);
    const currentQuestion = getQuickQuestion(currentRound);
    const answers = [...room.round!.answers.values()];

    if (currentRound?.gameType === 'work_situation') {
      room.aggregatedResult = null;
      room.leaderboard = createRoundLeaderboard(room);
      emit(room, 'round:revealed');
      emit(room, 'leaderboard:update');
      return;
    }

    if (currentQuestion && isCompetitiveQuestion(currentQuestion)) {
      room.aggregatedResult = null;
      room.leaderboard = createRoundLeaderboard(room);
      emit(room, 'round:revealed');
      emit(room, 'leaderboard:update');
      return;
    }

    room.leaderboard = [];
    room.aggregatedResult = currentQuestion ? createAggregatedResult(currentQuestion, answers) : null;
    emit(room, 'round:revealed');
  }

  function scheduleRoundClose(room: LiveRoomInternal) {
    clearRoundTimer(room);
    room.roundTimer = setTimeout(() => {
      revealRound(room);
    }, Math.max(0, room.round!.closesAt - now()));
  }

  function openRound(room: LiveRoomInternal, questionIndex: number) {
    const startedAt = now();
    const matchRound = room.rounds[questionIndex];

    if (!matchRound) {
      finishGame(room);
      return;
    }

    room.status = 'round_open';
    room.currentQuestionIndex = questionIndex;
    syncMatchProgress(room);
    room.round = {
      questionId: matchRound.id,
      startedAt,
      closesAt: startedAt + roundMs,
      answers: new Map<string, PlayerAnswer>(),
    };
    room.leaderboard = [];
    room.aggregatedResult = null;
    scheduleRoundClose(room);
    emit(room, 'round:opened');
  }

  function activePlayers(room: LiveRoomInternal) {
    return [...room.players.values()].filter((player) => player.connected);
  }

  function normalizePlayerName(name: string) {
    return name.trim().replace(/\s+/g, ' ');
  }

  function toComparableName(name: string) {
    return normalizePlayerName(name).toLocaleLowerCase('pt-BR');
  }

  function hasDuplicatePlayerName(room: LiveRoomInternal, name: string) {
    const comparableName = toComparableName(name);
    return [...room.players.values()].some((player) => toComparableName(player.name) === comparableName);
  }

  function maybeRevealWhenAllAnswered(room: LiveRoomInternal) {
    const players = activePlayers(room);

    if (players.length > 0 && players.every((player) => room.round?.answers.has(player.id))) {
      revealRound(room);
    }
  }

  function createRoom(): CreateRoomResult {
    const pin = createPin(new Set(rooms.keys()));
    const hostToken = createToken();
    const sessionQuestions = getSessionQuestions();
    const matchSession = selectMatchSession({
      questions: sessionQuestions,
      workSituations,
    });
    const room: LiveRoomInternal = {
      pin,
      hostToken,
      hostConnected: true,
      status: 'lobby',
      players: new Map(),
      questions: sessionQuestions,
      rounds: matchSession.rounds,
      selectedGames: matchSession.selectedGames,
      currentGameIndex: -1,
      currentGameRoundIndex: -1,
      currentQuestionIndex: -1,
      round: null,
      leaderboard: [],
      finalRanking: [],
      aggregatedResult: null,
      roundTimer: null,
      lobbyExpirationTimer: null,
      finishedExpirationTimer: null,
    };

    rooms.set(pin, room);
    emit(room, 'room:state');

    return {
      pin,
      hostToken,
      state: sanitizeRoom(room),
    };
  }

  function joinPlayer(pin: string, name: string, avatar?: PigeonAvatarState): JoinPlayerResult {
    const room = requireRoom(pin);
    const cleanName = normalizePlayerName(name);

    if (room.status !== 'lobby') {
      throw new RoomStoreError('A partida já começou. Só é possível reconectar jogadores existentes.');
    }

    if (!cleanName || cleanName.length > 32) {
      throw new RoomStoreError('Informe um nome entre 1 e 32 caracteres.');
    }

    if (hasDuplicatePlayerName(room, cleanName)) {
      throw new RoomStoreError('Este nome já está em uso nesta sala.');
    }

    const playerToken = createToken();
    const playerId = createToken();
    room.players.set(playerId, {
      id: playerId,
      token: playerToken,
      name: cleanName,
      avatar: normalizePigeonAvatarState(avatar),
      score: 0,
      gameScores: {},
      connected: true,
      joinedAt: now(),
    });

    emit(room, 'presence:update');

    return {
      pin,
      playerToken,
      state: sanitizeRoom(room),
    };
  }

  function reconnectHost(pin: string, hostToken: string) {
    const room = requireRoom(pin);
    requireHostToken(room, hostToken);
    room.hostConnected = true;
    clearLobbyExpirationTimer(room);
    emit(room, 'room:state');
    return sanitizeRoom(room);
  }

  function reconnectPlayer(pin: string, playerToken: string) {
    const room = requireRoom(pin);
    const player = [...room.players.values()].find((candidate) => candidate.token === playerToken);

    if (!player) {
      throw new RoomStoreError('Jogador não encontrado nesta sala.');
    }

    player.connected = true;
    emit(room, 'presence:update');
    return sanitizeRoom(room);
  }

  function startGame(pin: string, hostToken: string) {
    const room = requireRoom(pin);
    requireConnectedHost(room, hostToken);

    if (room.status !== 'lobby') {
      throw new RoomStoreError('A partida já foi iniciada.');
    }

    if (activePlayers(room).length < 1) {
      throw new RoomStoreError('Adicione pelo menos 1 jogador para iniciar.');
    }

    room.status = 'game_intro';
    room.currentQuestionIndex = 0;
    room.round = null;
    room.leaderboard = [];
    room.aggregatedResult = null;
    syncMatchProgress(room);
    emit(room, 'room:state');
    return sanitizeRoom(room);
  }

  function nextRound(pin: string, hostToken: string) {
    const room = requireRoom(pin);
    requireConnectedHost(room, hostToken);

    if (room.status === 'finished') {
      return sanitizeRoom(room);
    }

    if (room.status === 'game_intro') {
      openRound(room, room.currentQuestionIndex < 0 ? 0 : room.currentQuestionIndex);
      return sanitizeRoom(room);
    }

    if (room.status === 'between_games') {
      room.status = 'game_intro';
      room.round = null;
      room.aggregatedResult = null;
      syncMatchProgress(room);
      emit(room, 'room:state');
      return sanitizeRoom(room);
    }

    if (room.status !== 'round_revealed') {
      throw new RoomStoreError('A rodada atual ainda não foi revelada.');
    }

    const nextQuestionIndex = room.currentQuestionIndex + 1;

    if (nextQuestionIndex >= room.rounds.length) {
      finishGame(room);
      return sanitizeRoom(room);
    }

    const nextRound = room.rounds[nextQuestionIndex];

    if (nextRound && isFirstRoundOfGame(room.selectedGames, nextRound.id)) {
      clearRoundTimer(room);
      room.status = 'between_games';
      room.currentQuestionIndex = nextQuestionIndex;
      room.round = null;
      room.aggregatedResult = null;
      room.leaderboard = sortMatchRanking(createRoundLeaderboard(room));
      syncMatchProgress(room);
      emit(room, 'room:state');
      return sanitizeRoom(room);
    }

    openRound(room, nextQuestionIndex);
    return sanitizeRoom(room);
  }

  function submitAnswer(
    pin: string,
    playerToken: string,
    questionId: string,
    answer: string | LiveAnswerPayload,
  ) {
    const room = requireRoom(pin);

    if (room.status !== 'round_open' || !room.round) {
      throw new RoomStoreError('Nenhuma rodada aberta para resposta.');
    }

    const player = [...room.players.values()].find((candidate) => candidate.token === playerToken);
    const currentRound = getCurrentRound(room);
    const question = getQuickQuestion(currentRound);

    if (!player) {
      throw new RoomStoreError('Jogador inválido para esta sala.');
    }

    if (!currentRound || currentRound.id !== questionId) {
      throw new RoomStoreError('Rodada invalida para o match atual.');
    }

    if (room.round.answers.has(player.id)) {
      throw new RoomStoreError('Você já respondeu esta rodada.');
    }

    const submittedAt = now();

    if (submittedAt > room.round.closesAt) {
      throw new RoomStoreError('O tempo da rodada já acabou.');
    }

    const responseMs = Math.max(0, submittedAt - room.round.startedAt);
    let optionIds: string[];
    let text: string | undefined;
    let normalizedText: string | undefined;
    let displayText: string | undefined;
    let value: number | undefined;
    let isCorrect: boolean;
    let points: number;

    try {
      if (currentRound.gameType === 'work_situation') {
        const normalizedAnswer = normalizeWorkSituationAnswer(currentRound.situation, toAnswerPayload(answer));
        optionIds = normalizedAnswer.optionIds;
        isCorrect = normalizedAnswer.option.id === currentRound.situation.bestOptionId;
        points = calculateWorkSituationScore({
          basePoints: normalizedAnswer.option.basePoints,
          submittedAt,
          startedAt: room.round.startedAt,
          limitMs: roundMs,
        });
      } else if (question) {
        const normalizedAnswer = normalizeLiveAnswer(question, toAnswerPayload(answer));
        optionIds = normalizedAnswer.optionIds;
        text = normalizedAnswer.text;
        normalizedText = normalizedAnswer.normalizedText;
        displayText = normalizedAnswer.displayText;
        value = normalizedAnswer.value;
        isCorrect = isCompetitiveQuestion(question)
          ? isLiveAnswerCorrect(question, normalizedAnswer)
          : false;
        points = isCompetitiveQuestion(question)
          ? calculateLiveScore({
              isCorrect,
              submittedAt,
              startedAt: room.round.startedAt,
              limitMs: roundMs,
            })
          : 0;
      } else {
        throw new Error('Rodada sem pergunta configurada.');
      }
    } catch (error) {
      throw new RoomStoreError(error instanceof Error ? error.message : 'Resposta invalida para esta rodada.');
    }

    player.score += points;
    const { currentGame } = getMatchProgress(room);

    if (currentGame) {
      player.gameScores[currentGame.id] = (player.gameScores[currentGame.id] ?? 0) + points;
    }
    room.round.answers.set(player.id, {
      optionId: optionIds[0],
      optionIds,
      text,
      normalizedText,
      displayText,
      value,
      submittedAt,
      responseMs,
      isCorrect,
      points,
    });

    maybeRevealWhenAllAnswered(room);
    return sanitizeRoom(room);
  }

  function leaveRoom(pin: string, token: string | undefined) {
    const room = rooms.get(pin);

    if (!room || !token) {
      return null;
    }

    if (token === room.hostToken) {
      room.hostConnected = false;
      scheduleLobbyExpiration(room);
      emit(room, 'room:state');
      return sanitizeRoom(room);
    }

    const player = [...room.players.values()].find((candidate) => candidate.token === token);

    if (player) {
      player.connected = false;
      emit(room, 'presence:update');
    }

    return sanitizeRoom(room);
  }

  function getState(pin: string) {
    return sanitizeRoom(requireRoom(pin));
  }

  function clearAllRooms() {
    rooms.forEach(clearRoomTimers);
    rooms.clear();
  }

  return {
    clearAllRooms,
    createRoom,
    getState,
    joinPlayer,
    leaveRoom,
    nextRound,
    reconnectHost,
    reconnectPlayer,
    startGame,
    submitAnswer,
  };
}

export type RoomStore = ReturnType<typeof createRoomStore>;
