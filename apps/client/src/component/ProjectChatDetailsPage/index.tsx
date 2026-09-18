"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMessages, useSendMessage } from "@/hooks/useMessage";
import UserMenu from "@/component/UserMenu";

type ProjectChatDetailsPageProps = {
  chatId: string;
  projectId: string;
};

export default function ProjectChatDetailsPage({
  chatId,
  projectId,
}: ProjectChatDetailsPageProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading, isError } = useMessages(projectId, chatId);
  const sendMessage = useSendMessage(projectId, chatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sendMessage.isPending) return;
    sendMessage.mutate(text);
    setInput("");
  }

  return (
    <main className="min-h-screen bg-page-bg flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 bg-surface border-b border-border">
        <Link href={`/project/${projectId}/chat`} className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors">
          ← Chat threads
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/home" className="inline-flex items-center justify-center min-h-[36px] px-4 text-sm font-semibold rounded-pill border border-border-strong bg-surface hover:bg-surface-muted transition-all">
            Workspace
          </Link>
          <UserMenu />
        </div>
      </nav>

      <section className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-8 py-12">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage mb-2">
            Project · Chat
          </p>
          <h1 className="text-3xl font-bold text-text-primary mb-1">Chat</h1>
          <p className="text-sm text-text-secondary">Thread ID: {chatId}</p>
        </div>

        <div className="flex-1 flex flex-col bg-surface border border-border rounded-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading && (
              <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage">
                Loading messages…
              </p>
            )}

            {isError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                Failed to load messages. Please check your connection and try again.
              </div>
            )}

            {messages?.map((msg) => (
              <div
                className={`flex gap-3 ${msg.message_type === "USER" ? "justify-end" : ""}`}
                key={msg.message_id}
              >
                <div className={`max-w-[80%] ${msg.message_type === "USER" ? "order-1" : ""}`}>
                  <span className="text-xs font-semibold text-text-muted mb-1 block">
                    {msg.message_type === "USER" ? "You" : "ON"}
                  </span>
                  <div className={`p-4 rounded-lg ${
                    msg.message_type === "USER"
                      ? "bg-brand text-white"
                      : "bg-surface-muted text-text-primary"
                  }`}>
                    <p className="text-sm m-0">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}

            {sendMessage.isPending && (
              <div className="flex gap-3">
                <div className="max-w-[80%]">
                  <span className="text-xs font-semibold text-text-muted mb-1 block">ON</span>
                  <div className="p-4 rounded-lg bg-surface-muted text-text-primary">
                    <p className="text-sm m-0">Thinking…</p>
                  </div>
                </div>
              </div>
            )}

            {sendMessage.isError && (
              <div className="text-sm text-red-600">
                Failed to send message. Please try again.
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form className="flex items-stretch gap-2 p-4 border-t border-border" onSubmit={submit}>
            <label htmlFor="chat-input" className="sr-only">
              Ask a project question
            </label>
            <input
              id="chat-input"
              className="flex-1 px-4 py-2.5 border border-border rounded-md text-sm text-text-primary bg-surface focus:outline-none focus:border-brand transition-colors disabled:opacity-50"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about this project..."
              disabled={sendMessage.isPending}
            />
            <button
              className="inline-flex items-center justify-center min-h-[42px] px-5 text-sm font-semibold text-white rounded-pill bg-brand hover:bg-brand-hover shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={sendMessage.isPending}
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
