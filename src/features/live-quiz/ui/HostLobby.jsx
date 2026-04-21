import Badge from '../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../../../shared/ui/FeedbackNotice.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import BetweenGamesPanel from '../../live-match/ui/BetweenGamesPanel.jsx';
import FinalPodium from '../../live-match/ui/FinalPodium.jsx';
import MatchGameShell from '../../live-match/ui/MatchGameShell.jsx';
import MatchLobby from '../../live-match/ui/MatchLobby.jsx';
import PriorityOrderView from '../../live-match/ui/minigames/PriorityOrderView.jsx';
import WorkSituationView from '../../live-match/ui/minigames/WorkSituationView.jsx';
import LiveQuestionCard from './LiveQuestionCard.jsx';
import PresenceList from './PresenceList.jsx';
import WaitingScreen from './WaitingScreen.jsx';
import CompetitiveResultView from './result-renderers/CompetitiveResultView.jsx';
import ParticipatoryResultView from './result-renderers/ParticipatoryResultView.jsx';

const statusLabels = {
  lobby: 'Lobby',
  game_intro: 'Intro do jogo',
  round_open: 'Rodada aberta',
  round_revealed: 'Rodada revelada',
  between_games: 'Entre jogos',
  finished: 'Finalizada',
};

export default function HostLobby({ state, error, onStart, onNextRound }) {
  if (!state) {
    return <WaitingScreen title="Conectando sala do host" />;
  }

  const isLastQuestion = state.currentQuestionIndex + 1 >= state.totalQuestions;
  const isLastRoundInGame = state.currentGame
    ? state.currentGameRoundIndex + 1 >= state.currentGame.roundCount
    : false;
  const nextRoundLabel = isLastQuestion
    ? 'Finalizar match'
    : isLastRoundInGame
      ? 'Ver ranking parcial'
      : 'Próxima rodada';
  const statusLabel = state.status === 'lobby'
    ? statusLabels[state.status]
    : state.status === 'game_intro' || state.status === 'between_games'
      ? `${statusLabels[state.status] || state.status} ${Math.max(0, state.currentGameIndex) + 1}/${state.selectedGames.length}`
      : `${statusLabels[state.status] || state.status} ${state.currentQuestionIndex + 1}/${state.totalQuestions}`;
  const isWorkSituationRound = state.currentRound?.gameType === 'work_situation';
  const isPriorityOrderRound = state.currentRound?.gameType === 'priority_order';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="space-y-4">
        <ResultPanel tone="info">
          <p className="text-sm uppercase tracking-wide text-blue-700 dark:text-blue-200">PIN da sala</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <p className="font-display text-5xl font-extrabold tracking-[0.2em] text-gray-950 dark:text-white">{state.pin}</p>
            <Badge tone="blue">{statusLabel}</Badge>
          </div>
        </ResultPanel>

        {error && <FeedbackNotice tone="danger">{error}</FeedbackNotice>}

        {state.status === 'lobby' && (
          <>
            <MatchLobby state={state} />
            <ResultPanel>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">Sala pronta</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Compartilhe o PIN com os jogadores. Quando todos estiverem no lobby, inicie o match.
              </p>
              <CtaButtonRow
                className="mt-5 justify-start"
                actions={[{ label: 'Iniciar match', onClick: onStart, tone: 'green' }]}
              />
            </ResultPanel>
          </>
        )}

        {state.status === 'game_intro' && (
          <MatchGameShell state={state} host onStart={onNextRound} />
        )}

        {state.status === 'round_open' && (
          <>
            {isWorkSituationRound ? (
              <WorkSituationView
                round={state.currentRound}
                startedAt={state.startedAt}
                closesAt={state.closesAt}
                serverNow={state.serverNow}
                disabled
              />
            ) : isPriorityOrderRound ? (
              <PriorityOrderView
                round={state.currentRound}
                startedAt={state.startedAt}
                closesAt={state.closesAt}
                serverNow={state.serverNow}
                disabled
              />
            ) : (
              <LiveQuestionCard
                question={state.currentQuestion}
                startedAt={state.startedAt}
                closesAt={state.closesAt}
                serverNow={state.serverNow}
                disabled
              />
            )}
            <ResultPanel>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Respostas recebidas: {state.answeredCount} de {state.players.filter((player) => player.connected).length}
              </p>
            </ResultPanel>
          </>
        )}

        {state.status === 'round_revealed' && (
          <>
            {isWorkSituationRound ? (
              <WorkSituationView
                round={state.currentRound}
                startedAt={state.startedAt}
                closesAt={state.closesAt}
                serverNow={state.serverNow}
                disabled
                showAnswer
              />
            ) : isPriorityOrderRound ? (
              <PriorityOrderView
                round={state.currentRound}
                startedAt={state.startedAt}
                closesAt={state.closesAt}
                serverNow={state.serverNow}
                disabled
                showAnswer
              />
            ) : (
              <LiveQuestionCard
                question={state.currentQuestion}
                startedAt={state.startedAt}
                closesAt={state.closesAt}
                serverNow={state.serverNow}
                disabled
                showAnswer
              />
            )}
            {state.aggregatedResult ? (
              <ParticipatoryResultView result={state.aggregatedResult} />
            ) : (
              <CompetitiveResultView entries={state.leaderboard} title="Leaderboard da rodada" />
            )}
            <CtaButtonRow
              className="justify-start"
              actions={[{
                label: nextRoundLabel,
                onClick: onNextRound,
                tone: 'blue',
              }]}
            />
          </>
        )}

        {state.status === 'between_games' && (
          <BetweenGamesPanel state={state} host onContinue={onNextRound} />
        )}

        {state.status === 'finished' && (
          <FinalPodium entries={state.finalRanking} />
        )}
      </section>

      <PresenceList players={state.players} />
    </div>
  );
}
