import Link from "next/link";

type ProjectMeetingPageProps = {
  meetingId: string;
  projectId: string;
};

export default function ProjectMeetingPage({
  meetingId,
  projectId,
}: ProjectMeetingPageProps) {
  return (
    <main className="resource-shell">
      <nav className="resource-nav"><Link href={`/project/${projectId}/meeting-summary`} className="text-link">← Meeting summaries</Link><Link href="/home" className="button button-quiet small">Workspace</Link></nav>
      <section className="resource-page meeting-page">
        <div className="resource-intro"><p className="eyebrow">Structured meeting record</p><h1>Project Orca sprint planning</h1><p>September 12, 2026 · 46 minutes · Microsoft Teams</p></div>
        <div className="meeting-layout"><article className="record-document"><div className="document-title"><span className="tag tag-green">Saved to vault</span><span>Meeting ID: {meetingId}</span></div><section><h2>Objective</h2><p>Align the first Project Orca release around the operational problems that will make the largest impact for the Bluewave delivery team.</p></section><section><h2>Summary</h2><p>The team confirmed the October 18 release target. The first release will focus on exception visibility, clear ownership, and a daily reporting loop. Advanced analytics moves to a later phase so the team can validate the core workflow first.</p></section><div className="record-columns"><section><h2>Decisions</h2><ul><li>Keep the October 18 release target.</li><li>Prioritize exception visibility and ownership assignment.</li><li>Defer advanced analytics beyond the first release.</li></ul></section><section><h2>Risks</h2><ul><li>Jira access is still needed for the delivery board.</li><li>Daily report ownership needs a named approver.</li></ul></section></div></article><aside className="record-aside"><p className="eyebrow">Proposed follow-through</p><h2>Actions need approval</h2><p>Ops Ninja has prepared two external actions from this record. Nothing has been sent.</p><Link href="/home" className="button button-primary full">Review approval queue</Link><span>Project ID: {projectId}</span></aside></div>
      </section>
    </main>
  );
}
