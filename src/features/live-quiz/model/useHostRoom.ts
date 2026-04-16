import { useCallback, useEffect, useState } from 'react';
import { useRoomSocket } from './useRoomSocket';
import type { BasicAck, RoomCreateAck, RoomJoinAck, RoomState } from '../../../shared/types/realtime';

const roomStateEvents = [
  'room:state',
  'presence:update',
  'round:opened',
  'round:revealed',
  'leaderboard:update',
  'game:finished',
];

function hostTokenKey(pin: string) {
  return `stw.live.host.${pin}`;
}

function readHostToken(pin?: string) {
  if (!pin || typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(hostTokenKey(pin));
}

function storeHostToken(pin: string, token: string) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(hostTokenKey(pin), token);
  }
}

export default function useHostRoom(pin?: string) {
  const { connected, emitWithAck, socket } = useRoomSocket();
  const [state, setState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const updateState = (nextState: RoomState) => {
      setState(nextState);
      setError(null);
    };
    const updateError = (payload: { message?: string }) => setError(payload.message ?? 'Erro na sala.');

    roomStateEvents.forEach((eventName) => socket.on(eventName, updateState));
    socket.on('room:error', updateError);

    return () => {
      roomStateEvents.forEach((eventName) => socket.off(eventName, updateState));
      socket.off('room:error', updateError);
    };
  }, [socket]);

  useEffect(() => {
    if (!connected || !pin) {
      return;
    }

    const hostToken = readHostToken(pin);

    if (!hostToken) {
      setError('Token de host não encontrado nesta aba. Crie uma nova sala.');
      return;
    }

    emitWithAck<RoomJoinAck>('room:join', { pin, role: 'host', hostToken }).then((response) => {
      if (!response.ok) {
        setError(response.message);
        return;
      }

      setState(response.state);
    });
  }, [connected, emitWithAck, pin]);

  const createRoom = useCallback(async () => {
    setBusy(true);
    setError(null);

    const response = await emitWithAck<RoomCreateAck>('room:create', {});
    setBusy(false);

    if (!response.ok) {
      setError(response.message);
      return null;
    }

    storeHostToken(response.pin, response.hostToken);
    setState(response.state);
    return response;
  }, [emitWithAck]);

  const startGame = useCallback(async () => {
    if (!pin) return;
    const hostToken = readHostToken(pin);
    if (!hostToken) return;

    const response = await emitWithAck<BasicAck>('game:start', { pin, hostToken });
    if (!response.ok) setError(response.message);
    else setState(response.state);
  }, [emitWithAck, pin]);

  const nextRound = useCallback(async () => {
    if (!pin) return;
    const hostToken = readHostToken(pin);
    if (!hostToken) return;

    const response = await emitWithAck<BasicAck>('round:next', { pin, hostToken });
    if (!response.ok) setError(response.message);
    else setState(response.state);
  }, [emitWithAck, pin]);

  return {
    busy,
    connected,
    createRoom,
    error,
    hasHostToken: Boolean(readHostToken(pin)),
    nextRound,
    startGame,
    state,
  };
}
