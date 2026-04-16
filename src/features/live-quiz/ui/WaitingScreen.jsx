import ResultPanel from '../../../shared/ui/ResultPanel.jsx';

export default function WaitingScreen({ title = 'Aguardando', children }) {
  return (
    <ResultPanel tone="info" className="text-center">
      <p className="text-sm uppercase tracking-wide text-blue-700 dark:text-blue-200">Competição ao vivo</p>
      <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
      {children && (
        <div className="mt-3 text-sm text-blue-900 dark:text-blue-100">
          {children}
        </div>
      )}
    </ResultPanel>
  );
}
