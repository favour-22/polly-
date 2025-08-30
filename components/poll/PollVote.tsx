// ...new file...
"use client";
import { useMemo, useState, useEffect } from "react";
import { submitVote, getPollResults, hasUserVoted } from "@/lib/database";
import type { PollOption, PollResult } from "@/lib/types";

export default function PollVote({ 
  pollId, 
  options, 
  totalVotes 
}: { 
  pollId: string; 
  options: PollOption[]; 
  totalVotes: number; 
}) {
  const [results, setResults] = useState<PollResult[]>([]);
  const [votedId, setVotedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial results and check if user has voted
  useEffect(() => {
    const loadResults = async () => {
      try {
        const pollResults = await getPollResults(pollId);
        setResults(pollResults);
        
        // Check if user has voted (you'll need to get user ID from auth)
        // For now, we'll skip this check
      } catch (error) {
        console.error('Error loading poll results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [pollId]);

  const currentTotal = useMemo(() => results.reduce((s, r) => s + r.vote_count, 0), [results]);

  const handleVote = async (optId: string) => {
    if (submitting || votedId) return;
    setSubmitting(true);

    try {
      const success = await submitVote({
        poll_id: pollId,
        option_id: optId
      });

      if (success) {
        // Refresh results
        const newResults = await getPollResults(pollId);
        setResults(newResults);
        setVotedId(optId);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading poll results...</div>;
  }

  return (
    <div>
      <div className="space-y-3">
        {results.map((result) => {
          const pct = result.percentage;
          const isSelected = votedId === result.option_id;

          return (
            <div key={result.option_id} className="flex items-center gap-3">
              <button
                onClick={() => handleVote(result.option_id)}
                disabled={!!votedId}
                className={`flex-1 flex items-center gap-3 p-3 rounded-md border bg-white dark:bg-slate-900 hover:shadow-sm transition ${
                  isSelected ? "ring-2 ring-indigo-300" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{result.option_label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{result.vote_count} votes</div>
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