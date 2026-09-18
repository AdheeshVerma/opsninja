import Link from "next/link";

const projects = [
  { id: "project-orca", name: "Project Orca", description: "Release planning, risks, and accountable follow-through for Bluewave delivery.", members: ["AR", "PK", "ML"], updated: "Active today", integrations: ["Jira", "Slack"] },
  { id: "release-radar", name: "Release Radar", description: "A cross-functional record of launch readiness, blockers, and weekly decisions.", members: ["AR", "JD"], updated: "Active yesterday", integrations: ["Obsidian", "Jira"] },
];

export default function ProjectPage() {
  return (
    <main className="resource-shell">
      <nav className="resource-nav"><Link href="/" className="brand"><span className="mark" aria-hidden="true"><i /><i /><i /><i /></span>Ops Ninja</Link><div><Link href="/integrations" className="resource-nav-link">Integrations</Link><Link href="/home" className="button button-quiet small">Workspace</Link></div></nav>
      <section className="resource-page">
        <div className="projects-header"><div className="resource-intro"><p className="eyebrow">Shared context</p><h1>Projects</h1><p>Every project has a durable record of decisions, meeting intelligence, and pending follow-through.</p></div><button className="button button-primary" type="button">New project</button></div>
        <div className="projects-grid">{projects.map((project) => <Link className="project-card" href={`/project/${project.id}`} key={project.id}><h3>{project.name}</h3><p>{project.description}</p><div className="project-card-tags">{project.integrations.map((integration) => <span className="tag tag-slate" key={integration}>{integration}</span>)}</div><div className="project-card-meta"><div className="project-avatars">{project.members.map((member) => <span key={member}>{member}</span>)}</div><span>{project.updated}</span></div></Link>)}</div>
      </section>
    </main>
  );
}
