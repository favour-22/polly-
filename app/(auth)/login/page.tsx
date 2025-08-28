import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-6">
      <div className="w-full max-w-3xl flex items-center gap-8">
        <div className="hidden md:block w-1/2 p-6 rounded-lg bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-slate-900">
          <h3 className="text-lg font-semibold">Welcome to Polly</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Sign in to manage your polls, view results, and invite collaborators.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}