"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams?.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submittingText = mode === "login" ? "Sign in" : "Create account";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      // simulate network latency (no backend)
      await new Promise((res) => setTimeout(res, 700));

      if (mode === "register") {
        // redirect to login with a flag so the login form can show a success message
        router.push("/(auth)/login?registered=1");
      } else {
        // simulate successful login -> go to dashboard
        router.push("/dashboard");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {mode === "login" ? "Sign in to access your polls." : "Start creating polls and collecting responses."}
        </p>
      </div>

      {registered && mode === "login" && (
        <div className="mb-3 text-sm text-green-700 bg-green-50 dark:bg-green-900/20 rounded px-3 py-2">
          Account created — please sign in.
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
        </div>

        {mode === "register" && (
          <div>
            <label className="block text-sm mb-1">Confirm password</label>
            <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Repeat password" />
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          {mode === "login" ? (
            <Link href="/(auth)/register" className="text-sm text-indigo-600 dark:text-indigo-400 underline">
              Create account
            </Link>
          ) : (
            <Link href="/(auth)/login" className="text-sm text-slate-600 dark:text-slate-300 underline">
              Already have an account?
            </Link>
          )}

          {mode === "login" && (
            <Link href="/forgot-password" className="text-sm text-slate-500 dark:text-slate-400">
              Forgot password?
            </Link>
          )}
        </div>

        <div className="pt-2">
          <Button variant="primary" type="submit" className="w-full" disabled={submitting}>
            {submitting ? (mode === "login" ? "Signing in..." : "Creating...") : submittingText}
          </Button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <span className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
          <span className="text-xs text-slate-400">or continue with</span>
          <span className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <Button className="w-full" type="button" onClick={() => alert("No backend: social sign-in not configured")}>
            GitHub
          </Button>
          <Button className="w-full" type="button" onClick={() => alert("No backend: social sign-in not configured")}>
            Google
          </Button>
        </div>
      </form>
    </div>
  );
}