import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";

export default function AdminRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-6">
      <div className="w-full max-w-3xl flex items-center gap-8">
        <div className="hidden md:block w-1/2 p-6 rounded-lg bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-slate-900">
          <h3 className="text-lg font-semibold">Admin Registration</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Create a new admin account to manage the platform.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <AuthForm mode="register" adminRegistration={true} />
          <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Already an admin?{" "}
            <Link
              href="/admin/login"
              className="underline text-indigo-600 dark:text-indigo-400"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
