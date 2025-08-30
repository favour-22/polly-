"use client"
import { notFound } from "next/navigation";
import Link from "next/link";
import PollVote from "@/components/poll/PollVote";
import PollQRCode from "@/components/poll/PollQRCode";
import NavBar from "@/components/nav/NavBar";
import React, { useState } from "react";
import { use } from "react";

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const mockPoll = {
    id,
    title: "Which feature should we build next?",
    description:
      "Help us prioritize features for the next release. Pick the option you want most or add a comment.",
    options: [
      { id: "o1", label: "Real-time results" },
      { id: "o2", label: "Anonymous voting" },
      { id: "o3", label: "Export results (CSV)" },
      { id: "o4", label: "Multi-select polls" },
    ],
  };

  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleVote(e: React.FormEvent) {
    e.preventDefault();
    if (selected) setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <NavBar />
      <main className="flex items-center justify-center min-h-[80vh]">
        <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-2">{mockPoll.title}</h1>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            {mockPoll.description}
          </p>
          {!submitted ? (
            <form onSubmit={handleVote} className="space-y-4">
              <div className="space-y-2">
                {mockPoll.options.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value={opt.id}
                      checked={selected === opt.id}
                      onChange={() => setSelected(opt.id)}
                      className="accent-indigo-600"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              <button
                type="submit"
                disabled={!selected}
                className="mt-2 px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
              >
                Submit Vote
              </button>
            </form>
          ) : (
            <div className="mt-6 text-center">
              <div className="text-green-600 font-semibold text-lg mb-2">
                Thank you for voting!
              </div>
              <div className="text-slate-500">Results coming soon...</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}