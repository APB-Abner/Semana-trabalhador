import { useEffect, useRef, useState } from 'react';
import { quizQuestions } from '../../content/quiz/questions.ts';
import { trackQuizAbandoned, trackQuizCompleted } from '../../features/analytics/lib/analytics.js';
import { readQuizProgress, saveQuizProgress } from '../../features/persistence/lib/quizProgress.js';
import useQuizSession from '../../features/quiz-session/model/useQuizSession.ts';
import { somAcerto, somErro, somVitoria } from '../../sounds/sounds.js';
import Badge from '../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../shared/ui/ResultPanel.jsx';

const optionLetters = ['A', 'B', 'C', 'D'];

export default function Quiz({ onComplete }) {
    const [history, setHistory] = useState(() => readQuizProgress());
    const completedRef = useRef(false);
    const answeredCountRef = useRef(0);

    const {
        answeredQuestions,
        bestStreak,
        currentIndex,
        currentQuestion,
        currentStreak,
        focusedOptionIndex,
        goToNextQuestion,
        isFinished,
        isLastQuestion,
        keyboardActive,
        preparedQuestions,
        progress,
        score,
        selectedAnswer,
        wrongAnswers,
        answerCurrentQuestion,
    } = useQuizSession(quizQuestions, {
        onCorrect: () => somAcerto.play(),
        onWrong: () => somErro.play(),
        onReviewReady: () => somVitoria.play(),
    });

    useEffect(() => {
        answeredCountRef.current = answeredQuestions.length;
    }, [answeredQuestions.length]);

    useEffect(() => {
        if (!isFinished || completedRef.current) {
            return;
        }

        const nextHistory = saveQuizProgress({
            lastScore: score,
            bestStreak,
            wrongCount: wrongAnswers.length,
        });

        setHistory(nextHistory);
        trackQuizCompleted();
        completedRef.current = true;
    }, [bestStreak, isFinished, score, wrongAnswers.length]);

    useEffect(() => () => {
        if (answeredCountRef.current > 0 && !completedRef.current) {
            trackQuizAbandoned();
        }
    }, []);

    if (!preparedQuestions.length || !currentQuestion) {
        return (
            <ResultPanel className="text-center">
                <p className="text-gray-600 dark:text-gray-300">Carregando perguntas...</p>
            </ResultPanel>
        );
    }

    if (isFinished) {
        return (
            <div className="animate-fade-in text-gray-900 dark:text-white">
                <ResultPanel tone="info">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-200">
                        Revisão do quiz
                    </p>
                    <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-950 dark:text-white">
                                Você acertou {score} de {preparedQuestions.length}
                            </h2>
                            <p className="mt-2 text-sm text-blue-900 dark:text-blue-100">
                                Melhor sequência: {bestStreak} acerto(s) seguido(s).
                            </p>
                        </div>
                        <Badge tone={wrongAnswers.length ? 'amber' : 'green'}>
                            {wrongAnswers.length ? `${wrongAnswers.length} para revisar` : 'Sem erros'}
                        </Badge>
                    </div>
                </ResultPanel>

                <ResultPanel className="mt-5">
                    {wrongAnswers.length ? (
                        <>
                            <h3 className="font-semibold text-red-600 dark:text-red-300">Respostas para revisar</h3>
                            <div className="mt-4 divide-y divide-gray-200 dark:divide-zinc-800">
                                {wrongAnswers.map((answer, index) => (
                                    <div key={`${answer.question.pergunta}-${index}`} className="py-4 first:pt-0 last:pb-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{answer.question.pergunta}</p>
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-300">Sua resposta: {answer.selectedAnswer}</p>
                                        <p className="text-sm text-green-700 dark:text-green-300">Resposta correta: {answer.question.resposta}</p>
                                        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{answer.question.explicacao}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h3 className="font-semibold text-green-700 dark:text-green-300">Você acertou tudo.</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Continue para o próximo desafio e tente manter o desempenho.
                            </p>
                        </div>
                    )}
                </ResultPanel>

                <ResultPanel tone="info" className="mt-4 text-sm text-blue-900 dark:text-blue-100">
                    Histórico salvo: último score {history.lastScore}/{preparedQuestions.length}, {history.wrongCount} erro(s), melhor sequência {history.bestStreak}.
                </ResultPanel>

                <button
                    type="button"
                    onClick={() => onComplete(score)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                >
                    Continuar para o desafio da memória
                </button>
            </div>
        );
    }

    const feedbackIsVisible = selectedAnswer !== null;
    const answeredCorrectly = selectedAnswer === currentQuestion.resposta;

    return (
        <div className="animate-fade-in text-gray-900 dark:text-white">
            {history.completedAt && (
                <ResultPanel tone="info" className="mb-5 text-sm">
                    <p className="font-semibold text-blue-700 dark:text-blue-200">Resumo salvo do quiz</p>
                    <p className="mt-1 text-blue-800 dark:text-blue-100">
                        Último score: {history.lastScore}/{preparedQuestions.length} - Erros: {history.wrongCount} - Melhor sequência: {history.bestStreak}
                    </p>
                </ResultPanel>
            )}

            <ResultPanel>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                        <Badge tone="blue">{currentQuestion.tema}</Badge>
                        <Badge tone="gray">Sequência: {currentStreak}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Pergunta {currentIndex + 1} de {preparedQuestions.length}
                    </p>
                </div>

                <ProgressBar value={progress} className="mt-4 h-2" />

                <h3 className="mt-7 text-2xl font-bold leading-tight text-gray-950 dark:text-white">
                    {currentQuestion.pergunta}
                </h3>

                <div className="mt-6 grid gap-3">
                    {currentQuestion.opcoes.map((opcao, idx) => {
                        const isCorreta = opcao === currentQuestion.resposta;
                        const isErrada = opcao === selectedAnswer && !isCorreta;
                        const isFocus = keyboardActive && idx === focusedOptionIndex && !feedbackIsVisible;

                        let optionClass = 'border-gray-200 bg-white text-gray-900 hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100 dark:hover:border-blue-600 dark:hover:bg-blue-950';
                        if (isCorreta && feedbackIsVisible) optionClass = 'border-green-400 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-950 dark:text-green-100';
                        else if (isErrada) optionClass = 'border-red-400 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-950 dark:text-red-100';
                        else if (isFocus) optionClass = 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950';

                        return (
                            <button
                                key={opcao}
                                type="button"
                                onClick={() => answerCurrentQuestion(opcao)}
                                disabled={feedbackIsVisible}
                                aria-pressed={selectedAnswer === opcao}
                                className={`grid grid-cols-[2rem_1fr] items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-zinc-900 ${optionClass}`}
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                                    {optionLetters[idx]}
                                </span>
                                <span>{opcao}</span>
                            </button>
                        );
                    })}
                </div>
            </ResultPanel>

            {feedbackIsVisible && (
                <FeedbackNotice tone={answeredCorrectly ? 'success' : 'danger'} className="mt-5">
                    <p className="font-semibold">{answeredCorrectly ? 'Resposta correta.' : `Resposta correta: ${currentQuestion.resposta}`}</p>
                    <p className="mt-1 text-sm">{currentQuestion.explicacao}</p>
                    <button
                        type="button"
                        onClick={goToNextQuestion}
                        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                    >
                        {isLastQuestion ? 'Ver revisão' : 'Próxima'}
                    </button>
                </FeedbackNotice>
            )}

            <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Acertos: {score}</span>
                <span>{Math.round(progress)}% concluído</span>
            </div>
        </div>
    );
}
