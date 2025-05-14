"use client";

import React from "react";
import highlight from "highlight.js";

export default function ({
  content,
  className,
}: {
  content: string;
  className: string;
}) {
  const refCode = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (refCode.current) {
      highlight.highlightElement(refCode.current);
    }
  }, []);

  return (
    <pre>
      <code ref={refCode} className={className}>
        {content}
      </code>
    </pre>
  );
}
