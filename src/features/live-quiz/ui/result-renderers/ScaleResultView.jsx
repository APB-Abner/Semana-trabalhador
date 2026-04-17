import Badge from '../../../../shared/ui/Badge.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';

export default function ScaleResultView({ result }) {
  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Resultado da escala</h3>
        <Badge tone="purple">{result.totalResponses} resposta(s)</Badge>
      </div>

      <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-200">Média do grupo</p>
        <p className="mt-1 text-3xl font-extrabold text-blue-950 dark:text-white">
          {result.average ?? '-'}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {result.distribution.map((entry) => (
          <div key={entry.value} className="grid grid-cols-[3rem_1fr_6rem] items-center gap-3 text-sm">
            <span className="font-bold text-gray-900 dark:text-white">{entry.value}</span>
            <ProgressBar value={entry.percentage} max={100} className="h-2" />
            <span className="text-right font-semibold text-gray-600 dark:text-gray-300">
              {entry.count} ({entry.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </ResultPanel>
  );
}
