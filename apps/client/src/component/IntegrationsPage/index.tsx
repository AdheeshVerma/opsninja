"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyIntegrations, useDisconnectIntegration } from "@/hooks/useIntegration";
import ConfirmDialog from "@/component/ConfirmDialog";
import UserMenu from "@/component/UserMenu";
import { useAuth } from "@/contexts/AuthContext";

const INTEGRATION_META: Record<string, { symbol: string; description: string }> = {
  jira: { symbol: "◇", description: "Turn approved action items into traceable delivery work." },
  slack: { symbol: "#", description: "Prepare follow-ups for the channels where work happens." },
  calendar: { symbol: "◎", description: "Keep meeting context linked to calendar events." },
};

export default function IntegrationsPage() {
  const { data: integrations, isLoading, isError } = useMyIntegrations();
  const disconnect = useDisconnectIntegration();
  const [platformToDisconnect, setPlatformToDisconnect] = useState<string | null>(null);
  const { user } = useAuth();

  const handleConnect = (platform: "jira" | "slack" | "calendar") => {
    if (!user) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

    if (platform === "jira") {
      const siteUrl = prompt("Enter your Jira site URL (e.g., https://yourcompany.atlassian.net):");
      if (siteUrl) {
        window.location.href = `${apiBase}/api/v1/auth/jira?user_id=${user.user_id}&site_url=${encodeURIComponent(siteUrl)}`;
      }
    } else {
      alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} integration coming soon!`);
    }
  };

  const handleDisconnect = async () => {
    if (platformToDisconnect) {
      await disconnect.mutateAsync(platformToDisconnect as "jira" | "slack" | "calendar");
      setPlatformToDisconnect(null);
    }
  };

  return (
    <main className="min-h-screen bg-page-bg">
      <nav className="flex items-center justify-between px-8 py-4 bg-surface border-b border-border">
        <Link href="/" className="flex items-center gap-2 text-text-primary font-semibold">
          <span className="mark" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          Ops Ninja
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/project" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Projects
          </Link>
          <Link href="/home" className="inline-flex items-center justify-center min-h-[36px] px-4 text-sm font-semibold rounded-pill border border-border-strong bg-surface hover:bg-surface-muted transition-all">
            Workspace
          </Link>
          <UserMenu />
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="max-w-2xl mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage mb-2">
            Workspace setup
          </p>
          <h1 className="text-4xl font-bold text-text-primary mb-3">Integrations</h1>
          <p className="text-base text-text-secondary">
            Connect the tools where your team keeps context and carries work forward. Ops Ninja always asks before an external action is sent.
          </p>
        </div>

        {isLoading && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage">
            Loading integrations…
          </p>
        )}

        {isError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
            Failed to load integrations. Please check your connection and try again.
          </div>
        )}

        {!isLoading && !isError && integrations && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => {
              const meta = INTEGRATION_META[integration.platform] ?? { symbol: "●", description: "" };
              const isConnected = integration.connected;
              return (
                <article className="p-6 bg-surface border border-border rounded-lg" key={integration.integration_id}>
                  <span className={`inline-flex items-center justify-center w-12 h-12 mb-4 text-2xl ${integration.platform === 'jira' ? 'text-blue-600' : integration.platform === 'slack' ? 'text-purple-600' : 'text-green-600'}`}>
                    {meta.symbol}
                  </span>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {integration.platform.charAt(0).toUpperCase() + integration.platform.slice(1)}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">{meta.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm">
                      <i className={`status-dot ${isConnected ? "status-green" : "status-blue"}`} />
                      <span className={isConnected ? "text-accent-green" : "text-brand"}>
                        {isConnected ? "Connected" : "Not connected"}
                      </span>
                    </span>
                    {isConnected ? (
                      <button
                        className="inline-flex items-center justify-center min-h-[36px] px-4 text-sm font-semibold rounded-pill border border-border-strong bg-surface hover:bg-surface-muted transition-all disabled:opacity-50"
                        type="button"
                        disabled={disconnect.isPending}
                        onClick={() => setPlatformToDisconnect(integration.platform)}
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center justify-center min-h-[36px] px-4 text-sm font-semibold rounded-pill border border-border-strong bg-surface hover:bg-surface-muted transition-all"
                        type="button"
                        onClick={() => handleConnect(integration.platform as "jira" | "slack" | "calendar")}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={platformToDisconnect !== null}
        title="Disconnect Integration"
        message={`Are you sure you want to disconnect ${platformToDisconnect}? You'll need to reconnect to continue using this integration.`}
        confirmText="Disconnect"
        cancelText="Cancel"
        isDestructive
        onConfirm={handleDisconnect}
        onCancel={() => setPlatformToDisconnect(null)}
      />
    </main>
  );
}
