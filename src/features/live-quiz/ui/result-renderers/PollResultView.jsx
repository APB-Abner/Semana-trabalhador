import Badge from '../../../../shared/ui/Badge.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';

export default function PollResultView({ result }) {
  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Resultado da enquete</h3>
          <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
            Distribuição de votos da rodada atual.
          </p>
        </div>
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
