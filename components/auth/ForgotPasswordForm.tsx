"use client";
import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // simulate sending reset email (no backend)
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    setSending(false);
  };

  if (sent) {
    return (
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          If an account exists for <span className="font-medium">{email || "that address"}</span>, a password reset link has been sent.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <Link href="/login" className="inline-block px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-500">
            Back to sign in
          </Link>
          <button
            type="button"
            onClick={() => { setSent(false); setEmail(""); }}
            className="text-sm text-slate-600 dark:text-slate-300 underline"
          >
            Send again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold">Reset your password</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Enter your email and we’ll send a password reset link.
      </p>

      <div className="mt-4">
        <label className="block text-sm mb-1">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
      </div>

      <div className="mt-4">
        <Button variant="primary" type="submit" className="w-full" disabled={sending}>
          {sending ? "Sending..." : "Send reset link"}
        </Button>
      </div>

      <div className="mt-3 text-sm text-center">
        <Link href="/login" className="underline text-indigo-600 dark:text-indigo-400">Back to sign in</Link>
      </div>
    </form>
  );
}