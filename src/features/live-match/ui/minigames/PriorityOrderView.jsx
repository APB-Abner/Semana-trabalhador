import { useEffect, useMemo, useState } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

function SortablePriorityItem({
  itemId,
  item,
  index,
  locked,
  presentationMode = false,
  total,
  onMoveDown,
  onMoveUp,
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: itemId, disabled: locked });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid touch-none grid-cols-[2.25rem_auto_minmax(0,1fr)] items-center gap-x-2 gap-y-2 rounded-lg border border-gray-200 bg-white px-3 py-3 transition focus:outline-none focus:ring-2 focus:ring-purple-400 dark:border-zinc-700 dark:bg-zinc-950 sm:gap-x-3 sm:px-4 ${
        isDragging ? 'z-10 scale-[1.01] shadow-lg ring-2 ring-purple-300 dark:ring-purple-700' : ''
      } ${locked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
      aria-label={`Arrastar ${item?.text ?? itemId}`}
      {...attributes}
      {...listeners}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-base font-bold text-gray-500 dark:border-zinc-700 dark:text-gray-300 sm:h-9 sm:w-9"
      >
        <span aria-hidden="true">⠿</span>
      </span>
      <Badge tone="purple">#{index + 1}</Badge>
      <p className="min-w-0 text-sm font-semibold leading-snug text-gray-900 dark:text-white">{item?.text ?? itemId}</p>
      {!presentationMode && (
        <div className="col-span-3 flex justify-end gap-2">
          <button
            type="button"
            disabled={locked || index === 0}
            onClick={onMoveUp}
            onPointerDown={(event) => event.stopPropagation()}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-purple-400 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-45 dark:border-zinc-700 dark:text-gray-200"
            aria-label={`Mover ${item?.text ?? itemId} para cima`}
          >
            Subir
          </button>
          <button
            type="button"
            disabled={locked || index === total - 1}
            onClick={onMoveDown}
            onPointerDown={(event) => event.stopPropagation()}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-purple-400 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-45 dark:border-zinc-700 dark:text-gray-200"
            aria-label={`Mover ${item?.text ?? itemId} para baixo`}
          >
            Descer
          </button>
        </div>
      )}
    </div>
  );
}

export default function PriorityOrderView({
  disabled = false,
  hasSubmitted = false,
  onChange,
  onSubmit,
  presentationMode = false,
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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  useEffect(() => {
    if (!disabled && !hasSubmitted && !showAnswer && orderedIds.length) {
      onChange?.(orderedIds);
    }
  }, [disabled, hasSubmitted, onChange, orderedIds, showAnswer]);

  if (!scenario) {
    return null;
  }

  const itemsById = new Map(scenario.items.map((item) => [item.id, item]));
  const locked = disabled || hasSubmitted || showAnswer;
  const remainingMs = closesAt ? Math.max(0, closesAt - now) : 0;
  const totalMs = startedAt && closesAt ? Math.max(1, closesAt - startedAt) : 1;
  const isComplete = orderedIds.length === scenario.items.length && new Set(orderedIds).size === scenario.items.length;

  const handleDragEnd = ({ active, over }) => {
    if (locked || !over || active.id === over.id) {
      return;
    }

    setOrderedIds((ids) => {
      const oldIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);

      if (oldIndex < 0 || newIndex < 0) {
        return ids;
      }

      const nextIds = arrayMove(ids, oldIndex, newIndex);
      onChange?.(nextIds);
      return nextIds;
    });
  };

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

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
          <div className="mt-5 space-y-3">
            {orderedIds.map((itemId, index) => (
              <SortablePriorityItem
                key={itemId}
                itemId={itemId}
                item={itemsById.get(itemId)}
                index={index}
                locked={locked}
                presentationMode={presentationMode}
                total={orderedIds.length}
                onMoveUp={() => setOrderedIds((ids) => {
                  const nextIds = moveItem(ids, index, -1);
                  onChange?.(nextIds);
                  return nextIds;
                })}
                onMoveDown={() => setOrderedIds((ids) => {
                  const nextIds = moveItem(ids, index, 1);
                  onChange?.(nextIds);
                  return nextIds;
                })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!showAnswer && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {isComplete ? 'Ordem pronta para envio.' : 'Organize todos os itens antes de enviar.'}
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
          Ordem enviada. Aguarde o resultado da rodada para ver a sequência ideal.
        </FeedbackNotice>
      )}

      {showAnswer && (
        <PriorityOrderReveal reveal={round.reveal} selectedOptionIds={selectedOptionIds} />
      )}
    </ResultPanel>
  );
}
