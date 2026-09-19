"use client";

import Link from "next/link";
import WorkspaceLayout from "@/component/WorkspaceLayout";
import { useMyIntegrations } from "@/hooks/useIntegration";
import { useProjects } from "@/hooks/useProject";
import type { Integration } from "@/types/api.types";

type WorkspaceSection = "projects" | "integrations";

const platforms: Array<{
  platform: Integration["platform"];
  label: string;
  symbol: string;
  color: string;
}> = [
  { platform: "jira", label: "Jira", symbol: "◇", color: "text-blue-600" },
  { platform: "slack", label: "Slack", symbol: "#", color: "text-purple-600" },
  {
    platform: "calendar",
    label: "Calendar",
    symbol: "◎",
    color: "text-green-600",
  },
];

function ProjectsSection() {
  const { data: projects, isLoading, isError } = useProjects();

  return (
    <section>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#59745b]">
        Workspace
      </p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#20251f]">
            Projects
          </h1>
          <p className="mt-2 text-sm text-[#667166]">
            Projects connected to your operational memory.
          </p>
        </div>
        <span className="rounded-full bg-[#f1f7ef] px-3 py-1 text-xs font-semibold text-[#426347]">
          {projects?.length ?? 0} total
        </span>
      </div>

      {isLoading && (
        <p className="mt-8 text-sm text-[#667166]">Loading projects...</p>
      )}
      {isError && (
        <p className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Projects could not be loaded. Check your connection and try again.
        </p>
      )}
      {!isLoading && !isError && projects?.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-[#cbd9c8] bg-[#f7faf6] p-8 text-center text-sm text-[#667166]">
          No projects found.
        </div>
      )}
      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.project_id}
              href={`/project/${project.project_id}`}
              className="group rounded-xl border border-[#dfe5dc] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#9db29b] hover:shadow-lg hover:shadow-[#59745b]/10"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf2e8] text-[#59745b]"
                  aria-hidden="true"
                >
                  ▰
                </span>
                <span className="text-lg text-[#8a9587] transition group-hover:translate-x-1">
                  →
                </span>
              </div>
              <h2 className="mt-5 text-lg font-bold text-[#20251f]">
                {project.name}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667166]">
                {project.description || "No description provided."}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function IntegrationsSection() {
  const { data: integrations, isLoading, isError } = useMyIntegrations();
  const connected = new Set(
    (integrations ?? [])
      .filter((item) => item.connected)
      .map((item) => item.platform),
  );

  return (
    <section>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#59745b]">
        Workspace setup
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#20251f]">
        Integrations
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[#667166]">
        See which tools are connected to your operational workspace.
      </p>
      {isLoading && (
        <p className="mt-8 text-sm text-[#667166]">Loading integrations...</p>
      )}
      {isError && (
        <p className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Integrations could not be loaded. Check your connection and try again.
        </p>
      )}
      {!isLoading && !isError && (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {platforms.map(({ platform, label, symbol, color }) => {
            const isConnected = connected.has(platform);
            return (
              <article
                key={platform}
                className="rounded-xl border border-[#dfe5dc] bg-white p-5"
              >
                <span className={`text-3xl ${color}`} aria-hidden="true">
                  {symbol}
                </span>
                <h2 className="mt-4 text-lg font-bold text-[#20251f]">
                  {label}
                </h2>
                <p
                  className={`mt-3 text-sm font-semibold ${isConnected ? "text-[#347146]" : "text-[#8a9587]"}`}
                >
                  <i
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${isConnected ? "bg-[#16a34a]" : "bg-[#8a9587]"}`}
                  />
                  {isConnected ? "Connected" : "Not connected"}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function WorkspacePage({
  section,
}: {
  section?: WorkspaceSection;
}) {
  const activeSection = section ?? "projects";

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-14">
        {activeSection === "projects" ? (
          <ProjectsSection />
        ) : (
          <IntegrationsSection />
        )}
      </div>
    </WorkspaceLayout>
  );
}
