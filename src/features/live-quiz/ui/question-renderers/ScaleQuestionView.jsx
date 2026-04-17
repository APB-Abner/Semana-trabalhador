import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../../shared/ui/Badge.jsx';

export default function ScaleQuestionView({
  disabled = false,
  hasSubmitted = false,
  onSubmit,
  question,
  selectedValue,
  showAnswer = false,
}) {
  const scale = question.scale ?? { min: 1, max: 5, step: 1 };
  const initialValue = selectedValue ?? scale.min;
  const [value, setValue] = useState(initialValue);
  const locked = disabled || hasSubmitted || showAnswer;
  const values = useMemo(() => {
    const step = scale.step ?? 1;
    const nextValues = [];

    for (let current = scale.min; current <= scale.max; current += step) {
      nextValues.push(Number(current.toFixed(10)));
    }

    return nextValues;
  }, [scale.max, scale.min, scale.step]);

  useEffect(() => {
    setValue(selectedValue ?? scale.min);
  }, [question.id, scale.min, selectedValue]);

  return (
    <div className="mt-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {scale.minLabel ?? scale.min}
        </span>
        <Badge tone="blue">{value}</Badge>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {scale.maxLabel ?? scale.max}
        </span>
      </div>

      <input
        type="range"
        min={scale.min}
        max={scale.max}
        step={scale.step ?? 1}
        value={value}
        disabled={locked}
        aria-label="Valor da escala"
        onChange={(event) => setValue(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-600 disabled:cursor-default dark:bg-zinc-700"
      />

      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
        {values.map((scaleValue) => (
          <button
            key={scaleValue}
            type="button"
            disabled={locked}
            onClick={() => setValue(scaleValue)}
            aria-pressed={value === scaleValue}
            className={`rounded-md border px-2 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-zinc-900 ${
              value === scaleValue
                ? 'border-blue-500 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-100'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800'
            }`}
          >
            {scaleValue}
          </button>
        ))}
      </div>

      {!showAnswer && (
        <button
          type="button"
          disabled={locked}
          onClick={() => onSubmit?.({ value })}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:focus:ring-offset-zinc-900"
        >
          Confirmar resposta
        </button>
      )}
    </div>
  );
}
