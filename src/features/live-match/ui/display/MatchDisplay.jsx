import Badge from '../../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';
import PigeonAvatar from '../../../pigeon-avatar/ui/PigeonAvatar';
import LiveQuestionCard from '../../../live-quiz/ui/LiveQuestionCard.jsx';
import CompetitiveResultView from '../../../live-quiz/ui/result-renderers/CompetitiveResultView.jsx';
import ParticipatoryResultView from '../../../live-quiz/ui/result-renderers/ParticipatoryResultView.jsx';
import FinalPodium from '../FinalPodium.jsx';
import PriorityOrderView from '../minigames/PriorityOrderView.jsx';
import WorkSituationView from '../minigames/WorkSituationView.jsx';

const statusLabels = {
  lobby: 'Lobby',
  game_intro: 'Próximo desafio',
  round_open: 'Rodada aberta',
  round_revealed: 'Resultado',
  between_games: 'Intervalo',
  finished: 'Pódio final',
};

function connectedCount(players = []) {
  return players.filter((player) => player.connected).length;
}

function DisplayHeader({ state }) {
  const gameStep = state.currentGame
    ? `${Math.max(0, state.currentGameIndex) + 1}/${state.selectedGames.length}`
    : `0/${state.selectedGames.length}`;

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Competição Jovem Trabalhador</p>
        <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
          {statusLabels[state.status] ?? state.status}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">PIN</p>
          <p className="font-display text-3xl font-extrabold tracking-[0.18em] text-white">{state.pin}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Etapa</p>
          <p className="text-lg font-bold text-white">{gameStep}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Online</p>
          <p className="text-lg font-bold text-white">{connectedCount(state.players)}</p>
        </div>
      </div>
    </header>
  );
}

function DisplayStage({ children, stageKey }) {
  return (
    <section
      key={stageKey}
      className="mx-auto w-full max-w-6xl px-6 pb-10 pt-4 animate-display-fade-up lg:px-10"
    >
      {children}
    </section>
  );
}

function LobbyDisplay({ state }) {
  const players = state.players.slice(0, 16);

  return (
    <DisplayStage stageKey="lobby">
      <div className="grid min-h-[66svh] gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
        <div>
          <p className="text-lg font-semibold uppercase tracking-wide text-blue-200">Entre na sala</p>
          <p className="font-display mt-5 text-8xl font-black tracking-[0.18em] text-white sm:text-9xl">
            {state.pin}
          </p>
          <p className="mt-6 max-w-2xl text-2xl font-semibold leading-snug text-slate-200">
            Use o PIN no celular ou computador. A partida começa quando o host liberar.
          </p>
        </div>

        <ResultPanel className="border-white/10 bg-white/10 dark:border-white/10 dark:bg-white/10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Jogadores no lobby</h2>
            <Badge tone="blue">{state.players.length}</Badge>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {players.length ? players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2"
              >
                <PigeonAvatar avatar={player.avatar} size="sm" label={`Avatar de ${player.name}`} />
                <span className="min-w-0 truncate text-sm font-semibold text-white">{player.name}</span>
              </div>
            )) : (
              <p className="col-span-2 rounded-lg border border-dashed border-white/20 px-4 py-8 text-center text-slate-300">
                Aguardando participantes.
              </p>
            )}
          </div>
        </ResultPanel>
      </div>
    </DisplayStage>
  );
}

function GameIntroDisplay({ state }) {
  const game = state.currentGame;

  if (!game) {
    return null;
  }

  return (
    <DisplayStage stageKey={`intro-${game.id}`}>
      <div className="flex min-h-[66svh] items-center">
        <div className="max-w-4xl">
          <Badge tone="blue">Jogo {state.currentGameIndex + 1}/{state.selectedGames.length}</Badge>
          <h2 className="mt-5 text-6xl font-black tracking-tight text-white sm:text-7xl">{game.title}</h2>
          <p className="mt-6 max-w-3xl text-2xl font-semibold leading-snug text-slate-200">
            {game.description}
          </p>
          <p className="mt-8 text-lg font-semibold text-blue-200">
            Prepare-se para {game.roundCount} rodadas.
          </p>
        </div>
      </div>
    </DisplayStage>
  );
}

