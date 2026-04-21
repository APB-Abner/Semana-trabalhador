import Badge from '../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import PigeonAvatar from '../../pigeon-avatar/ui/PigeonAvatar';
import CompetitiveResultView from '../../live-quiz/ui/result-renderers/CompetitiveResultView.jsx';

export default function FinalPodium({ entries = [], variant = 'default' }) {
  const topThree = entries.slice(0, 3);
  const displayMode = variant === 'display';

  return (
    <div className={displayMode ? 'space-y-8' : 'space-y-5'}>
      <ResultPanel tone="success" className={displayMode ? 'p-7 lg:p-10' : ''}>
        <p className="text-sm uppercase tracking-wide text-green-700 dark:text-green-200">Pódio final</p>
        <h2 className={displayMode ? 'mt-3 text-5xl font-black text-gray-950 dark:text-white sm:text-6xl' : 'mt-2 text-3xl font-extrabold text-gray-950 dark:text-white'}>
          Resultado final
        </h2>
        <div className={displayMode ? 'mt-10 grid gap-5 md:grid-cols-3 md:items-end' : 'mt-6 grid gap-3 md:grid-cols-3'}>
          {topThree.map((entry, index) => (
            <div
              key={entry.playerId}
              className={`relative overflow-hidden rounded-lg border text-center dark:bg-zinc-950/70 ${
                index === 0
                  ? `border-amber-300 bg-amber-50 dark:border-amber-700 ${displayMode ? 'p-8 md:-mt-10 md:pb-10' : 'p-5 md:-mt-4 md:pb-7'}`
                  : 'border-green-200 bg-white/80 dark:border-green-800'
              } ${index === 0 ? '' : displayMode ? 'p-6' : 'p-5'}`}
            >
              <Badge tone={index === 0 ? 'amber' : 'green'}>{index + 1}º lugar</Badge>
              <div className="mt-4 flex justify-center">
                <PigeonAvatar avatar={entry.avatar} size={index === 0 ? 'xl' : displayMode ? 'xl' : 'lg'} label={`Avatar de ${entry.name}`} />
              </div>
              <p className={displayMode ? 'mt-5 text-3xl font-black text-gray-950 dark:text-white' : 'mt-4 text-lg font-bold text-gray-950 dark:text-white'}>
                {entry.name}
              </p>
              <p className={displayMode ? 'mt-2 text-xl font-bold text-green-700 dark:text-green-200' : 'text-sm font-semibold text-green-700 dark:text-green-200'}>
                {entry.score} pontos
              </p>
            </div>
          ))}
        </div>
      </ResultPanel>
      <CompetitiveResultView entries={entries} title="Ranking final" />
    </div>
  );
}
