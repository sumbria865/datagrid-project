import { useState } from "react";

interface KeyboardNavOptions {
  rowCount: number;
  colCount: number;
  onEnter?: (row: number, col: number) => void;
  onEscape?: () => void;
}

/**
 * Keyboard navigation state
 */
export function useKeyboardNavigation({
  rowCount,
  colCount,
  onEnter,
  onEscape,
}: KeyboardNavOptions) {
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);

  function handleKey(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setRow(r => Math.min(rowCount - 1, r + 1));
        break;

      case "ArrowUp":
        e.preventDefault();
        setRow(r => Math.max(0, r - 1));
        break;

      case "ArrowRight":
        e.preventDefault();
        setCol(c => Math.min(colCount - 1, c + 1));
        break;

      case "ArrowLeft":
        e.preventDefault();
        setCol(c => Math.max(0, c - 1));
        break;

      case "Enter":
        onEnter?.(row, col);
        break;

      case "Escape":
        onEscape?.();
        break;
    }
  }

  return {
    focusedRow: row,
    focusedCol: col,
    handleKey,
  };
}
