export default function Badge({ children, tone = 'blue', className = '' }) {
  const toneClasses = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    gray: 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone] || toneClasses.blue} ${className}`}>
      {children}
    </span>
  );
}
