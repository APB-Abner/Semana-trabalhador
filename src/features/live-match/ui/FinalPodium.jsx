import Badge from '../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import PigeonAvatar from '../../pigeon-avatar/ui/PigeonAvatar';
import CompetitiveResultView from '../../live-quiz/ui/result-renderers/CompetitiveResultView.jsx';

export default function FinalPodium({ entries = [] }) {
  const topThree = entries.slice(0, 3);

  return (
    <div className="space-y-5">
      <ResultPanel tone="success">
        <p className="text-sm uppercase tracking-wide text-green-700 dark:text-green-200">Pódio final</p>
        <h2 className="mt-2 text-3xl font-extrabold text-gray-950 dark:text-white">Resultado final</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {topThree.map((entry, index) => (
            <div
              key={entry.playerId}
              className={`relative overflow-hidden rounded-lg border p-5 text-center dark:bg-zinc-950/70 ${
                index === 0
                  ? 'border-amber-300 bg-amber-50 md:-mt-4 md:pb-7 dark:border-amber-700'
                  : 'border-green-200 bg-white/80 dark:border-green-800'
              }`}
            >
              <Badge tone={index === 0 ? 'amber' : 'green'}>{index + 1}º lugar</Badge>
              <div className="mt-4 flex justify-center">
                <PigeonAvatar avatar={entry.avatar} size={index === 0 ? 'xl' : 'lg'} label={`Avatar de ${entry.name}`} />
              </div>
              <p className="mt-4 text-lg font-bold text-gray-950 dark:text-white">{entry.name}</p>
              <p className="text-sm font-semibold text-green-700 dark:text-green-200">{entry.score} pontos</p>
            </div>
          ))}
        </div>
      </ResultPanel>
      <CompetitiveResultView entries={entries} title="Ranking final" />
    </div>
  );
}
