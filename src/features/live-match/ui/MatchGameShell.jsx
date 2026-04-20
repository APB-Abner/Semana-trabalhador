import Badge from '../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import ProgressBar from '../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function MatchGameShell({ state, onStart, host = false }) {
  const game = state?.currentGame;
  const gameIndex = state?.currentGameIndex ?? -1;
  const totalGames = state?.selectedGames?.length ?? 0;

  if (!game) {
    return null;
  }

  return (
    <ResultPanel tone="info">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="blue">Jogo {gameIndex + 1}/{totalGames}</Badge>
        <Badge tone="purple">{game.title}</Badge>
      </div>
      <h2 className="mt-4 text-2xl font-extrabold text-gray-950 dark:text-white">{game.title}</h2>
      <p className="mt-2 text-gray-700 dark:text-gray-200">{game.description}</p>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm font-semibold text-gray-600 dark:text-gray-300">
          <span>Rodadas deste jogo</span>
          <span>{game.roundCount}</span>
        </div>
        <ProgressBar value={gameIndex + 1} max={Math.max(1, totalGames)} barClassName="bg-blue-500" />
      </div>

      {host ? (
        <CtaButtonRow
          className="mt-6 justify-start"
          actions={[{ label: `Iniciar ${game.title}`, onClick: onStart, tone: 'green' }]}
        />
      ) : (
        <p className="mt-5 text-sm font-semibold text-blue-700 dark:text-blue-200">
          Aguarde o host liberar a primeira rodada deste jogo.
        </p>
      )}
    </ResultPanel>
  );
}

