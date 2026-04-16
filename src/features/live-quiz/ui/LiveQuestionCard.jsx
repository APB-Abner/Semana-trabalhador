import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function LiveQuestionCard({
  question,
  startedAt,
  closesAt,
  disabled = false,
  hasSubmitted = false,
  onSubmit,
  selectedOptionId,
  showAnswer = false,
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);

  const remainingMs = closesAt ? Math.max(0, closesAt - now) : 0;
  const totalMs = useMemo(
    () => (startedAt && closesAt ? Math.max(1, closesAt - startedAt) : 1),
    [closesAt, startedAt],
  );
  const selectedIsCorrect = selectedOptionId && question?.correctOptionId
    ? selectedOptionId === question.correctOptionId
    : false;

  if (!question) {
    return null;
  }

  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone="blue">{question.topic}</Badge>
        {closesAt && (
          <Badge tone={remainingMs <= 5_000 ? 'red' : 'gray'}>
            {Math.ceil(remainingMs / 1000)}s
          </Badge>
        )}
      </div>

      {closesAt && (
        <ProgressBar
          value={remainingMs}
          max={totalMs}
          className="mt-4 h-2"
          barClassName={remainingMs <= 5_000 ? 'bg-red-500' : 'bg-blue-500'}
        />
      )}

      <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
        {question.text}
      </h3>

      <div className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const selected = selectedOptionId === option.id;
          const correct = showAnswer && question.correctOptionId === option.id;
          const wrongSelection = showAnswer && selected && !correct;
          let optionClass = 'border-gray-200 bg-white hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800';

          if (correct) {
            optionClass = 'border-green-400 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-950 dark:text-green-100';
          } else if (wrongSelection) {
            optionClass = 'border-red-400 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-950 dark:text-red-100';
          } else if (selected) {
            optionClass = 'border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950';
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled || hasSubmitted || showAnswer}
              onClick={() => onSubmit?.(option.id)}
              aria-pressed={selected}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-zinc-900 ${optionClass}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {hasSubmitted && !showAnswer && (
        <FeedbackNotice tone="info" className="mt-4 text-sm">
          Resposta enviada. Aguarde o fechamento da rodada.
        </FeedbackNotice>
      )}

      {showAnswer && (
        <FeedbackNotice tone={selectedIsCorrect ? 'success' : 'info'} className="mt-4 text-sm">
          <p className="font-semibold">
            Resposta correta: {question.options.find((option) => option.id === question.correctOptionId)?.text}
          </p>
          {question.explanation && <p className="mt-1">{question.explanation}</p>}
        </FeedbackNotice>
      )}
    </ResultPanel>
  );
}
