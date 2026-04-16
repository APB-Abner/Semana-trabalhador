import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoomStore, RoomStoreError, type RoomStore } from '../src/domain/roomStore.ts';
import { liveQuestionsFixture } from './fixtures.ts';

describe('roomStore', () => {
  let currentTime: number;
  let store: RoomStore;

  beforeEach(() => {
    currentTime = 1_000;
    store = createRoomStore({
      questions: liveQuestionsFixture,
      roundMs: 20_000,
      now: () => currentTime,
    });
  });

  afterEach(() => {
    store.clearAllRooms();
    vi.useRealTimers();
  });

  it('creates rooms with unique 6-digit PINs', () => {
    const firstRoom = store.createRoom();
    const secondRoom = store.createRoom();

    expect(firstRoom.pin).toMatch(/^\d{6}$/);
    expect(secondRoom.pin).toMatch(/^\d{6}$/);
    expect(secondRoom.pin).not.toBe(firstRoom.pin);
  });

  it('adds a player and rejects invalid joins', () => {
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');

    expect(player.playerToken).toBeTruthy();
    expect(player.state.players).toHaveLength(1);
    expect(player.state.players[0].name).toBe('Ana');
    expect(() => store.joinPlayer('000000', 'Bia')).toThrow(RoomStoreError);
    expect(() => store.joinPlayer(room.pin, '')).toThrow(RoomStoreError);
  });

  it('rejects duplicate player names with case and spacing normalization', () => {
    const room = store.createRoom();

    store.joinPlayer(room.pin, 'Ana Silva');

    expect(() => store.joinPlayer(room.pin, '  ana   silva  ')).toThrow(RoomStoreError);
  });

  it('rejects starting a match without connected players', () => {
    const room = store.createRoom();

    expect(() => store.startGame(room.pin, room.hostToken)).toThrow(RoomStoreError);
  });

  it('starts the match and accepts a single answer per player per round', () => {
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');
    const started = store.startGame(room.pin, room.hostToken);

    expect(started.status).toBe('question');
    expect(started.currentQuestion?.correctOptionId).toBeUndefined();

    currentTime += 500;
    const answered = store.submitAnswer(
      room.pin,
      player.playerToken,
      liveQuestionsFixture[0].id,
      'q1-a',
    );

    expect(answered.status).toBe('revealed');
    expect(answered.leaderboard[0].roundPoints).toBeGreaterThan(0);
    expect(answered.currentQuestion?.correctOptionId).toBe('q1-a');
    expect(() => store.submitAnswer(
      room.pin,
      player.playerToken,
      liveQuestionsFixture[0].id,
      'q1-a',
    )).toThrow(RoomStoreError);
  });

  it('rejects late answers without changing score or answer count', () => {
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');

    store.startGame(room.pin, room.hostToken);
    currentTime += 20_001;

    expect(() => store.submitAnswer(
      room.pin,
      player.playerToken,
      liveQuestionsFixture[0].id,
      'q1-a',
    )).toThrow(RoomStoreError);

    const state = store.getState(room.pin);
    expect(state.answeredCount).toBe(0);
    expect(state.players[0].score).toBe(0);
  });

  it('accepts answers exactly at the deadline', () => {
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');

    store.startGame(room.pin, room.hostToken);
    currentTime += 20_000;

    const state = store.submitAnswer(
      room.pin,
      player.playerToken,
      liveQuestionsFixture[0].id,
      'q1-a',
    );

    expect(state.status).toBe('revealed');
    expect(state.leaderboard[0].roundPoints).toBe(700);
  });

  it('includes server time and host connectivity in public room state', () => {
    const room = store.createRoom();

    expect(room.state.serverNow).toBe(currentTime);
    expect(room.state.hostConnected).toBe(true);
  });

  it('builds a round leaderboard and final ranking by score', () => {
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');

    store.startGame(room.pin, room.hostToken);
    currentTime += 1_000;
    store.submitAnswer(room.pin, ana.playerToken, 'q1', 'q1-a');
    currentTime += 1_000;
    const revealed = store.submitAnswer(room.pin, bia.playerToken, 'q1', 'q1-b');

    expect(revealed.leaderboard[0].name).toBe('Ana');

    store.nextRound(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, bia.playerToken, 'q2', 'q2-a');
    currentTime += 5_000;
    store.submitAnswer(room.pin, ana.playerToken, 'q2', 'q2-a');

    store.nextRound(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q3', { optionIds: ['q3-d', 'q3-a', 'q3-b'] });
    currentTime += 1_000;
    store.submitAnswer(room.pin, bia.playerToken, 'q3', { optionIds: ['q3-a', 'q3-b'] });

    const finished = store.nextRound(room.pin, room.hostToken);

    expect(finished.status).toBe('finished');
    expect(finished.finalRanking[0].score).toBeGreaterThanOrEqual(finished.finalRanking[1].score);
  });

  it('scores true_false questions through the question handler', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: [liveQuestionsFixture[1]],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');

    store.startGame(room.pin, room.hostToken);
    currentTime += 500;
    const state = store.submitAnswer(room.pin, player.playerToken, 'q2', 'q2-a');

    expect(state.status).toBe('revealed');
    expect(state.leaderboard[0].lastAnswerCorrect).toBe(true);
    expect(state.currentQuestion?.correctOptionId).toBe('q2-a');
  });

  it('scores multiple_select only when the selected set is exact', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: [liveQuestionsFixture[2]],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');

    store.startGame(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q3', { optionIds: ['q3-d', 'q3-a', 'q3-b'] });
    currentTime += 500;
    const revealed = store.submitAnswer(room.pin, bia.playerToken, 'q3', { optionIds: ['q3-a', 'q3-b'] });

    expect(revealed.status).toBe('revealed');
    expect(revealed.currentQuestion?.correctOptionIds).toEqual(['q3-a', 'q3-b', 'q3-d']);
    expect(revealed.leaderboard[0].name).toBe('Ana');
    expect(revealed.leaderboard[0].roundPoints).toBeGreaterThan(0);
    expect(revealed.leaderboard.find((entry) => entry.name === 'Bia')?.roundPoints).toBe(0);
  });

  it('rejects invalid multiple_select options and duplicate submissions', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: [liveQuestionsFixture[2]],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');

    store.startGame(room.pin, room.hostToken);

    expect(() => store.submitAnswer(
      room.pin,
      player.playerToken,
      'q3',
      { optionIds: ['q3-a', 'q3-x'] },
    )).toThrow(RoomStoreError);

    store.submitAnswer(room.pin, player.playerToken, 'q3', { optionIds: ['q3-a', 'q3-b', 'q3-d'] });
    expect(() => store.submitAnswer(
      room.pin,
      player.playerToken,
      'q3',
      { optionIds: ['q3-a', 'q3-b', 'q3-d'] },
    )).toThrow(RoomStoreError);
  });

  it('marks host disconnects, blocks host actions, and allows continuing after reconnect', () => {
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');

    store.startGame(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, player.playerToken, 'q1', 'q1-a');

    const disconnected = store.leaveRoom(room.pin, room.hostToken);

    expect(disconnected?.hostConnected).toBe(false);
    expect(() => store.nextRound(room.pin, room.hostToken)).toThrow(RoomStoreError);

    const reconnected = store.reconnectHost(room.pin, room.hostToken);
    expect(reconnected.hostConnected).toBe(true);
    expect(store.nextRound(room.pin, room.hostToken).status).toBe('question');
  });

  it('expires abandoned lobby rooms after the configured TTL', () => {
    store.clearAllRooms();
    vi.useFakeTimers();
    store = createRoomStore({
      questions: liveQuestionsFixture,
      abandonedLobbyTtlMs: 1_000,
      now: () => currentTime,
    });

    const room = store.createRoom();
    store.leaveRoom(room.pin, room.hostToken);

    vi.advanceTimersByTime(999);
    expect(store.getState(room.pin).hostConnected).toBe(false);

    vi.advanceTimersByTime(1);
    expect(() => store.getState(room.pin)).toThrow(RoomStoreError);
  });

  it('cancels abandoned lobby expiration when the host reconnects', () => {
    store.clearAllRooms();
    vi.useFakeTimers();
    store = createRoomStore({
      questions: liveQuestionsFixture,
      abandonedLobbyTtlMs: 1_000,
      now: () => currentTime,
    });

    const room = store.createRoom();
    store.leaveRoom(room.pin, room.hostToken);
    vi.advanceTimersByTime(500);

    store.reconnectHost(room.pin, room.hostToken);
    vi.advanceTimersByTime(1_000);

    expect(store.getState(room.pin).hostConnected).toBe(true);
  });

  it('expires finished rooms after the configured TTL', () => {
    store.clearAllRooms();
    vi.useFakeTimers();
    store = createRoomStore({
      questions: liveQuestionsFixture.slice(0, 1),
      finishedRoomTtlMs: 1_000,
      now: () => currentTime,
    });

    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');

    store.startGame(room.pin, room.hostToken);
    store.submitAnswer(room.pin, player.playerToken, 'q1', 'q1-a');
    expect(store.nextRound(room.pin, room.hostToken).status).toBe('finished');

    vi.advanceTimersByTime(1_000);
    expect(() => store.getState(room.pin)).toThrow(RoomStoreError);
  });
});
