import React, { useRef, useState, useEffect } from "react";
import type { Column } from "./types";
import { useVirtualRows } from "./useVirtualRows";
import { useSorting } from "./useSorting";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { useEditing } from "./useEditing";
import { GridRow } from "./GridRow";
import { GridHeader } from "./GridHeader";

interface Props<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataGrid<T>({ columns: initialColumns, data: initial }: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // data state
  const [data, setData] = useState(initial);

  // column state (REQUIRED for resizing)
  const [cols, setCols] = useState<Column<T>[]>(initialColumns);

  // scroll state
  const [scrollTop, setScrollTop] = useState(0);

  const rowHeight = 32;
  const viewportHeight = 400;

  // sorting
  const sorting = useSorting(data);
  const sortedData = sorting.getSortedData();

  // virtualization
  const virtual = useVirtualRows(
    sortedData.length,
    rowHeight,
    viewportHeight,
    scrollTop
  );

  // keyboard navigation (MUST use cols.length)
  const keyboard = useKeyboardNavigation({
    rowCount: sortedData.length,
    colCount: cols.length,
  });

  // editing
  const editing = useEditing(data, setData);

  function onScroll() {
    if (!containerRef.current) return;
    setScrollTop(containerRef.current.scrollTop);
  }

  // auto-scroll focused row into view
  useEffect(() => {
    if (!containerRef.current) return;

    const top = keyboard.focusedRow * rowHeight;
    const bottom = top + rowHeight;

    const viewTop = scrollTop;
    const viewBottom = scrollTop + viewportHeight;

    if (top < viewTop) {
      containerRef.current.scrollTop = top;
    } else if (bottom > viewBottom) {
      containerRef.current.scrollTop = bottom - viewportHeight;
    }
  }, [keyboard.focusedRow, rowHeight, viewportHeight, scrollTop]);

  const activeCellId = `cell-${keyboard.focusedRow}-${keyboard.focusedCol}`;

  return (
    <div
      ref={containerRef}
      role="grid"
      aria-rowcount={sortedData.length}
      aria-colcount={cols.length}
      aria-activedescendant={activeCellId}
      onKeyDown={keyboard.handleKey}
      onScroll={onScroll}
      className="border w-full max-w-full overflow-auto font-sans text-gray-800"
      style={{ height: viewportHeight }}
    >
      {/* Total scroll height spacer */}
      <div style={{ height: sortedData.length * rowHeight }}>
        {/* Column headers */}
        <GridHeader
          columns={cols}
          onSort={sorting.toggleSort}
          onResize={(id, width) =>
            setCols(prev =>
              prev.map(col =>
                col.id === id ? { ...col, width } : col
              )
            )
          }
        />

        {/* Virtualized rows */}
        <div
          style={{
            transform: `translateY(${virtual.offsetTop}px)`,
          }}
        >
          {sortedData
            .slice(virtual.startIndex, virtual.endIndex)
            .map((row, i) => (
              <GridRow
                key={virtual.startIndex + i}
                row={row}
                rowIndex={virtual.startIndex + i}
                columns={cols}
                focusedRow={keyboard.focusedRow}
                focusedCol={keyboard.focusedCol}
                editing={editing.editing}
                error={editing.error}
                onStartEdit={editing.startEditing}
                onCommit={editing.commit}
                onCancel={editing.cancelEditing}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
