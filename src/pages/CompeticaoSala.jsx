import { useNavigate, useParams } from 'react-router-dom';
import usePlayerRoom from '../features/live-quiz/model/usePlayerRoom';
import LeaderboardPanel from '../features/live-quiz/ui/LeaderboardPanel.jsx';
import LiveQuestionCard from '../features/live-quiz/ui/LiveQuestionCard.jsx';
import PlayerJoinForm from '../features/live-quiz/ui/PlayerJoinForm.jsx';
import PresenceList from '../features/live-quiz/ui/PresenceList.jsx';
import WaitingScreen from '../features/live-quiz/ui/WaitingScreen.jsx';
import Badge from '../shared/ui/Badge.jsx';
import FeedbackNotice from '../shared/ui/FeedbackNotice.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';

const statusLabels = {
  lobby: 'Lobby',
  question: 'Pergunta aberta',
  revealed: 'Rodada revelada',
  finished: 'Finalizada',
};

export default function CompeticaoSala() {
  const { pin = '' } = useParams();
  const navigate = useNavigate();
  const {
    connected,
    error,
    hasPlayerToken,
    joinRoom,
    state,
    submitAnswer,
    submittedAnswers,
  } = usePlayerRoom(pin);

  const currentQuestionId = state?.currentQuestion?.id;
  const selectedOptionId = currentQuestionId ? submittedAnswers[currentQuestionId] : undefined;
  const hasSubmitted = Boolean(selectedOptionId);

  const handleJoin = async ({ roomPin, name }) => {
    const response = await joinRoom({ roomPin, name });

    if (response?.ok) {
      navigate(`/competicao/sala/${response.pin}`);
    }
  };

  if (!hasPlayerToken && !state) {
    return (
      <PageShell size="narrow" className="text-gray-900 dark:text-white">
        <PageHeader
          eyebrow="Sala ao vivo"
          title="Entrar na sala"
          description="Informe seu nome para recuperar ou iniciar sua participação nesta sala."
          align="center"
        />
        {error && <FeedbackNotice tone="danger" className="mb-4">{error}</FeedbackNotice>}
        <PlayerJoinForm initialPin={pin} onJoin={handleJoin} />
      </PageShell>
    );
  }

  if (!connected && !state) {
    return (
      <PageShell size="narrow">
        <WaitingScreen title="Reconectando à sala" />
      </PageShell>
    );
  }

  return (
    <PageShell size="default" className="text-gray-900 dark:text-white">
      <PageHeader
        eyebrow="Sala"
        title={pin}
        description="Responda quando a pergunta abrir. O tempo e a pontuação seguem o relógio oficial do servidor."
        actions={state && <Badge tone="blue">{statusLabels[state.status] || state.status}</Badge>}
      />

      {error && <FeedbackNotice tone="danger" className="mb-4">{error}</FeedbackNotice>}

      {state && !state.hostConnected && state.status !== 'finished' && (
        <FeedbackNotice tone="info" className="mb-4">
          Host desconectado. Aguarde a reconexão para continuar.
        </FeedbackNotice>
      )}

      {!state && <WaitingScreen title="Carregando sala" />}

      {state?.status === 'lobby' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <WaitingScreen title="Aguardando o host iniciar">
            Você já está no lobby. A pergunta aparecerá automaticamente quando a partida começar.
          </WaitingScreen>
          <PresenceList players={state.players} />
        </div>
      )}

      {state?.status === 'question' && (
        <LiveQuestionCard
          question={state.currentQuestion}
          startedAt={state.startedAt}
          closesAt={state.closesAt}
          serverNow={state.serverNow}
          selectedOptionId={selectedOptionId}
          hasSubmitted={hasSubmitted}
          onSubmit={submitAnswer}
        />
      )}

      {state?.status === 'revealed' && (
        <div className="space-y-6">
          <LiveQuestionCard
            question={state.currentQuestion}
            startedAt={state.startedAt}
            closesAt={state.closesAt}
            serverNow={state.serverNow}
            selectedOptionId={selectedOptionId}
            hasSubmitted={hasSubmitted}
            showAnswer
          />
          <LeaderboardPanel entries={state.leaderboard} title="Leaderboard da rodada" />
          <WaitingScreen title="Aguardando próxima rodada" />
        </div>
      )}

      {state?.status === 'finished' && (
        <LeaderboardPanel entries={state.finalRanking} title="Ranking final" />
      )}
    </PageShell>
  );
}
