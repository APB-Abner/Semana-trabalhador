import { useEffect, useMemo, useState } from 'react';

function moveItem(items, fromIndex, toIndex) {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

export default function RankingQuestionView({
  disabled = false,
  hasSubmitted = false,
  onSubmit,
  question,
  selectedOptionIds = [],
  showAnswer = false,
}) {
  const selectedKey = selectedOptionIds.join('|');
  const defaultKey = question.options.map((option) => option.id).join('|');
  const defaultOrder = useMemo(() => (defaultKey ? defaultKey.split('|') : []), [defaultKey]);
  const initialOrder = selectedOptionIds.length
    ? selectedOptionIds
    : defaultOrder;
  const [orderedIds, setOrderedIds] = useState(initialOrder);
  const locked = disabled || hasSubmitted || showAnswer;
  const optionsById = new Map(question.options.map((option) => [option.id, option]));

  useEffect(() => {
    setOrderedIds(selectedKey ? selectedKey.split('|') : defaultOrder);
  }, [defaultOrder, question.id, selectedKey]);

  const move = (index, direction) => {
    const nextIndex = index + direction;

    if (locked || nextIndex < 0 || nextIndex >= orderedIds.length) {
      return;
    }

    setOrderedIds((currentIds) => moveItem(currentIds, index, nextIndex));
  };

  return (
    <div className="mt-5">
      <div className="grid gap-3">
        {orderedIds.map((optionId, index) => {
          const option = optionsById.get(optionId);

          if (!option) {
            return null;
          }

          return (
            <div
              key={option.id}
              className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-100">
                {index + 1}
              </span>
              <span>{option.text}</span>
              <span className="flex gap-1">
                <button
                  type="button"
                  disabled={locked || index === 0}
                  onClick={() => move(index, -1)}
                  aria-label={`Mover ${option.text} para cima`}
                  className="rounded-md border border-gray-200 px-2 py-1 text-xs font-bold text-gray-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-800"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={locked || index === orderedIds.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label={`Mover ${option.text} para baixo`}
                  className="rounded-md border border-gray-200 px-2 py-1 text-xs font-bold text-gray-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-800"
                >
                  ↓
                </button>
              </span>
            </div>
          );
        })}
      </div>

      {!showAnswer && (
        <button
          type="button"
          disabled={locked}
          onClick={() => onSubmit?.(orderedIds)}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:focus:ring-offset-zinc-900"
        >
          Confirmar ranking
        </button>
      )}
    </div>
  );
}
