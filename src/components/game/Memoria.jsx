import { useCallback } from 'react';
import confetti from 'canvas-confetti';
import { memoryGameCards, memoryGameDifficulties } from '../../content/game/cards.ts';
import { trackMemoryDifficulty } from '../../features/analytics/lib/analytics.js';
import useMemoryGame from '../../features/memory-game/model/useMemoryGame.js';
import { somAcerto, somErro, somVitoria } from '../../sounds/sounds.js';
import Badge from '../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../shared/ui/CtaButtonRow.jsx';
import ProgressBar from '../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../shared/ui/ResultPanel.jsx';

export default function Memoria({ onComplete }) {
    const handleMatch = useCallback(() => {
        somAcerto.play();
    }, []);

    const handleMismatch = useCallback(() => {
        somErro.play();
    }, []);

    const handleWin = useCallback(() => {
        somVitoria.play();
        confetti();
    }, []);

    const handleDifficultySelected = useCallback((difficultyId) => {
        trackMemoryDifficulty(difficultyId);
    }, []);

    const {
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
        shouldRevealAll,
        startGame,
        status,
        tempoRestante,
        totalPares,
    } = useMemoryGame(memoryGameCards, memoryGameDifficulties, {
        onMatch: handleMatch,
        onMismatch: handleMismatch,
        onWin: handleWin,
        onDifficultySelected: handleDifficultySelected,
    });

    if (status === 'selectingDifficulty') {
        return (
            <div className="max-w-md mx-auto p-4 text-center">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-300">Escolha a dificuldade</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    A rodada começa com uma prévia rápida das cartas.
                </p>
                <div className="mt-6 grid gap-3">
                    {difficultyOptions.map((option) => {
                        const record = records[option.id];

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => startGame(option)}
                                className="rounded border border-blue-200 bg-white px-4 py-3 text-left transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:focus:ring-offset-zinc-900"
                            >
                                <span className="block font-semibold text-gray-900 dark:text-white">{option.label}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {option.pairCount} pares · {option.timeLimit}s · prévia de {option.previewSeconds}s
                                </span>
                                <span className="mt-2 block text-xs font-semibold text-blue-700 dark:text-blue-300">
                                    {record ? `Recorde: ${record.bestScore}/10 com ${record.bestPairs} pares` : 'Sem recorde ainda'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (status === 'won' || status === 'lost') {
        const won = status === 'won';

        return (
            <div className="max-w-md mx-auto p-4 text-center">
                <ResultPanel tone={won ? 'success' : 'danger'}>
                    <p className="text-sm uppercase tracking-wide text-gray-600 dark:text-gray-300">
                        Resultado da memória
                    </p>
                    <h3 className={`mt-2 text-2xl font-bold ${won ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {won ? 'Vitória no jogo da memória' : 'Tempo esgotado'}
                    </h3>
                    <p className="mt-2 text-gray-700 dark:text-gray-200">
                        Você encontrou {paresConcluidos} de {totalPares} pares no modo {difficulty?.label}.
                    </p>
                    <p className="mt-4 text-xl font-semibold text-blue-600 dark:text-blue-300">
                        Pontuação: {pontuacao} / 10
                    </p>
                </ResultPanel>

                <CtaButtonRow
                    className="mt-6"
                    actions={[
                        { label: 'Jogar novamente', onClick: retryCurrentDifficulty, tone: 'blue' },
                        { label: 'Trocar dificuldade', onClick: resetToDifficultySelection, tone: 'gray' },
                        { label: 'Ver resultado final', onClick: () => onComplete(pontuacao), tone: 'green' },
                    ]}
                />
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <ProgressBar
                value={tempoRestante}
                max={difficulty.timeLimit}
                className="mb-3"
                barClassName={tempoRestante <= 10 ? 'bg-red-500' : 'bg-blue-500'}
            />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                <Badge tone={tempoRestante <= 10 ? 'red' : 'gray'}>{tempoRestante}s</Badge>
                <Badge tone="blue">{difficulty.label}</Badge>
                <Badge tone="green">Pares: {paresConcluidos} / {totalPares}</Badge>
            </div>

            {status === 'preview' && (
                <ResultPanel tone="info" className="mb-4 text-center text-sm font-semibold text-blue-700 dark:text-blue-100">
                    Memorize as cartas: {previewRestante}s
                </ResultPanel>
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
                            aria-pressed={revelada}
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
