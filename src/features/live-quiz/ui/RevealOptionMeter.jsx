import { getRevealBarClass } from './revealOptionStyles.js';

export default function RevealOptionMeter({
  count = 0,
  percentage = 0,
  tone = 'gray',
}) {
  const safePercentage = Math.min(100, Math.max(0, Number.isFinite(percentage) ? percentage : 0));

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs font-bold opacity-85">
        <span>{safePercentage}%</span>
        <span>{count} voto(s)</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getRevealBarClass(tone)}`}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}
