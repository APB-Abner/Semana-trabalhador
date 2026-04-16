import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readMemoryRecords, saveMemoryRecord } from '../../src/features/persistence/lib/memoryRecords.js';
import { readQuizProgress, saveQuizProgress } from '../../src/features/persistence/lib/quizProgress.js';
import { readStorage, STORAGE_KEYS, writeStorage } from '../../src/features/persistence/lib/storage.js';
import { readVocationalHistory, saveVocationalHistory } from '../../src/features/persistence/lib/vocationalHistory.js';

function createLocalStorage() {
  const store = new Map();

  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

describe('local persistence', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      localStorage: createLocalStorage(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back safely when stored data is invalid JSON', () => {
    window.localStorage.setItem(STORAGE_KEYS.quiz, '{bad-json');

    expect(readStorage(STORAGE_KEYS.quiz, { ok: true })).toEqual({ ok: true });
  });

  it('normalizes invalid quiz progress and preserves best streak when saving', () => {
    writeStorage(STORAGE_KEYS.quiz, { lastScore: 'bad', bestStreak: 4, wrongCount: null });

    expect(readQuizProgress()).toEqual({
      lastScore: 0,
      bestStreak: 4,
      wrongCount: 0,
      completedAt: null,
    });

    const savedProgress = saveQuizProgress({ lastScore: 8, bestStreak: 2, wrongCount: 3 });

    expect(savedProgress.lastScore).toBe(8);
    expect(savedProgress.bestStreak).toBe(4);
    expect(savedProgress.wrongCount).toBe(3);
    expect(savedProgress.completedAt).toEqual(expect.any(String));
  });

  it('keeps memory records per difficulty and ignores worse attempts', () => {
    saveMemoryRecord('facil', { bestScore: 7, bestPairs: 3 });
    saveMemoryRecord('facil', { bestScore: 5, bestPairs: 4 });
    saveMemoryRecord('dificil', { bestScore: 9, bestPairs: 8 });

    const records = readMemoryRecords();

    expect(records.facil.bestScore).toBe(7);
    expect(records.facil.bestPairs).toBe(3);
    expect(records.medio).toBeNull();
    expect(records.dificil.bestScore).toBe(9);
  });

  it('stores the latest vocational top 3 summary', () => {
    const history = saveVocationalHistory({
      primary: { area: 'tecnologia' },
      ranking: [
        { area: 'tecnologia', title: 'Tecnologia', percentage: 60, score: 3 },
        { area: 'exatas', title: 'Exatas', percentage: 20, score: 1 },
        { area: 'saude', title: 'Saude', percentage: 20, score: 1 },
      ],
    });

    expect(history.primaryArea).toBe('tecnologia');
    expect(history.ranking).toHaveLength(3);
    expect(readVocationalHistory().ranking[0]).toMatchObject({
      area: 'tecnologia',
      percentage: 60,
    });
  });
});
