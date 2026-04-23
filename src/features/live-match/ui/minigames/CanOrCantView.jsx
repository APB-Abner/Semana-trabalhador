import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';

function getClockOffset(serverNow) {
  return Number.isFinite(serverNow) ? serverNow - Date.now() : 0;
}

export default function CanOrCantView({
  disabled = false,
  hasSubmitted = false,
  onSubmit,
  round,
  selectedOptionIds = [],
  serverNow,
  startedAt,
  closesAt,
  showAnswer = false,
}) {
  const [clockOffset, setClockOffset] = useState(() => getClockOffset(serverNow));
  const [now, setNow] = useState(() => Date.now() + clockOffset);

  useEffect(() => {
    setClockOffset(getClockOffset(serverNow));
  }, [closesAt, serverNow, startedAt]);

  useEffect(() => {
    const updateNow = () => setNow(Date.now() + clockOffset);

    updateNow();
    const timer = setInterval(updateNow, 250);
    return () => clearInterval(timer);
  }, [clockOffset]);

  const item = round?.item;
  const reveal = round?.reveal;
  const selectedOptionId = selectedOptionIds[0];
  const remainingMs = closesAt ? Math.max(0, closesAt - now) : 0;
  const totalMs = useMemo(
    () => (startedAt && closesAt ? Math.max(1, closesAt - startedAt) : 1),
    [closesAt, startedAt],
  );

  if (!item) {
    return null;
  }

  const locked = disabled || hasSubmitted || showAnswer;

  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{item.topic}</Badge>
          <Badge tone="green">Pode / Não Pode</Badge>
        </div>
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
          barClassName={remainingMs <= 5_000 ? 'bg-red-500' : 'bg-emerald-500'}
        />
      )}

      <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
      <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
        {item.situation}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {item.options.map((option) => {
          const selected = selectedOptionId === option.id;
          const isCorrect = showAnswer && reveal?.correctAnswer === option.id;
          const isWrongSelected = showAnswer && selected && reveal?.correctAnswer !== option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              disabled={locked}
              onClick={() => onSubmit?.(option.id)}
              className={`rounded-lg border px-5 py-4 text-left text-base font-bold transition ${
                isCorrect
                  ? 'border-green-500 bg-green-50 text-green-950 dark:bg-green-950/50 dark:text-green-100'
                  : isWrongSelected
                    ? 'border-red-400 bg-red-50 text-red-950 dark:bg-red-950/50 dark:text-red-100'
                    : selected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100'
              } disabled:cursor-not-allowed disabled:opacity-85`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {hasSubmitted && !showAnswer && (
        <FeedbackNotice tone="info" className="mt-4 text-sm">
          Resposta enviada. Aguarde o resultado para ver a classificação correta.
        </FeedbackNotice>
      )}

      {showAnswer && reveal && (
        <FeedbackNotice
          tone={selectedOptionId ? (selectedOptionId === reveal.correctAnswer ? 'success' : 'danger') : 'info'}
          className="mt-4 text-sm"
        >
          <p className="font-semibold">
            Resposta correta: {item.options.find((option) => option.id === reveal.correctAnswer)?.text}.
          </p>
          <p className="mt-1">{reveal.explanation}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {reveal.options.map((option) => (
              <div key={option.optionId} className="rounded-md border border-current/20 px-3 py-2">
                <span className="font-semibold">{option.text}</span>
                <span className="ml-2 text-xs">{option.count} voto(s) · {option.percentage}%</span>
              </div>
            ))}
          </div>
        </FeedbackNotice>
      )}
    </ResultPanel>
  );
}
