import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';

function getClockOffset(serverNow) {
  return Number.isFinite(serverNow) ? serverNow - Date.now() : 0;
}

function toggleId(selectedIds, id) {
  return selectedIds.includes(id)
    ? selectedIds.filter((selectedId) => selectedId !== id)
    : [...selectedIds, id];
}

export default function FindTheMistakeView({
  disabled = false,
  hasSubmitted = false,
  onChange,
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
  const [selectedIds, setSelectedIds] = useState(selectedOptionIds);

  useEffect(() => {
    setClockOffset(getClockOffset(serverNow));
  }, [closesAt, serverNow, startedAt]);

  useEffect(() => {
    const updateNow = () => setNow(Date.now() + clockOffset);

    updateNow();
    const timer = setInterval(updateNow, 250);
    return () => clearInterval(timer);
  }, [clockOffset]);

  useEffect(() => {
    setSelectedIds(selectedOptionIds);
  }, [selectedOptionIds]);

  const caseItem = round?.case;
  const reveal = round?.reveal;
  const remainingMs = closesAt ? Math.max(0, closesAt - now) : 0;
  const totalMs = useMemo(
    () => (startedAt && closesAt ? Math.max(1, closesAt - startedAt) : 1),
    [closesAt, startedAt],
  );

  if (!caseItem) {
    return null;
  }

  const locked = disabled || hasSubmitted || showAnswer;

  const updateSelectedIds = (nextIds) => {
    setSelectedIds(nextIds);
    onChange?.(nextIds);
  };

  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{caseItem.topic}</Badge>
          <Badge tone="amber">Caça-erros</Badge>
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

      <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">{caseItem.title}</h3>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{caseItem.prompt}</p>
      <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-amber-200 bg-amber-50 p-4 font-sans text-sm leading-relaxed text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        {caseItem.sample}
      </pre>

      <div className="mt-5 space-y-3">
        {caseItem.options.map((option) => {
          const selected = selectedIds.includes(option.id);
          const revealedOption = reveal?.options.find((candidate) => candidate.optionId === option.id);
          const isCorrectMarked = showAnswer && selected && revealedOption?.isMistake;
          const isMissed = showAnswer && !selected && revealedOption?.isMistake;
          const isFalsePositive = showAnswer && selected && !revealedOption?.isMistake;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              disabled={locked}
              onClick={() => updateSelectedIds(toggleId(selectedIds, option.id))}
              className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                isCorrectMarked
                  ? 'border-green-500 bg-green-50 text-green-950 dark:bg-green-950/50 dark:text-green-100'
                  : isMissed
                    ? 'border-amber-500 bg-amber-50 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100'
                    : isFalsePositive
                      ? 'border-red-400 bg-red-50 text-red-950 dark:bg-red-950/50 dark:text-red-100'
                      : selected
                        ? 'border-blue-500 bg-blue-50 text-blue-950 dark:bg-blue-950/50 dark:text-blue-100'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-amber-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100'
              } disabled:cursor-not-allowed disabled:opacity-85`}
            >
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${selected ? 'border-current bg-current text-white dark:text-zinc-950' : 'border-gray-300 dark:border-zinc-600'}`}>
                {selected ? '✓' : ''}
              </span>
              <span className="min-w-0">
                {option.label}
                {showAnswer && revealedOption && (
                  <span className="mt-1 block text-xs font-normal opacity-85">
                    {revealedOption.isMistake ? 'Era erro.' : 'Não era erro.'} {revealedOption.explanation}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {!showAnswer && !disabled && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {selectedIds.length} item(ns) marcado(s)
          </p>
          <CtaButtonRow
            actions={[{
              label: hasSubmitted ? 'Análise enviada' : 'Confirmar análise',
              onClick: () => onSubmit?.(selectedIds),
              tone: 'blue',
              disabled: locked || selectedIds.length === 0,
            }]}
          />
        </div>
      )}

      {hasSubmitted && !showAnswer && (
        <FeedbackNotice tone="info" className="mt-4 text-sm">
          Análise enviada. Aguarde o resultado para ver os erros reais.
        </FeedbackNotice>
      )}

      {showAnswer && reveal && (
        <FeedbackNotice tone="info" className="mt-4 text-sm">
          <p className="font-semibold">Erros reais: {reveal.mistakeCount}</p>
          <p className="mt-1">O placar considera erros encontrados e desconta marcações indevidas.</p>
        </FeedbackNotice>
      )}
    </ResultPanel>
  );
}
