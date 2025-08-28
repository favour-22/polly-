import NavBar from "@/components/nav/NavBar";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Forgot password</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">We will send a password reset link to your email (simulated).</p>
        </div>

        <ForgotPasswordForm />
      </main>
    </div>
  );
}