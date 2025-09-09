import NavBar from "@/components/nav/NavBar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <NavBar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600 dark:text-indigo-400">
            About Polly
          </h1>
          <div className="space-y-6 text-slate-700 dark:text-slate-300">
            <p className="text-lg leading-relaxed">
              Welcome to Polly, your go-to platform for creating and sharing polls with ease. Whether you're looking to gather opinions, make decisions with a group, or just have some fun, Polly provides the tools you need to get instant feedback.
            </p>
            <p className="leading-relaxed">
              Our mission is to make polling simple, accessible, and engaging. With a user-friendly interface, you can create a poll in seconds, add as many options as you need, and share it with your audience through a direct link or a scannable QR code.
            </p>
            <h2 className="text-2xl font-semibold pt-4 border-t border-slate-200 dark:border-slate-700">
              Key Features
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Easy Poll Creation:</strong> A straightforward form to get your poll up and running in no time.
              </li>
              <li>
                <strong>Secure Voting:</strong> Users must be logged in to create polls and vote, ensuring that results are authentic.
              </li>
              <li>
                <strong>Real-time Results:</strong> Watch the results come in live as your audience votes.
              </li>
              <li>
                <strong>QR Code Sharing:</strong> Instantly generate a QR code for your poll to easily share it in presentations, on social media, or in person.
              </li>
              <li>
                <strong>User Dashboard:</strong> Keep track of all the polls you've created in your personal dashboard.
              </li>
              <li>
                <strong>Poll Management:</strong> You have full control over your polls and can delete them at any time.
              </li>
            </ul>
            <p className="text-center pt-6 border-t border-slate-200 dark:border-slate-700 font-medium text-indigo-600 dark:text-indigo-400">
              Start creating your first poll today and see what Polly can do for you!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
