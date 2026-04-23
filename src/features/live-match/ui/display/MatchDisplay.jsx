import Badge from '../../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';
import QRCode from 'react-qr-code';
import PigeonAvatar from '../../../pigeon-avatar/ui/PigeonAvatar';
import LiveQuestionCard from '../../../live-quiz/ui/LiveQuestionCard.jsx';
import CompetitiveResultView from '../../../live-quiz/ui/result-renderers/CompetitiveResultView.jsx';
import ParticipatoryResultView from '../../../live-quiz/ui/result-renderers/ParticipatoryResultView.jsx';
import FinalPodium from '../FinalPodium.jsx';
import CanOrCantView from '../minigames/CanOrCantView.jsx';
import FindTheMistakeView from '../minigames/FindTheMistakeView.jsx';
import PriorityOrderView from '../minigames/PriorityOrderView.jsx';
import ProfessionalCommunicationView from '../minigames/ProfessionalCommunicationView.jsx';
import WorkSituationView from '../minigames/WorkSituationView.jsx';

const statusLabels = {
  lobby: 'Lobby',
  game_intro: 'Próximo desafio',
  round_open: 'Rodada aberta',
  round_revealed: 'Resultado',
  between_games: 'Intervalo',
  finished: 'Pódio final',
};

const gameLabels = {
  quick_quiz: 'Quiz Relâmpago',
  work_situation: 'Situação Profissional',
  priority_order: 'Ordem de Prioridade',
  can_or_cant: 'Pode / Não Pode',
  professional_communication: 'Comunicação Profissional',
  find_the_mistake: 'Caça-erros',
};

const toneStyles = {
  blue: {
    bar: 'bg-blue-300',
    border: 'border-blue-300/30',
    eyebrow: 'text-blue-200',
    panel: 'border-blue-300/20 bg-blue-500/10',
    pill: 'border-blue-300/30 bg-blue-500/15 text-blue-100',
  },
  amber: {
    bar: 'bg-amber-300',
    border: 'border-amber-300/30',
    eyebrow: 'text-amber-200',
    panel: 'border-amber-300/20 bg-amber-500/10',
    pill: 'border-amber-300/30 bg-amber-500/15 text-amber-100',
  },
  purple: {
    bar: 'bg-violet-300',
    border: 'border-violet-300/30',
    eyebrow: 'text-violet-200',
    panel: 'border-violet-300/20 bg-violet-500/10',
    pill: 'border-violet-300/30 bg-violet-500/15 text-violet-100',
  },
  green: {
    bar: 'bg-emerald-300',
    border: 'border-emerald-300/30',
    eyebrow: 'text-emerald-200',
    panel: 'border-emerald-300/20 bg-emerald-500/10',
    pill: 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100',
  },
};

function connectedCount(players = []) {
  return players.filter((player) => player.connected).length;
}

function buildJoinUrl(pin) {
  const path = `/competicao/entrar?pin=${encodeURIComponent(pin)}`;

  if (typeof window === 'undefined') {
    return path;
  }

  return `${window.location.origin}${path}`;
}

function getDisplayTone(state) {
  if (state.status === 'finished' || state.status === 'round_revealed') {
    return 'amber';
  }

  if (state.status === 'between_games') {
    return 'green';
  }

  const gameType = state.currentRound?.gameType ?? state.currentGame?.type;

  if (gameType === 'work_situation') {
    return 'amber';
  }

  if (gameType === 'priority_order') {
    return 'purple';
  }

  if (gameType === 'can_or_cant') {
    return 'green';
  }

  if (gameType === 'professional_communication') {
    return 'purple';
  }

  if (gameType === 'find_the_mistake') {
    return 'amber';
  }

  return 'blue';
}

function getToneClasses(state) {
  return toneStyles[getDisplayTone(state)] ?? toneStyles.blue;
}

function DisplayStat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{label}</p>
      <p className="text-lg font-black text-white">{value}</p>
    </div>
  );
}

function DisplayHeader({ state }) {
  const gameStep = state.currentGame
    ? `${Math.max(0, state.currentGameIndex) + 1}/${state.selectedGames.length}`
    : `0/${state.selectedGames.length}`;
  const tone = getToneClasses(state);

  return (
    <header className="relative z-10 mx-auto flex w-full max-w-[92rem] shrink-0 flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
      <div className="flex flex-wrap items-center gap-4">
        <span className={`rounded-full border px-4 py-2 text-sm font-black uppercase tracking-[0.18em] ${tone.pill}`}>
          Ao vivo
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Competição Jovem Trabalhador</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {statusLabels[state.status] ?? state.status}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DisplayStat label="PIN" value={state.pin} />
        <DisplayStat label="Etapa" value={gameStep} />
        <DisplayStat label="Online" value={connectedCount(state.players)} />
      </div>
    </header>
  );
}

