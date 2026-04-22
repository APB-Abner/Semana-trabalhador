import Badge from '../../../shared/ui/Badge.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';
import PigeonAvatar from '../../pigeon-avatar/ui/PigeonAvatar';
import CompetitiveResultView from '../../live-quiz/ui/result-renderers/CompetitiveResultView.jsx';

export default function FinalPodium({ compact = false, entries = [], variant = 'default' }) {
  const topThree = entries.slice(0, 3);
  const displayMode = variant === 'display';
  const orderedTopThree = displayMode && topThree.length >= 3
    ? [topThree[1], topThree[0], topThree[2]]
    : topThree;

  return (
    <div className={displayMode ? 'space-y-8' : compact ? 'space-y-3' : 'space-y-5'}>
      <ResultPanel tone="success" className={displayMode ? 'projector-panel border-amber-300/20 bg-amber-300/10 p-8 lg:p-12 dark:border-amber-300/20 dark:bg-amber-300/10' : compact ? 'p-4' : ''}>
        <p className={displayMode ? 'text-base font-black uppercase tracking-[0.2em] text-amber-200' : 'text-sm uppercase tracking-wide text-green-700 dark:text-green-200'}>
          Pódio final
        </p>
        <h2 className={displayMode ? 'mt-3 text-5xl font-black text-gray-950 dark:text-white sm:text-6xl' : compact ? 'mt-2 text-2xl font-extrabold text-gray-950 dark:text-white' : 'mt-2 text-3xl font-extrabold text-gray-950 dark:text-white'}>
          Fim de partida
        </h2>
        <div className={displayMode ? 'mt-12 grid gap-5 md:grid-cols-3 md:items-end' : compact ? 'mt-4 grid gap-3 md:grid-cols-3' : 'mt-6 grid gap-3 md:grid-cols-3'}>
          {orderedTopThree.map((entry) => {
            const index = entries.findIndex((candidate) => candidate.playerId === entry.playerId);
            const isWinner = index === 0;

            return (
            <div
              key={entry.playerId}
              className={`relative overflow-hidden rounded-lg border text-center dark:bg-zinc-950/70 ${
                isWinner
                  ? `border-amber-300 bg-amber-50 dark:border-amber-700 ${displayMode ? 'p-9 md:-mt-14 md:pb-12' : compact ? 'p-4 md:-mt-2 md:pb-5' : 'p-5 md:-mt-4 md:pb-7'}`
                  : `border-green-200 bg-white/80 dark:border-green-800 ${displayMode ? 'p-7 opacity-95' : compact ? 'p-4' : 'p-5'}`
              }`}
            >
              <Badge tone={isWinner ? 'amber' : 'green'}>{index + 1}º lugar</Badge>
              {displayMode && isWinner && (
                <p className="mt-4 text-sm font-black uppercase tracking-[0.22em] text-amber-700 dark:text-amber-200">
                  Campeão
                </p>
              )}
              <div className={displayMode ? 'mt-6 flex justify-center' : 'mt-4 flex justify-center'}>
                <PigeonAvatar avatar={entry.avatar} size={displayMode ? (isWinner ? 168 : 126) : compact ? 'lg' : isWinner ? 'xl' : 'lg'} label={`Avatar de ${entry.name}`} />
              </div>
              <p className={displayMode ? `${isWinner ? 'text-4xl' : 'text-3xl'} mt-3 font-black leading-tight text-gray-950 dark:text-white` : 'mt-4 text-lg font-bold text-gray-950 dark:text-white'}>
                {entry.name}
              </p>
              <p className={displayMode ? 'mt-2 text-2xl font-black text-green-700 dark:text-green-200' : 'text-sm font-semibold text-green-700 dark:text-green-200'}>
                {entry.score} pontos
              </p>
            </div>
          );
          })}
        </div>
      </ResultPanel>
      <CompetitiveResultView entries={entries} title="Ranking final" />
    </div>
  );
}
