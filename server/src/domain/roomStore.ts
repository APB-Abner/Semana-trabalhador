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
import type {
  LeaderboardEntry,
  LiveAnswerPayload,
  LiveQuestion,
  LiveRoomInternal,
  PlayerAnswer,
  RoomEvent,
  RoomEventName,
  RoomState,
} from '../types/realtime.ts';
import type { PigeonAvatarState } from '../../../src/shared/types/pigeonAvatar.ts';

type RoomStoreOptions = {
  questions: LiveQuestion[];
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

function sortRanking(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort(
    (a, b) =>
      b.score - a.score ||
      b.roundPoints - a.roundPoints ||
      Number(b.lastAnswerCorrect) - Number(a.lastAnswerCorrect) ||
      a.name.localeCompare(b.name),
  );
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

function toAnswerPayload(answer: string | LiveAnswerPayload): LiveAnswerPayload {
  return typeof answer === 'string' ? { optionId: answer } : answer;
}

export function createRoomStore({
  questions,
  roundMs = 20_000,
  abandonedLobbyTtlMs = DEFAULT_ABANDONED_LOBBY_TTL_MS,
  finishedRoomTtlMs = DEFAULT_FINISHED_ROOM_TTL_MS,
  now = () => Date.now(),
  onRoomEvent,
}: RoomStoreOptions) {
  assertQuestions(questions);

  const rooms = new Map<string, LiveRoomInternal>();

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

  function sanitizeRoom(room: LiveRoomInternal): RoomState {
    const currentQuestion = room.questions[room.currentQuestionIndex] ?? null;
    const revealAnswer = room.status === 'revealed' || room.status === 'finished';

    return {
      pin: room.pin,
      status: room.status,
      hostConnected: room.hostConnected,
      serverNow: now(),
      players: [...room.players.values()].map(({ token: _token, ...player }) => player),
      currentQuestionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
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
    return [...room.players.values()]
      .map((player) => {
        const answer = room.round?.answers.get(player.id);

        return {
          playerId: player.id,
          name: player.name,
          avatar: player.avatar,
          score: player.score,
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
    room.finalRanking = sortRanking(createRoundLeaderboard(room));
    room.leaderboard = room.finalRanking;
    emit(room, 'game:finished');
    scheduleFinishedExpiration(room);
  }

  function revealRound(room: LiveRoomInternal) {
    if (room.status !== 'question') {
      return;
    }

    clearRoundTimer(room);
    room.status = 'revealed';
    const currentQuestion = room.questions[room.currentQuestionIndex];
    const answers = [...room.round!.answers.values()];

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
    const question = room.questions[questionIndex];

    if (!question) {
      finishGame(room);
      return;
    }

    room.status = 'question';
    room.currentQuestionIndex = questionIndex;
    room.round = {
      questionId: question.id,
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
    const room: LiveRoomInternal = {
      pin,
      hostToken,
      hostConnected: true,
      status: 'lobby',
      players: new Map(),
      questions,
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

    openRound(room, 0);
    return sanitizeRoom(room);
  }

  function nextRound(pin: string, hostToken: string) {
    const room = requireRoom(pin);
    requireConnectedHost(room, hostToken);

    if (room.status === 'finished') {
      return sanitizeRoom(room);
    }

    if (room.status !== 'revealed') {
      throw new RoomStoreError('A rodada atual ainda não foi revelada.');
    }

    const nextQuestionIndex = room.currentQuestionIndex + 1;

    if (nextQuestionIndex >= room.questions.length) {
      finishGame(room);
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

    if (room.status !== 'question' || !room.round) {
      throw new RoomStoreError('Nenhuma rodada aberta para resposta.');
    }

    const player = [...room.players.values()].find((candidate) => candidate.token === playerToken);
    const question = room.questions[room.currentQuestionIndex];

    if (!player) {
      throw new RoomStoreError('Jogador inválido para esta sala.');
    }

    if (!question || question.id !== questionId) {
      throw new RoomStoreError('Pergunta inválida para a rodada atual.');
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

    try {
      const normalizedAnswer = normalizeLiveAnswer(question, toAnswerPayload(answer));
      optionIds = normalizedAnswer.optionIds;
      text = normalizedAnswer.text;
      normalizedText = normalizedAnswer.normalizedText;
      displayText = normalizedAnswer.displayText;
      value = normalizedAnswer.value;
      isCorrect = isCompetitiveQuestion(question)
        ? isLiveAnswerCorrect(question, normalizedAnswer)
        : false;
    } catch (error) {
      throw new RoomStoreError(error instanceof Error ? error.message : 'Resposta inválida para esta pergunta.');
    }

    const points = isCompetitiveQuestion(question)
      ? calculateLiveScore({
          isCorrect,
          submittedAt,
          startedAt: room.round.startedAt,
          limitMs: roundMs,
        })
      : 0;

    player.score += points;
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
