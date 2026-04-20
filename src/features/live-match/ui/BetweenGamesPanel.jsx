import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import CompetitiveResultView from '../../live-quiz/ui/result-renderers/CompetitiveResultView.jsx';

export default function BetweenGamesPanel({ state, host = false, onContinue }) {
  const nextGame = state?.currentGame;

  return (
    <div className="space-y-5">
      <ResultPanel tone="success">
        <p className="text-sm uppercase tracking-wide text-green-700 dark:text-green-200">Ranking parcial</p>
        <h2 className="mt-2 text-2xl font-extrabold text-gray-950 dark:text-white">
          {nextGame ? `Próximo jogo: ${nextGame.title}` : 'Preparando próximo jogo'}
        </h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
          O placar acumulado segue para o próximo bloco. Cada jogo adiciona pontos ao total do match.
        </p>
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
      <CompetitiveResultView entries={state?.leaderboard ?? []} title="Placar acumulado" />
    </div>
  );
}

