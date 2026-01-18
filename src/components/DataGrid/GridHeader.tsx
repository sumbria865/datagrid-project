import React, { useRef } from "react";
import type { Column } from "./types";

interface Props<T> {
  columns: Column<T>[];
  onSort: (columnId: string) => void;
  onResize?: (columnId: string, width: number) => void;
}

export function GridHeader<T>({
  columns,
  onSort,
  onResize,
}: Props<T>) {
  const startX = useRef(0);
  const startWidth = useRef(0);
  const resizingCol = useRef<string | null>(null);

  function onMouseDown(
    e: React.MouseEvent,
    columnId: string,
    width: number
  ) {
    startX.current = e.clientX;
    startWidth.current = width;
    resizingCol.current = columnId;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (!resizingCol.current || !onResize) return;

    const delta = e.clientX - startX.current;
    onResize(resizingCol.current, Math.max(60, startWidth.current + delta));
  }

  function onMouseUp() {
    resizingCol.current = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  return (
    <div role="row" className="flex sticky top-0 bg-gray-100 z-20">
      {columns.map(col => {
        const isPinned = col.pinned === "left";

        return (
          <div
            key={col.id}
            role="columnheader"
            aria-sort="none"
            className={`relative flex items-center border-r px-2 h-8 text-sm font-medium select-none ${
              isPinned ? "sticky left-0 z-30 bg-gray-100" : ""
            }`}
            style={{ width: col.width }}
            onClick={() => col.sortable && onSort(col.id)}
          >
            {col.title}

            {/* Resize handle */}
            <div
              onMouseDown={e => onMouseDown(e, col.id, col.width)}
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
            />
          </div>
        );
      })}
    </div>
  );
}
