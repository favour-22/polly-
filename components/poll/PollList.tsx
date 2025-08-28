"use client";
import { useMemo, useState } from "react";
import PollCard from "./PollCard";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

type Poll = { id: string; title: string; description?: string };

export default function PollList({ initialPolls }: { initialPolls: Poll[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "title">("newest");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = initialPolls.filter((p) => !q || p.title.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q));
    if (sort === "title") out = out.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "newest") out = out.sort((a, b) => Number(b.id) - Number(a.id));
    return out;
  }, [initialPolls, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetToFirst = () => setPage(1);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search polls by title or description..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); resetToFirst(); }}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 dark:text-slate-300">Sort</label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as any); resetToFirst(); }}
            className="rounded-md border px-2 py-1 text-sm bg-white dark:bg-slate-800"
            aria-label="Sort polls"
          >
            <option value="newest">Newest</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-sm text-slate-500 dark:text-slate-400">
            No polls found. Try a different search or create a new poll.
          </div>
        ) : (
          pageItems.map((p) => <PollCard key={p.id} id={p.id} title={p.title} description={p.description} />)
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3"
          >
            Prev
          </Button>

          <div className="text-sm text-slate-600 dark:text-slate-300 px-2">
            {page} / {totalPages}
          </div>

          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}