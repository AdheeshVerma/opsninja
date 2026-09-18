"use client";

import { useState } from "react";

export default function ExpandableContent({
  content,
  maxLength = 300,
}: {
  content?: string | null;
  maxLength?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const value = content ?? "";
  const shouldExpand = value.length > maxLength;
  const visible =
    expanded || !shouldExpand ? value : `${value.slice(0, maxLength)}...`;

  return (
    <div>
      <p className="whitespace-pre-wrap text-sm leading-7 text-text-secondary">
        {visible || "No transcript available."}
      </p>
      {shouldExpand ? (
        <button
          className="mt-3 text-sm font-semibold text-brand hover:text-brand-hover"
          type="button"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}
