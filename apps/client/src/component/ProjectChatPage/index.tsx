import Link from "next/link";

type ProjectChatPageProps = {
  projectId: string;
};

export default function ProjectChatPage({ projectId }: ProjectChatPageProps) {
  return (
    <main className="resource-shell">
      <nav className="resource-nav"><Link href={`/project/${projectId}`} className="text-link">← Project Orca</Link><Link href="/home" className="button button-quiet small">Workspace</Link></nav>
      <section className="resource-page">
        <div className="projects-header"><div className="resource-intro"><p className="eyebrow">Project conversations</p><h1>Chat threads</h1><p>Keep questions and answers close to the project context that informed them.</p></div><Link href="/home" className="button button-primary">Ask Ops Ninja</Link></div>
        <div className="thread-list"><Link href={`/project/${projectId}/chat/release-decisions`} className="thread-row"><span className="thread-icon">✦</span><div><h2>Release decisions and scope</h2><p>What did the team agree to defer from the first release?</p></div><span>Today</span></Link><Link href={`/project/${projectId}/chat/action-follow-up`} className="thread-row"><span className="thread-icon">✓</span><div><h2>Follow-up actions</h2><p>Which actions still need an explicit approval?</p></div><span>Sep 12</span></Link></div>
      </section>
    </main>
  );
}
