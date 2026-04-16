export default function ProgressBar({ value, max = 100, className = '', barClassName = 'bg-blue-500' }) {
  const percentage = max ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={`h-3 overflow-hidden rounded bg-gray-200 dark:bg-zinc-700 ${className}`}>
      <div
        className={`h-full transition-all duration-300 ${barClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
