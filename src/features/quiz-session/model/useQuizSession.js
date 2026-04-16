import { useCallback, useEffect, useMemo, useState } from 'react';
import prepareQuizQuestions from '../lib/prepareQuizQuestions.js';

export default function useQuizSession(questions, { onCorrect, onWrong, onReviewReady } = {}) {
  const [preparedQuestions, setPreparedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [mode, setMode] = useState('question');

  useEffect(() => {
    setPreparedQuestions(prepareQuizQuestions(questions));
  }, [questions]);

  const currentQuestion = preparedQuestions[currentIndex];
  const score = useMemo(
    () => answeredQuestions.filter((answer) => answer.isCorrect).length,
    [answeredQuestions],
  );
  const wrongAnswers = useMemo(
    () => answeredQuestions.filter((answer) => !answer.isCorrect),
    [answeredQuestions],
  );

  const answerCurrentQuestion = useCallback((answer) => {
    if (!currentQuestion || selectedAnswer !== null || mode !== 'question') return;

    const isCorrect = answer === currentQuestion.resposta;
    const nextStreak = isCorrect ? currentStreak + 1 : 0;

    setSelectedAnswer(answer);
    setCurrentStreak(nextStreak);
    setBestStreak((previousBest) => Math.max(previousBest, nextStreak));
    setAnsweredQuestions((currentAnswers) => [
      ...currentAnswers,
      {
        question: currentQuestion,
        selectedAnswer: answer,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      onCorrect?.();
    } else {
      onWrong?.();
    }
  }, [currentQuestion, currentStreak, mode, onCorrect, onWrong, selectedAnswer]);

  const goToNextQuestion = useCallback(() => {
    if (!currentQuestion || selectedAnswer === null) return;

    setSelectedAnswer(null);
    setFocusedOptionIndex(0);
    setKeyboardActive(false);

    if (currentIndex + 1 < preparedQuestions.length) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    setMode('review');
    onReviewReady?.();
  }, [currentIndex, currentQuestion, onReviewReady, preparedQuestions.length, selectedAnswer]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!currentQuestion || mode !== 'question') return;

      if (selectedAnswer !== null) {
        if (event.key === 'Enter') {
          goToNextQuestion();
        }
        return;
      }

      if (!keyboardActive && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        setKeyboardActive(true);
        return;
      }

      if (!keyboardActive) return;

      if (event.key === 'ArrowUp') {
        setFocusedOptionIndex((previousIndex) =>
          previousIndex > 0 ? previousIndex - 1 : currentQuestion.opcoes.length - 1,
        );
      }

      if (event.key === 'ArrowDown') {
        setFocusedOptionIndex((previousIndex) =>
          previousIndex < currentQuestion.opcoes.length - 1 ? previousIndex + 1 : 0,
        );
      }

      if (event.key === 'Enter') {
        answerCurrentQuestion(currentQuestion.opcoes[focusedOptionIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    answerCurrentQuestion,
    currentQuestion,
    focusedOptionIndex,
    goToNextQuestion,
    keyboardActive,
    mode,
    selectedAnswer,
  ]);

  return {
    answeredQuestions,
    bestStreak,
    currentIndex,
    currentQuestion,
    currentStreak,
    focusedOptionIndex,
    goToNextQuestion,
    isFinished: mode === 'review',
    isLastQuestion: currentIndex + 1 === preparedQuestions.length,
    keyboardActive,
    mode,
    preparedQuestions,
    progress: preparedQuestions.length ? ((currentIndex + 1) / preparedQuestions.length) * 100 : 0,
    score,
    selectedAnswer,
    wrongAnswers,
    answerCurrentQuestion,
  };
}
