import { useNavigate, useParams } from 'react-router-dom';
import usePlayerRoom from '../features/live-quiz/model/usePlayerRoom';
import LeaderboardPanel from '../features/live-quiz/ui/LeaderboardPanel.jsx';
import LiveQuestionCard from '../features/live-quiz/ui/LiveQuestionCard.jsx';
import PlayerJoinForm from '../features/live-quiz/ui/PlayerJoinForm.jsx';
import PresenceList from '../features/live-quiz/ui/PresenceList.jsx';
import WaitingScreen from '../features/live-quiz/ui/WaitingScreen.jsx';
import Badge from '../shared/ui/Badge.jsx';
import FeedbackNotice from '../shared/ui/FeedbackNotice.jsx';

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
      <div className="mx-auto max-w-xl px-4 py-10 text-gray-900 dark:text-white">
        <h1 className="mb-6 text-center text-3xl font-black">Entrar na sala</h1>
        {error && <FeedbackNotice tone="danger" className="mb-4">{error}</FeedbackNotice>}
        <PlayerJoinForm initialPin={pin} onJoin={handleJoin} />
      </div>
    );
  }

  if (!connected && !state) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <WaitingScreen title="Reconectando à sala" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 text-gray-900 dark:text-white">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-300">Sala</p>
          <h1 className="text-3xl font-black">{pin}</h1>
        </div>
        {state && <Badge tone="blue">{state.status}</Badge>}
      </div>

      {error && <FeedbackNotice tone="danger" className="mb-4">{error}</FeedbackNotice>}

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
    </div>
  );
}
