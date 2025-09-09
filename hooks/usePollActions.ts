"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePoll } from "@/lib/database";
import useAuth from "@/hooks/useAuth";
import type { PollWithOptions } from "@/lib/types";

export function usePollActions(poll: PollWithOptions | null) {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!poll || !user || user.id !== poll.creator_id) {
      return;
    }

    if (window.confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      setSubmitting(true);
      setError(null);

      const success = await deletePoll(poll.id);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Failed to delete poll. Please try again.");
        setSubmitting(false);
      }
    }
  };

  const isCreator = user && poll && user.id === poll.creator_id;

  return {
    handleDelete,
    submitting,
    error,
    isCreator
  };
}
