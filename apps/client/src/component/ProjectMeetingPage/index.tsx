"use client";

import Link from "next/link";
import { useMeeting } from "@/hooks/useMeeting";
import { useActions, useExecuteAction } from "@/hooks/useAction";
import ExpandableContent from "@/component/ExpandableContent";
import UserMenu from "@/component/UserMenu";

type ProjectMeetingPageProps = {
  meetingId: string;
  projectId: string;
};

export default function ProjectMeetingPage({ meetingId, projectId }: ProjectMeetingPageProps) {
  const { data: meeting, isLoading: meetingLoading, isError: meetingError } = useMeeting(projectId, meetingId);
  const { data: actions, isLoading: actionsLoading, isError: actionsError } = useActions(projectId, meetingId);
  const executeAction = useExecuteAction(projectId, meetingId);

  return (
    <main className="min-h-screen bg-page-bg">
      <nav className="flex items-center justify-between px-8 py-4 bg-surface border-b border-border">
        <Link href={`/project/${projectId}/meeting-summary`} className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors">
          ← Meeting summaries
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/home" className="inline-flex items-center justify-center min-h-[36px] px-4 text-sm font-semibold rounded-pill border border-border-strong bg-surface hover:bg-surface-muted transition-all">
            Workspace
          </Link>
          <UserMenu />
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-12">
        {meetingLoading && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage">
            Loading meeting…
          </p>
        )}

        {meetingError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
            Failed to load meeting. Please check your connection and try again.
          </div>
        )}

        {meeting && (
          <>
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage mb-2">
                Structured meeting record
              </p>
              <h1 className="text-4xl font-bold text-text-primary mb-3">
                {meeting.summary ? meeting.summary.slice(0, 60) : "Meeting record"}
              </h1>
              <p className="text-sm text-text-secondary">
                {new Date(meeting.created_at).toLocaleDateString()} · {meeting.meeting_platform}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <article className="lg:col-span-2 p-8 bg-surface border border-border rounded-lg">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded bg-accent-green-light text-accent-green">
                    Saved to vault
                  </span>
                  <span className="text-xs text-text-muted">Meeting ID: {meetingId}</span>
                </div>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-text-primary mb-3">Summary</h2>
                  <p className="text-sm text-text-secondary">{meeting.summary ?? "Processing…"}</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-text-primary mb-3">Transcript</h2>
                  <ExpandableContent content={meeting.original_transcript} maxLength={300} />
                </section>
              </article>

              <aside className="p-6 bg-surface border border-border rounded-lg h-fit">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage mb-2">
                  Proposed follow-through
                </p>
                <h2 className="text-xl font-semibold text-text-primary mb-4">Actions</h2>

                {actionsLoading && <p className="text-sm text-text-secondary">Loading actions…</p>}

                {actionsError && (
                  <div className="text-sm text-red-600">Failed to load actions.</div>
                )}

                {actions && actions.length === 0 && (
                  <p className="text-sm text-text-secondary">No actions for this meeting.</p>
                )}

                {actions && actions.map((action) => (
                  <div key={action.action_id} className="mb-4 pb-4 border-b border-border last:border-0">
                    <p className="font-semibold text-sm text-text-primary mb-2">{action.title}</p>
                    <p className="mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-surface-muted text-text-secondary">
                        {action.action_status}
                      </span>
                    </p>
                    {action.action_status === "pending" && (
                      <button
                        className="inline-flex items-center justify-center min-h-[36px] px-4 text-sm font-semibold text-white rounded-pill bg-brand hover:bg-brand-hover shadow-sm transition-all disabled:opacity-50"
                        type="button"
                        disabled={executeAction.isPending}
                        onClick={() => executeAction.mutate({ actionId: action.action_id, proposal: action, credentials: {} })}
                      >
                        Execute
                      </button>
                    )}
                  </div>
                ))}

                <span className="text-xs text-text-muted block mt-4">Project ID: {projectId}</span>
              </aside>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
