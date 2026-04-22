import { findTheMistakeCases } from '../../../content/games/findTheMistake.ts';
import Badge from '../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import GameIntro from '../shared/GameIntro.jsx';
import GameResult from '../shared/GameResult.jsx';
import { useSequentialGame } from '../shared/useSequentialGame.js';
import { evaluateFindTheMistake } from './lib/evaluateFindTheMistake.js';

function toggleId(selectedIds, id) {
  return selectedIds.includes(id)
    ? selectedIds.filter((selectedId) => selectedId !== id)
    : [...selectedIds, id];
}

function optionClass({ option, selected, reveal }) {
  if (reveal && option.isMistake && selected) {
    return 'border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100';
  }

  if (reveal && option.isMistake && !selected) {
    return 'border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-100';
  }

  if (reveal && !option.isMistake && selected) {
    return 'border-red-400 bg-red-50 text-red-950 dark:border-red-600 dark:bg-red-950 dark:text-red-100';
  }

  if (selected) {
    return 'border-blue-400 bg-blue-50 text-blue-950 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-100';
  }

  return 'border-gray-200 bg-white text-gray-950 hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:border-blue-600 dark:hover:bg-blue-950';
}

function RevealList({ title, items, emptyText, tone = 'info' }) {
  const toneClass = {
    success: 'text-emerald-700 dark:text-emerald-300',
    danger: 'text-red-700 dark:text-red-300',
    info: 'text-blue-700 dark:text-blue-300',
    amber: 'text-amber-700 dark:text-amber-300',
  }[tone];

  return (
    <div>
      <h3 className={`text-sm font-bold ${toneClass}`}>{title}</h3>
      {items.length ? (
        <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {items.map((item) => (
            <li key={item.id} className="rounded border border-gray-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="font-semibold text-gray-950 dark:text-white">{item.label}</p>
              <p className="mt-1">{item.explanation}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{emptyText}</p>
      )}
    </div>
  );
}

export default function FindTheMistakeGame({ onBackToMenu }) {
  const game = useSequentialGame(findTheMistakeCases, {
    createInitialAnswer: () => [],
    evaluateAnswer: evaluateFindTheMistake,
  });

  const maxScore = findTheMistakeCases.reduce(
    (total, caseItem) => total + caseItem.options.filter((option) => option.isMistake).length,
    0,
  );

  if (game.phase === 'intro') {
    return (
      <GameIntro
        eyebrow="Caça-erros"
        title="Encontre problemas em mensagens, currículos e situações profissionais."
        description="Leia o caso, marque os pontos que precisam ser corrigidos e confirme. O reveal mostra o que você acertou, o que faltou e o que não era erro."
        roundsLabel={`${findTheMistakeCases.length} casos`}
        bullets={[
          'Marque erros em uma lista objetiva.',
          'Confirme só quando terminar a análise.',
          'Revise explicações para melhorar escrita e postura.',
        ]}
        onStart={game.start}
      />
    );
  }

  if (game.phase === 'result') {
    return (
      <GameResult
        title="Resultado do Caça-erros"
        score={game.score}
        maxScore={maxScore}
        summary="A pontuação considera erros encontrados e desconta marcações indevidas. O objetivo é treinar leitura crítica sem depender de clique em texto."
        details={[
          { label: 'Casos', value: findTheMistakeCases.length },
          { label: 'Pontos possíveis', value: maxScore },
          { label: 'Aproveitamento', value: `${Math.round((game.score / maxScore) * 100)}%` },
        ]}
        onRestart={game.restart}
        onBackToMenu={onBackToMenu}
      />
    );
  }

  const caseItem = game.currentItem;
  const selectedIds = game.phase === 'reveal'
    ? game.history[game.history.length - 1]?.answer ?? []
    : game.draftAnswer;

  return (
    <div className="animate-fade-in">
      <ResultPanel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="amber">{caseItem.topic}</Badge>
            <Badge tone="gray">Caso {game.currentIndex + 1} de {game.totalRounds}</Badge>
          </div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {selectedIds.length} marcado(s)
          </p>
        </div>

        <ProgressBar value={game.currentIndex + 1} max={game.totalRounds} className="mt-4 h-2" barClassName="bg-amber-500" />

        <h2 className="mt-7 text-2xl font-bold text-gray-950 dark:text-white">{caseItem.title}</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{caseItem.prompt}</p>
        <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-5 font-sans text-base leading-7 text-gray-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-100">
          {caseItem.sample}
        </pre>

        <div className="mt-6 grid gap-3">
          {caseItem.options.map((option) => {
            const selected = selectedIds.includes(option.id);
            const reveal = game.phase === 'reveal';

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => game.setDraftAnswer(toggleId(selectedIds, option.id))}
                disabled={reveal}
                aria-pressed={selected}
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-default dark:focus:ring-offset-zinc-900 ${optionClass({ option, selected, reveal })}`}
              >
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${selected ? 'border-current bg-current text-white dark:text-zinc-950' : 'border-gray-300 dark:border-zinc-600'}`}>
                  {selected ? '✓' : ''}
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        {game.phase === 'question' && (
          <CtaButtonRow
            className="mt-6 justify-start"
            actions={[
              {
                label: 'Confirmar análise',
                onClick: () => game.submit(game.draftAnswer),
                disabled: game.draftAnswer.length === 0,
                tone: 'blue',
              },
            ]}
          />
        )}
      </ResultPanel>

      {game.phase === 'reveal' && (
        <FeedbackNotice tone={game.currentResult.isCorrect ? 'success' : 'info'} className="mt-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <RevealList
              title="Você marcou corretamente"
              items={game.currentResult.correctMarked}
              emptyText="Nenhum erro correto marcado nesta rodada."
              tone="success"
            />
            <RevealList
              title="Faltou marcar"
              items={game.currentResult.missed}
              emptyText="Nada ficou faltando."
              tone="amber"
            />
            <RevealList
              title="Não era erro"
              items={game.currentResult.falsePositives}
              emptyText="Você não marcou itens indevidos."
              tone="danger"
            />
          </div>
          <CtaButtonRow
            className="mt-5 justify-start"
            actions={[{ label: game.isLastRound ? 'Ver resultado' : 'Próximo caso', onClick: game.next, tone: 'blue' }]}
          />
        </FeedbackNotice>
      )}
    </div>
  );
}
