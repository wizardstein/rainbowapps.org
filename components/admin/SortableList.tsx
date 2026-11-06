"use client";

import { useId, useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AdminActionState } from "@/app/admin/actions";

export type SortableRow = {
  id: string;
  title: string;
  /** A short second line: the address, or the start of the text. */
  meta?: string;
  published: boolean;
  /** The edit form (and delete button), shown when the row is opened. */
  body: React.ReactNode;
};

/** The admin's ordered lists (portfolio, testimonials): the order here is the
 *  order on the site. Drag a row by its handle — mouse, finger, or keyboard
 *  (Space to pick up, ↑ ↓ to move, Space to drop) — and the new order is
 *  saved right away. No index numbers to maintain (owner, 2026-11-06). */
export default function SortableList({
  rows,
  onReorder,
}: {
  rows: SortableRow[];
  onReorder: (ids: string[]) => Promise<AdminActionState>;
}) {
  const propOrder = rows.map((r) => r.id);
  const [order, setOrder] = useState(propOrder);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  // A row added, deleted or reordered on the server (after any save) wins
  // over the local order.
  const [seen, setSeen] = useState(propOrder.join());
  if (propOrder.join() !== seen) {
    setSeen(propOrder.join());
    setOrder(propOrder);
  }
  const [, startTransition] = useTransition();
  // A stable id keeps dnd-kit's aria-describedby the same on the server and
  // in the browser (its default counter differs and breaks hydration).
  const dndId = useId();
  const byId = new Map(rows.map((r) => [r.id, r]));
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const titleOf = (id: string | number) => byId.get(String(id))?.title ?? "elementul";
  const positionOf = (id: string | number) => order.indexOf(String(id)) + 1;
  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `Ai ridicat „${titleOf(active.id)}”, pe locul ${positionOf(active.id)} din ${order.length}.`,
    onDragOver: ({ active, over }) =>
      over
        ? `„${titleOf(active.id)}” ajunge pe locul ${positionOf(over.id)} din ${order.length}.`
        : `„${titleOf(active.id)}” nu e deasupra listei.`,
    onDragEnd: ({ active, over }) =>
      over
        ? `Ai lăsat „${titleOf(active.id)}” pe locul ${positionOf(over.id)} din ${order.length}.`
        : `Ai lăsat „${titleOf(active.id)}” la locul lui.`,
    onDragCancel: ({ active }) =>
      `Ai renunțat. „${titleOf(active.id)}” a rămas la locul lui.`,
  };

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const before = order;
    const next = arrayMove(order, order.indexOf(String(active.id)), order.indexOf(String(over.id)));
    setOrder(next);
    setStatus("saving");
    startTransition(async () => {
      const result = await onReorder(next);
      if (result?.ok) {
        setStatus("saved");
      } else {
        setOrder(before);
        setStatus("error");
      }
    });
  }

  return (
    <div className="mt-6">
      <p role="status" aria-live="polite" className="mb-3 min-h-5 text-sm">
        {status === "saving" && <span className="text-ink-muted">Se salvează ordinea…</span>}
        {status === "saved" && <span className="text-status-green">Ordinea e salvată.</span>}
        {status === "error" && (
          <span className="text-red-700">
            Ordinea nu s-a salvat. Am pus-o la loc; încearcă din nou.
          </span>
        )}
      </p>
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        accessibility={{
          announcements,
          screenReaderInstructions: {
            draggable:
              "Ca să muți un element, apasă Spațiu pe mâner, mută-l cu săgețile sus și jos, apoi apasă Spațiu ca să-l lași. Escape renunță.",
          },
        }}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ol className="flex flex-col gap-3">
            {order.map((id, i) => {
              const row = byId.get(id);
              return row ? <Row key={id} row={row} position={i + 1} /> : null;
            })}
          </ol>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function Row({ row, position }: { row: SortableRow; position: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative rounded-xl border bg-surface ${
        isDragging ? "z-10 border-ink shadow-lg" : "border-line"
      }`}
    >
      <div className="flex items-center gap-3 p-3 pr-4">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Mută „${row.title}” (locul ${position})`}
          className="flex size-11 flex-none cursor-grab touch-none items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-crem hover:text-ink active:cursor-grabbing"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
            <circle cx="9" cy="6" r="1.6" />
            <circle cx="15" cy="6" r="1.6" />
            <circle cx="9" cy="12" r="1.6" />
            <circle cx="15" cy="12" r="1.6" />
            <circle cx="9" cy="18" r="1.6" />
            <circle cx="15" cy="18" r="1.6" />
          </svg>
        </button>
        <span
          aria-hidden="true"
          className="w-5 flex-none text-right font-display text-sm font-semibold text-ink-muted"
        >
          {position}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[15px] font-semibold text-ink">{row.title}</span>
          {row.meta && <span className="truncate text-sm text-ink-muted">{row.meta}</span>}
        </div>
        <span
          className={`flex-none rounded-full px-2.5 py-1 text-xs font-medium ${
            row.published ? "bg-crem text-ink-soft" : "border border-dashed border-line-strong text-ink-muted"
          }`}
        >
          {row.published ? "Publicat" : "Nepublicat"}
        </span>
      </div>
      <details className="group border-t border-line">
        <summary className="cursor-pointer list-none px-4 py-2.5 text-sm font-medium text-ink underline decoration-line underline-offset-4 [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Editează</span>
          <span className="hidden group-open:inline">Închide</span>
        </summary>
        <div className="px-4 pb-5">{row.body}</div>
      </details>
    </li>
  );
}
