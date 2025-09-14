"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";

export default function AuthForm({
  mode = "login",
  isAdminLogin = false,
  adminRegistration = false,
}: {
  mode?: "login" | "register";
  isAdminLogin?: boolean;
  adminRegistration?: boolean;
}) {
  const router = useRouter();
  const { signIn, signUp, error: authError } = useAuth();
  const searchParams = useSearchParams();
  const registered = searchParams?.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submittingText = mode === "login" ? "Sign in" : "Create account";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "register") {
        if (password !== confirm) {
          setError("Passwords do not match.");
          return;
        }
<<<<<<< HEAD
        await signUp(email, password, isAdmin, adminRegistration ? adminSecret : undefined);
=======
        await signUp(email, password);
>>>>>>> 7f193740d91ef55c668cde61718f0a899a0ca0e2
      } else {
        await signIn(email, password, isAdminLogin);
      }
    } catch (err: any) {
      setError(err.message);
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

      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">
          {error}
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
          <>
            <div>
              <label className="block text-sm mb-1">Confirm password</label>
              <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Repeat password" />
            </div>
            {mode === 'register' && !adminRegistration && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isAdmin">Register as Admin</label>
              </div>
            )}

            {adminRegistration && (
              <div>
                <label className="block text-sm mb-1">Admin Secret</label>
                <Input
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  type="password"
                  placeholder="Enter admin secret"
                />
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-between mt-2">
          {mode === "login" ? (
            <Link href="/register" className="text-sm text-indigo-600 dark:text-indigo-400 underline">
              Create account
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-slate-600 dark:text-slate-300 underline">
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