function DisplayStage({ children, stageKey, state, wide = false }) {
  const tone = getToneClasses(state);

  return (
    <section
      key={stageKey}
      className={`projector-stage relative z-10 mx-auto flex w-full min-h-0 flex-1 flex-col overflow-hidden ${wide ? 'max-w-[92rem]' : 'max-w-7xl'} px-6 pb-5 pt-2 animate-display-fade-up lg:px-10`}
    >
      <div className={`mb-4 h-1.5 w-40 shrink-0 rounded-full ${tone.bar}`} />
      {children}
    </section>
  );
}

function LobbyDisplay({ state }) {
  const players = state.players.slice(0, 18);
  const tone = getToneClasses(state);

  return (
    <DisplayStage stageKey="lobby" state={state} wide>
      <div className="grid min-h-[68svh] gap-8 lg:grid-cols-[1.05fr_0.75fr] lg:items-center">
        <div>
          <p className={`text-xl font-black uppercase tracking-[0.2em] ${tone.eyebrow}`}>Partida prestes a começar</p>
          <div className={`projector-panel mt-6 grid gap-8 overflow-hidden rounded-3xl border p-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center ${tone.border} ${tone.panel}`}>
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-300">PIN da sala</p>
              <p className="font-display mt-3 max-w-full whitespace-nowrap text-[4.5rem] font-black leading-none tracking-[0.06em] text-white sm:text-[5.25rem] lg:text-[5.75rem] xl:text-[6rem]">
                {state.pin}
              </p>
            </div>
            <div
              aria-label="QR Code de entrada"
              className="justify-self-start rounded-2xl border border-white/20 bg-white p-3 shadow-2xl lg:justify-self-end"
            >
              <QRCode
                value={buildJoinUrl(state.pin)}
                size={198}
                className="h-[198px] w-[198px]"
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>
          </div>
          <p className="mt-7 max-w-3xl text-3xl font-bold leading-tight text-slate-100">
            Entre com o PIN ou escaneie o QR Code.
          </p>
        </div>

        <ResultPanel className="projector-panel border-white/10 bg-white/10 p-6 dark:border-white/10 dark:bg-white/10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-white">Jogadores no lobby</h2>
            <Badge tone="blue">{state.players.length}</Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {players.length ? players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/65 px-3 py-3"
              >
                <PigeonAvatar avatar={player.avatar} size="sm" label={`Avatar de ${player.name}`} />
                <span className="min-w-0 truncate text-base font-bold text-white">{player.name}</span>
              </div>
            )) : (
              <p className="col-span-2 rounded-xl border border-dashed border-white/20 px-4 py-10 text-center text-lg font-semibold text-slate-300">
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
  const tone = getToneClasses(state);

  if (!game) {
    return null;
  }

  return (
    <DisplayStage stageKey={`intro-${game.id}`} state={state}>
      <div className="flex min-h-[68svh] items-center">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-4 py-2 text-sm font-black uppercase tracking-[0.18em] ${tone.pill}`}>
              Desafio {state.currentGameIndex + 1}
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200">
              {game.roundCount} rodadas
            </span>
          </div>
          <h2 className="mt-7 text-7xl font-black leading-none tracking-tight text-white sm:text-8xl">
            {game.title}
          </h2>
          <p className="mt-7 max-w-4xl text-3xl font-bold leading-tight text-slate-200">
            {game.description}
          </p>
        </div>
      </div>
    </DisplayStage>
  );
}

function RoundContent({ state, showAnswer = false }) {
  const isWorkSituationRound = state.currentRound?.gameType === 'work_situation';
  const isPriorityOrderRound = state.currentRound?.gameType === 'priority_order';
  const isCanOrCantRound = state.currentRound?.gameType === 'can_or_cant';
  const isProfessionalCommunicationRound = state.currentRound?.gameType === 'professional_communication';
  const isFindTheMistakeRound = state.currentRound?.gameType === 'find_the_mistake';

  if (isCanOrCantRound) {
    return (
      <CanOrCantView
        round={state.currentRound}
        startedAt={state.startedAt}
        closesAt={state.closesAt}
        serverNow={state.serverNow}
        disabled
        showAnswer={showAnswer}
      />
    );
  }

  if (isProfessionalCommunicationRound) {
    return (
      <ProfessionalCommunicationView
        round={state.currentRound}
        startedAt={state.startedAt}
        closesAt={state.closesAt}
        serverNow={state.serverNow}
        disabled
        showAnswer={showAnswer}
      />
    );
  }

  if (isFindTheMistakeRound) {
    return (
      <FindTheMistakeView
        round={state.currentRound}
        startedAt={state.startedAt}
        closesAt={state.closesAt}
        serverNow={state.serverNow}
        disabled
        showAnswer={showAnswer}
      />
    );
  }

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

function RoundMeta({ state, showAnswer }) {
  const tone = getToneClasses(state);
  const gameType = state.currentRound?.gameType ?? state.currentGame?.type;
  const roundLabel = state.currentGame
    ? `${state.currentGameRoundIndex + 1}/${state.currentGame.roundCount}`
    : `${state.currentQuestionIndex + 1}/${state.totalQuestions}`;

  return (
    <div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-4 py-2 text-sm font-black uppercase tracking-[0.18em] ${tone.pill}`}>
          {showAnswer ? 'Momento do resultado' : 'Todos respondendo'}
        </span>
        <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200">
          {gameLabels[gameType] ?? state.currentGame?.title ?? 'Rodada'}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <DisplayStat label="Rodada" value={roundLabel} />
        <DisplayStat label="Respostas" value={`${state.answeredCount}/${connectedCount(state.players)}`} />
      </div>
    </div>
  );
}

