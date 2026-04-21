import { useCallback, useEffect, useState } from 'react';
import { useRoomSocket } from './useRoomSocket';
import type {
  AnswerSubmitPayload,
  BasicAck,
  RoomJoinAck,
  RoomState,
} from '../../../shared/types/realtime';
import type { PigeonAvatarState } from '../../../shared/types/pigeonAvatar';

type SubmittedLiveAnswer = {
  optionIds: string[];
  text?: string;
  value?: number;
};

type LiveAnswerInput = string | string[] | { text: string } | { value: number };

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
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, SubmittedLiveAnswer>>({});

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

  const joinRoom = useCallback(async ({
    roomPin,
    name,
    avatar,
  }: {
    roomPin: string;
    name: string;
    avatar?: PigeonAvatarState;
  }) => {
    setError(null);
    const normalizedPin = roomPin.trim();
    const response = await emitWithAck<RoomJoinAck>('room:join', {
      pin: normalizedPin,
      role: 'player',
      name,
      avatar,
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

  const submitAnswer = useCallback(async (answer: LiveAnswerInput) => {
    const currentRound = state?.currentRound;
    const currentQuestion = currentRound?.gameType === 'quick_quiz'
      ? currentRound.question
      : state?.currentQuestion;

    if (!pin || !currentRound) {
      return;
    }

    const playerToken = readPlayerToken(pin);

    if (!playerToken) {
      setError('Token de jogador não encontrado. Entre novamente na sala.');
      return;
    }

    const isObjectAnswer = typeof answer === 'object' && !Array.isArray(answer);
    const optionIds = isObjectAnswer ? [] : (Array.isArray(answer) ? answer : [answer]);
    const text = isObjectAnswer && 'text' in answer ? answer.text : undefined;
    const value = isObjectAnswer && 'value' in answer ? answer.value : undefined;
    const isWorkSituation = currentRound.gameType === 'work_situation';
    const isPriorityOrder = currentRound.gameType === 'priority_order';
    const payload: AnswerSubmitPayload = {
      pin,
      playerToken,
      questionId: currentRound.id,
      ...(isWorkSituation
        ? { optionId: optionIds[0] }
        : isPriorityOrder
        ? { optionIds }
        : currentQuestion?.type === 'word_cloud' || currentQuestion?.type === 'qna'
        ? { text }
        : currentQuestion?.type === 'scale'
          ? { value }
          : currentQuestion?.type === 'multiple_select' || currentQuestion?.type === 'ranking'
          ? { optionIds }
          : { optionId: optionIds[0] }),
    };
    const response = await emitWithAck<BasicAck>('answer:submit', payload);

    if (!response.ok) {
      setError(response.message);
      return;
    }

    setSubmittedAnswers((answers) => ({
      ...answers,
      [currentRound.id]: { optionIds, text, value },
    }));
    setState(response.state);
  }, [emitWithAck, pin, state?.currentQuestion, state?.currentRound]);

  return {
    connected,
    error,
    hasPlayerToken: Boolean(readPlayerToken(pin)),
    joinRoom,
    optionOrderSeed: readPlayerToken(pin) ?? pin ?? 'player',
    state,
    submitAnswer,
    submittedAnswers,
  };
}
