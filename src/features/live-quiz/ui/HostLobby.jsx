import Badge from '../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../../../shared/ui/FeedbackNotice.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import LeaderboardPanel from './LeaderboardPanel.jsx';
import LiveQuestionCard from './LiveQuestionCard.jsx';
import PresenceList from './PresenceList.jsx';
import WaitingScreen from './WaitingScreen.jsx';

export default function HostLobby({ state, error, onStart, onNextRound }) {
  if (!state) {
    return <WaitingScreen title="Conectando sala do host" />;
  }

  const isLastQuestion = state.currentQuestionIndex + 1 >= state.totalQuestions;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="space-y-4">
        <ResultPanel tone="info">
          <p className="text-sm uppercase tracking-wide text-blue-700 dark:text-blue-200">PIN da sala</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <p className="text-5xl font-black tracking-[0.2em] text-gray-900 dark:text-white">{state.pin}</p>
            <Badge tone="blue">
              {state.status === 'lobby' ? 'Lobby' : `${state.currentQuestionIndex + 1}/${state.totalQuestions}`}
            </Badge>
          </div>
        </ResultPanel>

        {error && <FeedbackNotice tone="danger">{error}</FeedbackNotice>}

        {state.status === 'lobby' && (
          <ResultPanel>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sala pronta</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Compartilhe o PIN com os jogadores. Quando todos estiverem no lobby, inicie a partida.
            </p>
            <CtaButtonRow
              className="mt-5 justify-start"
              actions={[{ label: 'Iniciar partida', onClick: onStart, tone: 'green' }]}
            />
          </ResultPanel>
        )}

        {state.status === 'question' && (
          <>
            <LiveQuestionCard
              question={state.currentQuestion}
              startedAt={state.startedAt}
              closesAt={state.closesAt}
              disabled
            />
            <ResultPanel>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Respostas recebidas: {state.answeredCount} de {state.players.filter((player) => player.connected).length}
              </p>
            </ResultPanel>
          </>
        )}

        {state.status === 'revealed' && (
          <>
            <LiveQuestionCard
              question={state.currentQuestion}
              startedAt={state.startedAt}
              closesAt={state.closesAt}
              disabled
              showAnswer
            />
            <LeaderboardPanel entries={state.leaderboard} title="Leaderboard da rodada" />
            <CtaButtonRow
              className="justify-start"
              actions={[{
                label: isLastQuestion ? 'Finalizar partida' : 'Próxima rodada',
                onClick: onNextRound,
                tone: 'blue',
              }]}
            />
          </>
        )}

        {state.status === 'finished' && (
          <LeaderboardPanel entries={state.finalRanking} title="Ranking final" />
        )}
      </section>

      <PresenceList players={state.players} />
    </div>
  );
}
