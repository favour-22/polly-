"use client";

import NavBar from "@/components/nav/NavBar";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import PollQRCode from "@/components/poll/PollQRCode";

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

          {/* QR Code Quick Access */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Quick Share</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Recent Polls</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm">Team Lunch Preferences</span>
                    <button className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800">
                      📱 QR
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm">Project Priority Vote</span>
                    <button className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800">
                      📱 QR
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Sample QR Code</h3>
                <div className="flex justify-center">
                  <PollQRCode 
                    pollId="dashboard-demo"
                    pollTitle="Dashboard Demo Poll"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}