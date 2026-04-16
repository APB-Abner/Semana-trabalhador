import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function WaitingScreen({ title = 'Aguardando', children }) {
  return (
    <ResultPanel tone="info" className="text-center">
      <div className="mx-auto mb-4 h-2 w-16 overflow-hidden rounded-full bg-blue-200 dark:bg-blue-900">
        <span className="block h-full w-1/2 animate-pulse rounded-full bg-blue-600 dark:bg-blue-300" />
      </div>
      <p className="text-sm uppercase tracking-wide text-blue-700 dark:text-blue-200">Competição ao vivo</p>
      <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
      {children && (
        <div className="mx-auto mt-3 max-w-md text-sm leading-6 text-blue-900 dark:text-blue-100">
          {children}
        </div>
      )}
    </ResultPanel>
  );
}
