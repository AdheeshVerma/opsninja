"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type ProjectChatDetailsPageProps = {
  chatId: string;
  projectId: string;
};

export default function ProjectChatDetailsPage({
  chatId,
  projectId,
}: ProjectChatDetailsPageProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message) return;
    setMessages((items) => [...items, message]);
    setInput("");
  }

  return (
    <main className="resource-shell">
      <nav className="resource-nav"><Link href={`/project/${projectId}/chat`} className="text-link">← Chat threads</Link><Link href="/home" className="button button-quiet small">Workspace</Link></nav>
      <section className="resource-page thread-page">
        <div className="resource-intro"><p className="eyebrow">Project Orca · Chat</p><h1>Release decisions and scope</h1><p>Thread ID: {chatId}</p></div>
        <div className="thread-conversation"><div className="thread-message assistant"><span>ON</span><p>The team agreed to keep the October 18 release target. The first release focuses on exception visibility, ownership assignment, and daily reporting.</p></div><div className="thread-message user"><span>AR</span><p>What moved to a later release?</p></div><div className="thread-message assistant"><span>ON</span><p>Advanced analytics was deferred so the team can validate the core operational workflow first. I can prepare a Jira task for that follow-up, but it will remain in the approval queue until you decide.</p></div>{messages.map((message) => <div className="thread-message user" key={message}><span>AR</span><p>{message}</p></div>)}<form className="thread-compose" onSubmit={submit}><input aria-label="Ask a project question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about this project..." /><button className="button button-primary" type="submit">Send</button></form></div>
      </section>
    </main>
  );
}
