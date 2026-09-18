"use client";

import { useState } from "react";
import Link from "next/link";

const integrations = [
  { id: "obsidian", name: "Obsidian", description: "Keep approved meeting notes and linked context in your vault.", connected: true, symbol: "◆" },
  { id: "jira", name: "Jira", description: "Turn approved action items into traceable delivery work.", connected: true, symbol: "◇" },
  { id: "slack", name: "Slack", description: "Prepare follow-ups for the channels where work happens.", connected: false, symbol: "#" },
];

export default function IntegrationsPage() {
  const [connected, setConnected] = useState(() => new Set(integrations.filter((item) => item.connected).map((item) => item.id)));

  return (
    <main className="resource-shell">
      <nav className="resource-nav"><Link href="/" className="brand"><span className="mark" aria-hidden="true"><i /><i /><i /><i /></span>Ops Ninja</Link><div><Link href="/project" className="resource-nav-link">Projects</Link><Link href="/home" className="button button-quiet small">Workspace</Link></div></nav>
      <section className="resource-page">
        <div className="resource-intro"><p className="eyebrow">Workspace setup</p><h1>Integrations</h1><p>Connect the tools where your team keeps context and carries work forward. Ops Ninja always asks before an external action is sent.</p></div>
        <div className="integrations-grid">{integrations.map((integration) => { const isConnected = connected.has(integration.id); return <article className="integration-card" key={integration.id}><span className={`integration-card-icon ${integration.id}`}>{integration.symbol}</span><h3>{integration.name}</h3><p>{integration.description}</p><div className="integration-status"><span className={isConnected ? "connected" : "disconnected"}><i className={`status-dot ${isConnected ? "status-green" : "status-blue"}`} />{isConnected ? "Connected" : "Not connected"}</span><button className="button button-quiet small" type="button" onClick={() => setConnected((items) => { const next = new Set(items); if (next.has(integration.id)) next.delete(integration.id); else next.add(integration.id); return next; })}>{isConnected ? "Configure" : "Connect"}</button></div></article>; })}</div>
      </section>
    </main>
  );
}
