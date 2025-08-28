import PollForm from "@/components/poll/PollForm";
import Link from "next/link";

export default function CreatePollPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Create a new poll</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Gather opinions quickly — add options and publish your poll.
            </p>
          </div>

          <div className="text-sm">
            <Link
              href="/polls"
              className="text-indigo-600 hover:underline"
            >
              View polls
            </Link>
          </div>
        </div>

        <PollForm />
      </div>
    </div>
  );
}