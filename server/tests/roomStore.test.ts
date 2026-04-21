import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoomStore, RoomStoreError, type RoomStore } from '../src/domain/roomStore.ts';
import { getPriorityOrderCatalog } from '../src/domain/match/minigames/priorityOrderCatalog.ts';
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

  function startFirstRound(room: { pin: string; hostToken: string }) {
    const intro = store.startGame(room.pin, room.hostToken);
    expect(intro.status).toBe('game_intro');
    const opened = store.nextRound(room.pin, room.hostToken);
    expect(opened.status).toBe('round_open');
    return opened;
  }

  it('creates rooms with unique 6-digit PINs', () => {
    const firstRoom = store.createRoom();
    const secondRoom = store.createRoom();

    expect(firstRoom.pin).toMatch(/^\d{6}$/);
    expect(secondRoom.pin).toMatch(/^\d{6}$/);
    expect(secondRoom.pin).not.toBe(firstRoom.pin);
  });

  it('creates a match with authoritative quick quiz and work situation games', () => {
    const room = store.createRoom();

    expect(room.state.status).toBe('lobby');
    expect(room.state.selectedGames).toHaveLength(3);
    expect(room.state.match.selectedGames).toEqual(room.state.selectedGames);
    expect(room.state.selectedGames.map((game) => game.type)).toEqual([
      'quick_quiz',
      'work_situation',
      'priority_order',
    ]);
    expect(room.state.selectedGames.map((game) => game.roundCount)).toEqual([4, 3, 3]);
  });

  it('adds a player and rejects invalid joins', () => {
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana', {
      baseId: 'official-pigeon',
      palette: {
        primary: '#9AD8FF',
        secondary: '#3B82F6',
        chest: '#F0F9FF',
        beak: '#FFB13B',
        accent: '#22D3EE',
      },
      patternId: 'wing-bars',
      expressionId: 'focused',
      equipped: {
        head: 'neon-headphones',
        face: 'visor-glasses',
      },
      selectedPresetId: 'gamer',
      details: {
        blush: true,
      },
    });

    expect(player.playerToken).toBeTruthy();
    expect(player.state.players).toHaveLength(1);
    expect(player.state.players[0].name).toBe('Ana');
    expect(player.state.players[0].avatar.selectedPresetId).toBe('gamer');
    expect(player.state.players[0].avatar.equipped.head).toBe('neon-headphones');
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
    const intro = store.startGame(room.pin, room.hostToken);

    expect(intro.status).toBe('game_intro');
    expect(intro.currentGame?.type).toBe('quick_quiz');
    expect(intro.currentQuestion?.correctOptionId).toBeUndefined();

    const started = store.nextRound(room.pin, room.hostToken);

    expect(started.status).toBe('round_open');
    expect(started.currentQuestion?.correctOptionId).toBeUndefined();

    currentTime += 500;
    const answered = store.submitAnswer(
      room.pin,
      player.playerToken,
      liveQuestionsFixture[0].id,
      'q1-a',
    );

    expect(answered.status).toBe('round_revealed');
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

    startFirstRound(room);
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

    startFirstRound(room);
    currentTime += 20_000;

    const state = store.submitAnswer(
      room.pin,
      player.playerToken,
      liveQuestionsFixture[0].id,
      'q1-a',
    );

    expect(state.status).toBe('round_revealed');
    expect(state.leaderboard[0].roundPoints).toBe(700);
  });

  it('includes server time and host connectivity in public room state', () => {
    const room = store.createRoom();

    expect(room.state.serverNow).toBe(currentTime);
    expect(room.state.hostConnected).toBe(true);
  });

  it('builds a round leaderboard and final ranking by score', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: liveQuestionsFixture.slice(0, 3),
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');

    startFirstRound(room);
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

  it('moves through between_games at game boundaries while keeping the accumulated score', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: liveQuestionsFixture.slice(0, 5),
      workSituations: [],
      priorityOrderScenarios: [],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');

    let state = startFirstRound(room);
    expect(state.currentGame?.id).toBe('quick_quiz_1');

    currentTime += 500;
    store.submitAnswer(room.pin, player.playerToken, 'q1', 'q1-a');
    state = store.nextRound(room.pin, room.hostToken);
    expect(state.status).toBe('round_open');

    currentTime += 500;
    store.submitAnswer(room.pin, player.playerToken, 'q2', 'q2-a');
    state = store.nextRound(room.pin, room.hostToken);
    expect(state.status).toBe('round_open');

    currentTime += 500;
    store.submitAnswer(room.pin, player.playerToken, 'q3', { optionIds: ['q3-a', 'q3-b', 'q3-d'] });
    state = store.nextRound(room.pin, room.hostToken);
    expect(state.status).toBe('round_open');

    currentTime += 500;
    store.submitAnswer(room.pin, player.playerToken, 'q4', 'q4-a');
    const betweenGames = store.nextRound(room.pin, room.hostToken);

    expect(betweenGames.status).toBe('between_games');
    expect(betweenGames.currentGame?.id).toBe('quick_quiz_2');
    expect(betweenGames.leaderboard[0].name).toBe('Ana');
    expect(betweenGames.leaderboard[0].score).toBeGreaterThan(0);

    const nextGameIntro = store.nextRound(room.pin, room.hostToken);
    expect(nextGameIntro.status).toBe('game_intro');
    expect(nextGameIntro.currentQuestion?.id).toBe('q5');
    expect(nextGameIntro.currentGame?.id).toBe('quick_quiz_2');

    const nextGameRound = store.nextRound(room.pin, room.hostToken);
    expect(nextGameRound.status).toBe('round_open');
    expect(nextGameRound.currentQuestion?.id).toBe('q5');
  });

  it('plays work_situation rounds with quality score and reveal distribution', () => {
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q1', 'q1-a');
    store.submitAnswer(room.pin, bia.playerToken, 'q1', 'q1-b');

    store.nextRound(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q2', 'q2-a');
    store.submitAnswer(room.pin, bia.playerToken, 'q2', 'q2-b');

    store.nextRound(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q3', { optionIds: ['q3-a', 'q3-b', 'q3-d'] });
    store.submitAnswer(room.pin, bia.playerToken, 'q3', { optionIds: ['q3-a', 'q3-b'] });

    store.nextRound(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q4', 'q4-a');
    store.submitAnswer(room.pin, bia.playerToken, 'q4', 'q4-b');

    expect(store.nextRound(room.pin, room.hostToken).status).toBe('between_games');
    expect(store.nextRound(room.pin, room.hostToken).status).toBe('game_intro');
    const workRound = store.nextRound(room.pin, room.hostToken);

    expect(workRound.status).toBe('round_open');
    expect(workRound.currentRound?.gameType).toBe('work_situation');
    expect(workRound.currentQuestion).toBeNull();
    if (workRound.currentRound?.gameType !== 'work_situation') return;

    const [bestOption, okOption] = workRound.currentRound.situation.options;
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, workRound.currentRound.id, bestOption.id);
    currentTime += 500;
    const revealed = store.submitAnswer(room.pin, bia.playerToken, workRound.currentRound.id, okOption.id);

    expect(revealed.status).toBe('round_revealed');
    expect(revealed.currentRound?.gameType).toBe('work_situation');
    expect(revealed.aggregatedResult).toBeNull();
    expect(revealed.leaderboard[0].name).toBe('Ana');
    expect(revealed.leaderboard[0].roundPoints).toBeGreaterThan(revealed.leaderboard[1].roundPoints);
    if (revealed.currentRound?.gameType !== 'work_situation') return;
    expect(revealed.currentRound.reveal?.totalResponses).toBe(2);
    expect(revealed.currentRound.reveal?.options.find((option) => option.optionId === bestOption.id)).toMatchObject({
      count: 1,
      percentage: 50,
      basePoints: 1000,
    });
    expect(revealed.currentRound.reveal?.options.find((option) => option.optionId === okOption.id)).toMatchObject({
      count: 1,
      percentage: 50,
      basePoints: 600,
    });
  });

  it('plays priority_order rounds with permutation validation and distance score', () => {
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q1', 'q1-a');
    store.submitAnswer(room.pin, bia.playerToken, 'q1', 'q1-b');

    store.nextRound(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q2', 'q2-a');
    store.submitAnswer(room.pin, bia.playerToken, 'q2', 'q2-b');

    store.nextRound(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q3', { optionIds: ['q3-a', 'q3-b', 'q3-d'] });
    store.submitAnswer(room.pin, bia.playerToken, 'q3', { optionIds: ['q3-a', 'q3-b'] });

    store.nextRound(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q4', 'q4-a');
    store.submitAnswer(room.pin, bia.playerToken, 'q4', 'q4-b');

    expect(store.nextRound(room.pin, room.hostToken).status).toBe('between_games');
    expect(store.nextRound(room.pin, room.hostToken).status).toBe('game_intro');

    let workRound = store.nextRound(room.pin, room.hostToken);
    for (let roundIndex = 0; roundIndex < 3; roundIndex += 1) {
      expect(workRound.currentRound?.gameType).toBe('work_situation');
      if (workRound.currentRound?.gameType !== 'work_situation') return;
      const [bestOption, okOption] = workRound.currentRound.situation.options;
      currentTime += 500;
      store.submitAnswer(room.pin, ana.playerToken, workRound.currentRound.id, bestOption.id);
      currentTime += 500;
      store.submitAnswer(room.pin, bia.playerToken, workRound.currentRound.id, okOption.id);

      const nextState = store.nextRound(room.pin, room.hostToken);
      if (roundIndex < 2) {
        expect(nextState.status).toBe('round_open');
        workRound = nextState;
      } else {
        expect(nextState.status).toBe('between_games');
      }
    }

    expect(store.nextRound(room.pin, room.hostToken).status).toBe('game_intro');
    const priorityRound = store.nextRound(room.pin, room.hostToken);
    expect(priorityRound.status).toBe('round_open');
    expect(priorityRound.currentRound?.gameType).toBe('priority_order');
    expect(priorityRound.currentQuestion).toBeNull();
    if (priorityRound.currentRound?.gameType !== 'priority_order') return;
    const priorityCurrentRound = priorityRound.currentRound;

    const itemIds = priorityCurrentRound.scenario.items.map((item) => item.id);
    expect(priorityCurrentRound.scenario.items[0]).not.toHaveProperty('idealPosition');
    expect(() => store.submitAnswer(
      room.pin,
      ana.playerToken,
      priorityCurrentRound.id,
      { optionIds: [itemIds[0], itemIds[0], ...itemIds.slice(2)] },
    )).toThrow(RoomStoreError);
    expect(() => store.submitAnswer(
      room.pin,
      ana.playerToken,
      priorityCurrentRound.id,
      { optionIds: itemIds.slice(0, -1) },
    )).toThrow(RoomStoreError);

    const internalScenario = getPriorityOrderCatalog().find((scenario) => scenario.id === priorityCurrentRound.id);
    const idealOrder = [...(internalScenario?.items ?? [])]
      .sort((left, right) => left.idealPosition - right.idealPosition)
      .map((item) => item.id);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, priorityCurrentRound.id, { optionIds: idealOrder });
    currentTime += 500;
    const revealed = store.submitAnswer(room.pin, bia.playerToken, priorityCurrentRound.id, {
      optionIds: [...idealOrder].reverse(),
    });

    expect(idealOrder).toHaveLength(itemIds.length);
    expect(revealed.status).toBe('round_revealed');
    expect(revealed.currentRound?.gameType).toBe('priority_order');
    expect(revealed.aggregatedResult).toBeNull();
    expect(revealed.leaderboard).toHaveLength(2);
    if (revealed.currentRound?.gameType !== 'priority_order') return;
    expect(revealed.currentRound.reveal?.idealOrder).toHaveLength(itemIds.length);
    expect(revealed.currentRound.reveal?.answerSummaries).toHaveLength(2);
    const perfectSummary = revealed.currentRound.reveal?.answerSummaries.find((summary) =>
      summary.optionIds.every((optionId, index) => optionId === idealOrder[index]));
    expect(perfectSummary).toMatchObject({
      correctPositionCount: itemIds.length,
      maxDistance: Math.floor((itemIds.length * itemIds.length) / 2),
      totalDistance: 0,
      basePoints: 1000,
    });
    expect(perfectSummary?.points).toBe((perfectSummary?.basePoints ?? 0) + (perfectSummary?.speedBonus ?? 0));
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

    startFirstRound(room);
    currentTime += 500;
    const state = store.submitAnswer(room.pin, player.playerToken, 'q2', 'q2-a');

    expect(state.status).toBe('round_revealed');
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

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q3', { optionIds: ['q3-d', 'q3-a', 'q3-b'] });
    currentTime += 500;
    const revealed = store.submitAnswer(room.pin, bia.playerToken, 'q3', { optionIds: ['q3-a', 'q3-b'] });

    expect(revealed.status).toBe('round_revealed');
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

    startFirstRound(room);

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

  it('aggregates poll rounds without changing scores or leaderboard', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: [liveQuestionsFixture[3]],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q4', 'q4-a');
    currentTime += 500;
    const revealed = store.submitAnswer(room.pin, bia.playerToken, 'q4', 'q4-b');

    expect(revealed.status).toBe('round_revealed');
    expect(revealed.leaderboard).toEqual([]);
    expect(revealed.players.every((player) => player.score === 0)).toBe(true);
    expect(revealed.aggregatedResult?.type).toBe('poll');
    if (revealed.aggregatedResult?.type !== 'poll') return;
    expect(revealed.aggregatedResult.totalResponses).toBe(2);
    expect(revealed.aggregatedResult.options.find((option) => option.optionId === 'q4-a')).toMatchObject({
      count: 1,
      percentage: 50,
    });
  });

  it('aggregates word_cloud rounds with normalized keys and readable display text', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: [liveQuestionsFixture[4]],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');
    const caio = store.joinPlayer(room.pin, 'Caio');

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q5', { text: '  trabalho   em equipe ' });
    currentTime += 500;
    store.submitAnswer(room.pin, bia.playerToken, 'q5', { text: 'Trabalho em equipe' });
    currentTime += 500;
    const revealed = store.submitAnswer(room.pin, caio.playerToken, 'q5', { text: 'Pontualidade' });

    expect(revealed.status).toBe('round_revealed');
    expect(revealed.leaderboard).toEqual([]);
    expect(revealed.players.every((player) => player.score === 0)).toBe(true);
    expect(revealed.aggregatedResult?.type).toBe('word_cloud');
    if (revealed.aggregatedResult?.type !== 'word_cloud') return;
    expect(revealed.aggregatedResult.totalResponses).toBe(3);
    expect(revealed.aggregatedResult.entries[0]).toMatchObject({
      text: 'Trabalho em equipe',
      normalizedText: 'trabalho em equipe',
      count: 2,
    });
  });

  it('aggregates scale rounds without changing scores or leaderboard', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: [liveQuestionsFixture[5]],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q6', { value: 2 });
    currentTime += 500;
    const revealed = store.submitAnswer(room.pin, bia.playerToken, 'q6', { value: 4 });

    expect(revealed.status).toBe('round_revealed');
    expect(revealed.leaderboard).toEqual([]);
    expect(revealed.players.every((player) => player.score === 0)).toBe(true);
    expect(revealed.aggregatedResult?.type).toBe('scale');
    if (revealed.aggregatedResult?.type !== 'scale') return;
    expect(revealed.aggregatedResult.average).toBe(3);
    expect(revealed.aggregatedResult.distribution.find((entry) => entry.value === 2)).toMatchObject({
      count: 1,
      percentage: 50,
    });
  });

  it('aggregates ranking rounds with Borda count without changing scores', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: [liveQuestionsFixture[6]],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q7', { optionIds: ['q7-a', 'q7-b', 'q7-c'] });
    currentTime += 500;
    const revealed = store.submitAnswer(room.pin, bia.playerToken, 'q7', { optionIds: ['q7-b', 'q7-a', 'q7-c'] });

    expect(revealed.status).toBe('round_revealed');
    expect(revealed.leaderboard).toEqual([]);
    expect(revealed.players.every((player) => player.score === 0)).toBe(true);
    expect(revealed.aggregatedResult?.type).toBe('ranking');
    if (revealed.aggregatedResult?.type !== 'ranking') return;
    expect(revealed.aggregatedResult.items[0]).toMatchObject({
      optionId: 'q7-a',
      totalPoints: 5,
      averagePosition: 1.5,
    });
  });

  it('aggregates qna rounds without changing scores or leaderboard', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: [liveQuestionsFixture[7]],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');
    const caio = store.joinPlayer(room.pin, 'Caio');

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q8', { text: '  Atualizar   meu currículo ' });
    currentTime += 500;
    store.submitAnswer(room.pin, bia.playerToken, 'q8', { text: 'atualizar meu currículo' });
    currentTime += 500;
    const revealed = store.submitAnswer(room.pin, caio.playerToken, 'q8', { text: 'Pedir feedback' });

    expect(revealed.status).toBe('round_revealed');
    expect(revealed.leaderboard).toEqual([]);
    expect(revealed.players.every((player) => player.score === 0)).toBe(true);
    expect(revealed.aggregatedResult?.type).toBe('qna');
    if (revealed.aggregatedResult?.type !== 'qna') return;
    expect(revealed.aggregatedResult.totalResponses).toBe(3);
    expect(revealed.aggregatedResult.entries[0]).toMatchObject({
      text: 'Atualizar meu currículo',
      normalizedText: 'atualizar meu currículo',
      count: 2,
    });
  });

  it('keeps final ranking based on competitive scores when participatory rounds follow', () => {
    store.clearAllRooms();
    store = createRoomStore({
      questions: [liveQuestionsFixture[0], liveQuestionsFixture[3]],
      roundMs: 20_000,
      now: () => currentTime,
    });
    const room = store.createRoom();
    const ana = store.joinPlayer(room.pin, 'Ana');
    const bia = store.joinPlayer(room.pin, 'Bia');

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q1', 'q1-a');
    currentTime += 500;
    store.submitAnswer(room.pin, bia.playerToken, 'q1', 'q1-b');

    store.nextRound(room.pin, room.hostToken);
    currentTime += 500;
    store.submitAnswer(room.pin, ana.playerToken, 'q4', 'q4-a');
    currentTime += 500;
    store.submitAnswer(room.pin, bia.playerToken, 'q4', 'q4-b');

    const finished = store.nextRound(room.pin, room.hostToken);

    expect(finished.status).toBe('finished');
    expect(finished.aggregatedResult).toBeNull();
    expect(finished.finalRanking[0].name).toBe('Ana');
    expect(finished.finalRanking.find((entry) => entry.name === 'Bia')?.score).toBe(0);
  });

  it('marks host disconnects, blocks host actions, and allows continuing after reconnect', () => {
    const room = store.createRoom();
    const player = store.joinPlayer(room.pin, 'Ana');

    startFirstRound(room);
    currentTime += 500;
    store.submitAnswer(room.pin, player.playerToken, 'q1', 'q1-a');

    const disconnected = store.leaveRoom(room.pin, room.hostToken);

    expect(disconnected?.hostConnected).toBe(false);
    expect(() => store.nextRound(room.pin, room.hostToken)).toThrow(RoomStoreError);

    const reconnected = store.reconnectHost(room.pin, room.hostToken);
    expect(reconnected.hostConnected).toBe(true);
    expect(store.nextRound(room.pin, room.hostToken).status).toBe('round_open');
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

    startFirstRound(room);
    store.submitAnswer(room.pin, player.playerToken, 'q1', 'q1-a');
    expect(store.nextRound(room.pin, room.hostToken).status).toBe('finished');

    vi.advanceTimersByTime(1_000);
    expect(() => store.getState(room.pin)).toThrow(RoomStoreError);
  });
});
