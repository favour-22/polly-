import PollList from "@/components/poll/PollList";
import { getPolls } from "@/lib/database";
import { PollsPageHeader } from "@/components/poll/PollsPageHeader";
import { Suspense } from "react";

async function Polls() {
  const polls = await getPolls();
  return <PollList initialPolls={polls} />;
}

export default function PollsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <PollsPageHeader />
        <Suspense fallback={<div className="text-center p-8">Loading polls...</div>}>
          <Polls />
        </Suspense>
      </div>
    </div>
  );
}