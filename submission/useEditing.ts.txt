import { useState } from "react";

interface EditingCell {
  row: number;
  col: string;
  originalValue: unknown;
}

/**
 * Handles in-cell editing logic
 */
export function useEditing<T extends Record<string, any>>(
  data: T[],
  setData: (d: T[]) => void
) {
  const [editing, setEditing] = useState<EditingCell | null>(null);
  const [error, setError] = useState<string | null>(null);

  function startEditing(row: number, col: string) {
    const originalValue = data[row]?.[col];
    setError(null);
    setEditing({ row, col, originalValue });
  }

  async function commit(value: unknown) {
    if (!editing) return;

    const { row, col, originalValue } = editing;

    // Optimistic update
    const next = data.map((r, i) =>
      i === row ? { ...r, [col]: value } : r
    );

    setData(next);

    const success = await mockValidate();

    if (!success) {
      // Rollback on failure
      const rollback = data.map((r, i) =>
        i === row ? { ...r, [col]: originalValue } : r
      );

      setData(rollback);
      setError("Validation failed. Value reverted.");
    }

    setEditing(null);
  }

  function cancelEditing() {
    setError(null);
    setEditing(null);
  }

  return {
    editing,
    error,
    startEditing,
    commit,
    cancelEditing,
  };
}

function mockValidate(): Promise<boolean> {
  return new Promise(resolve => {
    setTimeout(() => resolve(Math.random() > 0.3), 500);
  });
}
