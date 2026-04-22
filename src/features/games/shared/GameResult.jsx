import Badge from '../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import ProgressBar from '../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

function getRank(percentage) {
  if (percentage >= 90) return { label: 'Excelente', tone: 'green' };
  if (percentage >= 70) return { label: 'Bom desempenho', tone: 'blue' };
  if (percentage >= 45) return { label: 'Em evolução', tone: 'amber' };
  return { label: 'Revisar conceitos', tone: 'red' };
}

export default function GameResult({
  title,
  score,
  maxScore,
  summary,
  details = [],
  onRestart,
  onBackToMenu,
}) {
  const percentage = maxScore ? Math.round((score / maxScore) * 100) : 0;
  const rank = getRank(percentage);

  return (
    <ResultPanel className="animate-fade-in text-center">
      <div className="flex justify-center">
        <Badge tone={rank.tone}>{rank.label}</Badge>
      </div>

      <h2 className="mt-4 text-3xl font-bold text-gray-950 dark:text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-gray-700 dark:text-gray-300">{summary}</p>

      <div className="mx-auto mt-7 max-w-md text-left">
        <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
          <span>Resultado</span>
          <span>{score} / {maxScore}</span>
        </div>
        <ProgressBar value={score} max={maxScore} className="mt-2 h-2" />
      </div>

      {details.length > 0 && (
        <div className="mt-7 grid gap-3 text-left sm:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{detail.label}</p>
              <p className="mt-2 text-lg font-bold text-gray-950 dark:text-white">{detail.value}</p>
            </div>
          ))}
        </div>
      )}

      <CtaButtonRow
        className="mt-7"
        actions={[
          { label: 'Jogar novamente', onClick: onRestart, tone: 'blue' },
          { label: 'Voltar para jogos', onClick: onBackToMenu, tone: 'gray' },
        ]}
      />
    </ResultPanel>
  );
}
