import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { io as createClient, type Socket } from 'socket.io-client';
import { createRealtimeApp } from '../src/app.ts';
import { liveQuestionsFixture } from './fixtures.ts';
import type { BasicAck, RoomCreateAck, RoomJoinAck, RoomState } from '../src/types/realtime.ts';

function once<T>(socket: Socket, event: string) {
  return new Promise<T>((resolve) => socket.once(event, resolve));
}

function emitAck<TResponse>(socket: Socket, event: string, payload: unknown = {}) {
  return new Promise<TResponse>((resolve) => socket.emit(event, payload, resolve));
}

async function startMatchAndOpenFirstRound(
  host: Socket,
  listener: Socket,
  pin: string,
  hostToken: string,
) {
  const startAck = await emitAck<BasicAck>(host, 'game:start', { pin, hostToken });
  expect(startAck.ok).toBe(true);
  if (!startAck.ok) return null;
  expect(startAck.state.status).toBe('game_intro');

  const openedPromise = once<RoomState>(listener, 'round:opened');
  const openAck = await emitAck<BasicAck>(host, 'round:next', { pin, hostToken });
  expect(openAck.ok).toBe(true);
  if (!openAck.ok) return null;
  expect(openAck.state.status).toBe('round_open');

  return openedPromise;
}

