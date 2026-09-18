import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="resource-shell">
      <nav className="resource-nav"><Link href="/" className="brand"><span className="mark" aria-hidden="true"><i /><i /><i /><i /></span>Ops Ninja</Link><Link href="/home" className="button button-quiet small">Open workspace</Link></nav>
      <section className="resource-page about-page"><div className="resource-intro"><p className="eyebrow orange-eyebrow">About Ops Ninja</p><h1>Good operations start with a record everyone can trust.</h1><p>Ops Ninja turns meetings into structured project context, then helps teams prepare clear next steps without taking action on their behalf.</p></div><div className="about-grid"><article><span>01</span><h2>Keep the signal</h2><p>Decisions, dependencies, and commitments are captured in an editable meeting record, not buried in a transcript.</p></article><article><span>02</span><h2>Connect the context</h2><p>Meeting intelligence stays linked to projects, people, and connected tools so later questions have a real foundation.</p></article><article><span>03</span><h2>Protect the handoff</h2><p>Every Jira issue or Slack message is a visible proposal. A person must approve it before it leaves the workspace.</p></article></div></section>
    </main>
  );
}
