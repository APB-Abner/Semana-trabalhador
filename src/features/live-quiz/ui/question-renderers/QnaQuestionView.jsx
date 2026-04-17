import { useEffect, useState } from 'react';

const maxLength = 160;

export default function QnaQuestionView({
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
      <label htmlFor="live-qna-answer" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        Resposta aberta curta
      </label>
      <textarea
        id="live-qna-answer"
        value={text}
        onChange={(event) => setText(event.target.value)}
        disabled={locked}
        maxLength={maxLength}
        rows={4}
        placeholder="Escreva uma resposta curta ou uma ideia para compartilhar com o grupo"
        className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default disabled:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-offset-zinc-900 dark:disabled:bg-zinc-950"
      />
      <div className="mt-2 flex justify-between gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <span>Resposta opinativa curta. Ideias equivalentes serao agrupadas.</span>
        <span>{text.length}/{maxLength}</span>
      </div>

      {!showAnswer && (
        <button
          type="button"
          disabled={locked || !text.trim()}
          onClick={() => onSubmit?.({ text })}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 dark:focus:ring-offset-zinc-900"
        >
          Enviar ideia
        </button>
      )}
    </div>
  );
}
