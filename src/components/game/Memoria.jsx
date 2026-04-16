import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { memoryGameCards, memoryGameDifficulties } from '../../content/game/cards.js';
import calculateMemoryScore from '../../features/memory-game/lib/calculateMemoryScore.js';
import createMemoryDeck from '../../features/memory-game/lib/createMemoryDeck.js';
import { somAcerto, somErro, somVitoria } from '../../sounds/sounds.js';

const difficultyOptions = Object.values(memoryGameDifficulties);

export default function Memoria({ onComplete }) {
    const [status, setStatus] = useState('selectingDifficulty');
    const [difficulty, setDifficulty] = useState(null);
    const [cartas, setCartas] = useState([]);
    const [selecionadas, setSelecionadas] = useState([]);
    const [concluidas, setConcluidas] = useState([]);
    const [tempoRestante, setTempoRestante] = useState(0);
    const [previewRestante, setPreviewRestante] = useState(0);
    const concluIdasRef = useRef([]);

    useEffect(() => {
        concluIdasRef.current = concluidas;
    }, [concluidas]);

    const startGame = useCallback((selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        setCartas(createMemoryDeck(memoryGameCards, selectedDifficulty.pairCount));
        setSelecionadas([]);
        setConcluidas([]);
        setTempoRestante(selectedDifficulty.timeLimit);
        setPreviewRestante(selectedDifficulty.previewSeconds);
        setStatus('preview');
    }, []);

    const finishGame = useCallback((nextStatus) => {
        setStatus(nextStatus);
        setSelecionadas([]);

        if (nextStatus === 'won') {
            somVitoria.play();
            confetti();
        }
    }, []);

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
            finishGame('won');
        }
    }, [cartas.length, concluidas.length, finishGame, status]);

    useEffect(() => {
        if (selecionadas.length !== 2) return;

        const [firstIndex, secondIndex] = selecionadas;
        const firstCard = cartas[firstIndex];
        const secondCard = cartas[secondIndex];

        if (firstCard.id === secondCard.id) {
            somAcerto.play();
            setConcluidas((current) => [...current, firstIndex, secondIndex]);
            setSelecionadas([]);
            return;
        }

        somErro.play();
        const timer = setTimeout(() => setSelecionadas([]), 800);
        return () => clearTimeout(timer);
    }, [cartas, selecionadas]);

    const selecionar = (idx) => {
        if (
            status !== 'playing' ||
            selecionadas.includes(idx) ||
            concluidas.includes(idx) ||
            selecionadas.length === 2
        ) {
            return;
        }

        setSelecionadas((current) => [...current, idx]);
    };

    const paresConcluidos = Math.floor(concluidas.length / 2);
    const totalPares = Math.floor(cartas.length / 2);
    const pontuacao = calculateMemoryScore(concluidas.length, cartas.length);
    const shouldRevealAll = status === 'preview' || status === 'won' || status === 'lost';

    if (status === 'selectingDifficulty') {
        return (
            <div className="max-w-md mx-auto p-4 text-center">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-300">Escolha a dificuldade</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    A rodada começa com uma prévia rápida das cartas.
                </p>
                <div className="mt-6 grid gap-3">
                    {difficultyOptions.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => startGame(option)}
                            className="rounded border border-blue-200 bg-white px-4 py-3 text-left transition hover:bg-blue-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                        >
                            <span className="block font-semibold text-gray-900 dark:text-white">{option.label}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {option.pairCount} pares · {option.timeLimit}s · prévia de {option.previewSeconds}s
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (status === 'won' || status === 'lost') {
        const won = status === 'won';

        return (
            <div className="max-w-md mx-auto p-4 text-center">
                <h3 className={`text-2xl font-bold ${won ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
                    {won ? 'Vitória no jogo da memória' : 'Tempo esgotado'}
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-200">
                    Você encontrou {paresConcluidos} de {totalPares} pares no modo {difficulty?.label}.
                </p>
                <p className="mt-4 text-xl font-semibold text-blue-600 dark:text-blue-300">
                    Pontuação: {pontuacao} / 10
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => startGame(difficulty)}
                        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Jogar novamente
                    </button>
                    <button
                        type="button"
                        onClick={() => onComplete(pontuacao)}
                        className="rounded bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
                    >
                        Ver resultado final
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <div className={`w-full h-3 mb-3 rounded ${tempoRestante <= 10 ? 'bg-red-500' : 'bg-green-500'} transition-colors duration-300`}>
                <div className="h-full bg-blue-500" style={{ width: `${(tempoRestante / difficulty.timeLimit) * 100}%` }} />
            </div>

            <div className="flex justify-between items-center text-sm mb-4">
                <span>⏱️ {tempoRestante}s</span>
                <span>{difficulty.label}</span>
                <span>✅ Pares: {paresConcluidos} / {totalPares}</span>
            </div>

            {status === 'preview' && (
                <div className="mb-4 rounded bg-blue-50 p-3 text-center text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-100">
                    Memorize as cartas: {previewRestante}s
                </div>
            )}

            <div className={`grid gap-4 ${cartas.length > 12 ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'}`}>
                {cartas.map((carta, idx) => {
                    const revelada = shouldRevealAll || selecionadas.includes(idx) || concluidas.includes(idx);
                    return (
                        <button
                            type="button"
                            key={carta.instanceId}
                            onClick={() => selecionar(idx)}
                            className="relative w-full h-28 perspective cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                            aria-label={revelada ? carta.label : 'Carta virada'}
                        >
                            <span className={`block w-full h-full transition-transform duration-500 preserve-3d ${revelada ? 'rotate-y-180' : ''}`}>
                                <span className="absolute w-full h-full backface-hidden bg-gray-200 dark:bg-zinc-700 border-2 border-gray-300 dark:border-zinc-600 rounded-lg flex items-center justify-center text-2xl text-gray-500 dark:text-gray-400">
                                    ❓
                                </span>
                                <span className="absolute w-full h-full backface-hidden rotate-y-180 bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 dark:border-blue-700 rounded-lg flex items-center justify-center text-sm font-semibold text-blue-800 dark:text-blue-200 px-1 text-center">
                                    {carta.label}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
