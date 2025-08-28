"use client";
import Link from "next/link";

export default function PollCard({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description?: string;
}) {
  return (
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
          <Link href={`/polls/${id}`} className="underline">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}