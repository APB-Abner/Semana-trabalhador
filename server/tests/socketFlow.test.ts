import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { io as createClient, type Socket } from 'socket.io-client';
import { createRealtimeApp } from '../src/app.ts';
import { liveQuestionsFixture } from './fixtures.ts';
import type { BasicAck, RoomCreateAck, RoomJoinAck, RoomState } from '../src/types/realtime.ts';

function once<T>(socket: Socket, event: string) {
  return new Promise<T>((resolve) => socket.once(event, resolve));
}

function emitAck<TResponse>(socket: Socket, event: string, payload = {}) {
  return new Promise<TResponse>((resolve) => socket.emit(event, payload, resolve));
}

describe('socket live quiz flow', () => {
  let httpServer: ReturnType<typeof createRealtimeApp>['httpServer'];
  let ioServer: ReturnType<typeof createRealtimeApp>['io'];
  let baseUrl: string;
  let sockets: Socket[];

  beforeEach(async () => {
    const app = createRealtimeApp({
      questions: liveQuestionsFixture.slice(0, 1),
      roundMs: 1_000,
    });
    httpServer = app.httpServer;
    ioServer = app.io;
    sockets = [];

    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => resolve());
    });

    const address = httpServer.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterEach(async () => {
    sockets.forEach((socket) => socket.disconnect());
    await new Promise<void>((resolve) => ioServer.close(() => resolve()));
    await new Promise<void>((resolve) => httpServer.close(() => resolve()));
  });

  async function connectClient() {
    const socket = createClient(baseUrl, { transports: ['websocket'] });
    sockets.push(socket);
    await once(socket, 'connect');
    return socket;
  }

  it('creates a room, updates presence, opens a round, reveals leaderboard and finishes', async () => {
    const host = await connectClient();
    const player = await connectClient();
    const created = await emitAck<RoomCreateAck>(host, 'room:create');

    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const presencePromise = once<RoomState>(host, 'presence:update');
    const joined = await emitAck<RoomJoinAck>(player, 'room:join', {
      pin: created.pin,
      role: 'player',
      name: 'Ana',
    });

    expect(joined.ok).toBe(true);
    if (!joined.ok) return;

    const presence = await presencePromise;
    expect(presence.players.map((currentPlayer) => currentPlayer.name)).toContain('Ana');

    const openedPromise = once<RoomState>(player, 'round:opened');
    const startAck = await emitAck<BasicAck>(host, 'game:start', {
      pin: created.pin,
      hostToken: created.hostToken,
    });

    expect(startAck.ok).toBe(true);
    const opened = await openedPromise;
    expect(opened.status).toBe('question');
    expect(opened.serverNow).toEqual(expect.any(Number));
    expect(opened.currentQuestion?.correctOptionId).toBeUndefined();

    const revealedPromise = once<RoomState>(host, 'round:revealed');
    const leaderboardPromise = once<RoomState>(player, 'leaderboard:update');
    const answerAck = await emitAck<BasicAck>(player, 'answer:submit', {
      pin: created.pin,
      playerToken: joined.playerToken,
      questionId: opened.currentQuestion?.id,
      optionId: opened.currentQuestion?.options[0].id,
    });

    expect(answerAck.ok).toBe(true);
    const revealed = await revealedPromise;
    const leaderboard = await leaderboardPromise;
    expect(revealed.currentQuestion?.correctOptionId).toBe(liveQuestionsFixture[0].correctOptionId);
    expect(leaderboard.leaderboard[0].name).toBe('Ana');

    const hostDisconnectedPromise = once<RoomState>(player, 'room:state');
    host.disconnect();
    const hostDisconnected = await hostDisconnectedPromise;
    expect(hostDisconnected.hostConnected).toBe(false);

    const blockedHost = await connectClient();
    const blockedAck = await emitAck<BasicAck>(blockedHost, 'round:next', {
      pin: created.pin,
      hostToken: created.hostToken,
    });
    expect(blockedAck.ok).toBe(false);

    const reconnected = await emitAck<RoomJoinAck>(blockedHost, 'room:join', {
      pin: created.pin,
      role: 'host',
      hostToken: created.hostToken,
    });
    expect(reconnected.ok).toBe(true);
    if (!reconnected.ok) return;
    expect(reconnected.state.hostConnected).toBe(true);

    const finishedPromise = once<RoomState>(player, 'game:finished');
    const nextAck = await emitAck<BasicAck>(blockedHost, 'round:next', {
      pin: created.pin,
      hostToken: created.hostToken,
    });

    expect(nextAck.ok).toBe(true);
    const finished = await finishedPromise;
    expect(finished.status).toBe('finished');
    expect(finished.finalRanking[0].name).toBe('Ana');
  });

  it('returns an error when a player submits after the round has closed', async () => {
    const host = await connectClient();
    const player = await connectClient();
    const created = await emitAck<RoomCreateAck>(host, 'room:create');

    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const joined = await emitAck<RoomJoinAck>(player, 'room:join', {
      pin: created.pin,
      role: 'player',
      name: 'Ana',
    });

    expect(joined.ok).toBe(true);
    if (!joined.ok) return;

    const openedPromise = once<RoomState>(player, 'round:opened');
    await emitAck<BasicAck>(host, 'game:start', {
      pin: created.pin,
      hostToken: created.hostToken,
    });
    const opened = await openedPromise;

    await new Promise((resolve) => setTimeout(resolve, 1_100));

    const answerAck = await emitAck<BasicAck>(player, 'answer:submit', {
      pin: created.pin,
      playerToken: joined.playerToken,
      questionId: opened.currentQuestion?.id,
      optionId: opened.currentQuestion?.options[0].id,
    });

    expect(answerAck.ok).toBe(false);
  });
});

