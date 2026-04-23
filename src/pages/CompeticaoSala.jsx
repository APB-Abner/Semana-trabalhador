import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePlayerRoom from '../features/live-match/model/usePlayerMatch';
import BetweenGamesPanel from '../features/live-match/ui/BetweenGamesPanel.jsx';
import FinalPodium from '../features/live-match/ui/FinalPodium.jsx';
import MatchGameShell from '../features/live-match/ui/MatchGameShell.jsx';
import CanOrCantView from '../features/live-match/ui/minigames/CanOrCantView.jsx';
import FindTheMistakeView from '../features/live-match/ui/minigames/FindTheMistakeView.jsx';
import PriorityOrderView from '../features/live-match/ui/minigames/PriorityOrderView.jsx';
import ProfessionalCommunicationView from '../features/live-match/ui/minigames/ProfessionalCommunicationView.jsx';
import WorkSituationView from '../features/live-match/ui/minigames/WorkSituationView.jsx';
import LiveQuestionCard from '../features/live-quiz/ui/LiveQuestionCard.jsx';
import PlayerJoinForm from '../features/live-quiz/ui/PlayerJoinForm.jsx';
import PresenceList from '../features/live-quiz/ui/PresenceList.jsx';
import WaitingScreen from '../features/live-quiz/ui/WaitingScreen.jsx';
import CompetitiveResultView from '../features/live-quiz/ui/result-renderers/CompetitiveResultView.jsx';
import ParticipatoryResultView from '../features/live-quiz/ui/result-renderers/ParticipatoryResultView.jsx';
import Badge from '../shared/ui/Badge.jsx';
import FeedbackNotice from '../shared/ui/FeedbackNotice.jsx';
import PageHeader from '../shared/ui/PageHeader.jsx';
import PageShell from '../shared/ui/PageShell.jsx';

const statusLabels = {
  lobby: 'Lobby',
  game_intro: 'Preparando desafio',
  round_open: 'Rodada aberta',
  round_revealed: 'Resultado da rodada',
  between_games: 'Intervalo',
  finished: 'Finalizada',
};

function normalizePendingAnswer(answer) {
  if (!answer) {
    return null;
  }

  if (Array.isArray(answer)) {
    return { optionIds: answer };
  }

  if (typeof answer === 'string') {
    return { optionIds: [answer] };
  }

  if ('text' in answer) {
    return { optionIds: [], text: answer.text };
  }

  if ('value' in answer) {
    return { optionIds: [], value: answer.value };
  }

  return null;
}

function pendingAnswerToInput(answer) {
  if (!answer) {
    return null;
  }

  if (answer.text !== undefined) {
    return { text: answer.text };
  }

  if (answer.value !== undefined) {
    return { value: answer.value };
  }

  return answer.optionIds;
}

function hasPendingContent(answer) {
  return Boolean(
    answer?.optionIds?.length ||
    (typeof answer?.text === 'string' && answer.text.trim()) ||
    answer?.value !== undefined,
  );
}

