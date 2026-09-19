"use client";

import { useState } from "react";
import Link from "next/link";
import { useProject } from "@/hooks/useProject";
import { useMeeting } from "@/hooks/useMeeting";
import { useActions, useExecuteAction } from "@/hooks/useAction";
import ExpandableContent from "@/component/ExpandableContent";

type ProjectMeetingPageProps = {
  meetingId: string;
  projectId: string;
};

export default function ProjectMeetingPage({
  meetingId,
  projectId,
}: ProjectMeetingPageProps) {
  const { data: project } = useProject(projectId);
  const {
    data: meeting,
    isLoading: meetingLoading,
    isError: meetingError,
  } = useMeeting(projectId, meetingId);
  const {
    data: actions,
    isLoading: actionsLoading,
    isError: actionsError,
  } = useActions(projectId, meetingId);
  const executeAction = useExecuteAction(projectId, meetingId);

  const [copied, setCopied] = useState(false);

  const handleCopyTranscript = () => {
    if (meeting?.original_transcript) {
      navigator.clipboard.writeText(meeting.original_transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const actionList = actions ?? [];

  return (
    <div className="workspace-page space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#8a9587]">
        <Link
          href={`/project/${projectId}`}
          className="text-[#59745b] transition hover:text-[#20251f]"
        >
          {project?.name || "Project"}
        </Link>
        <span>/</span>
        <Link
          href={`/project/${projectId}/meeting-summary`}
          className="text-[#59745b] transition hover:text-[#20251f]"
        >
          Meeting Records
        </Link>
        <span>/</span>
        <span className="text-[#20251f] font-bold">
          {meeting?.meeting_platform || "Record"}
        </span>
      </nav>

      {/* Loading state */}
      {meetingLoading && (
        <div className="space-y-6">
          <div className="h-32 animate-pulse rounded-3xl border border-[#dfe5dc] bg-white p-8" />
          <div className="h-72 animate-pulse rounded-3xl border border-[#dfe5dc] bg-white p-8" />
        </div>
      )}

      {/* Error state */}
      {meetingError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Meeting record could not be loaded. Please check your connection and try again.
        </div>
      )}

      {meeting && (
        <>
          {/* Header Banner */}
          <section className="flex flex-col gap-4 border-b border-[#dfe5dc] bg-transparent pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-[#f0f5ee] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#59745b] shadow-xs">
                  {meeting.meeting_platform || "Meeting Platform"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf6ec] px-3.5 py-1 text-xs font-bold text-[#347146] border border-[#16a34a]/20">
                  <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
                  Saved to vault
                </span>
              </div>
              <span className="text-xs text-[#8a9587]">
                Meeting ID: <code className="font-mono text-[#596257]">{meetingId.slice(0, 8)}…</code>
              </span>
            </div>

            <h1 className="text-xl font-extrabold tracking-tight text-[#20251f] sm:text-2xl leading-snug">
              {meeting.summary
                ? meeting.summary.slice(0, 90) + (meeting.summary.length > 90 ? "…" : "")
                : "Meeting Intelligence Record"}
            </h1>

            <p className="text-xs text-[#7a8678]">
              Recorded on{" "}
              {new Date(meeting.created_at).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </section>

          {/* 2-Column Content: Summary & Actions */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left Column: Summary & Transcript */}
            <div className="space-y-4">
              {/* Structured MOM Card */}
              <article className="border border-[#dfe5dc] bg-white p-5">
                <div className="flex items-center gap-3 border-b border-[#f0f3ee] pb-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#f0f8ef] text-sm font-bold text-[#2f7447] shadow-xs">
                    ✓
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-[#20251f]">
                      Structured Minutes of the Meeting
                    </h2>
                    <p className="text-xs text-[#7a8678]">Decisions, dependencies, and discussion context</p>
                  </div>
                </div>

                <div className="mt-6 text-sm leading-relaxed text-[#596257] whitespace-pre-wrap">
                  {meeting.summary || "Summary is being synthesized..."}
                </div>
              </article>

              {/* Transcript Card */}
              <article className="border border-[#dfe5dc] bg-white p-5">
                <div className="flex items-center justify-between border-b border-[#f0f3ee] pb-5">
                  <div>
                    <h2 className="text-lg font-bold text-[#20251f]">Original Transcript</h2>
                    <p className="text-xs text-[#7a8678]">Source conversation record</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyTranscript}
                    className="rounded-xl border border-[#dfe5dc] bg-white px-4 py-2 text-xs font-bold text-[#59745b] shadow-xs transition hover:border-[#59745b] hover:bg-[#f0f5ee]"
                  >
                    {copied ? "✓ Copied!" : "Copy transcript"}
                  </button>
                </div>

                <div className="mt-6">
                  <ExpandableContent
                    content={meeting.original_transcript || "No transcript content."}
                    maxLength={350}
                  />
                </div>
              </article>
            </div>

            {/* Right Column: Extracted Actions */}
            <aside className="h-fit border border-[#dfe5dc] bg-white p-5 lg:sticky lg:top-20">
              <div className="flex items-center justify-between border-b border-[#f0f3ee] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#c2491d]" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#c2491d]">
                      Approval Gate
                    </p>
                  </div>
                  <h2 className="mt-1 text-lg font-bold text-[#20251f]">Action Items</h2>
                </div>
                <span className="rounded-full bg-[#fff1e9] px-3 py-1 text-xs font-bold text-[#b5522c] border border-[#c2491d]/20">
                  {actionList.length} total
                </span>
              </div>

              {actionsLoading && (
                <div className="mt-6 space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#f7f8f5]" />
                  ))}
                </div>
              )}

              {actionsError && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                  Failed to load action items.
                </div>
              )}

              {!actionsLoading && !actionsError && actionList.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-[#cbd9c8] bg-[#fafaf8] p-8 text-center">
                  <p className="text-xs text-[#667166]">No action items were identified in this meeting.</p>
                </div>
              )}

              {!actionsLoading && !actionsError && actionList.length > 0 && (
                <div className="mt-6 space-y-4">
                  {actionList.map((action) => {
                    const isPending =
                      action.action_status === "pending" ||
                      action.action_status === "initialized" ||
                      action.action_status === "un_initialized";
                    const isSuccess =
                      action.action_status === "completed" ||
                      action.action_status === "success";

                    return (
                      <div
                        key={action.action_id}
                        className="rounded-2xl border border-[#edf0eb] bg-[#fafaf8] p-5 shadow-xs transition hover:border-[#dfe5dc] hover:bg-white"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#59745b]">
                              {action.action_type || "Follow-up Task"}
                            </span>
                            <h3 className="mt-1 text-sm font-bold text-[#20251f]">
                              {action.title || action.description}
                            </h3>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              isSuccess
                                ? "bg-[#eaf6ec] text-[#347146]"
                                : isPending
                                ? "bg-[#fff8ea] text-[#b45309]"
                                : "bg-[#fff1f1] text-[#b91c1c]"
                            }`}
                          >
                            {action.action_status || "pending"}
                          </span>
                        </div>

                        {action.description && action.title && (
                          <p className="mt-2 text-xs leading-relaxed text-[#596257]">
                            {action.description}
                          </p>
                        )}

                        <div className="mt-4 flex items-center justify-between border-t border-[#f0f3ee] pt-3 text-xs">
                          <span className="text-[11px] text-[#8a9587]">
                            Platform:{" "}
                            <strong className="text-[#20251f]">
                              {action.action_type || "manual"}
                            </strong>
                          </span>

                          {isPending && (
                            <button
                              type="button"
                              disabled={executeAction.isPending}
                              onClick={() =>
                                executeAction.mutate({
                                  actionId: action.action_id,
                                  proposal: action,
                                  credentials: {},
                                })
                              }
                              className="rounded-xl bg-[#20251f] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#323c31] disabled:opacity-50 active:scale-[0.98]"
                            >
                              {executeAction.isPending ? "Executing…" : "Approve & Run"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
