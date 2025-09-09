"use client";

import type { PollResult } from "@/lib/types";

interface PollResultsProps {
  results: PollResult[];
}

export function PollResults({ results }: PollResultsProps) {
  const totalVotes = results.reduce((acc, result) => acc + (result.vote_count || 0), 0);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Results</h2>
      <div className="space-y-2">
        {results.map((result) => (
          <div key={result.option_id}>
            <div className="flex justify-between mb-1">
              <span>{result.option_label}</span>
              <span>{result.vote_count} votes ({result.percentage.toFixed(2)}%)</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${result.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
        Total votes: {totalVotes}
      </p>
    </div>
  );
}
