import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';
import { shuffleOptionsForPlayer } from '../../../live-quiz/lib/optionShuffle.js';
import RevealOptionMeter from '../../../live-quiz/ui/RevealOptionMeter.jsx';
import { getRevealOptionCardClass } from '../../../live-quiz/ui/revealOptionStyles.js';

function getClockOffset(serverNow) {
  return Number.isFinite(serverNow) ? serverNow - Date.now() : 0;
}

const qualityLabels = {
  best: 'Melhor',
  ok: 'Aceitável',
  poor: 'Ruim',
};

const qualityTones = {
  best: 'green',
  ok: 'amber',
  poor: 'red',
};

export default function WorkSituationView({
  disabled = false,
  hasSubmitted = false,
  onSubmit,
  optionOrderSeed = '',
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

  const situation = round?.situation;
  const reveal = round?.reveal;
  const selectedOptionId = selectedOptionIds[0];
  const remainingMs = closesAt ? Math.max(0, closesAt - now) : 0;
  const totalMs = useMemo(
    () => (startedAt && closesAt ? Math.max(1, closesAt - startedAt) : 1),
    [closesAt, startedAt],
  );
  const displayedOptions = useMemo(
    () => shuffleOptionsForPlayer(situation?.options ?? [], `${optionOrderSeed}:${round?.id ?? ''}`),
    [optionOrderSeed, round?.id, situation?.options],
  );
  const selectedRevealOption = reveal?.options.find((option) => option.optionId === selectedOptionId);

  if (!situation) {
    return null;
  }

  const locked = disabled || hasSubmitted || showAnswer;

  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{situation.topic}</Badge>
          <Badge tone="amber">Situação Profissional</Badge>
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
          barClassName={remainingMs <= 5_000 ? 'bg-red-500' : 'bg-amber-500'}
        />
      )}

      <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">{situation.title}</h3>
      <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        {situation.scenario}
      </p>

      <div className="mt-5 space-y-3">
        {displayedOptions.map((option, index) => {
          const selected = selectedOptionId === option.id;
          const revealedOption = reveal?.options.find((candidate) => candidate.optionId === option.id);
          const revealTone = qualityTones[revealedOption?.quality] ?? 'gray';

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              disabled={locked}
              onClick={() => onSubmit?.(option.id)}
              className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                showAnswer && revealedOption
                  ? getRevealOptionCardClass(revealTone, selected)
                  : selected
                    ? 'border-amber-500 bg-amber-50 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-amber-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100'
              } disabled:cursor-not-allowed disabled:opacity-85`}
            >
              <span className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide opacity-75">
                <span>Ação {index + 1}</span>
                {showAnswer && revealedOption && (
                  <span className="rounded-full bg-black/10 px-2 py-0.5 dark:bg-white/15">
                    {qualityLabels[revealedOption.quality] ?? revealedOption.quality}
                  </span>
                )}
                {showAnswer && selected && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-white">
                    Sua escolha
                  </span>
                )}
              </span>
              <span className="mt-1 block font-semibold">{option.text}</span>
              {showAnswer && revealedOption && (
                <RevealOptionMeter
                  count={revealedOption.count}
                  percentage={revealedOption.percentage}
                  tone={revealTone}
                />
              )}
            </button>
          );
        })}
      </div>

      {hasSubmitted && !showAnswer && (
        <FeedbackNotice tone="info" className="mt-4 text-sm">
          Decisão enviada. Aguarde o resultado da rodada para ver a melhor escolha.
        </FeedbackNotice>
      )}

      {showAnswer && reveal && (
        <FeedbackNotice
          tone={selectedRevealOption?.quality === 'best' ? 'success' : selectedRevealOption?.quality === 'poor' ? 'danger' : 'info'}
          className="mt-3 text-sm"
        >
          <p className="font-semibold">Melhor decisão: {reveal.options.find((option) => option.optionId === reveal.bestOptionId)?.text}</p>
          <p className="mt-1">{reveal.explanation}</p>
          {selectedRevealOption && (
            <p className="mt-2">
              Sua escolha: {selectedRevealOption.feedback}
            </p>
          )}
        </FeedbackNotice>
      )}
    </ResultPanel>
  );
}
