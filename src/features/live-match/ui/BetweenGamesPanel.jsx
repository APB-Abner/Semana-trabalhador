import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import CompetitiveResultView from '../../live-quiz/ui/result-renderers/CompetitiveResultView.jsx';

export default function BetweenGamesPanel({ state, host = false, onContinue }) {
  const nextGame = state?.currentGame;

  return (
    <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
      <ResultPanel tone="success" className="flex min-h-0 flex-col justify-center">
        <p className="text-sm uppercase tracking-wide text-green-700 dark:text-green-200">Ranking parcial</p>
        <h2 className="mt-2 text-2xl font-extrabold text-gray-950 dark:text-white">
          {nextGame ? `Próximo jogo: ${nextGame.title}` : 'Preparando próximo jogo'}
        </h2>
        {host ? (
          <CtaButtonRow
            className="mt-5 justify-start"
            actions={[{ label: 'Liberar próximo jogo', onClick: onContinue, tone: 'blue' }]}
          />
        ) : (
          <p className="mt-5 text-sm font-semibold text-green-700 dark:text-green-200">
            Aguarde o host liberar o próximo jogo.
          </p>
        )}
      </ResultPanel>
      <div className="min-h-0 overflow-hidden">
        <CompetitiveResultView entries={state?.leaderboard ?? []} title="Placar acumulado" showRoundDetails={false} />
      </div>
    </div>
  );
}
