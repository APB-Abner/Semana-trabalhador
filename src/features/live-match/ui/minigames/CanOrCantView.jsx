import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';
import RevealOptionMeter from '../../../live-quiz/ui/RevealOptionMeter.jsx';
import { getRevealOptionCardClass } from '../../../live-quiz/ui/revealOptionStyles.js';

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
          const revealOption = reveal?.options.find((candidate) => candidate.optionId === option.id);
          const revealTone = isCorrect && selected
            ? 'green'
            : isCorrect
              ? 'amber'
              : isWrongSelected
                ? 'red'
                : 'gray';

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              disabled={locked}
              onClick={() => onSubmit?.(option.id)}
              className={`rounded-lg border px-5 py-3 text-left text-base font-bold transition ${
                showAnswer
                  ? getRevealOptionCardClass(revealTone, selected)
                  : selected
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100'
              } disabled:cursor-not-allowed disabled:opacity-85`}
            >
              <span className="flex flex-wrap items-center gap-2">
                <span>{option.text}</span>
                {showAnswer && selected && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white">
                    Sua escolha
                  </span>
                )}
                {showAnswer && isCorrect && !selected && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-amber-950">
                    Correta
                  </span>
                )}
              </span>
              {showAnswer && revealOption && (
                <RevealOptionMeter count={revealOption.count} percentage={revealOption.percentage} tone={revealTone} />
              )}
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
          className="mt-3 text-sm"
        >
          <p className="font-semibold">Por quê?</p>
          <p className="mt-1">{reveal.explanation}</p>
        </FeedbackNotice>
      )}
    </ResultPanel>
  );
}
