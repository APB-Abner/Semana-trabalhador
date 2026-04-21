import { useEffect, useState } from 'react';
import { useRoomSocket } from '../../live-quiz/model/useRoomSocket';
import type { BasicAck, RoomState } from '../../../shared/types/realtime';

const roomStateEvents = [
  'room:state',
  'presence:update',
  'round:opened',
  'round:revealed',
  'leaderboard:update',
  'game:finished',
];

export default function useDisplayMatch(pin?: string) {
  const { connected, emitWithAck, socket } = useRoomSocket();
  const [state, setState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    emitWithAck<BasicAck>('room:view', { pin }).then((response) => {
      if (!response.ok) {
        setError(response.message);
        return;
      }

      setState(response.state);
    });
  }, [connected, emitWithAck, pin]);

  return {
    connected,
    error,
    state,
  };
}
