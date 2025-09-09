"use client";

import { useState } from "react";
import { submitVote } from "@/lib/database";
import useAuth from "@/hooks/useAuth";

export function useVoting(pollId: string, onVoteSuccess: () => void) {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOption) {
      setError("Please select an option to vote.");
      return;
    }

    if (!user) {
      setError("You must be logged in to vote.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const success = await submitVote({
      poll_id: pollId,
      option_id: selectedOption,
    }, user.id);

    if (success) {
      onVoteSuccess();
    } else {
      setError("Failed to submit vote. Please try again.");
    }

    setSubmitting(false);
  };

  return {
    selectedOption,
    setSelectedOption,
    submitting,
    error,
    handleVote
  };
}
