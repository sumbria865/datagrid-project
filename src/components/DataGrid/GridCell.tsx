import React, { useEffect, useRef, useState } from "react";

interface Props {
  value: unknown;
  width: number;
  focused: boolean;
  pinned?: "left" | "right";

  isEditing: boolean;
  error?: string | null;

  onStartEdit: () => void;
  onCommit: (value: unknown) => void;
  onCancel: () => void;
}

export function GridCell({
  value,
  width,
  focused,
  pinned,
  isEditing,
  error,
  onStartEdit,
  onCommit,
  onCancel,
}: Props) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!isEditing && e.key === "Enter") {
      e.preventDefault();
      onStartEdit();
    }

    if (isEditing) {
      if (e.key === "Enter") {
        e.preventDefault();
        onCommit(draft);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    }
  }

  return (
    <div
      role="gridcell"
      tabIndex={focused ? 0 : -1}
      aria-invalid={!!error}
      onKeyDown={onKeyDown}
      className={`h-8 flex items-center px-2 border-r text-sm overflow-hidden whitespace-nowrap ${
        focused ? "bg-blue-100 outline outline-1 outline-blue-400" : ""
      } ${pinned === "left" ? "sticky left-0 bg-white z-10" : ""}`}
      style={{ width }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={String(draft ?? "")}
          onChange={e => setDraft(e.target.value)}
          className="w-full outline-none"
        />
      ) : (
        <span className="truncate">{String(value ?? "")}</span>
      )}

      {error && focused && (
        <span className="sr-only" aria-live="assertive">
          {error}
        </span>
      )}
    </div>
  );
}
