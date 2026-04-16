import { readStorage, STORAGE_KEYS, writeStorage } from './storage.js';

export const emptyQuizProgress = {
  lastScore: 0,
  bestStreak: 0,
  wrongCount: 0,
  completedAt: null,
};

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function readQuizProgress() {
  const storedProgress = readStorage(STORAGE_KEYS.quiz, emptyQuizProgress);

  if (!isObject(storedProgress)) {
    return emptyQuizProgress;
  }

  return {
    lastScore: Number.isFinite(storedProgress.lastScore) ? storedProgress.lastScore : 0,
    bestStreak: Number.isFinite(storedProgress.bestStreak) ? storedProgress.bestStreak : 0,
    wrongCount: Number.isFinite(storedProgress.wrongCount) ? storedProgress.wrongCount : 0,
    completedAt: typeof storedProgress.completedAt === 'string' ? storedProgress.completedAt : null,
  };
}

export function saveQuizProgress({ lastScore, bestStreak, wrongCount }) {
  const previousProgress = readQuizProgress();
  return writeStorage(STORAGE_KEYS.quiz, {
    lastScore,
    bestStreak: Math.max(previousProgress.bestStreak || 0, bestStreak || 0),
    wrongCount,
    completedAt: new Date().toISOString(),
  });
}
