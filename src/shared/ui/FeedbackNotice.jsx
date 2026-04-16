export default function FeedbackNotice({ children, tone = 'info', className = '' }) {
  const toneClasses = {
    info: 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-100',
    success: 'border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-100',
    danger: 'border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-100',
  };

  return (
    <div className={`rounded border p-4 ${toneClasses[tone] || toneClasses.info} ${className}`}>
      {children}
    </div>
  );
}
