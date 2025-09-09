"use client";

import { useEffect, useState, useCallback } from "react";
import { getPoll, hasUserVoted, getPollResults } from "@/lib/database";
import useAuth from "@/hooks/useAuth";
import type { PollWithOptions, PollResult } from "@/lib/types";

export function usePollData(pollId: string) {
  const { user } = useAuth();
  const [poll, setPoll] = useState<PollWithOptions | null>(null);
  const [results, setResults] = useState<PollResult[]>([]);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    const fetchedResults = await getPollResults(pollId);
    setResults(fetchedResults);
  }, [pollId]);

  useEffect(() => {
    const fetchPollData = async () => {
      setLoading(true);
      const fetchedPoll = await getPoll(pollId);

      if (fetchedPoll) {
        setPoll(fetchedPoll);
        if (user) {
          const voted = await hasUserVoted(pollId, user.id);
          setUserHasVoted(voted);
          if (voted) {
            await fetchResults();
          }
        }
      }
      setLoading(false);
    };

    fetchPollData();
  }, [pollId, user, fetchResults]);

  return {
    poll,
    results,
    userHasVoted,
    loading,
    refetchResults: fetchResults
  };
}
