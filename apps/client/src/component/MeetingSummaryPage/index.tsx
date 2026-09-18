"use client";

import { useState } from "react";
import Link from "next/link";
import { useMeetings } from "@/hooks/useMeeting";
import UploadMeetingModal from "@/component/UploadMeetingModal";
import UserMenu from "@/component/UserMenu";

type MeetingSummaryPageProps = {
  projectId: string;
};

export default function MeetingSummaryPage({ projectId }: MeetingSummaryPageProps) {
  const { data: meetings, isLoading, isError } = useMeetings(projectId);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-page-bg">
      <nav className="flex items-center justify-between px-8 py-4 bg-surface border-b border-border">
        <Link href={`/project/${projectId}`} className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors">
          ← Project
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/home" className="inline-flex items-center justify-center min-h-[36px] px-4 text-sm font-semibold rounded-pill border border-border-strong bg-surface hover:bg-surface-muted transition-all">
            Workspace
          </Link>
          <UserMenu />
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-start justify-between mb-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage mb-2">
              Meeting intelligence
            </p>
            <h1 className="text-4xl font-bold text-text-primary mb-3">Meeting summaries</h1>
            <p className="text-base text-text-secondary">
              Structured records give everyone the same starting point for decisions, dependencies, and next steps.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center min-h-[42px] px-5 text-sm font-semibold text-white rounded-pill bg-brand hover:bg-brand-hover shadow-sm hover:-translate-y-0.5 transition-all"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload transcript
          </button>
        </div>

        {isLoading && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage">
            Loading meetings…
          </p>
        )}

        {isError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
            Failed to load meetings. Please check your connection and try again.
          </div>
        )}

        {!isLoading && !isError && meetings && (
          <>
            {meetings.length === 0 ? (
              <div className="text-center py-16 px-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">No meetings yet</h3>
                <p className="text-sm text-text-secondary mb-6">
                  Upload a meeting transcript to extract structured intelligence and action items.
                </p>
                <button
                  className="inline-flex items-center justify-center min-h-[42px] px-5 text-sm font-semibold text-white rounded-pill bg-brand hover:bg-brand-hover shadow-sm transition-all"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  Upload your first transcript
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <Link
                    href={`/project/${projectId}/meeting/${meeting.meeting_id}`}
                    className="block p-6 bg-surface border border-border rounded-lg hover:border-border-strong hover:shadow-md transition-all"
                    key={meeting.meeting_id}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage mb-2">
                          {new Date(meeting.created_at).toLocaleDateString()} · {meeting.meeting_platform}
                        </p>
                        <h2 className="text-lg font-semibold text-text-primary mb-2">
                          {meeting.summary ? meeting.summary.slice(0, 80) : "Meeting record"}
                        </h2>
                        <p className="text-sm text-text-secondary">
                          {meeting.summary ?? "Transcript uploaded and processing."}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded bg-accent-green-light text-accent-green">
                          MOM ready
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <UploadMeetingModal
        projectId={projectId}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </main>
  );
}
