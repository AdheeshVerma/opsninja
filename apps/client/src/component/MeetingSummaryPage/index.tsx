import Link from "next/link";

type MeetingSummaryPageProps = {
  projectId: string;
};

export default function MeetingSummaryPage({
  projectId,
}: MeetingSummaryPageProps) {
  return (
    <main className="resource-shell">
      <nav className="resource-nav"><Link href={`/project/${projectId}`} className="text-link">← Project Orca</Link><Link href="/home" className="button button-quiet small">Workspace</Link></nav>
      <section className="resource-page">
        <div className="resource-intro"><p className="eyebrow">Meeting intelligence</p><h1>Meeting summaries</h1><p>Structured records give everyone the same starting point for decisions, dependencies, and next steps.</p></div>
        <div className="record-list">
          <Link href={`/project/${projectId}/meeting/sprint-planning`} className="meeting-record"><div><p className="eyebrow">Sep 12, 2026 · 46 minutes</p><h2>Project Orca sprint planning</h2><p>Bluewave confirmed the October 18 release target and prioritized exception visibility, ownership, and daily reporting.</p></div><div className="record-meta"><span className="tag tag-green">MOM ready</span><span>3 decisions · 3 actions</span></div></Link>
          <article className="meeting-record muted-record"><div><p className="eyebrow">Sep 05, 2026 · 31 minutes</p><h2>Release discovery</h2><p>Initial scope and stakeholder needs are stored in the project vault.</p></div><div className="record-meta"><span className="tag tag-slate">Archived</span><span>2 decisions</span></div></article>
        </div>
      </section>
    </main>
  );
}
