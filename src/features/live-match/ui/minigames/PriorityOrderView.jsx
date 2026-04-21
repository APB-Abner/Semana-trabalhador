import { useEffect, useMemo, useState } from 'react';
import Badge from '../../../../shared/ui/Badge.jsx';
import CtaButtonRow from '../../../../shared/ui/CtaButtonRow.jsx';
import FeedbackNotice from '../../../../shared/ui/FeedbackNotice.jsx';
import ProgressBar from '../../../../shared/ui/ProgressBar.jsx';
import ResultPanel from '../../../../shared/ui/ResultPanel.jsx';
import PriorityOrderReveal from './PriorityOrderReveal.jsx';

function getClockOffset(serverNow) {
  return Number.isFinite(serverNow) ? serverNow - Date.now() : 0;
}

function moveItem(ids, fromIndex, direction) {
  const toIndex = fromIndex + direction;
  if (toIndex < 0 || toIndex >= ids.length) {
    return ids;
  }

  const nextIds = [...ids];
  const [item] = nextIds.splice(fromIndex, 1);
  nextIds.splice(toIndex, 0, item);
  return nextIds;
}

export default function PriorityOrderView({
  disabled = false,
  hasSubmitted = false,
  onSubmit,
  round,
  selectedOptionIds = [],
  serverNow,
  startedAt,
  closesAt,
  showAnswer = false,
}) {
  const [clockOffset, setClockOffset] = useState(() => getClockOffset(serverNow));
  const [now, setNow] = useState(() => Date.now() + clockOffset);
  const scenario = round?.scenario;
  const initialIds = useMemo(() => scenario?.items.map((item) => item.id) ?? [], [scenario]);
  const [orderedIds, setOrderedIds] = useState(initialIds);

  useEffect(() => {
    setClockOffset(getClockOffset(serverNow));
  }, [closesAt, serverNow, startedAt]);

  useEffect(() => {
    const updateNow = () => setNow(Date.now() + clockOffset);

    updateNow();
    const timer = setInterval(updateNow, 250);
    return () => clearInterval(timer);
  }, [clockOffset]);

  useEffect(() => {
    setOrderedIds(selectedOptionIds.length > 0 ? selectedOptionIds : initialIds);
  }, [initialIds, selectedOptionIds]);

  if (!scenario) {
    return null;
  }

  const itemsById = new Map(scenario.items.map((item) => [item.id, item]));
  const locked = disabled || hasSubmitted || showAnswer;
  const remainingMs = closesAt ? Math.max(0, closesAt - now) : 0;
  const totalMs = startedAt && closesAt ? Math.max(1, closesAt - startedAt) : 1;
  const isComplete = orderedIds.length === scenario.items.length && new Set(orderedIds).size === scenario.items.length;

  return (
    <ResultPanel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{scenario.topic}</Badge>
          <Badge tone="purple">Ordem de Prioridade</Badge>
        </div>
        {closesAt && (
          <Badge tone={remainingMs <= 5_000 ? 'red' : 'gray'}>
            {Math.ceil(remainingMs / 1000)}s
          </Badge>
        )}
      </div>

      {closesAt && (
        <ProgressBar
          value={remainingMs}
          max={totalMs}
          className="mt-4 h-2"
          barClassName={remainingMs <= 5_000 ? 'bg-red-500' : 'bg-purple-500'}
        />
      )}

      <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">{scenario.title}</h3>
      <p className="mt-3 rounded-lg border border-purple-200 bg-purple-50 p-4 text-sm leading-relaxed text-purple-950 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-100">
        {scenario.scenario}
      </p>

      <div className="mt-5 space-y-3">
        {orderedIds.map((itemId, index) => {
          const item = itemsById.get(itemId);

          return (
            <div
              key={itemId}
              className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950"
            >
              <Badge tone="purple">#{index + 1}</Badge>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item?.text ?? itemId}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={locked || index === 0}
                  onClick={() => setOrderedIds((ids) => moveItem(ids, index, -1))}
                  className="rounded-md border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-purple-400 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-45 dark:border-zinc-700 dark:text-gray-200"
                  aria-label={`Mover ${item?.text ?? itemId} para cima`}
                >
                  Subir
                </button>
                <button
                  type="button"
                  disabled={locked || index === orderedIds.length - 1}
                  onClick={() => setOrderedIds((ids) => moveItem(ids, index, 1))}
                  className="rounded-md border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-purple-400 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-45 dark:border-zinc-700 dark:text-gray-200"
                  aria-label={`Mover ${item?.text ?? itemId} para baixo`}
                >
                  Descer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!showAnswer && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {isComplete ? 'Ordem completa para envio.' : 'Ordene todos os itens para enviar.'}
          </p>
          <CtaButtonRow
            actions={[{
              label: hasSubmitted ? 'Ordem enviada' : 'Confirmar ordem',
              onClick: () => onSubmit?.(orderedIds),
              tone: 'purple',
              disabled: locked || !isComplete,
            }]}
          />
        </div>
      )}

      {hasSubmitted && !showAnswer && (
        <FeedbackNotice tone="info" className="mt-4 text-sm">
          Ordem enviada. Aguarde o fechamento da rodada para ver a sequencia ideal.
        </FeedbackNotice>
      )}

      {showAnswer && (
        <PriorityOrderReveal reveal={round.reveal} selectedOptionIds={selectedOptionIds} />
      )}
    </ResultPanel>
  );
}
