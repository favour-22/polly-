import { notFound } from "next/navigation";
import Link from "next/link";
import PollVote from "@/components/poll/PollVote";

type Props = { params: { id: string } };

export default async function PollPage({ params }: Props) {
  // await params before accessing properties (Next.js requirement)
  const { id } = await params;

  // placeholder: server-side fetch could go here
  if (!id) return notFound();

  // mock poll data (replace with real fetch later)
  const poll = {
    id,
    title: "Which feature should we build next?",
    description:
      "Help us prioritize features for the next release. Pick the option you want most or add a comment.",
    creator: { name: "Team Polly", avatar: "" },
    createdAt: "2025-08-01",
    options: [
      { id: "o1", label: "Real-time results", votes: 48 },
      { id: "o2", label: "Anonymous voting", votes: 32 },
      { id: "o3", label: "Export results (CSV)", votes: 20 },
      { id: "o4", label: "Multi-select polls", votes: 12 },
    ],
    totalVotes: 112,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{poll.title}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {poll.description}
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span>By {poll.creator.name}</span>
              <span>•</span>
              <span>Created {poll.createdAt}</span>
              <span>•</span>
              <span>{poll.totalVotes} votes</span>
            </div>
          </div>

          <div className="text-sm">
            <Link
              href="/polls"
              className="text-indigo-600 hover:underline"
            >
              ← Back to polls
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-slate-800 border p-6 shadow-sm">
          {/* Voting UI (client-side) */}
          <PollVote
            pollId={poll.id}
            options={poll.options}
            totalVotes={poll.totalVotes}
          />

          {/* Additional sections */}
          <section className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium">About this poll</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This is a client-side stub. When backend is added, votes and comments
              will persist and you’ll see live results.
            </p>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-50 dark:bg-slate-900 p-3 text-sm">
                <strong>Visibility:</strong> Public
              </div>
              <div className="rounded-md bg-slate-50 dark:bg-slate-900 p-3 text-sm">
                <strong>Responses:</strong> {poll.totalVotes}
              </div>
            </div>
          </section>

          <section className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium">Comments</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Comments are not enabled yet. This area will show feedback from
              respondents.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}