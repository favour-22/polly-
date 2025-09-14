import Link from "next/link";

export function PollsPageHeader() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">All polls</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Browse, search and sort polls — click any poll to view details and
          vote.
        </p>
      </div>
      <div className="text-sm">
        <Link
          href="/create-poll"
          className="text-indigo-600 hover:underline"
        >
          Create poll
        </Link>
      </div>
    </div>
  );
}