import Badge from '../../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';

export default function WordCloudResultView({ result }) {
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
