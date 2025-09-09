"use client";

import { notFound } from "next/navigation";
import { usePollData } from "@/hooks/usePollData";
import { useVoting } from "@/hooks/useVoting";
import { usePollActions } from "@/hooks/usePollActions";
import { PollDisplay } from "@/components/poll/PollDisplay";
import { VoteForm } from "@/components/poll/VoteForm";
import { PollResults } from "@/components/poll/PollResults";
import { PollActions } from "@/components/poll/PollActions";
import { LoadingState } from "@/components/poll/LoadingState";

export default function PollPage({ params }: { params: { id: string } }) {
  const { poll, results, userHasVoted, loading, refetchResults } = usePollData(params.id);

  const {
    selectedOption,
    setSelectedOption,
    submitting: votingSubmitting,
    error: votingError,
    handleVote
  } = useVoting(params.id, () => {
    refetchResults();
  });

  const {
    handleDelete,
    submitting: deletingSubmitting,
    error: deletingError,
    isCreator
  } = usePollActions(poll);

  if (loading) {
    return <LoadingState />;
  }

  if (!poll) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <main className="flex items-center justify-center min-h-[80vh]">
        <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <PollDisplay poll={poll} />

          {userHasVoted ? (
            <PollResults results={results} />
          ) : (
            <VoteForm
              poll={poll}
              selectedOption={selectedOption}
              onOptionChange={setSelectedOption}
              onSubmit={handleVote}
              submitting={votingSubmitting}
              error={votingError}
            />
          )}

          {isCreator && (
            <PollActions
              onDelete={handleDelete}
              submitting={deletingSubmitting}
              error={deletingError}
            />
          )}
        </div>
      </main>
    </div>
  );
}
