import { DEFAULT_PIGEON_AVATAR_STATE } from './defaultAvatar';
import { normalizePigeonAvatarState } from './avatarRules';
import type { PigeonAvatarState } from './types';

export const PIGEON_AVATAR_STORAGE_KEY = 'stw.v1.pigeonAvatar';

function hasLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function readPigeonAvatarState(): PigeonAvatarState {
  if (!hasLocalStorage()) {
    return DEFAULT_PIGEON_AVATAR_STATE;
  }

  try {
    const rawValue = window.localStorage.getItem(PIGEON_AVATAR_STORAGE_KEY);
    return normalizePigeonAvatarState(rawValue ? JSON.parse(rawValue) : null);
  } catch {
    return DEFAULT_PIGEON_AVATAR_STATE;
  }
}

export function savePigeonAvatarState(value: PigeonAvatarState): PigeonAvatarState {
  const normalizedValue = normalizePigeonAvatarState(value);

  if (hasLocalStorage()) {
    window.localStorage.setItem(PIGEON_AVATAR_STORAGE_KEY, JSON.stringify(normalizedValue));
  }

  return normalizedValue;
}

export function resetPigeonAvatarState(): PigeonAvatarState {
  if (hasLocalStorage()) {
    window.localStorage.setItem(PIGEON_AVATAR_STORAGE_KEY, JSON.stringify(DEFAULT_PIGEON_AVATAR_STATE));
  }

  return DEFAULT_PIGEON_AVATAR_STATE;
}
