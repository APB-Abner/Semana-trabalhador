import { quizQuestions } from '../../content/quiz/questions.js';
import useQuizSession from '../../features/quiz-session/model/useQuizSession.js';
import { somAcerto, somErro, somVitoria } from '../../sounds/sounds.js';

export default function Quiz({ onComplete }) {
    const {
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

    if (!preparedQuestions.length || !currentQuestion) {
        return (
            <div className="max-w-xl mx-auto text-center">
                <p className="text-gray-600 dark:text-gray-300">Carregando perguntas...</p>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="max-w-xl mx-auto text-gray-900 dark:text-white">
                <div className="text-center">
                    <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-300">Revisão do quiz</p>
                    <h3 className="mt-2 text-2xl font-bold">Você acertou {score} de {preparedQuestions.length}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Melhor sequência: {bestStreak} acerto(s) seguido(s).
                    </p>
                </div>

                <div className="mt-6 rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
                    {wrongAnswers.length ? (
                        <>
                            <h4 className="font-semibold text-red-600 dark:text-red-300">Respostas para revisar</h4>
                            <div className="mt-4 space-y-4">
                                {wrongAnswers.map((answer, index) => (
                                    <div key={`${answer.question.pergunta}-${index}`} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0 dark:border-zinc-700">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{answer.question.pergunta}</p>
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-300">Sua resposta: {answer.selectedAnswer}</p>
                                        <p className="text-sm text-green-700 dark:text-green-300">Resposta correta: {answer.question.resposta}</p>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{answer.question.explicacao}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h4 className="font-semibold text-green-700 dark:text-green-300">Você acertou tudo.</h4>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Continue para o próximo desafio e tente manter o desempenho.
                            </p>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onComplete(score)}
                    className="mt-6 w-full rounded bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                >
                    Continuar para o desafio da memória
                </button>
            </div>
        );
    }

    const feedbackIsVisible = selectedAnswer !== null;
    const answeredCorrectly = selectedAnswer === currentQuestion.resposta;

    return (
        <div className="max-w-xl mx-auto text-center text-gray-900 dark:text-white">
            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-3 rounded mb-4 overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    {currentQuestion.tema}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
                    Sequência: {currentStreak}
                </span>
            </div>

            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                {currentQuestion.pergunta}
            </h3>

            <div className="grid gap-3">
                {currentQuestion.opcoes.map((opcao, idx) => {
                    const isCorreta = opcao === currentQuestion.resposta;
                    const isErrada = opcao === selectedAnswer && !isCorreta;
                    const isFocus = keyboardActive && idx === focusedOptionIndex && !feedbackIsVisible;

                    let bgClass = 'bg-white dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900 border border-gray-200 dark:border-zinc-700';
                    if (isCorreta && feedbackIsVisible) bgClass = 'bg-green-200 border-green-400 dark:bg-green-700 dark:border-green-500';
                    else if (isErrada) bgClass = 'bg-red-200 border-red-400 dark:bg-red-700 dark:border-red-500';
                    else if (isFocus) bgClass = 'bg-blue-100 border-blue-300 dark:bg-blue-800 dark:border-blue-500';

                    return (
                        <button
                            key={opcao}
                            type="button"
                            onClick={() => answerCurrentQuestion(opcao)}
                            disabled={feedbackIsVisible}
                            className={`px-4 py-2 rounded text-sm transition-all duration-300 ${bgClass}`}
                        >
                            {opcao}
                        </button>
                    );
                })}
            </div>

            {feedbackIsVisible && (
                <div className={`mt-4 rounded border p-4 text-left ${answeredCorrectly ? 'border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-100' : 'border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-100'}`}>
                    <p className="font-semibold">{answeredCorrectly ? 'Resposta correta.' : `Resposta correta: ${currentQuestion.resposta}`}</p>
                    <p className="mt-1 text-sm">{currentQuestion.explicacao}</p>
                    <button
                        type="button"
                        onClick={goToNextQuestion}
                        className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                    >
                        {isLastQuestion ? 'Ver revisão' : 'Próxima'}
                    </button>
                </div>
            )}

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                <span>Pergunta {currentIndex + 1} de {preparedQuestions.length}</span>
                <span>Acertos: {score}</span>
            </div>
        </div>
    );
}
