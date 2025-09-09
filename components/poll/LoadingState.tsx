"use client";

import NavBar from "@/components/nav/NavBar";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <NavBar />
      <main className="flex items-center justify-center min-h-[80vh]">
        <div>Loading poll...</div>
      </main>
    </div>
  );
}
