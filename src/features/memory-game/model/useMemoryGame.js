import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import calculateMemoryScore from '../lib/calculateMemoryScore.js';
import createMemoryDeck from '../lib/createMemoryDeck.ts';
import { readMemoryRecords, saveMemoryRecord } from '../../persistence/lib/memoryRecords.js';

export default function useMemoryGame(cardPairs, difficultyMap, {
  onMatch,
  onMismatch,
  onWin,
  onDifficultySelected,
} = {}) {
  const difficultyOptions = useMemo(() => Object.values(difficultyMap), [difficultyMap]);
  const [status, setStatus] = useState('selectingDifficulty');
  const [difficulty, setDifficulty] = useState(null);
  const [cartas, setCartas] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [concluidas, setConcluidas] = useState([]);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [previewRestante, setPreviewRestante] = useState(0);
  const [records, setRecords] = useState(() => readMemoryRecords());

  const cartasRef = useRef([]);
  const concluidasRef = useRef([]);
  const difficultyRef = useRef(null);

  useEffect(() => {
    cartasRef.current = cartas;
  }, [cartas]);

  useEffect(() => {
    concluidasRef.current = concluidas;
  }, [concluidas]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  const saveCurrentRecord = useCallback((completedCardsCount) => {
    const currentDifficulty = difficultyRef.current;
    const totalCardsCount = cartasRef.current.length;

    if (!currentDifficulty || !totalCardsCount) {
      return;
    }

    const nextRecords = saveMemoryRecord(currentDifficulty.id, {
      bestScore: calculateMemoryScore(completedCardsCount, totalCardsCount),
      bestPairs: Math.floor(completedCardsCount / 2),
    });

    setRecords(nextRecords);
  }, []);

  const finishGame = useCallback((nextStatus, completedCardsCount = concluidasRef.current.length) => {
    setStatus(nextStatus);
    setSelecionadas([]);
    saveCurrentRecord(completedCardsCount);

    if (nextStatus === 'won') {
      onWin?.();
    }
  }, [onWin, saveCurrentRecord]);

  const startGame = useCallback((selectedDifficulty) => {
    if (!selectedDifficulty) {
      return;
    }

    setDifficulty(selectedDifficulty);
    setCartas(createMemoryDeck(cardPairs, selectedDifficulty.pairCount));
    setSelecionadas([]);
    setConcluidas([]);
    setTempoRestante(selectedDifficulty.timeLimit);
    setPreviewRestante(selectedDifficulty.previewSeconds);
    setStatus('preview');
    onDifficultySelected?.(selectedDifficulty.id);
  }, [cardPairs, onDifficultySelected]);

  const resetToDifficultySelection = useCallback(() => {
    setStatus('selectingDifficulty');
    setDifficulty(null);
    setCartas([]);
    setSelecionadas([]);
    setConcluidas([]);
    setTempoRestante(0);
    setPreviewRestante(0);
  }, []);

  const retryCurrentDifficulty = useCallback(() => {
    startGame(difficultyRef.current);
  }, [startGame]);

  useEffect(() => {
    if (status !== 'preview') return undefined;

    const timer = setInterval(() => {
      setPreviewRestante((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setStatus('playing');
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== 'playing') return undefined;

    const timer = setInterval(() => {
      setTempoRestante((current) => {
        if (current <= 1) {
          clearInterval(timer);
          finishGame('lost');
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [finishGame, status]);

  useEffect(() => {
    if (status === 'playing' && cartas.length && concluidas.length === cartas.length) {
      finishGame('won', concluidas.length);
    }
  }, [cartas.length, concluidas.length, finishGame, status]);

  useEffect(() => {
    if (selecionadas.length !== 2) return undefined;

    const [firstIndex, secondIndex] = selecionadas;
    const firstCard = cartas[firstIndex];
    const secondCard = cartas[secondIndex];

    if (!firstCard || !secondCard) {
      return undefined;
    }

    if (firstCard.id === secondCard.id) {
      onMatch?.();
      setConcluidas((current) => [...current, firstIndex, secondIndex]);
      setSelecionadas([]);
      return undefined;
    }

    onMismatch?.();
    const timer = setTimeout(() => setSelecionadas([]), 800);
    return () => clearTimeout(timer);
  }, [cartas, onMatch, onMismatch, selecionadas]);

  const selecionar = useCallback((idx) => {
    if (
      status !== 'playing' ||
      selecionadas.includes(idx) ||
      concluidas.includes(idx) ||
      selecionadas.length === 2
    ) {
      return;
    }

    setSelecionadas((current) => [...current, idx]);
  }, [concluidas, selecionadas, status]);

  const paresConcluidos = Math.floor(concluidas.length / 2);
  const totalPares = Math.floor(cartas.length / 2);
  const pontuacao = calculateMemoryScore(concluidas.length, cartas.length);

  return {
    cartas,
    concluidas,
    difficulty,
    difficultyOptions,
    paresConcluidos,
    pontuacao,
    previewRestante,
    records,
    resetToDifficultySelection,
    retryCurrentDifficulty,
    selecionar,
    selecionadas,
    shouldRevealAll: status === 'preview' || status === 'won' || status === 'lost',
    startGame,
    status,
    tempoRestante,
    totalPares,
  };
}
