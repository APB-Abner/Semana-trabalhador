import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';
import { shuffleOptionsForPlayer } from '../../../live-quiz/lib/optionShuffle.js';

function getClockOffset(serverNow) {
  return Number.isFinite(serverNow) ? serverNow - Date.now() : 0;
}

export default function ProfessionalCommunicationView({
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

  const scenario = round?.scenario;
  const reveal = round?.reveal;
  const selectedOptionId = selectedOptionIds[0];
  const remainingMs = closesAt ? Math.max(0, closesAt - now) : 0;
  const totalMs = useMemo(
    () => (startedAt && closesAt ? Math.max(1, closesAt - startedAt) : 1),
    [closesAt, startedAt],
  );
  const displayedOptions = useMemo(
    () => shuffleOptionsForPlayer(scenario?.options ?? [], `${optionOrderSeed}:${round?.id ?? ''}`),
    [optionOrderSeed, round?.id, scenario?.options],
  );

  if (!scenario) {
    return null;
  }

  const locked = disabled || hasSubmitted || showAnswer;

  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{scenario.topic}</Badge>
          <Badge tone="purple">Comunicação Profissional</Badge>
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
          barClassName={remainingMs <= 5_000 ? 'bg-red-500' : 'bg-violet-500'}
        />
      )}

      <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">{scenario.title}</h3>
      <p className="mt-3 rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm leading-relaxed text-violet-950 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100">
        {scenario.scenario}
      </p>

      <div className="mt-5 space-y-3">
        {displayedOptions.map((option, index) => {
          const selected = selectedOptionId === option.id;
          const revealedOption = reveal?.options.find((candidate) => candidate.optionId === option.id);
          const isBest = reveal?.bestOptionId === option.id;
          const isPoorSelected = showAnswer && selected && revealedOption?.quality === 'poor';

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              disabled={locked}
              onClick={() => onSubmit?.(option.id)}
              className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                isBest && showAnswer
                  ? 'border-green-500 bg-green-50 text-green-950 dark:bg-green-950/50 dark:text-green-100'
                  : isPoorSelected
                    ? 'border-red-400 bg-red-50 text-red-950 dark:bg-red-950/50 dark:text-red-100'
                    : selected
                      ? 'border-violet-500 bg-violet-50 text-violet-950 dark:bg-violet-950/50 dark:text-violet-100'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100'
              } disabled:cursor-not-allowed disabled:opacity-85`}
            >
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Resposta {index + 1}
              </span>
              <span className="mt-1 block font-semibold">{option.text}</span>
              {showAnswer && revealedOption && (
                <span className="mt-2 block text-xs font-semibold opacity-80">
                  {revealedOption.count} escolha(s) · {revealedOption.percentage}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {hasSubmitted && !showAnswer && (
        <FeedbackNotice tone="info" className="mt-4 text-sm">
          Resposta enviada. Aguarde o resultado para ver o melhor tom.
        </FeedbackNotice>
      )}

      {showAnswer && reveal && (
        <FeedbackNotice tone={selectedOptionId === reveal.bestOptionId ? 'success' : 'info'} className="mt-4 text-sm">
          <p className="font-semibold">
            Melhor resposta: {reveal.options.find((option) => option.optionId === reveal.bestOptionId)?.text}
          </p>
          <p className="mt-1">{reveal.learningPoint}</p>
          {selectedOptionId && (
            <p className="mt-2">
              Sua escolha: {reveal.options.find((option) => option.optionId === selectedOptionId)?.feedback}
            </p>
          )}
        </FeedbackNotice>
      )}
    </ResultPanel>
  );
}
