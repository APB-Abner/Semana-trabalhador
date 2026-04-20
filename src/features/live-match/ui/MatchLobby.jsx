import Badge from '../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

const typeLabels = {
  quick_quiz: 'Quiz Relâmpago',
  work_situation: 'Situação Profissional',
  priority_order: 'Ordem de Prioridade',
};

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
            O servidor montou 3 blocos de jogo para esta sala. O placar é acumulado até o pódio final.
          </p>
        </div>
        <Badge tone="purple">{games.length} jogos</Badge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {games.map((game, index) => {
          const isCurrent = state.currentGame?.id === game.id;

          return (
            <div
              key={game.id}
              className={`rounded-lg border p-4 ${
                isCurrent
                  ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/50'
                  : 'border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <Badge tone={isCurrent ? 'blue' : 'gray'}>Jogo {index + 1}</Badge>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {game.roundCount} rodadas
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-950 dark:text-white">
                {typeLabels[game.type] ?? game.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{game.description}</p>
            </div>
          );
        })}
      </div>
    </ResultPanel>
  );
}

