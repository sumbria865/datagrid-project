import { useMemo } from "react";

/**
 * Manual row virtualization logic
 */
export function useVirtualRows(
  totalRows: number,
  rowHeight: number,
  viewportHeight: number,
  scrollTop: number,
  overscan: number = 5
) {
  return useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / rowHeight) - overscan
    );

    const visibleCount = Math.ceil(viewportHeight / rowHeight);

    const endIndex = Math.min(
      totalRows,
      startIndex + visibleCount + overscan * 2
    );

    const offsetTop = startIndex * rowHeight;
    const offsetBottom =
      (totalRows - endIndex) * rowHeight;

    return {
      startIndex,
      endIndex, // EXCLUSIVE
      offsetTop,
      offsetBottom,
    };
  }, [totalRows, rowHeight, viewportHeight, scrollTop, overscan]);
}
