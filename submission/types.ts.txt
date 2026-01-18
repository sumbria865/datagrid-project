import React from "react";

export interface Column<T> {
  id: string;
  title: string;
  width: number;
  pinned?: "left" | "right";
  sortable?: boolean;
  visible?: boolean;
  render: (row: T) => React.ReactNode;
  editor?: (value: unknown) => React.ReactNode;
  validate?: (value: unknown) => Promise<boolean>;
}


/**
 * Sorting rule for multi-sort
 */
export interface SortRule {
  columnId: string;
  direction: "asc" | "desc";
}
