import Badge from '../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import PigeonAvatar from '../../pigeon-avatar/ui/PigeonAvatar';

function getRoundDetail(entry, showRoundDetails) {
  if (!showRoundDetails) {
    return null;
  }

  if (entry.roundPoints > 0) {
    return `Rodada: +${entry.roundPoints} pontos${entry.responseMs !== null ? ` · ${entry.responseMs}ms` : ''}`;
  }

  if (entry.responseMs !== null) {
    return 'Sem pontos nesta rodada';
  }

  return null;
}

export default function LeaderboardPanel({
  currentPlayerId,
  entries = [],
  showRoundDetails = true,
  title = 'Placar',
}) {
  return (
    <ResultPanel>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Badge tone="purple">
          {entries.length} {entries.length === 1 ? 'jogador' : 'jogadores'}
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        {entries.length ? entries.map((entry, index) => {
          const roundDetail = getRoundDetail(entry, showRoundDetails);
          const isCurrentPlayer = currentPlayerId === entry.playerId;

          return (
            <div
              key={entry.playerId}
              className={`grid grid-cols-[2rem_2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md border px-3 py-2 text-sm ${
                isCurrentPlayer
                  ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300/50 dark:border-blue-600 dark:bg-blue-950/60'
                  : 'border-gray-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950'
              }`}
            >
              <span className="font-bold text-blue-600 dark:text-blue-300">#{index + 1}</span>
              <PigeonAvatar avatar={entry.avatar} size="sm" label={`Avatar de ${entry.name}`} />
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900 dark:text-white">
                  {entry.name}
                  {isCurrentPlayer && (
                    <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white">
                      Você
                    </span>
                  )}
                </p>
                {roundDetail && (
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {roundDetail}
                  </p>
                )}
              </div>
              <Badge tone={entry.lastAnswerCorrect ? 'green' : 'gray'}>
                {entry.score}
              </Badge>
            </div>
          );
        }) : (
          <p className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-600 dark:border-zinc-700 dark:text-gray-300">
            O placar aparece quando a rodada terminar.
          </p>
        )}
      </div>
    </ResultPanel>
  );
}
