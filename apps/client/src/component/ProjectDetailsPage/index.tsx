import Link from "next/link";

type ProjectDetailsPageProps = {
  projectId: string;
};

export default function ProjectDetailsPage({
  projectId,
}: ProjectDetailsPageProps) {
  return (
    <main className="resource-shell">
      <nav className="resource-nav"><Link href="/project" className="text-link">← All projects</Link><Link href="/home" className="button button-quiet small">Workspace</Link></nav>
      <section className="resource-page project-context">
        <div className="resource-intro"><p className="eyebrow">Project workspace</p><h1>Project Orca</h1><p>Release planning for Bluewave delivery. Keep the decisions, conversations, and follow-through that shape the October release in one searchable record.</p></div>
        <div className="context-banner"><div><span className="tag tag-green"><i className="status-dot status-green" /> Healthy</span><strong>October 18 release target</strong><p>3 decisions captured from the latest planning session.</p></div><span className="context-id">Project ID: {projectId}</span></div>
        <div className="context-grid">
          <Link href={`/project/${projectId}/meeting-summary`} className="context-card"><span>01</span><h2>Meeting intelligence</h2><p>Review structured summaries, decisions, dependencies, and action owners.</p><b>Open summaries →</b></Link>
          <Link href={`/project/${projectId}/chat`} className="context-card"><span>02</span><h2>Project conversations</h2><p>Continue the questions that need shared context, not another status meeting.</p><b>Open chat →</b></Link>
          <Link href="/integrations" className="context-card"><span>03</span><h2>Connected tools</h2><p>Jira and Obsidian are ready. Slack actions still require a connection.</p><b>Manage integrations →</b></Link>
        </div>
      </section>
    </main>
  );
}