function RoundContent({ state, showAnswer = false }) {
  const isWorkSituationRound = state.currentRound?.gameType === 'work_situation';
  const isPriorityOrderRound = state.currentRound?.gameType === 'priority_order';

  if (isWorkSituationRound) {
    return (
      <WorkSituationView
        round={state.currentRound}
        startedAt={state.startedAt}
        closesAt={state.closesAt}
        serverNow={state.serverNow}
        disabled
        showAnswer={showAnswer}
      />
    );
  }

  if (isPriorityOrderRound) {
    return (
      <PriorityOrderView
        round={state.currentRound}
        startedAt={state.startedAt}
        closesAt={state.closesAt}
        serverNow={state.serverNow}
        disabled
        presentationMode
        showAnswer={showAnswer}
      />
    );
  }

  return (
    <LiveQuestionCard
      question={state.currentQuestion}
      startedAt={state.startedAt}
      closesAt={state.closesAt}
      serverNow={state.serverNow}
      disabled
      showAnswer={showAnswer}
    />
  );
}

function RoundDisplay({ state, showAnswer = false }) {
  const stageKey = `${state.status}-${state.currentRound?.id ?? state.currentQuestionIndex}`;

  return (
    <DisplayStage stageKey={stageKey}>
      <div className="space-y-6">
        <RoundContent state={state} showAnswer={showAnswer} />

        {showAnswer && (
          state.aggregatedResult ? (
            <ParticipatoryResultView result={state.aggregatedResult} />
          ) : (
            <CompetitiveResultView entries={state.leaderboard} title="Placar da rodada" />
          )
        )}
      </div>
    </DisplayStage>
  );
}

function BetweenGamesDisplay({ state }) {
  const nextGame = state.currentGame;
  const topThree = state.leaderboard.slice(0, 3);

  return (
    <DisplayStage stageKey={`between-${state.currentGameIndex}`}>
      <div className="grid min-h-[66svh] gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="text-lg font-semibold uppercase tracking-wide text-green-200">Ranking parcial</p>
          <h2 className="mt-4 text-6xl font-black tracking-tight text-white sm:text-7xl">
            {nextGame ? 'Próxima etapa' : 'Reta final'}
          </h2>
          <p className="mt-6 max-w-3xl text-2xl font-semibold leading-snug text-slate-200">
            {nextGame ? nextGame.title : 'O pódio final está quase pronto.'}
          </p>
        </div>

        <ResultPanel className="border-white/10 bg-white/10 dark:border-white/10 dark:bg-white/10">
          <h3 className="text-xl font-bold text-white">Top 3 até agora</h3>
          <div className="mt-5 space-y-3">
            {topThree.length ? topThree.map((entry, index) => (
              <div
                key={entry.playerId}
                className="grid grid-cols-[2rem_3rem_1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3"
              >
                <span className="text-xl font-black text-blue-200">#{index + 1}</span>
                <PigeonAvatar avatar={entry.avatar} size="md" label={`Avatar de ${entry.name}`} />
                <p className="min-w-0 truncate text-lg font-bold text-white">{entry.name}</p>
                <Badge tone={index === 0 ? 'amber' : 'green'}>{entry.score}</Badge>
              </div>
            )) : (
              <p className="rounded-lg border border-dashed border-white/20 px-4 py-8 text-center text-slate-300">
                O placar aparece depois da primeira rodada.
              </p>
            )}
          </div>
        </ResultPanel>
      </div>
    </DisplayStage>
  );
}

export default function MatchDisplay({ state, error }) {
  if (!state) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Exibição</p>
          <h1 className="mt-3 text-4xl font-black">Conectando à sala</h1>
          {error && <p className="mt-4 text-red-200">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen overflow-hidden bg-slate-950 text-white">
      <DisplayHeader state={state} />

      {error && (
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <FeedbackNotice tone="danger">{error}</FeedbackNotice>
        </div>
      )}

      {state.status === 'lobby' && <LobbyDisplay state={state} />}
      {state.status === 'game_intro' && <GameIntroDisplay state={state} />}
      {state.status === 'round_open' && <RoundDisplay state={state} />}
      {state.status === 'round_revealed' && <RoundDisplay state={state} showAnswer />}
      {state.status === 'between_games' && <BetweenGamesDisplay state={state} />}
      {state.status === 'finished' && (
        <DisplayStage stageKey="finished">
          <FinalPodium entries={state.finalRanking} variant="display" />
        </DisplayStage>
      )}
    </div>
  );
}
