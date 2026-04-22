import Badge from '../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../shared/ui/CtaButtonRow.jsx';
import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function GameIntro({
  eyebrow,
  title,
  description,
  bullets = [],
  roundsLabel,
  onStart,
}) {
  return (
    <ResultPanel className="overflow-hidden">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          {eyebrow && <Badge tone="blue">{eyebrow}</Badge>}
          <h2 className="mt-4 text-3xl font-bold text-gray-950 dark:text-white">{title}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-gray-700 dark:text-gray-300">{description}</p>
          <CtaButtonRow
            className="mt-6 justify-start"
            actions={[{ label: 'Começar', onClick: onStart, tone: 'blue' }]}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
          {roundsLabel && <Badge tone="gray">{roundsLabel}</Badge>}
          <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ResultPanel>
  );
}
