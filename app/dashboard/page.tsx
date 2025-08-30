"use client";

import NavBar from "@/components/nav/NavBar";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <NavBar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/60 shadow-lg p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Your polls, drafts, and analytics (client-only stub — no backend).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/create-poll" className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-500">
                Create poll
              </Link>
              <Link href="/polls" className="text-sm text-slate-600 dark:text-slate-300 hover:underline">
                View polls
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              You are signed in as <span className="font-semibold">{user?.email}</span>.
            </div>
          </div>


        </div>
      </main>
    </div>
  );
}