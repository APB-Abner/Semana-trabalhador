import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../../shared/ui/Badge.jsx';
import RevealOptionMeter from '../RevealOptionMeter.jsx';
import { getRevealOptionCardClass } from '../revealOptionStyles.js';

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

function getOptionClass({ correct, selected, wrongSelection }) {
  if (correct && selected) {
    return getRevealOptionCardClass('green', true);
  }

  if (correct) {
    return getRevealOptionCardClass('amber');
  }

  if (wrongSelection) {
    return getRevealOptionCardClass('red', true);
  }

  if (selected) {
    return 'border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950';
  }

  return 'border-gray-200 bg-white hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800';
}

export default function MultipleSelectQuestionView({
  correctOptionIds = [],
  disabled = false,
  hasSubmitted = false,
  onChange,
  onSubmit,
  question,
  selectedOptionIds = [],
  showAnswer = false,
}) {
  const selectedKey = selectedOptionIds.join('|');
  const [selectedIds, setSelectedIds] = useState(selectedOptionIds);
  const locked = disabled || hasSubmitted || showAnswer;
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const statsByOptionId = new Map((question.optionStats ?? []).map((stat) => [stat.optionId, stat]));

  useEffect(() => {
    setSelectedIds(selectedOptionIds);
  }, [question.id, selectedKey, selectedOptionIds]);

  const toggleOption = (optionId) => {
    if (locked) return;

    setSelectedIds((currentIds) => {
      const nextIds = currentIds.includes(optionId)
        ? currentIds.filter((currentId) => currentId !== optionId)
        : [...currentIds, optionId];

      onChange?.(nextIds);
      return nextIds;
    });
  };

  return (
    <div className="mt-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="purple">Seleção múltipla</Badge>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {selectedIds.length} selecionada(s)
        </span>
      </div>

      <div className="grid gap-3">
        {question.options.map((option, index) => {
          const selected = selectedSet.has(option.id);
          const correct = showAnswer && correctOptionIds.includes(option.id);
          const wrongSelection = showAnswer && selected && !correct;
          const stat = statsByOptionId.get(option.id);
          const revealTone = correct && selected
            ? 'green'
            : correct
              ? 'amber'
              : wrongSelection
                ? 'red'
                : 'gray';

          return (
            <button
              key={option.id}
              type="button"
              disabled={locked}
              onClick={() => toggleOption(option.id)}
              aria-pressed={selected}
              className={`grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-zinc-900 ${getOptionClass({ correct, selected, wrongSelection })}`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                {optionLetters[index] ?? index + 1}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span>{option.text}</span>
                  {selected && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white">
                      Marcada
                    </span>
                  )}
                  {showAnswer && correct && !selected && (
                    <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-amber-950">
                      Faltou
                    </span>
                  )}
                </span>
                {showAnswer && stat && (
                  <RevealOptionMeter count={stat.count} percentage={stat.percentage} tone={revealTone} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {!showAnswer && (
        <button
          type="button"
          disabled={locked || selectedIds.length === 0}
          onClick={() => onSubmit?.(selectedIds)}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:focus:ring-offset-zinc-900"
        >
          {hasSubmitted ? 'Resposta travada' : 'Confirmar resposta'}
        </button>
      )}
    </div>
  );
}
