export default function ResultPanel({ children, className = '', tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800',
    success: 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-950',
    danger: 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-950',
    info: 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-950',
  };

  return (
    <div className={`rounded border p-4 ${toneClasses[tone] || toneClasses.neutral} ${className}`}>
      {children}
    </div>
  );
}
