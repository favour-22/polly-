"use client";

import type { PollWithOptions } from "@/lib/types";
import Button from "@/components/ui/button";

interface VoteFormProps {
  poll: PollWithOptions;
  selectedOption: string | null;
  onOptionChange: (optionId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
}

export function VoteForm({
  poll,
  selectedOption,
  onOptionChange,
  onSubmit,
  submitting,
  error
}: VoteFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        {poll.options.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <input
              type="radio"
              name="option"
              value={opt.id}
              checked={selectedOption === opt.id}
              onChange={() => onOptionChange(opt.id)}
              className="accent-indigo-600"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        disabled={!selectedOption || submitting}
        className="w-full"
      >
        {submitting ? "Submitting..." : "Submit Vote"}
      </Button>
    </form>
  );
}
