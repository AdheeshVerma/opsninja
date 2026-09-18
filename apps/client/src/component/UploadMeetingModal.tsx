"use client";

import { FormEvent, useState } from "react";
import { useUploadTranscript } from "@/hooks/useMeeting";

export default function UploadMeetingModal({
  projectId,
  isOpen,
  onClose,
}: {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const upload = useUploadTranscript(projectId);
  const [platform, setPlatform] = useState("Microsoft Teams");
  const [transcript, setTranscript] = useState("");

  if (!isOpen) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await upload.mutateAsync({
      meeting_platform: platform,
      original_transcript: transcript.trim(),
    });
    setTranscript("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="w-full max-w-2xl rounded-lg border border-border bg-surface p-6 shadow-lg"
        onSubmit={submit}
      >
        <h2 className="text-xl font-semibold text-text-primary">
          Upload transcript
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Paste a meeting transcript to create a structured record.
        </p>
        <label
          className="mt-5 block text-sm font-semibold text-text-secondary"
          htmlFor="meeting-platform"
        >
          Platform
          <select
            className="mt-2 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-text-primary"
            id="meeting-platform"
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            <option>Microsoft Teams</option>
            <option>Google Meet</option>
            <option>Zoom</option>
            <option>Other</option>
          </select>
        </label>
        <label
          className="mt-4 block text-sm font-semibold text-text-secondary"
          htmlFor="meeting-transcript"
        >
          Transcript
          <textarea
            className="mt-2 min-h-48 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm leading-6 text-text-primary outline-none focus:border-brand"
            id="meeting-transcript"
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Paste the transcript here"
            required
          />
        </label>
        {upload.isError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            Unable to upload the transcript. Please try again.
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="inline-flex min-h-9 items-center rounded-pill border border-border-strong px-4 text-sm font-semibold text-text-secondary"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-9 items-center rounded-pill bg-brand px-4 text-sm font-semibold text-white disabled:opacity-50"
            type="submit"
            disabled={upload.isPending}
          >
            {upload.isPending ? "Uploading..." : "Upload transcript"}
          </button>
        </div>
      </form>
    </div>
  );
}
