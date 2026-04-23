import { useEffect, useMemo, useState } from 'react';
import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../../../shared/ui/FeedbackNotice.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import { getRoundProgressLabel } from '../../live-match/lib/matchProgress.js';
import BetweenGamesPanel from '../../live-match/ui/BetweenGamesPanel.jsx';
import FinalPodium from '../../live-match/ui/FinalPodium.jsx';
import MatchGameShell from '../../live-match/ui/MatchGameShell.jsx';
import MatchLobby from '../../live-match/ui/MatchLobby.jsx';
import CanOrCantView from '../../live-match/ui/minigames/CanOrCantView.jsx';
import FindTheMistakeView from '../../live-match/ui/minigames/FindTheMistakeView.jsx';
import PriorityOrderView from '../../live-match/ui/minigames/PriorityOrderView.jsx';
import ProfessionalCommunicationView from '../../live-match/ui/minigames/ProfessionalCommunicationView.jsx';
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
  round_revealed: 'Resultado',
  between_games: 'Intervalo',
  finished: 'Finalizada',
};

const autoAdvanceDelays = {
  game_intro: 2800,
  round_revealed: 6500,
  between_games: 5200,
};

function getHistoryKey(state) {
  return [
    state.status,
    state.currentRound?.id ?? state.currentQuestionIndex,
    state.answeredCount,
    state.leaderboard.map((entry) => `${entry.playerId}:${entry.roundPoints}:${entry.score}`).join('|'),
  ].join(':');
}

function getNextRoundLabel(state) {
  const isLastQuestion = state.currentQuestionIndex + 1 >= state.totalQuestions;
  const isLastRoundInGame = state.currentGame
    ? state.currentGameRoundIndex + 1 >= state.currentGame.roundCount
    : false;

  if (state.status === 'game_intro' || state.status === 'between_games') {
    return state.currentGame ? `Iniciar ${state.currentGame.title}` : 'Liberar rodada';
  }

  if (isLastQuestion) {
    return 'Finalizar match';
  }

  return isLastRoundInGame ? 'Ver ranking parcial' : 'Próxima rodada';
}

function getStatusLabel(state) {
  if (state.status === 'lobby') {
    return statusLabels[state.status];
  }

  if (state.status === 'game_intro' || state.status === 'between_games') {
    return `${statusLabels[state.status] || state.status} ${Math.max(0, state.currentGameIndex) + 1}/${state.selectedGames.length}`;
  }

  return `${statusLabels[state.status] || state.status} · ${getRoundProgressLabel(state)}`;
}

