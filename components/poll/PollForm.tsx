"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import PollQRCode from "./PollQRCode";
import { createPoll } from "@/lib/database";
import useAuth from "@/hooks/useAuth";

export default function PollForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const addOption = () => setOptions((o) => [...o, ""]);
  const removeOption = (idx: number) =>
    setOptions((o) => o.filter((_, i) => i !== idx));
  const setOption = (idx: number, value: string) =>
    setOptions((o) => o.map((v, i) => (i === idx ? value : v)));

  const validOptions = () => options.filter(Boolean).length >= 2;
  const validForm = () => title.trim().length > 0 && validOptions();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to create a poll.");
      return;
    }

    if (!validForm()) {
      setError("Please provide a title and at least two non-empty options.");
      return;
    }

    setSubmitting(true);

    try {
      const pollData = {
        title: title.trim(),
        description: description.trim() || undefined,
        options: options.filter(Boolean)
      };

      const newPollId = await createPoll(pollData, user.id);

      if (newPollId) {
        setSuccessId(newPollId);

        // longer pause so user can see and use the QR code, then navigate to the poll page
        setTimeout(() => {
          router.push(`/polls/${newPollId}`);
        }, 5000);
      } else {
        setError("Failed to create poll. Try again.");
      }
    } catch (err) {
      setError("Failed to create poll. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div>
        <label className="block text-sm font-medium mb-2">Poll title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Which feature should we build next?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add context or details about this poll."
          className="w-full rounded-md border px-3 py-2 text-sm bg-transparent resize-none min-h-[80px]"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Options</label>
          <button
            type="button"
            onClick={addOption}
            className="text-sm text-indigo-600 hover:underline"
            aria-label="Add option"
          >
            + Add option
          </button>
        </div>

        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-100">
                {i + 1}
              </span>

              <Input
                value={opt}
                onChange={(e) => setOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
              />

              <button
                type="button"
                onClick={() => removeOption(i)}
                disabled={options.length <= 2}
                className={`text-sm px-2 py-1 rounded-md ${options.length <= 2 ? "text-slate-300" : "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"}`}
                aria-label={`Remove option ${i + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          At least two non-empty options are required.
        </p>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {successId && (
        <>
          <div className="text-sm text-green-600 mb-4">
            Poll created successfully! Here's your QR code to share:
          </div>
          
          <div className="border-t pt-6">
            <div className="flex justify-center">
              <PollQRCode 
                pollId={successId}
                pollTitle={title}
              />
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        <Button variant="primary" type="submit" className="flex-1" disabled={submitting || !validForm()}>
          {submitting ? "Creating..." : "Create poll"}
        </Button>

        <Button type="button" className="text-sm" onClick={() => {
          // reset form
          setTitle("");
          setDescription("");
          setOptions(["", ""]);
          setError(null);
        }}>
          Reset
        </Button>
      </div>
    </form>
  );
}