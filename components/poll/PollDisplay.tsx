"use client";

import type { PollWithOptions } from "@/lib/types";

interface PollDisplayProps {
  poll: PollWithOptions;
}

export function PollDisplay({ poll }: PollDisplayProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        {poll.description}
      </p>
    </div>
  );
}
