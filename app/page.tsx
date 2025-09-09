"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/nav/NavBar";
import PollCard from "@/components/poll/PollCard";
import Button from "@/components/ui/button";
import { getPolls } from "@/lib/database";
import type { Poll } from "@/lib/types";

// A type that includes the extra fields from the getPolls query
type PollWithCounts = Poll & { total_votes: number; options_count: number };

export default function Home() {
  const [polls, setPolls] = useState<PollWithCounts[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const fetchedPolls = await getPolls();
      setPolls(fetchedPolls);
    };
    fetchPolls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            Polly — Simple, Fast, and Engaging Polls
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Create polls in seconds, share them with anyone, and get real-time results. Make better decisions, together.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/create-poll">
              <Button variant="primary" size="lg">Create Your First Poll</Button>
            </Link>
            <Link href="/polls">
              <Button variant="secondary" size="lg">Explore Public Polls</Button>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">1. Create</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Easily create a poll with a title, description, and as many options as you need.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">2. Share</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Share your poll with a unique link or a QR code to gather votes from your audience.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">3. Analyze</h3>
              <p className="text-slate-600 dark:text-slate-400">
                View results in real-time and gain insights from the collective feedback.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Polls Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-10">Recent Public Polls</h2>
          {polls.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.slice(0, 6).map((p) => (
                <PollCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  description={p.description ?? undefined}
                  totalVotes={p.total_votes}
                  optionsCount={p.options_count}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400">No public polls available at the moment.</p>
          )}
        </section>

        {/* Call to Action Section */}
        <section className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Create an account and start making your own polls today. It's free!
          </p>
          <Link href="/register">
            <Button variant="primary" size="lg">Sign Up Now</Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
