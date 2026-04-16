import Badge from '../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function LeaderboardPanel({ entries = [], title = 'Leaderboard' }) {
  return (
    <ResultPanel>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Badge tone="purple">{entries.length} jogador(es)</Badge>
      </div>

      <div className="mt-4 space-y-2">
        {entries.length ? entries.map((entry, index) => (
          <div
            key={entry.playerId}
            className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <span className="font-bold text-blue-600 dark:text-blue-300">#{index + 1}</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{entry.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Rodada: {entry.roundPoints} ponto(s)
                {entry.responseMs !== null ? ` · ${entry.responseMs}ms` : ''}
              </p>
            </div>
            <Badge tone={entry.lastAnswerCorrect ? 'green' : 'gray'}>
              {entry.score}
            </Badge>
          </div>
        )) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            O ranking aparece após a rodada ser revelada.
          </p>
        )}
      </div>
    </ResultPanel>
  );
}