function HostControlPanel({
  answeredCount,
  connectedCount,
  displayHref,
  pin,
  primaryAction,
  reviewMode = false,
  secondaryActions = [],
  statusLabel,
  totalPlayers,
}) {
  const actionLabel = primaryAction?.label ?? 'Acompanhar rodada';

  return (
    <ResultPanel tone="info" className="shrink-0 p-4">
      <div className="grid gap-3 xl:grid-cols-[auto_1fr_auto] xl:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-200">PIN</p>
          <p className="font-display mt-1 text-3xl font-extrabold tracking-[0.16em] text-gray-950 dark:text-white sm:text-4xl">
            {pin}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div className="rounded-lg border border-blue-200 bg-white/80 p-2.5 dark:border-blue-900 dark:bg-zinc-950/60">
            <p className="text-[0.68rem] font-semibold uppercase text-gray-500 dark:text-gray-400">Status</p>
            <p className="mt-1 text-sm font-bold text-gray-950 dark:text-white">{statusLabel}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white/80 p-2.5 dark:border-blue-900 dark:bg-zinc-950/60">
            <p className="text-[0.68rem] font-semibold uppercase text-gray-500 dark:text-gray-400">Online</p>
            <p className="mt-1 text-sm font-bold text-gray-950 dark:text-white">{connectedCount}/{totalPlayers}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white/80 p-2.5 dark:border-blue-900 dark:bg-zinc-950/60">
            <p className="text-[0.68rem] font-semibold uppercase text-gray-500 dark:text-gray-400">Respostas</p>
            <p className="mt-1 text-sm font-bold text-gray-950 dark:text-white">{answeredCount}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white/80 p-2.5 dark:border-blue-900 dark:bg-zinc-950/60">
            <p className="text-[0.68rem] font-semibold uppercase text-gray-500 dark:text-gray-400">Ação</p>
            <p className="mt-1 text-sm font-bold text-gray-950 dark:text-white">{actionLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          {primaryAction && (
            <CtaButtonRow className="justify-start xl:justify-end" actions={[primaryAction]} />
          )}
          {secondaryActions.length > 0 && (
            <CtaButtonRow className="justify-start xl:justify-end" actions={secondaryActions} />
          )}
          {displayHref && (
            <a
              href={displayHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus:ring-offset-zinc-900"
            >
              Abrir exibição
            </a>
          )}
        </div>
      </div>

      {reviewMode && (
        <FeedbackNotice tone="info" className="mt-3 text-sm">
          Visualizando um estado anterior. Isso não reabre respostas nem altera a partida atual.
        </FeedbackNotice>
      )}
    </ResultPanel>
  );
}

function RoundContent({ state, showAnswer = false }) {
  const commonProps = {
    startedAt: state.startedAt,
    closesAt: state.closesAt,
    serverNow: state.serverNow,
    disabled: true,
    showAnswer,
  };

  if (state.currentRound?.gameType === 'can_or_cant') {
    return <CanOrCantView {...commonProps} round={state.currentRound} />;
  }

  if (state.currentRound?.gameType === 'professional_communication') {
    return <ProfessionalCommunicationView {...commonProps} round={state.currentRound} />;
  }

  if (state.currentRound?.gameType === 'find_the_mistake') {
    return <FindTheMistakeView {...commonProps} round={state.currentRound} />;
  }

  if (state.currentRound?.gameType === 'work_situation') {
    return <WorkSituationView {...commonProps} round={state.currentRound} />;
  }

  if (state.currentRound?.gameType === 'priority_order') {
    return <PriorityOrderView {...commonProps} round={state.currentRound} />;
  }

  return (
    <LiveQuestionCard
      {...commonProps}
      question={state.currentQuestion}
    />
  );
}

export default function HostLobby({ state, displayHref, error, onStart, onNextRound }) {
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);
  const [reviewIndex, setReviewIndex] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!state) {
      return;
    }

    const key = getHistoryKey(state);

    setHistory((items) => {
      if (items[items.length - 1]?.key === key) {
        return items;
      }

      return [...items, { key, state }].slice(-18);
    });
  }, [state]);

  const isReviewing = reviewIndex !== null;
  const stateForView = isReviewing ? history[reviewIndex]?.state ?? state : state;

  useEffect(() => {
    if (
      !autoAdvanceEnabled ||
      isReviewing ||
      !state ||
      !(state.status in autoAdvanceDelays)
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onNextRound?.();
    }, autoAdvanceDelays[state.status]);

    return () => window.clearTimeout(timer);
  }, [autoAdvanceEnabled, isReviewing, onNextRound, state]);

  const secondaryActions = useMemo(() => {
    if (!state) {
      return [];
    }

    const actions = [
      {
        label: autoAdvanceEnabled ? 'Pausar auto' : 'Retomar auto',
        onClick: () => setAutoAdvanceEnabled((enabled) => !enabled),
        tone: 'gray',
      },
    ];

    if (history.length > 1) {
      actions.push({
        label: 'Rever anterior',
        onClick: () => setReviewIndex((index) => Math.max(0, (index ?? history.length - 1) - 1)),
        tone: 'gray',
        disabled: isReviewing && reviewIndex <= 0,
      });
    }

    return actions;
  }, [autoAdvanceEnabled, history.length, isReviewing, reviewIndex, state]);

  if (!stateForView) {
    return <WaitingScreen title="Conectando sala do host" />;
  }

  const connectedPlayers = stateForView.players.filter((player) => player.connected).length;
  const canAdvanceCurrentState = state.status in autoAdvanceDelays;
  const primaryAction = isReviewing
    ? { label: 'Voltar ao atual', onClick: () => setReviewIndex(null), tone: 'blue' }
    : state.status === 'lobby'
      ? { label: 'Iniciar match', onClick: onStart, tone: 'green' }
      : canAdvanceCurrentState
        ? { label: getNextRoundLabel(state), onClick: onNextRound, tone: 'blue' }
        : null;

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <section className="flex min-h-0 flex-col gap-3 overflow-hidden">
        <HostControlPanel
          answeredCount={stateForView.answeredCount}
          connectedCount={connectedPlayers}
          displayHref={displayHref}
          pin={stateForView.pin}
          primaryAction={primaryAction}
          reviewMode={isReviewing}
          secondaryActions={secondaryActions}
          statusLabel={getStatusLabel(stateForView)}
          totalPlayers={stateForView.players.length}
        />

        {error && <FeedbackNotice tone="danger">{error}</FeedbackNotice>}

        {stateForView.status === 'lobby' && <MatchLobby state={stateForView} />}

        {stateForView.status === 'game_intro' && (
          <MatchGameShell state={stateForView} host showAction={false} onStart={onNextRound} />
        )}

        {stateForView.status === 'round_open' && (
          <>
            <div className="min-h-0 overflow-hidden">
              <RoundContent state={stateForView} />
            </div>
            <ResultPanel className="shrink-0 p-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Respostas recebidas: {stateForView.answeredCount} de {connectedPlayers}
              </p>
            </ResultPanel>
          </>
        )}

        {stateForView.status === 'round_revealed' && (
          <div className="grid min-h-0 flex-1 gap-3 overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="min-h-0 overflow-y-auto pr-1">
              <RoundContent state={stateForView} showAnswer />
            </div>
            <div className="min-h-0 overflow-y-auto pr-1">
              {stateForView.aggregatedResult ? (
                <ParticipatoryResultView result={stateForView.aggregatedResult} />
              ) : (
                <CompetitiveResultView entries={stateForView.leaderboard} title="Placar da rodada" />
              )}
            </div>
          </div>
        )}

        {stateForView.status === 'between_games' && (
          <BetweenGamesPanel state={stateForView} host={!isReviewing} onContinue={onNextRound} />
        )}

        {stateForView.status === 'finished' && (
          <div className="min-h-0 overflow-y-auto pr-1">
            <FinalPodium entries={stateForView.finalRanking} />
          </div>
        )}
      </section>

      <aside className="min-h-0 overflow-hidden">
        <PresenceList players={stateForView.players} />
      </aside>
    </div>
  );
}
