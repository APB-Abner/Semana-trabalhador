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
            <ResultPanel className="animate-fade-in">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                        Jogo da memória
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">Escolha a dificuldade</h3>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-300">
                        A rodada começa com uma prévia rápida das cartas. Depois, cada par encontrado aumenta sua pontuação final.
                    </p>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {difficultyOptions.map((option) => {
                        const record = records[option.id];

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => startGame(option)}
                                className="rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-blue-600 dark:hover:bg-blue-950 dark:focus:ring-offset-zinc-900"
                            >
                                <span className="block text-lg font-bold text-gray-950 dark:text-white">{option.label}</span>
                                <span className="mt-2 block text-sm text-gray-600 dark:text-gray-300">
                                    {option.pairCount} pares - {option.timeLimit}s - prévia de {option.previewSeconds}s
                                </span>
                                <span className="mt-3 block text-xs font-semibold text-blue-700 dark:text-blue-300">
                                    {record ? `Recorde: ${record.bestScore}/10 com ${record.bestPairs} pares` : 'Sem recorde ainda'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </ResultPanel>
        );
    }

    if (status === 'won' || status === 'lost') {
        const won = status === 'won';

        return (
            <div className="animate-fade-in text-center">
                <ResultPanel tone={won ? 'success' : 'danger'}>
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                        Resultado da memória
                    </p>
                    <h3 className={`mt-2 text-3xl font-bold ${won ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {won ? 'Vitória no jogo da memória' : 'Tempo esgotado'}
                    </h3>
                    <p className="mx-auto mt-3 max-w-xl text-gray-700 dark:text-gray-200">
                        Você encontrou {paresConcluidos} de {totalPares} pares no modo {difficulty?.label}.
                    </p>
                    <p className="mt-5 text-2xl font-bold text-blue-600 dark:text-blue-300">
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
        <div className="animate-fade-in">
            <ResultPanel>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                        <Badge tone="blue">{difficulty.label}</Badge>
                        <Badge tone="green">Pares: {paresConcluidos} / {totalPares}</Badge>
                    </div>
                    <Badge tone={tempoRestante <= 10 ? 'red' : 'gray'}>{tempoRestante}s</Badge>
                </div>

                <ProgressBar
                    value={tempoRestante}
                    max={difficulty.timeLimit}
                    className="mt-4 h-2"
                    barClassName={tempoRestante <= 10 ? 'bg-red-500' : 'bg-blue-500'}
                />

                {status === 'preview' && (
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
                        Memorize as cartas: {previewRestante}s
                    </div>
                )}
            </ResultPanel>

            <div className={`mt-5 grid gap-3 ${cartas.length > 12 ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'}`}>
                {cartas.map((carta, idx) => {
                    const revelada = shouldRevealAll || selecionadas.includes(idx) || concluidas.includes(idx);
                    return (
                        <button
                            type="button"
                            key={carta.instanceId}
                            onClick={() => selecionar(idx)}
                            className="perspective relative h-24 w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 sm:h-28"
                            aria-label={revelada ? carta.label : 'Carta virada'}
                            aria-pressed={revelada}
                        >
                            <span className={`preserve-3d block h-full w-full transition-transform duration-500 ${revelada ? 'rotate-y-180' : ''}`}>
                                <span className="backface-hidden absolute flex h-full w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-100 text-2xl font-bold text-gray-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400">
                                    ?
                                </span>
                                <span className="backface-hidden rotate-y-180 absolute flex h-full w-full items-center justify-center rounded-lg border border-blue-300 bg-blue-50 px-2 text-center text-xs font-bold text-blue-900 shadow-sm dark:border-blue-700 dark:bg-blue-950 dark:text-blue-100 sm:text-sm">
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
