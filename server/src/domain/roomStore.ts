import { createPin, createToken } from './pin.ts';
import { calculateLiveScore } from './scoring.ts';
import type {
  LeaderboardEntry,
  LiveQuestion,
  LiveRoomInternal,
  PlayerAnswer,
  RoomEvent,
  RoomEventName,
  RoomState,
} from '../types/realtime.ts';

type RoomStoreOptions = {
  questions: LiveQuestion[];
  roundMs?: number;
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

function assertQuestions(questions: LiveQuestion[]) {
  if (!questions.length) {
    throw new RoomStoreError('Nenhuma pergunta disponível para a competição.');
  }
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
  };

  if (!revealAnswer) {
    return publicQuestion;
  }

  return {
    ...publicQuestion,
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  };
}

export function createRoomStore({
  questions,
  roundMs = 20_000,
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

  function requireHost(room: LiveRoomInternal, hostToken: string) {
    if (!hostToken || room.hostToken !== hostToken) {
      throw new RoomStoreError('Host inválido para esta sala.');
    }
  }

  function sanitizeRoom(room: LiveRoomInternal): RoomState {
    const currentQuestion = room.questions[room.currentQuestionIndex] ?? null;
    const revealAnswer = room.status === 'revealed' || room.status === 'finished';

    return {
      pin: room.pin,
      status: room.status,
      players: [...room.players.values()].map(({ token: _token, ...player }) => player),
      currentQuestionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      currentQuestion: toPublicQuestion(currentQuestion, revealAnswer),
      startedAt: room.round?.startedAt ?? null,
      closesAt: room.round?.closesAt ?? null,
      answeredCount: room.round?.answers.size ?? 0,
      leaderboard: room.leaderboard,
      finalRanking: room.finalRanking,
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

  function createRoundLeaderboard(room: LiveRoomInternal): LeaderboardEntry[] {
    return [...room.players.values()]
      .map((player) => {
        const answer = room.round?.answers.get(player.id);

        return {
          playerId: player.id,
          name: player.name,
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
    room.finalRanking = sortRanking(createRoundLeaderboard(room));
    room.leaderboard = room.finalRanking;
    emit(room, 'game:finished');
  }

  function revealRound(room: LiveRoomInternal) {
    if (room.status !== 'question') {
      return;
    }

    clearRoundTimer(room);
    room.status = 'revealed';
    room.leaderboard = createRoundLeaderboard(room);
    emit(room, 'round:revealed');
    emit(room, 'leaderboard:update');
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
    scheduleRoundClose(room);
    emit(room, 'round:opened');
  }

  function activePlayers(room: LiveRoomInternal) {
    return [...room.players.values()].filter((player) => player.connected);
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
      status: 'lobby',
      players: new Map(),
      questions,
      currentQuestionIndex: -1,
      round: null,
      leaderboard: [],
      finalRanking: [],
      roundTimer: null,
    };

    rooms.set(pin, room);
    emit(room, 'room:state');

    return {
      pin,
      hostToken,
      state: sanitizeRoom(room),
    };
  }

  function joinPlayer(pin: string, name: string): JoinPlayerResult {
    const room = requireRoom(pin);
    const cleanName = name.trim();

    if (room.status !== 'lobby') {
      throw new RoomStoreError('A partida já começou. Só é possível reconectar jogadores existentes.');
    }

    if (!cleanName || cleanName.length > 32) {
      throw new RoomStoreError('Informe um nome entre 1 e 32 caracteres.');
    }

    const playerToken = createToken();
    const playerId = createToken();
    room.players.set(playerId, {
      id: playerId,
      token: playerToken,
      name: cleanName,
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
    requireHost(room, hostToken);
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
    requireHost(room, hostToken);

    if (room.status !== 'lobby') {
      throw new RoomStoreError('A partida já foi iniciada.');
    }

    openRound(room, 0);
    return sanitizeRoom(room);
  }

  function nextRound(pin: string, hostToken: string) {
    const room = requireRoom(pin);
    requireHost(room, hostToken);

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

  function submitAnswer(pin: string, playerToken: string, questionId: string, optionId: string) {
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

    if (!question.options.some((option) => option.id === optionId)) {
      throw new RoomStoreError('Opção inválida para esta pergunta.');
    }

    const submittedAt = Math.min(now(), room.round.closesAt);
    const responseMs = Math.max(0, submittedAt - room.round.startedAt);
    const isCorrect = optionId === question.correctOptionId;
    const points = calculateLiveScore({
      isCorrect,
      submittedAt,
      startedAt: room.round.startedAt,
      limitMs: roundMs,
    });

    player.score += points;
    room.round.answers.set(player.id, {
      optionId,
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
    rooms.forEach(clearRoundTimer);
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
