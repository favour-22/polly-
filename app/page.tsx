import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/nav/NavBar";
import PollCard from "@/components/poll/PollCard";

export default function Home() {
  const polls = [
    { id: "1", title: "Favorite programming language?", description: "Vote for your favorite." },
    { id: "2", title: "Best JS framework?", description: "Help us decide." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <NavBar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="rounded-2xl bg-white/80 dark:bg-slate-900/60 shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Polly — simple polling, better decisions</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-xl">
                Create polls, invite responses, and view results. Lightweight scaffold ready for auth and API integration.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/create-poll" className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500">
                  Create poll
                </Link>
                <Link href="/polls" className="inline-flex items-center px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                  View polls
                </Link>
                <Link href="/login" className="inline-flex items-center px-3 py-2 rounded-md text-sm underline">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="hidden md:block w-64">
              <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/40 dark:to-slate-950 shadow-inner">
                <p className="text-sm text-slate-600 dark:text-slate-300">Active polls</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Recent polls</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {polls.map((p) => (
              <PollCard key={p.id} id={p.id} title={p.title} description={p.description} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}