describe('socket live quiz question types', () => {
  let httpServer: ReturnType<typeof createRealtimeApp>['httpServer'];
  let ioServer: ReturnType<typeof createRealtimeApp>['io'];
  let baseUrl: string;
  let sockets: Socket[];

  beforeEach(async () => {
    const app = createRealtimeApp({
      questions: [liveQuestionsFixture[1], liveQuestionsFixture[2]],
      roundMs: 5_000,
    });
    httpServer = app.httpServer;
    ioServer = app.io;
    sockets = [];

    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => resolve());
    });

    const address = httpServer.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterEach(async () => {
    sockets.forEach((socket) => socket.disconnect());
    await new Promise<void>((resolve) => ioServer.close(() => resolve()));
    await new Promise<void>((resolve) => httpServer.close(() => resolve()));
  });

  async function connectClient() {
    const socket = createClient(baseUrl, { transports: ['websocket'] });
    sockets.push(socket);
    await once(socket, 'connect');
    return socket;
  }

  it('supports true_false and multiple_select answer payloads', async () => {
    const host = await connectClient();
    const anaSocket = await connectClient();
    const biaSocket = await connectClient();
    const created = await emitAck<RoomCreateAck>(host, 'room:create');

    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const ana = await emitAck<RoomJoinAck>(anaSocket, 'room:join', {
      pin: created.pin,
      role: 'player',
      name: 'Ana',
    });
    const bia = await emitAck<RoomJoinAck>(biaSocket, 'room:join', {
      pin: created.pin,
      role: 'player',
      name: 'Bia',
    });

    expect(ana.ok).toBe(true);
    expect(bia.ok).toBe(true);
    if (!ana.ok || !bia.ok) return;

    const firstOpenedPromise = once<RoomState>(anaSocket, 'round:opened');
    const startAck = await emitAck<BasicAck>(host, 'game:start', {
      pin: created.pin,
      hostToken: created.hostToken,
    });
    expect(startAck.ok).toBe(true);

    const trueFalseRound = await firstOpenedPromise;
    expect(trueFalseRound.currentQuestion?.type).toBe('true_false');

    const trueFalseRevealedPromise = once<RoomState>(host, 'round:revealed');
    await emitAck<BasicAck>(anaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: ana.playerToken,
      questionId: trueFalseRound.currentQuestion?.id,
      optionId: 'q2-a',
    });
    await emitAck<BasicAck>(biaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: bia.playerToken,
      questionId: trueFalseRound.currentQuestion?.id,
      optionId: 'q2-b',
    });

    const trueFalseRevealed = await trueFalseRevealedPromise;
    expect(trueFalseRevealed.currentQuestion?.correctOptionId).toBe('q2-a');

    const multipleSelectOpenedPromise = once<RoomState>(anaSocket, 'round:opened');
    const nextAck = await emitAck<BasicAck>(host, 'round:next', {
      pin: created.pin,
      hostToken: created.hostToken,
    });
    expect(nextAck.ok).toBe(true);

    const multipleSelectRound = await multipleSelectOpenedPromise;
    expect(multipleSelectRound.currentQuestion?.type).toBe('multiple_select');

    const anaAnswerAck = await emitAck<BasicAck>(anaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: ana.playerToken,
      questionId: multipleSelectRound.currentQuestion?.id,
      optionIds: ['q3-d', 'q3-a', 'q3-b'],
    });
    expect(anaAnswerAck.ok).toBe(true);

    const duplicateAck = await emitAck<BasicAck>(anaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: ana.playerToken,
      questionId: multipleSelectRound.currentQuestion?.id,
      optionIds: ['q3-d', 'q3-a', 'q3-b'],
    });
    expect(duplicateAck.ok).toBe(false);

    const multipleSelectRevealedPromise = once<RoomState>(host, 'round:revealed');
    const leaderboardPromise = once<RoomState>(biaSocket, 'leaderboard:update');
    await emitAck<BasicAck>(biaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: bia.playerToken,
      questionId: multipleSelectRound.currentQuestion?.id,
      optionIds: ['q3-a', 'q3-b'],
    });

    const multipleSelectRevealed = await multipleSelectRevealedPromise;
    const leaderboard = await leaderboardPromise;
    expect(multipleSelectRevealed.currentQuestion?.correctOptionIds).toEqual(['q3-a', 'q3-b', 'q3-d']);
    expect(leaderboard.leaderboard[0].name).toBe('Ana');
    expect(leaderboard.leaderboard.find((entry) => entry.name === 'Bia')?.roundPoints).toBe(0);
  });
});
