// ...new file...
"use client";
import { useMemo, useState } from "react";

type Opt = { id: string; label: string; votes: number };

export default function PollVote({ pollId, options, totalVotes }: { pollId: string; options: Opt[]; totalVotes: number }) {
  const [localOptions, setLocalOptions] = useState<Opt[]>(options);
  const [votedId, setVotedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const currentTotal = useMemo(() => localOptions.reduce((s, o) => s + o.votes, 0), [localOptions]);

  const handleVote = async (optId: string) => {
    if (submitting || votedId) return;
    setSubmitting(true);

    // simulate API call
    await new Promise((r) => setTimeout(r, 600));

    setLocalOptions((prev) => prev.map((o) => (o.id === optId ? { ...o, votes: o.votes + 1 } : o)));
    setVotedId(optId);
    setSubmitting(false);
  };

  return (
    <div>
      <div className="space-y-3">
        {localOptions.map((opt) => {
          const pct = currentTotal > 0 ? Math.round((opt.votes / currentTotal) * 100) : 0;
          const isSelected = votedId === opt.id;

          return (
            <div key={opt.id} className="flex items-center gap-3">
              <button
                onClick={() => handleVote(opt.id)}
                disabled={!!votedId}
                className={`flex-1 flex items-center gap-3 p-3 rounded-md border bg-white dark:bg-slate-900 hover:shadow-sm transition ${
                  isSelected ? "ring-2 ring-indigo-300" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{opt.votes} votes</div>
                  </div>

                  <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all"
                      aria-hidden
                    />
                  </div>

                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{pct}%</div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Total votes: {currentTotal}
        </div>

        <div className="text-sm">
          {votedId ? (
            <span className="text-green-600 dark:text-green-400">Thanks for voting</span>
          ) : (
            <span className="text-slate-500 dark:text-slate-400">Select an option to vote</span>
          )}
        </div>
      </div>
    </div>
  );
}
// ...new file...