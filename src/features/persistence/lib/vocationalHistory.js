import { readStorage, STORAGE_KEYS, writeStorage } from './storage.js';

export const emptyVocationalHistory = {
  primaryArea: null,
  primaryTitle: null,
  ranking: [],
  profileBlend: [],
  updatedAt: null,
};

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function readVocationalHistory() {
  const storedHistory = readStorage(STORAGE_KEYS.vocational, emptyVocationalHistory);

  if (!isObject(storedHistory) || !Array.isArray(storedHistory.ranking)) {
    return emptyVocationalHistory;
  }

  return {
    primaryArea: typeof storedHistory.primaryArea === 'string' ? storedHistory.primaryArea : null,
    primaryTitle: typeof storedHistory.primaryTitle === 'string' ? storedHistory.primaryTitle : null,
    ranking: storedHistory.ranking
      .filter(isObject)
      .map((profile) => ({
        area: typeof profile.area === 'string' ? profile.area : '',
        title: typeof profile.title === 'string' ? profile.title : '',
        percentage: Number.isFinite(profile.percentage) ? profile.percentage : 0,
        score: Number.isFinite(profile.score) ? profile.score : 0,
      }))
      .filter((profile) => profile.area && profile.title),
    profileBlend: Array.isArray(storedHistory.profileBlend)
      ? storedHistory.profileBlend.filter((item) => typeof item === 'string')
      : [],
    updatedAt: typeof storedHistory.updatedAt === 'string' ? storedHistory.updatedAt : null,
  };
}

export function saveVocationalHistory(result) {
  const nextHistory = {
    primaryArea: result.primary?.area || null,
    primaryTitle: result.primary?.title || null,
    ranking: result.ranking.map((profile) => ({
      area: profile.area,
      title: profile.title,
      percentage: profile.percentage,
      score: profile.score,
    })),
    profileBlend: Array.isArray(result.profileBlend) ? result.profileBlend : [],
    updatedAt: new Date().toISOString(),
  };

  return writeStorage(STORAGE_KEYS.vocational, nextHistory);
}