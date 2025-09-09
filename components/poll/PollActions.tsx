"use client";

import Button from "@/components/ui/button";

interface PollActionsProps {
  onDelete: () => void;
  submitting: boolean;
  error: string | null;
}

export function PollActions({ onDelete, submitting, error }: PollActionsProps) {
  return (
    <div className="mt-6 border-t pt-4">
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <Button
        onClick={onDelete}
        disabled={submitting}
        className="w-full bg-red-600 text-white hover:bg-red-700"
      >
        {submitting ? "Deleting..." : "Delete Poll"}
      </Button>
    </div>
  );
}
