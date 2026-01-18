import { useState } from "react";
import type { SortRule } from "./types";

/**
 * Sorting state management
 */
export function useSorting<T>(data: T[]) {

  const [sortRules, setSortRules] = useState<SortRule[]>([]);

  function toggleSort(columnId: string) {
    setSortRules(prev => {

      const existing = prev.find(r => r.columnId === columnId);

      if (!existing) {
        return [...prev, { columnId, direction: "asc" }];
      }

      if (existing.direction === "asc") {
        return prev.map(r =>
          r.columnId === columnId ? { ...r, direction: "desc" } : r
        );
      }

      return prev.filter(r => r.columnId !== columnId);
    });
  }

  function getSortedData(): T[] {
    if (sortRules.length === 0) return data;

    const copy = [...data];

    copy.sort((a: any, b: any) => {

      for (const rule of sortRules) {

        const av = a[rule.columnId];
        const bv = b[rule.columnId];

        if (av === bv) continue;

        if (rule.direction === "asc") {
          return av > bv ? 1 : -1;
        } else {
          return av < bv ? 1 : -1;
        }
      }

      return 0;
    });

    return copy;
  }

  return {
    sortRules,
    toggleSort,
    getSortedData
  };
}
