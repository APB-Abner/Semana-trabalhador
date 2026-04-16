export default function ResultPanel({ children, className = '', tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'border-gray-200 bg-white/95 dark:border-zinc-800 dark:bg-zinc-900/90',
    success: 'border-green-200 bg-green-50/90 dark:border-green-800 dark:bg-green-950/70',
    danger: 'border-red-200 bg-red-50/90 dark:border-red-800 dark:bg-red-950/70',
    info: 'border-blue-200 bg-blue-50/90 dark:border-blue-800 dark:bg-blue-950/70',
  };

  return (
    <div className={`rounded-lg border p-5 shadow-sm shadow-gray-200/50 dark:shadow-none ${toneClasses[tone] || toneClasses.neutral} ${className}`}>
      {children}
    </div>
  );
}
