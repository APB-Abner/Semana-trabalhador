import { professionalCommunicationScenarios } from '../../../content/games/professionalCommunication.ts';
import Badge from '../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import GameIntro from '../shared/GameIntro.jsx';
import GameResult from '../shared/GameResult.jsx';
import { useSequentialGame } from '../shared/useSequentialGame.js';
import { evaluateProfessionalCommunication } from './lib/evaluateProfessionalCommunication.js';

const optionLetters = ['A', 'B', 'C', 'D'];

function optionClass({ isSelected, isBest, quality, reveal }) {
  if (reveal && isBest) {
    return 'border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100';
  }

  if (reveal && isSelected && quality === 'poor') {
    return 'border-red-400 bg-red-50 text-red-950 dark:border-red-600 dark:bg-red-950 dark:text-red-100';
  }

  if (reveal && isSelected && quality === 'ok') {
    return 'border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-100';
  }

  if (isSelected) {
    return 'border-blue-400 bg-blue-50 text-blue-950 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-100';
  }

  return 'border-gray-200 bg-white text-gray-950 hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:border-blue-600 dark:hover:bg-blue-950';
}

export default function ProfessionalCommunicationGame({ onBackToMenu }) {
  const game = useSequentialGame(professionalCommunicationScenarios, {
    createInitialAnswer: () => null,
    evaluateAnswer: evaluateProfessionalCommunication,
  });

  const maxScore = professionalCommunicationScenarios.length;
  const roundedScore = Math.round(game.score * 10) / 10;

  if (game.phase === 'intro') {
    return (
      <GameIntro
        eyebrow="Comunicação Profissional"
        title="Escolha a resposta com melhor tom, clareza e postura."
        description="Cada rodada traz uma situação de trabalho e três caminhos de comunicação. A melhor resposta resolve o problema sem criar ruído."
        roundsLabel={`${professionalCommunicationScenarios.length} cenários`}
        bullets={[
          'Leia o contexto antes de responder.',
          'Compare tom, clareza e próximo passo.',
          'Veja o feedback da sua escolha no reveal.',
        ]}
        onStart={game.start}
      />
    );
  }

  if (game.phase === 'result') {
    return (
      <GameResult
        title="Resultado de Comunicação Profissional"
        score={roundedScore}
        maxScore={maxScore}
        summary="A pontuação considera escolhas ideais e parcialmente adequadas. O foco é reconhecer mensagens claras, respeitosas e úteis."
        details={[
          { label: 'Cenários', value: professionalCommunicationScenarios.length },
          { label: 'Pontuação', value: roundedScore },
          { label: 'Aproveitamento', value: `${Math.round((game.score / maxScore) * 100)}%` },
        ]}
        onRestart={game.restart}
        onBackToMenu={onBackToMenu}
      />
    );
  }

  const scenario = game.currentItem;
  const selectedOptionId = game.phase === 'reveal'
    ? game.history[game.history.length - 1]?.answer
    : game.draftAnswer;

  return (
    <div className="animate-fade-in">
      <ResultPanel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="purple">{scenario.topic}</Badge>
            <Badge tone="gray">Rodada {game.currentIndex + 1} de {game.totalRounds}</Badge>
          </div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {Math.round(((game.currentIndex + 1) / game.totalRounds) * 100)}% concluído
          </p>
        </div>

        <ProgressBar value={game.currentIndex + 1} max={game.totalRounds} className="mt-4 h-2" barClassName="bg-violet-500" />

        <h2 className="mt-7 text-2xl font-bold text-gray-950 dark:text-white">{scenario.title}</h2>
        <p className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-5 text-base leading-7 text-gray-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-100">
          {scenario.scenario}
        </p>

        <div className="mt-6 grid gap-3">
          {scenario.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id;
            const isBest = scenario.bestOptionId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => game.submit(option.id)}
                disabled={game.phase === 'reveal'}
                aria-pressed={isSelected}
                className={`grid grid-cols-[2rem_1fr] items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-zinc-900 ${optionClass({ isSelected, isBest, quality: option.quality, reveal: game.phase === 'reveal' })}`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                  {optionLetters[index]}
                </span>
                <span>{option.text}</span>
              </button>
            );
          })}
        </div>
      </ResultPanel>

      {game.phase === 'reveal' && (
        <FeedbackNotice tone={game.currentResult.tone} className="mt-5">
          <p className="font-semibold">
            {game.currentResult.isCorrect ? 'Melhor resposta.' : `Melhor opção: ${game.currentResult.bestOption?.text}`}
          </p>
          <p className="mt-1 text-sm">{game.currentResult.feedback}</p>
          <p className="mt-2 text-sm font-semibold">{game.currentResult.learningPoint}</p>
          <CtaButtonRow
            className="mt-4 justify-start"
            actions={[{ label: game.isLastRound ? 'Ver resultado' : 'Próximo cenário', onClick: game.next, tone: 'blue' }]}
          />
        </FeedbackNotice>
      )}
    </div>
  );
}
