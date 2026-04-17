import Badge from '../../../../shared/ui/Badge.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';

export default function ParticipatoryResultView({ result }) {
  if (!result) {
    return null;
  }

  if (result.type === 'poll') {
    return (
      <ResultPanel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Resultado da enquete</h3>
          <Badge tone="purple">{result.totalResponses} resposta(s)</Badge>
        </div>

        <div className="mt-4 space-y-3">
          {result.options.map((option) => (
            <div key={option.optionId} className="rounded-md border border-gray-100 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-gray-900 dark:text-white">{option.text}</span>
                <span className="font-bold text-blue-700 dark:text-blue-200">
                  {option.count} voto(s) - {option.percentage}%
                </span>
              </div>
              <ProgressBar value={option.percentage} max={100} className="mt-2 h-2" />
            </div>
          ))}
        </div>
      </ResultPanel>
    );
  }

  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Nuvem de palavras</h3>
        <Badge tone="purple">{result.totalResponses} resposta(s)</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {result.entries.length ? result.entries.map((entry) => (
          <span
            key={entry.normalizedText}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100"
          >
            {entry.text}
            <Badge tone="blue">{entry.count}</Badge>
          </span>
        )) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Nenhuma resposta enviada nesta rodada.
          </p>
        )}
      </div>
    </ResultPanel>
  );
}