export default function CompeticaoSala() {
  const { pin = '' } = useParams();
  const navigate = useNavigate();
  const [pendingAnswers, setPendingAnswers] = useState({});
  const submittingRoundRef = useRef(null);
  const {
    connected,
    error,
    hasPlayerToken,
    joinRoom,
    optionOrderSeed,
    state,
    submitAnswer,
    submittedAnswers,
  } = usePlayerRoom(pin);

  const currentRound = state?.currentRound;
  const currentRoundId = currentRound?.id ?? state?.currentQuestion?.id;
  const submittedAnswer = currentRoundId ? submittedAnswers[currentRoundId] : null;
  const pendingAnswer = currentRoundId ? pendingAnswers[currentRoundId] : null;
  const visibleAnswer = submittedAnswer ?? pendingAnswer;
  const selectedOptionIds = visibleAnswer?.optionIds ?? [];
  const selectedText = visibleAnswer?.text ?? '';
  const selectedValue = visibleAnswer?.value;
  const hasSubmitted = Boolean(submittedAnswer);

  const handleJoin = async ({ roomPin, name, avatar }) => {
    const response = await joinRoom({ roomPin, name, avatar });

    if (response?.ok) {
      navigate(`/competicao/sala/${response.pin}`);
    }
  };

  const updatePendingAnswer = useCallback((answer) => {
    if (!currentRoundId || hasSubmitted) {
      return;
    }

    setPendingAnswers((answers) => ({
      ...answers,
      [currentRoundId]: normalizePendingAnswer(answer),
    }));
  }, [currentRoundId, hasSubmitted]);

  const confirmAnswer = useCallback(async (answer) => {
    if (!currentRoundId || submittingRoundRef.current === currentRoundId) {
      return null;
    }

    const normalizedAnswer = normalizePendingAnswer(answer) ?? pendingAnswer;

    if (!hasPendingContent(normalizedAnswer)) {
      return null;
    }

    submittingRoundRef.current = currentRoundId;

    try {
      const response = await submitAnswer(pendingAnswerToInput(normalizedAnswer));

      if (response?.ok) {
        setPendingAnswers((answers) => {
          const nextAnswers = { ...answers };
          delete nextAnswers[currentRoundId];
          return nextAnswers;
        });
      }

      return response;
    } finally {
      submittingRoundRef.current = null;
    }
  }, [currentRoundId, pendingAnswer, submitAnswer]);

  useEffect(() => {
    if (
      state?.status !== 'round_open' ||
      !state.closesAt ||
      hasSubmitted ||
      !hasPendingContent(pendingAnswer)
    ) {
      return undefined;
    }

    const serverOffset = Number.isFinite(state.serverNow) ? state.serverNow - Date.now() : 0;
    const correctedNow = Date.now() + serverOffset;
    const delayMs = Math.max(0, state.closesAt - correctedNow - 450);
    const timer = window.setTimeout(() => {
      confirmAnswer();
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [confirmAnswer, hasSubmitted, pendingAnswer, state?.closesAt, state?.serverNow, state?.status]);

  if (!hasPlayerToken && !state) {
    return (
      <PageShell size="narrow" className="competition-page flex h-full flex-col justify-center overflow-hidden text-gray-900 dark:text-white">
        <PageHeader
          eyebrow="Sala ao vivo"
          title="Entrar na sala"
          description="Informe seu nome para entrar na partida."
          align="center"
        />
        {error && <FeedbackNotice tone="danger" className="mb-4">{error}</FeedbackNotice>}
        <PlayerJoinForm initialPin={pin} onJoin={handleJoin} />
      </PageShell>
    );
  }

  if (!connected && !state) {
    return (
      <PageShell size="narrow" className="competition-page flex h-full flex-col justify-center overflow-hidden">
        <WaitingScreen title="Reconectando à sala" />
      </PageShell>
    );
  }

  return (
    <PageShell size="full" className="competition-page flex h-full flex-col overflow-hidden text-gray-900 dark:text-white">
      <header className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="blue">Sala</Badge>
          <h1 className="font-display mt-2 text-2xl font-bold leading-tight text-gray-950 dark:text-white sm:text-3xl">
            {pin}
          </h1>
        </div>
        {state && <Badge tone="blue">{statusLabels[state.status] || state.status}</Badge>}
      </header>

      {error && <FeedbackNotice tone="danger" className="mb-3 shrink-0">{error}</FeedbackNotice>}

      {state && !state.hostConnected && state.status !== 'finished' && (
        <FeedbackNotice tone="info" className="mb-3 shrink-0">
          Host desconectado. A partida continua quando ele voltar.
        </FeedbackNotice>
      )}

      <section className="competition-main min-h-0 flex-1 overflow-hidden">
        {!state && <WaitingScreen title="Carregando sala" />}

        {state?.status === 'lobby' && (
          <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[1fr_20rem]">
            <WaitingScreen title="Aguardando o host iniciar">
              Você já está no lobby. A primeira rodada aparece quando a partida começar.
            </WaitingScreen>
            <PresenceList players={state.players} />
          </div>
        )}

        {state?.status === 'game_intro' && (
          <MatchGameShell state={state} />
        )}

        {state?.status === 'round_open' && (
          state.currentRound?.gameType === 'can_or_cant' ? (
            <CanOrCantView
              round={state.currentRound}
              startedAt={state.startedAt}
              closesAt={state.closesAt}
              serverNow={state.serverNow}
              selectedOptionIds={selectedOptionIds}
              hasSubmitted={hasSubmitted}
              onSubmit={confirmAnswer}
            />
          ) : state.currentRound?.gameType === 'professional_communication' ? (
            <ProfessionalCommunicationView
              round={state.currentRound}
              startedAt={state.startedAt}
              closesAt={state.closesAt}
              serverNow={state.serverNow}
              optionOrderSeed={optionOrderSeed}
              selectedOptionIds={selectedOptionIds}
              hasSubmitted={hasSubmitted}
              onSubmit={confirmAnswer}
            />
          ) : state.currentRound?.gameType === 'find_the_mistake' ? (
            <FindTheMistakeView
              round={state.currentRound}
              startedAt={state.startedAt}
              closesAt={state.closesAt}
              serverNow={state.serverNow}
              selectedOptionIds={selectedOptionIds}
              hasSubmitted={hasSubmitted}
              onChange={updatePendingAnswer}
              onSubmit={confirmAnswer}
            />
          ) : state.currentRound?.gameType === 'work_situation' ? (
            <WorkSituationView
              round={state.currentRound}
              startedAt={state.startedAt}
              closesAt={state.closesAt}
              serverNow={state.serverNow}
              optionOrderSeed={optionOrderSeed}
              selectedOptionIds={selectedOptionIds}
              hasSubmitted={hasSubmitted}
              onSubmit={confirmAnswer}
            />
          ) : state.currentRound?.gameType === 'priority_order' ? (
            <PriorityOrderView
              round={state.currentRound}
              startedAt={state.startedAt}
              closesAt={state.closesAt}
              serverNow={state.serverNow}
              selectedOptionIds={selectedOptionIds}
              hasSubmitted={hasSubmitted}
              onChange={updatePendingAnswer}
              onSubmit={confirmAnswer}
            />
          ) : (
            <LiveQuestionCard
              question={state.currentQuestion}
              startedAt={state.startedAt}
              closesAt={state.closesAt}
              serverNow={state.serverNow}
              optionOrderSeed={optionOrderSeed}
              selectedOptionIds={selectedOptionIds}
              selectedText={selectedText}
              selectedValue={selectedValue}
              hasSubmitted={hasSubmitted}
              onChange={updatePendingAnswer}
              onSubmit={confirmAnswer}
            />
          )
        )}

        {state?.status === 'round_revealed' && (
          <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="min-h-0">
              {state.currentRound?.gameType === 'can_or_cant' ? (
                <CanOrCantView
                  round={state.currentRound}
                  startedAt={state.startedAt}
                  closesAt={state.closesAt}
                  serverNow={state.serverNow}
                  selectedOptionIds={selectedOptionIds}
                  hasSubmitted={hasSubmitted}
                  showAnswer
                />
              ) : state.currentRound?.gameType === 'professional_communication' ? (
                <ProfessionalCommunicationView
                  round={state.currentRound}
                  startedAt={state.startedAt}
                  closesAt={state.closesAt}
                  serverNow={state.serverNow}
                  optionOrderSeed={optionOrderSeed}
                  selectedOptionIds={selectedOptionIds}
                  hasSubmitted={hasSubmitted}
                  showAnswer
                />
              ) : state.currentRound?.gameType === 'find_the_mistake' ? (
                <FindTheMistakeView
                  round={state.currentRound}
                  startedAt={state.startedAt}
                  closesAt={state.closesAt}
                  serverNow={state.serverNow}
                  selectedOptionIds={selectedOptionIds}
                  hasSubmitted={hasSubmitted}
                  showAnswer
                />
              ) : state.currentRound?.gameType === 'work_situation' ? (
                <WorkSituationView
                  round={state.currentRound}
                  startedAt={state.startedAt}
                  closesAt={state.closesAt}
                  serverNow={state.serverNow}
                  optionOrderSeed={optionOrderSeed}
                  selectedOptionIds={selectedOptionIds}
                  hasSubmitted={hasSubmitted}
                  showAnswer
                />
              ) : state.currentRound?.gameType === 'priority_order' ? (
                <PriorityOrderView
                  round={state.currentRound}
                  startedAt={state.startedAt}
                  closesAt={state.closesAt}
                  serverNow={state.serverNow}
                  selectedOptionIds={selectedOptionIds}
                  hasSubmitted={hasSubmitted}
                  showAnswer
                />
              ) : (
                <LiveQuestionCard
                  question={state.currentQuestion}
                  startedAt={state.startedAt}
                  closesAt={state.closesAt}
                  serverNow={state.serverNow}
                  optionOrderSeed={optionOrderSeed}
                  selectedOptionIds={selectedOptionIds}
                  selectedText={selectedText}
                  selectedValue={selectedValue}
                  hasSubmitted={hasSubmitted}
                  showAnswer
                />
              )}
            </div>
            {state.aggregatedResult ? (
              <ParticipatoryResultView result={state.aggregatedResult} />
            ) : (
              <CompetitiveResultView entries={state.leaderboard} title="Placar da rodada" showRoundDetails={false} />
            )}
          </div>
        )}

        {state?.status === 'between_games' && (
          <BetweenGamesPanel state={state} />
        )}

        {state?.status === 'finished' && (
          <FinalPodium entries={state.finalRanking} compact />
        )}
      </section>
    </PageShell>
  );
}
