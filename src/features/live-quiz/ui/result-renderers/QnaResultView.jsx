import Badge from '../../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';

export default function QnaResultView({ result }) {
  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Respostas abertas</h3>
          <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
            Ideias equivalentes foram agrupadas por texto normalizado.
          </p>
        </div>
        <Badge tone="purple">{result.totalResponses} resposta(s)</Badge>
      </div>

      <div className="mt-4 space-y-3">
        {result.entries.length ? result.entries.map((entry) => (
          <div
            key={entry.normalizedText}
            className="rounded-md border border-gray-100 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{entry.text}</p>
              <Badge tone="blue">{entry.count}x</Badge>
            </div>
          </div>
        )) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Nenhuma resposta enviada nesta rodada.
          </p>
        )}
      </div>
    </ResultPanel>
  );
}
