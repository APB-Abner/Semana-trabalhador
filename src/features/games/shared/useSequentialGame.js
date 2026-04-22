import { useMemo, useState } from 'react';

export function useSequentialGame(items, { createInitialAnswer, evaluateAnswer }) {
  const [phase, setPhase] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draftAnswer, setDraftAnswer] = useState(() => createInitialAnswer?.(items[0]) ?? null);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);

  const currentItem = items[currentIndex] ?? null;
  const isLastRound = currentIndex >= items.length - 1;
  const progress = items.length ? ((currentIndex + (phase === 'result' ? 1 : 0)) / items.length) * 100 : 0;

  const score = useMemo(
    () => history.reduce((total, entry) => total + (entry.result.score ?? 0), 0),
    [history],
  );

  function start() {
    setPhase('question');
    setCurrentIndex(0);
    setHistory([]);
    setCurrentResult(null);
    setDraftAnswer(createInitialAnswer?.(items[0]) ?? null);
  }

  function submit(answer = draftAnswer) {
    if (!currentItem || phase !== 'question') {
      return;
    }

    const result = evaluateAnswer(currentItem, answer);
    setCurrentResult(result);
    setHistory((entries) => [
      ...entries,
      {
        itemId: currentItem.id,
        answer,
        result,
      },
    ]);
    setPhase('reveal');
  }

  function next() {
    if (phase !== 'reveal') {
      return;
    }

    if (isLastRound) {
      setPhase('result');
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setDraftAnswer(createInitialAnswer?.(items[nextIndex]) ?? null);
    setCurrentResult(null);
    setPhase('question');
  }

  function restart() {
    start();
  }

  return {
    currentIndex,
    currentItem,
    currentResult,
    draftAnswer,
    history,
    isLastRound,
    phase,
    progress,
    score,
    setDraftAnswer,
    start,
    submit,
    next,
    restart,
    totalRounds: items.length,
  };
}
