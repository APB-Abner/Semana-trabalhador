import Badge from '../../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';

export default function RankingResultView({ result }) {
  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Ranking coletivo</h3>
        <Badge tone="purple">{result.totalResponses} resposta(s)</Badge>
      </div>

      <div className="mt-4 space-y-3">
        {result.items.map((item, index) => (
          <div
            key={item.optionId}
            className="grid grid-cols-[2.25rem_1fr] gap-3 rounded-md border border-gray-100 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-xs font-extrabold text-blue-800 dark:bg-blue-950 dark:text-blue-100">
              {index + 1}
            </span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{item.text}</p>
              <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                {item.totalPoints} ponto(s) Borda · média de posição {item.averagePosition ?? '-'} · {item.firstPlaceVotes} em 1º
              </p>
            </div>
          </div>
        ))}
      </div>
    </ResultPanel>
  );
}
