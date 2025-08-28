"use client";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full border-b px-6 py-4 bg-card">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold">
          Polly
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/polls" className="text-sm">
            Polls
          </Link>
          <Link href="/create-poll" className="text-sm">
            Create
          </Link>
          <Link href="/login" className="text-sm">
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
}