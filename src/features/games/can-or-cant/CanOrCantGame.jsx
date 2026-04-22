import { canOrCantItems } from '../../../content/games/canOrCant.ts';
import Badge from '../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import GameIntro from '../shared/GameIntro.jsx';
import GameResult from '../shared/GameResult.jsx';
import { useSequentialGame } from '../shared/useSequentialGame.js';
import { evaluateCanOrCant } from './lib/evaluateCanOrCant.js';

const answerLabels = {
  can: 'Pode',
  cant: 'Não pode',
};

function optionClass(isSelected, isCorrect, isWrong) {
  if (isCorrect) {
    return 'border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100';
  }

  if (isWrong) {
    return 'border-red-400 bg-red-50 text-red-950 dark:border-red-600 dark:bg-red-950 dark:text-red-100';
  }

  if (isSelected) {
    return 'border-blue-400 bg-blue-50 text-blue-950 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-100';
  }

  return 'border-gray-200 bg-white text-gray-950 hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:border-blue-600 dark:hover:bg-blue-950';
}

export default function CanOrCantGame({ onBackToMenu }) {
  const game = useSequentialGame(canOrCantItems, {
    createInitialAnswer: () => null,
    evaluateAnswer: evaluateCanOrCant,
  });

  if (game.phase === 'intro') {
    return (
      <GameIntro
        eyebrow="Pode / Não Pode"
        title="Decida rápido se a atitude combina com o ambiente profissional."
        description="Classifique situações comuns de rotina, postura, comunicação e segurança. Cada resposta recebe uma explicação curta para fixar o conceito."
        roundsLabel={`${canOrCantItems.length} situações`}
        bullets={[
          'Escolha Pode ou Não pode.',
          'Veja o motivo logo depois da resposta.',
          'Use o resultado para revisar atitudes do dia a dia.',
        ]}
        onStart={game.start}
      />
    );
  }

  if (game.phase === 'result') {
    return (
      <GameResult
        title="Resultado do Pode / Não Pode"
        score={game.score}
        maxScore={canOrCantItems.length}
        summary="Seu resultado mostra o quanto você reconhece atitudes adequadas para o ambiente de trabalho."
        details={[
          { label: 'Situações', value: canOrCantItems.length },
          { label: 'Acertos', value: game.score },
          { label: 'Aproveitamento', value: `${Math.round((game.score / canOrCantItems.length) * 100)}%` },
        ]}
        onRestart={game.restart}
        onBackToMenu={onBackToMenu}
      />
    );
  }

  const currentItem = game.currentItem;
  const selectedAnswer = game.phase === 'reveal'
    ? game.history[game.history.length - 1]?.answer
    : game.draftAnswer;

  return (
    <div className="animate-fade-in">
      <ResultPanel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">{currentItem.topic}</Badge>
            <Badge tone="gray">Rodada {game.currentIndex + 1} de {game.totalRounds}</Badge>
          </div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {Math.round(((game.currentIndex + 1) / game.totalRounds) * 100)}% concluído
          </p>
        </div>

        <ProgressBar value={game.currentIndex + 1} max={game.totalRounds} className="mt-4 h-2" />

        <h2 className="mt-7 text-2xl font-bold text-gray-950 dark:text-white">{currentItem.title}</h2>
        <p className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-5 text-lg font-semibold leading-8 text-gray-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-100">
          {currentItem.situation}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {/** Immediate feedback keeps this game fast. */}
          {['can', 'cant'].map((answer) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = game.phase === 'reveal' && answer === currentItem.answer;
            const isWrong = game.phase === 'reveal' && isSelected && answer !== currentItem.answer;

            return (
              <button
                key={answer}
                type="button"
                onClick={() => game.submit(answer)}
                disabled={game.phase === 'reveal'}
                aria-pressed={isSelected}
                className={`rounded-lg border px-5 py-4 text-left text-base font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-zinc-900 ${optionClass(isSelected, isCorrect, isWrong)}`}
              >
                {answerLabels[answer]}
              </button>
            );
          })}
        </div>
      </ResultPanel>

      {game.phase === 'reveal' && (
        <FeedbackNotice tone={game.currentResult.isCorrect ? 'success' : 'danger'} className="mt-5">
          <p className="font-semibold">
            {game.currentResult.isCorrect
              ? 'Boa decisão.'
              : `Resposta esperada: ${answerLabels[game.currentResult.correctAnswer]}.`}
          </p>
          <p className="mt-1 text-sm">{game.currentResult.explanation}</p>
          <CtaButtonRow
            className="mt-4 justify-start"
            actions={[{ label: game.isLastRound ? 'Ver resultado' : 'Próxima situação', onClick: game.next, tone: 'blue' }]}
          />
        </FeedbackNotice>
      )}
    </div>
  );
}
