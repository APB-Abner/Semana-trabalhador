import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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
      liveQuestionsFixture[0].correctOptionId,
    );

    expect(answered.status).toBe('revealed');
    expect(answered.leaderboard[0].roundPoints).toBeGreaterThan(0);
    expect(answered.currentQuestion?.correctOptionId).toBe(liveQuestionsFixture[0].correctOptionId);
    expect(() => store.submitAnswer(
      room.pin,
      player.playerToken,
      liveQuestionsFixture[0].id,
      liveQuestionsFixture[0].correctOptionId,
    )).toThrow(RoomStoreError);
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

    const finished = store.nextRound(room.pin, room.hostToken);

    expect(finished.status).toBe('finished');
    expect(finished.finalRanking[0].score).toBeGreaterThanOrEqual(finished.finalRanking[1].score);
  });
});
