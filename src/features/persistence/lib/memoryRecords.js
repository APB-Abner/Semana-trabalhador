import { readStorage, STORAGE_KEYS, writeStorage } from './storage.js';

export const emptyMemoryRecords = {
  facil: null,
  medio: null,
  dificil: null,
};

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeRecord(record) {
  if (!isObject(record)) {
    return null;
  }

  return {
    bestScore: Number.isFinite(record.bestScore) ? record.bestScore : 0,
    bestPairs: Number.isFinite(record.bestPairs) ? record.bestPairs : 0,
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : null,
  };
}

export function readMemoryRecords() {
  const storedRecords = readStorage(STORAGE_KEYS.memory, emptyMemoryRecords);

  if (!isObject(storedRecords)) {
    return emptyMemoryRecords;
  }

  return {
    facil: normalizeRecord(storedRecords.facil),
    medio: normalizeRecord(storedRecords.medio),
    dificil: normalizeRecord(storedRecords.dificil),
  };
}

export function saveMemoryRecord(difficultyId, record) {
  const currentRecords = readMemoryRecords();
  const previousRecord = currentRecords[difficultyId];
  const shouldReplace =
    !previousRecord ||
    record.bestScore > previousRecord.bestScore ||
    (record.bestScore === previousRecord.bestScore && record.bestPairs > previousRecord.bestPairs);

  const nextRecords = {
    ...currentRecords,
    [difficultyId]: shouldReplace
      ? {
          ...record,
          updatedAt: new Date().toISOString(),
        }
      : previousRecord,
  };

  return writeStorage(STORAGE_KEYS.memory, nextRecords);
}
