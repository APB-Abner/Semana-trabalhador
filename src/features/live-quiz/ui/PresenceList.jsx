import Badge from '../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function PresenceList({ players = [] }) {
  return (
    <ResultPanel>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Participantes</h3>
        <Badge tone="blue">{players.length}</Badge>
      </div>

      <div className="mt-4 space-y-2">
        {players.length ? players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <span className="font-medium text-gray-800 dark:text-gray-100">{player.name}</span>
            <Badge tone={player.connected ? 'green' : 'gray'}>
              {player.connected ? 'online' : 'offline'}
            </Badge>
          </div>
        )) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Nenhum jogador entrou ainda.
          </p>
        )}
      </div>
    </ResultPanel>
  );
}
