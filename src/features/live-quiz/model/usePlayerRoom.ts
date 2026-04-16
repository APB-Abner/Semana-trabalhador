import { useCallback, useEffect, useState } from 'react';
import { useRoomSocket } from './useRoomSocket';
import type {
  AnswerSubmitPayload,
  BasicAck,
  RoomJoinAck,
  RoomState,
} from '../../../shared/types/realtime';

const roomStateEvents = [
  'room:state',
  'presence:update',
  'round:opened',
  'round:revealed',
  'leaderboard:update',
  'game:finished',
];

function playerTokenKey(pin: string) {
  return `stw.live.player.${pin}`;
}

function readPlayerToken(pin?: string) {
  if (!pin || typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(playerTokenKey(pin));
}

function storePlayerToken(pin: string, token: string) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(playerTokenKey(pin), token);
  }
}

export default function usePlayerRoom(pin?: string) {
  const { connected, emitWithAck, socket } = useRoomSocket();
  const [state, setState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({});

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

    const playerToken = readPlayerToken(pin);

    if (!playerToken) {
      return;
    }

    emitWithAck<RoomJoinAck>('room:join', { pin, role: 'player', playerToken }).then((response) => {
      if (!response.ok) {
        setError(response.message);
        return;
      }

      setState(response.state);
    });
  }, [connected, emitWithAck, pin]);

  const joinRoom = useCallback(async ({ roomPin, name }: { roomPin: string; name: string }) => {
    setError(null);
    const normalizedPin = roomPin.trim();
    const response = await emitWithAck<RoomJoinAck>('room:join', {
      pin: normalizedPin,
      role: 'player',
      name,
    });

    if (!response.ok) {
      setError(response.message);
      return null;
    }

    if (response.playerToken) {
      storePlayerToken(normalizedPin, response.playerToken);
    }

    setState(response.state);
    return response;
  }, [emitWithAck]);

  const submitAnswer = useCallback(async (optionId: string) => {
    const currentQuestion = state?.currentQuestion;

    if (!pin || !currentQuestion) {
      return;
    }

    const playerToken = readPlayerToken(pin);

    if (!playerToken) {
      setError('Token de jogador não encontrado. Entre novamente na sala.');
      return;
    }

    const payload: AnswerSubmitPayload = {
      pin,
      playerToken,
      questionId: currentQuestion.id,
      optionId,
    };
    const response = await emitWithAck<BasicAck>('answer:submit', payload);

    if (!response.ok) {
      setError(response.message);
      return;
    }

    setSubmittedAnswers((answers) => ({
      ...answers,
      [currentQuestion.id]: optionId,
    }));
    setState(response.state);
  }, [emitWithAck, pin, state?.currentQuestion]);

  return {
    connected,
    error,
    hasPlayerToken: Boolean(readPlayerToken(pin)),
    joinRoom,
    state,
    submitAnswer,
    submittedAnswers,
  };
}
