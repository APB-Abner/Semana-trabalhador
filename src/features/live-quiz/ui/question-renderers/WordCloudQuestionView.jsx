import { useEffect, useState } from 'react';

const maxLength = 40;

export default function WordCloudQuestionView({
  disabled = false,
  hasSubmitted = false,
  onSubmit,
  selectedText = '',
  showAnswer = false,
}) {
  const [text, setText] = useState(selectedText);
  const locked = disabled || hasSubmitted || showAnswer;

  useEffect(() => {
    setText(selectedText);
  }, [selectedText]);

  return (
    <div className="mt-5">
      <label htmlFor="live-word-cloud-answer" className="sr-only">
        Resposta para nuvem de palavras
      </label>
      <input
        id="live-word-cloud-answer"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        disabled={locked}
        maxLength={maxLength}
        placeholder="Digite uma palavra ou expressão"
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default disabled:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-offset-zinc-900 dark:disabled:bg-zinc-950"
      />
      <div className="mt-2 flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
        <span>Até {maxLength} caracteres</span>
        <span>{text.length}/{maxLength}</span>
      </div>

      {!showAnswer && (
        <button
          type="button"
          disabled={locked || !text.trim()}
          onClick={() => onSubmit?.({ text })}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:focus:ring-offset-zinc-900"
        >
          Enviar resposta
        </button>
      )}
    </div>
  );
}
