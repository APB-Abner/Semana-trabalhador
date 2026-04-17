import { useCallback, useState } from 'react';
import { applyPigeonPreset, normalizePigeonAvatarState } from './avatarRules';
import { readPigeonAvatarState, resetPigeonAvatarState, savePigeonAvatarState } from './avatarStorage';
import type { PigeonAvatarState, PigeonPresetId } from './types';

type PigeonAvatarUpdater = PigeonAvatarState | ((currentState: PigeonAvatarState) => PigeonAvatarState);

export function useStoredPigeonAvatar() {
  const [avatar, setAvatarState] = useState<PigeonAvatarState>(() => readPigeonAvatarState());

  const setAvatar = useCallback((nextAvatar: PigeonAvatarUpdater) => {
    setAvatarState((currentState) => normalizePigeonAvatarState(
      typeof nextAvatar === 'function' ? nextAvatar(currentState) : nextAvatar,
    ));
  }, []);

  const saveAvatar = useCallback(() => {
    setAvatarState((currentState) => savePigeonAvatarState(currentState));
  }, []);

  const resetAvatar = useCallback(() => {
    setAvatarState(resetPigeonAvatarState());
  }, []);

  const selectPreset = useCallback((presetId: PigeonPresetId) => {
    setAvatarState((currentState) => applyPigeonPreset(currentState, presetId));
  }, []);

  return { avatar, setAvatar, saveAvatar, resetAvatar, selectPreset };
}
