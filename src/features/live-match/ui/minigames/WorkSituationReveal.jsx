import Badge from '../../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';

const qualityLabels = {
  best: 'Melhor decisão',
  ok: 'Decisão aceitável',
  poor: 'Risco alto',
};

const qualityTones = {
  best: 'green',
  ok: 'amber',
  poor: 'red',
};

export default function WorkSituationReveal({ reveal, selectedOptionId }) {
  if (!reveal) {
    return null;
  }

  const bestOption = reveal.options.find((option) => option.optionId === reveal.bestOptionId);
  const selectedOption = reveal.options.find((option) => option.optionId === selectedOptionId);

  return (
    <div className="mt-5 space-y-4">
      <FeedbackNotice tone="success" className="text-sm">
        <p className="font-semibold">Melhor decisão: {bestOption?.text ?? 'Opção principal'}</p>
        <p className="mt-1">{reveal.explanation}</p>
      </FeedbackNotice>

      {selectedOption && (
        <FeedbackNotice tone={selectedOption.quality === 'poor' ? 'danger' : 'info'} className="text-sm">
          <p className="font-semibold">Sua escolha: {qualityLabels[selectedOption.quality]}</p>
          <p className="mt-1">{selectedOption.feedback}</p>
        </FeedbackNotice>
      )}

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-semibold text-gray-950 dark:text-white">Distribuição das escolhas</h4>
          <Badge tone="purple">{reveal.totalResponses} respostas</Badge>
        </div>
        <div className="mt-4 space-y-3">
          {reveal.options.map((option) => (
            <div key={option.optionId} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Badge tone={qualityTones[option.quality] ?? 'gray'}>
                    {qualityLabels[option.quality] ?? option.quality}
                  </Badge>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{option.text}</span>
                </div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {option.count} voto(s) - {option.percentage}%
                </span>
              </div>
              <ProgressBar
                value={option.percentage}
                max={100}
                className="h-2"
                barClassName={option.quality === 'best' ? 'bg-green-500' : option.quality === 'ok' ? 'bg-amber-500' : 'bg-red-500'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
