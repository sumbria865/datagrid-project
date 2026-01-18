import React from "react";
import { GridCell } from "./GridCell";
import type { Column } from "./types";

interface Props<T> {
  row: T;
  rowIndex: number;
  columns: Column<T>[];

  // keyboard focus
  focusedRow: number;
  focusedCol: number;

  // editing
  editing?: {
    row: number;
    col: string;
  } | null;
  error?: string | null;

  onStartEdit: (row: number, col: string) => void;
  onCommit: (value: unknown) => void;
  onCancel: () => void;
}

export function GridRow<T extends Record<string, any>>({
  row,
  rowIndex,
  columns,
  focusedRow,
  focusedCol,
  editing,
  error,
  onStartEdit,
  onCommit,
  onCancel,
}: Props<T>) {
  return (
    <div
      role="row"
      aria-rowindex={rowIndex + 1}
      className="flex"
    >
      {columns.map((column, colIndex) => {
        const isFocused =
          focusedRow === rowIndex && focusedCol === colIndex;

        const isEditing =
          editing?.row === rowIndex &&
          editing?.col === column.id;

        return (
          <GridCell
            key={column.id}
            value={row[column.id]}
            width={column.width}
            focused={isFocused}
            isEditing={isEditing}
            error={isEditing ? error : null}
            onStartEdit={() => onStartEdit(rowIndex, column.id)}
            onCommit={onCommit}
            onCancel={onCancel}
          />
        );
      })}
    </div>
  );
}
