import PollList from "@/components/poll/PollList";
import PollQRCode from "@/components/poll/PollQRCode";
import { fetchPolls } from "@/hooks/usePolls";

export default async function PollsPage() {
  // server-side initial load (placeholder hook)
  const initialPolls = await fetchPolls();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">All polls</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Browse, search and sort polls — click any poll to view details and
              vote.
            </p>
          </div>
          <div className="text-sm">
            <a
              href="/create-poll"
              className="text-indigo-600 hover:underline"
            >
              Create poll
            </a>
          </div>
        </div>

        <PollList initialPolls={initialPolls} />

        {/* QR Code Demo Section */}
        <section className="mt-12 border-t pt-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Share Polls with QR Codes</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Generate QR codes to easily share polls with others
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PollQRCode 
              pollId="demo-poll-1"
              pollTitle="Team Lunch Preferences"
            />
            <PollQRCode 
              pollId="demo-poll-2"
              pollTitle="Project Priority Vote"
            />
            <PollQRCode 
              pollId="demo-poll-3"
              pollTitle="Office Location Survey"
            />
          </div>
        </section>
      </div>
    </div>
  );
}