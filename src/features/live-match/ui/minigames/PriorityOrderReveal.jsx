import Badge from '../../../../shared/ui/Badge.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';

function sameOrder(left = [], right = []) {
  return left.length === right.length && left.every((itemId, index) => itemId === right[index]);
}

function getTone(isCorrect) {
  return isCorrect ? 'green' : 'amber';
}

export default function PriorityOrderReveal({ reveal, selectedOptionIds = [] }) {
  if (!reveal) {
    return null;
  }

  const idealItemsById = new Map(reveal.idealOrder.map((item) => [item.itemId, item]));
  const selectedSummary = reveal.answerSummaries.find((summary) => sameOrder(summary.optionIds, selectedOptionIds));

  return (
    <div className="mt-5 space-y-4">
      <FeedbackNotice tone="success" className="text-sm">
        <p className="font-semibold">Ordem ideal</p>
        <p className="mt-1">{reveal.explanation}</p>
      </FeedbackNotice>

      {selectedSummary && (
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Posicoes certas</p>
            <p className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">
              {selectedSummary.correctPositionCount}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Base</p>
            <p className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">{selectedSummary.basePoints}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Bonus</p>
            <p className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">{selectedSummary.speedBonus}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Rodada</p>
            <p className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">{selectedSummary.points}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/40">
          <h4 className="font-semibold text-green-950 dark:text-green-100">Ordem ideal</h4>
          <ol className="mt-3 space-y-3">
            {reveal.idealOrder.map((item) => (
              <li key={item.itemId} className="rounded-lg bg-white p-3 text-sm dark:bg-zinc-950">
                <div className="flex gap-3">
                  <Badge tone="green">#{item.idealPosition}</Badge>
                  <div>
                    <p className="font-semibold text-gray-950 dark:text-white">{item.text}</p>
                    {item.explanation && (
                      <p className="mt-1 text-gray-600 dark:text-gray-300">{item.explanation}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {selectedOptionIds.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
            <h4 className="font-semibold text-amber-950 dark:text-amber-100">Sua ordem</h4>
            <ol className="mt-3 space-y-3">
              {selectedOptionIds.map((itemId, index) => {
                const item = idealItemsById.get(itemId);
                const selectedPosition = index + 1;
                const isCorrect = item?.idealPosition === selectedPosition;

                return (
                  <li key={itemId} className="rounded-lg bg-white p-3 text-sm dark:bg-zinc-950">
                    <div className="flex gap-3">
                      <Badge tone={getTone(isCorrect)}>#{selectedPosition}</Badge>
                      <div>
                        <p className="font-semibold text-gray-950 dark:text-white">{item?.text ?? itemId}</p>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {isCorrect
                            ? 'Ficou na posicao ideal.'
                            : `Ideal: posicao ${item?.idealPosition ?? '-'}.`}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        {reveal.totalResponses} jogador(es) enviaram ordem nesta rodada.
      </p>
    </div>
  );
}