function RoundDisplay({ state, showAnswer = false }) {
  const stageKey = `${state.status}-${state.currentRound?.id ?? state.currentQuestionIndex}`;

  return (
    <DisplayStage stageKey={stageKey} state={state} wide>
      <RoundMeta state={state} showAnswer={showAnswer} />
      <div className={showAnswer ? 'grid min-h-0 flex-1 gap-5 overflow-hidden xl:grid-cols-[minmax(0,1fr)_27rem]' : 'min-h-0 flex-1 overflow-hidden'}>
        <div className="projector-round-shell min-h-0 overflow-hidden">
          <RoundContent state={state} showAnswer={showAnswer} />
        </div>

        {showAnswer && (
          <div className="projector-result-shell min-h-0 overflow-hidden">
            {state.aggregatedResult ? (
              <ParticipatoryResultView result={state.aggregatedResult} />
            ) : (
              <CompetitiveResultView entries={state.leaderboard} title="Placar da rodada" />
            )}
          </div>
        )}
      </div>
    </DisplayStage>
  );
}

function BetweenGamesDisplay({ state }) {
  const nextGame = state.currentGame;
  const topThree = state.leaderboard.slice(0, 3);
  const completedGames = Math.max(0, state.currentGameIndex);
  const progress = Math.min(100, Math.round((completedGames / Math.max(1, state.selectedGames.length)) * 100));
  const tone = getToneClasses(state);

  return (
    <DisplayStage stageKey={`between-${state.currentGameIndex}`} state={state} wide>
      <div className="grid min-h-[68svh] gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className={`text-xl font-black uppercase tracking-[0.2em] ${tone.eyebrow}`}>Placar parcial</p>
          <h2 className="mt-5 text-7xl font-black leading-none tracking-tight text-white sm:text-8xl">
            {nextGame ? 'Próxima etapa' : 'Reta final'}
          </h2>
          <p className="mt-6 max-w-4xl text-3xl font-bold leading-tight text-slate-200">
            {nextGame ? nextGame.title : 'O pódio final está quase pronto.'}
          </p>
          <div className="mt-10 max-w-xl">
            <div className="mb-3 flex justify-between text-sm font-bold uppercase tracking-wide text-slate-300">
              <span>Progresso do match</span>
              <span>{completedGames}/{state.selectedGames.length}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <ResultPanel className="projector-panel border-white/10 bg-white/10 p-6 dark:border-white/10 dark:bg-white/10">
          <h3 className="text-2xl font-black text-white">Top 3 agora</h3>
          <div className="mt-6 space-y-3">
            {topThree.length ? topThree.map((entry, index) => (
              <div
                key={entry.playerId}
                className={`grid grid-cols-[2.75rem_3.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-4 py-3 ${
                  index === 0
                    ? 'border-amber-300/50 bg-amber-300/15'
                    : 'border-white/10 bg-slate-950/65'
                }`}
              >
                <span className="text-2xl font-black text-blue-100">#{index + 1}</span>
                <PigeonAvatar avatar={entry.avatar} size={58} label={`Avatar de ${entry.name}`} />
                <div className="min-w-0">
                  <p className="truncate text-2xl font-black leading-tight text-white">{entry.name}</p>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-300">Top {index + 1}</p>
                </div>
                <Badge tone={index === 0 ? 'amber' : 'green'}>{entry.score}</Badge>
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-white/20 px-4 py-10 text-center text-lg font-semibold text-slate-300">
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
      <div className="projector-display dark flex h-screen items-center justify-center overflow-hidden px-6 text-white">
        <div className="relative z-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">Exibição</p>
          <h1 className="mt-3 text-5xl font-black">Conectando à sala</h1>
          {error && <p className="mt-4 text-red-200">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="projector-display dark flex h-screen max-h-screen flex-col overflow-hidden text-white">
      <DisplayHeader state={state} />

      {error && (
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
          <FeedbackNotice tone="danger">{error}</FeedbackNotice>
        </div>
      )}

      {state.status === 'lobby' && <LobbyDisplay state={state} />}
      {state.status === 'game_intro' && <GameIntroDisplay state={state} />}
      {state.status === 'round_open' && <RoundDisplay state={state} />}
      {state.status === 'round_revealed' && <RoundDisplay state={state} showAnswer />}
      {state.status === 'between_games' && <BetweenGamesDisplay state={state} />}
      {state.status === 'finished' && (
        <DisplayStage stageKey="finished" state={state} wide>
          <FinalPodium entries={state.finalRanking} variant="display" />
        </DisplayStage>
      )}
    </div>
  );
}
