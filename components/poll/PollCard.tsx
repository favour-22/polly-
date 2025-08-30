"use client";
import Link from "next/link";
import { useState } from "react";
import PollQRCode from "./PollQRCode";

export default function PollCard({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description?: string;
}) {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <article className="rounded-lg border p-4 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold">
        <Link href={`/polls/${id}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-300 mt-2">
          {description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          Options:{" "}
          <span className="font-medium text-slate-700 dark:text-slate-100">4</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
            12 votes
          </span>
          <button
            onClick={() => setShowQR(!showQR)}
            className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
            title="Show QR Code"
          >
            📱 QR
          </button>
          <Link href={`/polls/${id}`} className="underline">
            View
          </Link>
        </div>
              </div>
      </article>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share Poll</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <PollQRCode 
              pollId={id}
              pollTitle={title}
            />
          </div>
        </div>
      )}
    </>
  );
}