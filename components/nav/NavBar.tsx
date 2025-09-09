"use client";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full border-b bg-white/60 dark:bg-slate-900/60 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Polly
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/about" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400">
              About
            </Link>
            <Link href="/polls" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400">
              Polls
            </Link>
          <Link href="/create-poll" className="hover:underline">
            Create
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-500"
              >
                Get started
              </Link>
            </>
          ) : (
            // Only show avatar, email, and sign out if user is logged in and not on the homepage
            <>
              {typeof window !== "undefined" && window.location.pathname !== "/" && (
                <div className="flex items-center gap-3">
                  {/* Avatar (first letter of email or a default icon) */}
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="px-3 py-1.5 rounded-md text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}