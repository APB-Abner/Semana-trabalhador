const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

function getOptionClass({ correct, selected, wrongSelection }) {
  if (correct) {
    return 'border-green-400 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-950 dark:text-green-100';
  }

  if (wrongSelection) {
    return 'border-red-400 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-950 dark:text-red-100';
  }

  if (selected) {
    return 'border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950';
  }

  return 'border-gray-200 bg-white hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800';
}

export default function MultipleChoiceQuestionView({
  correctOptionIds = [],
  disabled = false,
  hasSubmitted = false,
  onChange,
  onSubmit,
  question,
  selectedOptionIds = [],
  showAnswer = false,
}) {
  const locked = disabled || hasSubmitted || showAnswer;
  const selectedOptionId = selectedOptionIds[0];

  const selectOption = (optionId) => {
    if (locked) {
      return;
    }

    if (onChange) {
      onChange(optionId);
      return;
    }

    onSubmit?.(optionId);
  };

  return (
    <div className="mt-5">
      <div className="grid gap-3">
        {question.options.map((option, index) => {
          const selected = selectedOptionId === option.id;
          const correct = showAnswer && correctOptionIds.includes(option.id);
          const wrongSelection = showAnswer && selected && !correct;

          return (
            <button
              key={option.id}
              type="button"
              disabled={locked}
              onClick={() => selectOption(option.id)}
              aria-pressed={selected}
              className={`grid grid-cols-[2rem_1fr] items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-zinc-900 ${getOptionClass({ correct, selected, wrongSelection })}`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                {optionLetters[index] ?? index + 1}
              </span>
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>

      {onChange && onSubmit && !showAnswer && (
        <button
          type="button"
          disabled={locked || !selectedOptionId}
          onClick={() => onSubmit?.(selectedOptionId)}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:focus:ring-offset-zinc-900"
        >
          {hasSubmitted ? 'Resposta travada' : 'Confirmar resposta'}
        </button>
      )}
    </div>
  );
}
