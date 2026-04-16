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

    const finishedPromise = once<RoomState>(player, 'game:finished');
    const nextAck = await emitAck<BasicAck>(host, 'round:next', {
      pin: created.pin,
      hostToken: created.hostToken,
    });

    expect(nextAck.ok).toBe(true);
    const finished = await finishedPromise;
    expect(finished.status).toBe('finished');
    expect(finished.finalRanking[0].name).toBe('Ana');
  });
});