async function openNextRound(host: Socket, listener: Socket, pin: string, hostToken: string) {
  const openedPromise = once<RoomState>(listener, 'round:opened');
  const nextAck = await emitAck<BasicAck>(host, 'round:next', { pin, hostToken });
  expect(nextAck.ok).toBe(true);
  if (!nextAck.ok) return null;

  if (nextAck.state.status === 'between_games') {
    const continueAck = await emitAck<BasicAck>(host, 'round:next', { pin, hostToken });
    expect(continueAck.ok).toBe(true);
    if (!continueAck.ok) return null;
    expect(continueAck.state.status).toBe('game_intro');

    const openAck = await emitAck<BasicAck>(host, 'round:next', { pin, hostToken });
    expect(openAck.ok).toBe(true);
    if (!openAck.ok) return null;
    expect(openAck.state.status).toBe('round_open');
  } else {
    expect(nextAck.state.status).toBe('round_open');
  }

  return openedPromise;
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

  it('serves health checks with security headers and without framework fingerprinting', async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(response.headers.get('x-powered-by')).toBeNull();
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
  });

  it('rejects malformed socket payloads without leaking internal errors', async () => {
    const client = await connectClient();

    const joinAck = await emitAck<RoomJoinAck>(client, 'room:join', null);
    expect(joinAck).toEqual({
      ok: false,
      message: 'Dados inválidos para esta ação.',
    });

    const hostActionAck = await emitAck<BasicAck>(client, 'round:next', {
      pin: 'abc',
      hostToken: 'short',
    });
    expect(hostActionAck).toEqual({
      ok: false,
      message: 'PIN inválido.',
    });
  });

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

    const opened = await startMatchAndOpenFirstRound(host, player, created.pin, created.hostToken);
    expect(opened).toBeTruthy();
    if (!opened) return;
    expect(opened.status).toBe('round_open');
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

    const opened = await startMatchAndOpenFirstRound(host, player, created.pin, created.hostToken);
    expect(opened).toBeTruthy();
    if (!opened) return;

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
      questions: [
        liveQuestionsFixture[1],
        liveQuestionsFixture[2],
        liveQuestionsFixture[3],
        liveQuestionsFixture[4],
        liveQuestionsFixture[5],
        liveQuestionsFixture[6],
        liveQuestionsFixture[7],
      ],
      workSituations: [],
      priorityOrderScenarios: [],
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

  it('supports competitive and participatory answer payloads', async () => {
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

    const trueFalseRound = await startMatchAndOpenFirstRound(host, anaSocket, created.pin, created.hostToken);
    expect(trueFalseRound).toBeTruthy();
    if (!trueFalseRound) return;
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

    const multipleSelectRound = await openNextRound(host, anaSocket, created.pin, created.hostToken);
    expect(multipleSelectRound).toBeTruthy();
    if (!multipleSelectRound) return;
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

    const pollRound = await openNextRound(host, anaSocket, created.pin, created.hostToken);
    expect(pollRound).toBeTruthy();
    if (!pollRound) return;
    expect(pollRound.currentQuestion?.type).toBe('poll');

    const pollRevealedPromise = once<RoomState>(host, 'round:revealed');
    await emitAck<BasicAck>(anaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: ana.playerToken,
      questionId: pollRound.currentQuestion?.id,
      optionId: 'q4-a',
    });
    await emitAck<BasicAck>(biaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: bia.playerToken,
      questionId: pollRound.currentQuestion?.id,
      optionId: 'q4-b',
    });

    const pollRevealed = await pollRevealedPromise;
    expect(pollRevealed.leaderboard).toEqual([]);
    expect(pollRevealed.aggregatedResult?.type).toBe('poll');
    if (pollRevealed.aggregatedResult?.type !== 'poll') return;
    expect(pollRevealed.aggregatedResult.totalResponses).toBe(2);

    const wordCloudRound = await openNextRound(host, anaSocket, created.pin, created.hostToken);
    expect(wordCloudRound).toBeTruthy();
    if (!wordCloudRound) return;
    expect(wordCloudRound.currentQuestion?.type).toBe('word_cloud');

    const wordCloudRevealedPromise = once<RoomState>(host, 'round:revealed');
    await emitAck<BasicAck>(anaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: ana.playerToken,
      questionId: wordCloudRound.currentQuestion?.id,
      text: '  trabalho   em equipe ',
    });
    await emitAck<BasicAck>(biaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: bia.playerToken,
      questionId: wordCloudRound.currentQuestion?.id,
      text: 'Trabalho em equipe',
    });

    const wordCloudRevealed = await wordCloudRevealedPromise;
    expect(wordCloudRevealed.leaderboard).toEqual([]);
    expect(wordCloudRevealed.aggregatedResult?.type).toBe('word_cloud');
    if (wordCloudRevealed.aggregatedResult?.type !== 'word_cloud') return;
    expect(wordCloudRevealed.aggregatedResult.entries[0]).toMatchObject({
      text: 'Trabalho em equipe',
      normalizedText: 'trabalho em equipe',
      count: 2,
    });

    const scaleRound = await openNextRound(host, anaSocket, created.pin, created.hostToken);
    expect(scaleRound).toBeTruthy();
    if (!scaleRound) return;
    expect(scaleRound.currentQuestion?.type).toBe('scale');

    const scaleRevealedPromise = once<RoomState>(host, 'round:revealed');
    await emitAck<BasicAck>(anaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: ana.playerToken,
      questionId: scaleRound.currentQuestion?.id,
      value: 2,
    });
    await emitAck<BasicAck>(biaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: bia.playerToken,
      questionId: scaleRound.currentQuestion?.id,
      value: 4,
    });

    const scaleRevealed = await scaleRevealedPromise;
    expect(scaleRevealed.leaderboard).toEqual([]);
    expect(scaleRevealed.aggregatedResult?.type).toBe('scale');
    if (scaleRevealed.aggregatedResult?.type !== 'scale') return;
    expect(scaleRevealed.aggregatedResult.average).toBe(3);

    const rankingRound = await openNextRound(host, anaSocket, created.pin, created.hostToken);
    expect(rankingRound).toBeTruthy();
    if (!rankingRound) return;
    expect(rankingRound.currentQuestion?.type).toBe('ranking');

    const rankingRevealedPromise = once<RoomState>(host, 'round:revealed');
    await emitAck<BasicAck>(anaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: ana.playerToken,
      questionId: rankingRound.currentQuestion?.id,
      optionIds: ['q7-a', 'q7-b', 'q7-c'],
    });
    await emitAck<BasicAck>(biaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: bia.playerToken,
      questionId: rankingRound.currentQuestion?.id,
      optionIds: ['q7-b', 'q7-a', 'q7-c'],
    });

    const rankingRevealed = await rankingRevealedPromise;
    expect(rankingRevealed.leaderboard).toEqual([]);
    expect(rankingRevealed.aggregatedResult?.type).toBe('ranking');
    if (rankingRevealed.aggregatedResult?.type !== 'ranking') return;
    expect(rankingRevealed.aggregatedResult.items[0].totalPoints).toBe(5);

    const qnaRound = await openNextRound(host, anaSocket, created.pin, created.hostToken);
    expect(qnaRound).toBeTruthy();
    if (!qnaRound) return;
    expect(qnaRound.currentQuestion?.type).toBe('qna');

    const qnaRevealedPromise = once<RoomState>(host, 'round:revealed');
    await emitAck<BasicAck>(anaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: ana.playerToken,
      questionId: qnaRound.currentQuestion?.id,
      text: '  Atualizar   meu currículo ',
    });
    await emitAck<BasicAck>(biaSocket, 'answer:submit', {
      pin: created.pin,
      playerToken: bia.playerToken,
      questionId: qnaRound.currentQuestion?.id,
      text: 'atualizar meu currículo',
    });

    const qnaRevealed = await qnaRevealedPromise;
    expect(qnaRevealed.leaderboard).toEqual([]);
    expect(qnaRevealed.aggregatedResult?.type).toBe('qna');
    if (qnaRevealed.aggregatedResult?.type !== 'qna') return;
    expect(qnaRevealed.aggregatedResult.entries[0]).toMatchObject({
      text: 'Atualizar meu currículo',
      normalizedText: 'atualizar meu currículo',
      count: 2,
    });
  });
});
