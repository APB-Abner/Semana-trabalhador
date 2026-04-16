import { readStorage, STORAGE_KEYS, writeStorage } from '../../persistence/lib/storage.js';

const emptyAnalytics = {
  routes: {},
  quiz: {
    completed: 0,
    abandoned: 0,
  },
  memory: {
    selectedDifficulty: {},
  },
  vocational: {
    primaryAreas: {},
  },
};

function publishAnalytics(stats) {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    window.__stwDebugStats = stats;
    console.debug('[stw:analytics]', stats);
  }
}

function objectOrEmpty(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function updateAnalytics(updater) {
  const currentStats = objectOrEmpty(readStorage(STORAGE_KEYS.analytics, emptyAnalytics));
  const currentQuiz = objectOrEmpty(currentStats.quiz);
  const currentMemory = objectOrEmpty(currentStats.memory);
  const currentVocational = objectOrEmpty(currentStats.vocational);
  const nextStats = updater({
    ...emptyAnalytics,
    ...currentStats,
    routes: { ...emptyAnalytics.routes, ...objectOrEmpty(currentStats.routes) },
    quiz: { ...emptyAnalytics.quiz, ...currentQuiz },
    memory: {
      ...emptyAnalytics.memory,
      ...currentMemory,
      selectedDifficulty: {
        ...emptyAnalytics.memory.selectedDifficulty,
        ...objectOrEmpty(currentMemory.selectedDifficulty),
      },
    },
    vocational: {
      ...emptyAnalytics.vocational,
      ...currentVocational,
      primaryAreas: {
        ...emptyAnalytics.vocational.primaryAreas,
        ...objectOrEmpty(currentVocational.primaryAreas),
      },
    },
  });

  writeStorage(STORAGE_KEYS.analytics, nextStats);
  publishAnalytics(nextStats);
  return nextStats;
}

export function trackRouteVisit(pathname) {
  return updateAnalytics((stats) => ({
    ...stats,
    routes: {
      ...stats.routes,
      [pathname]: (stats.routes[pathname] || 0) + 1,
    },
  }));
}

export function trackQuizCompleted() {
  return updateAnalytics((stats) => ({
    ...stats,
    quiz: {
      ...stats.quiz,
      completed: stats.quiz.completed + 1,
    },
  }));
}

export function trackQuizAbandoned() {
  return updateAnalytics((stats) => ({
    ...stats,
    quiz: {
      ...stats.quiz,
      abandoned: stats.quiz.abandoned + 1,
    },
  }));
}

export function trackMemoryDifficulty(difficultyId) {
  return updateAnalytics((stats) => ({
    ...stats,
    memory: {
      ...stats.memory,
      selectedDifficulty: {
        ...stats.memory.selectedDifficulty,
        [difficultyId]: (stats.memory.selectedDifficulty[difficultyId] || 0) + 1,
      },
    },
  }));
}

export function trackVocationalProfile(area) {
  return updateAnalytics((stats) => ({
    ...stats,
    vocational: {
      ...stats.vocational,
      primaryAreas: {
        ...stats.vocational.primaryAreas,
        [area]: (stats.vocational.primaryAreas[area] || 0) + 1,
      },
    },
  }));
}
