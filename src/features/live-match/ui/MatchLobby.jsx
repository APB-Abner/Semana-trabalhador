import Badge from '../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function MatchLobby({ state }) {
  const games = state?.selectedGames ?? [];

  if (!games.length) {
    return null;
  }

  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Match online</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            A partida tem 3 desafios curtos. O placar acumula até o pódio final.
          </p>
        </div>
        <Badge tone="purple">{games.length} etapas</Badge>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
          <p className="text-sm font-semibold text-gray-950 dark:text-white">Rodadas rápidas</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">Decida sem perder o ritmo.</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
          <p className="text-sm font-semibold text-gray-950 dark:text-white">Placar acumulado</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">Cada desafio conta para o total.</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
          <p className="text-sm font-semibold text-gray-950 dark:text-white">Próxima etapa</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">O host revela no momento certo.</p>
        </div>
      </div>
    </ResultPanel>
  );
}
