export const STORAGE_KEYS = {
  quiz: 'stw.v1.quiz',
  memory: 'stw.v1.memory',
  vocational: 'stw.v1.vocational',
  analytics: 'stw.v1.analytics',
};

function hasLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function readStorage(key, fallbackValue) {
  if (!hasLocalStorage()) {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function writeStorage(key, value) {
  if (!hasLocalStorage()) {
    return value;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function clearStorage(key) {
  if (hasLocalStorage()) {
    window.localStorage.removeItem(key);
  }
}
