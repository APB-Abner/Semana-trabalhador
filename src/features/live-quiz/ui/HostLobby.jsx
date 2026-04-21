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
  game_intro: 'Preparando desafio',
  round_open: 'Rodada aberta',
  round_revealed: 'Resultado da rodada',
  between_games: 'Intervalo',
  finished: 'Finalizada',
};

function HostControlPanel({
  answeredCount,
  connectedCount,
  pin,
  primaryAction,
  statusLabel,
  totalPlayers,
}) {
  return (
    <ResultPanel
      tone="info"
      className="lg:sticky lg:top-24 lg:z-20"
    >
      <div className="grid gap-4 xl:grid-cols-[auto_1fr_auto] xl:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-200">PIN</p>
          <p className="font-display mt-1 text-4xl font-extrabold tracking-[0.18em] text-gray-950 dark:text-white sm:text-5xl">
            {pin}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-lg border border-blue-200 bg-white/80 p-3 dark:border-blue-900 dark:bg-zinc-950/60">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</p>
            <p className="mt-1 text-sm font-bold text-gray-950 dark:text-white">{statusLabel}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white/80 p-3 dark:border-blue-900 dark:bg-zinc-950/60">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Online</p>
            <p className="mt-1 text-sm font-bold text-gray-950 dark:text-white">{connectedCount}/{totalPlayers}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white/80 p-3 dark:border-blue-900 dark:bg-zinc-950/60">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Respostas</p>
            <p className="mt-1 text-sm font-bold text-gray-950 dark:text-white">{answeredCount}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white/80 p-3 dark:border-blue-900 dark:bg-zinc-950/60">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Controle</p>
            <p className="mt-1 text-sm font-bold text-gray-950 dark:text-white">Host</p>
          </div>
        </div>

        {primaryAction && (
          <CtaButtonRow
            className="justify-start xl:justify-end"
            actions={[primaryAction]}
          />
        )}
      </div>
    </ResultPanel>
  );
}

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
  const connectedPlayers = state.players.filter((player) => player.connected).length;
  const primaryAction = state.status === 'lobby'
    ? { label: 'Iniciar match', onClick: onStart, tone: 'green' }
    : state.status === 'round_revealed'
      ? { label: nextRoundLabel, onClick: onNextRound, tone: 'blue' }
      : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <section className="space-y-4">
        <HostControlPanel
          answeredCount={state.answeredCount}
          connectedCount={connectedPlayers}
          pin={state.pin}
          primaryAction={primaryAction}
          statusLabel={statusLabel}
          totalPlayers={state.players.length}
        />

        {error && <FeedbackNotice tone="danger">{error}</FeedbackNotice>}

        {state.status === 'lobby' && (
          <MatchLobby state={state} />
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
              <CompetitiveResultView entries={state.leaderboard} title="Placar da rodada" />
            )}
          </>
        )}

        {state.status === 'between_games' && (
          <BetweenGamesPanel state={state} host onContinue={onNextRound} />
        )}

        {state.status === 'finished' && (
          <FinalPodium entries={state.finalRanking} />
        )}
      </section>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <PresenceList players={state.players} />
      </aside>
    </div>
  );
}
