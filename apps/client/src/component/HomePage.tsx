"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

interface Project {
  project_id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Integration {
  integration_id: string;
  user_id: string;
  atlassian_connected?: boolean;
  slack_connected?: boolean;
  calendar_connected?: boolean;
  atlassian_cloud_id?: string;
  atlassian_site_url?: string;
}

type SidebarView = "projects" | "integrations";

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    folder: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
    zap: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    plus: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    check: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    circle: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v.01M12 12v.01M12 16v.01M12 2a10 10 0 110 20 10 10 0 010-20z"
        />
      </svg>
    ),
    logout: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    ),
    arrow: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5l7 7-7 7"
        />
      </svg>
    ),
  };
  return icons[name] || null;
}

function Mark() {
  return (
    <span className="inline-flex items-end gap-0.5" aria-hidden="true">
      {["h-3", "h-4", "h-5", "h-3.5"].map((height) => (
        <i
          key={height}
          className={`block w-1 rounded-full bg-[#20251f] ${height}`}
        />
      ))}
    </span>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarView, setSidebarView] = useState<SidebarView>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, integrationsRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/projects`, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(`${API_BASE}/api/v1/integrations/me`, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!projectsRes.ok) throw new Error("Failed to fetch projects");
        if (!integrationsRes.ok) throw new Error("Failed to fetch integrations");

        const projectsData = await projectsRes.json();
        const integrationsData = await integrationsRes.json();

        setProjects(projectsData.data || []);
        setIntegrations(integrationsData.data || []);

        if (projectsData.data && projectsData.data.length > 0) {
          setSelectedProject(projectsData.data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    router.push(`/project/${project.project_id}`);
  };

  const getConnectedIntegrations = () => {
    if (!integrations || integrations.length === 0) return [];
    const integration = integrations[0];
    const connected = [];
    if (integration.atlassian_connected) connected.push("jira");
    if (integration.slack_connected) connected.push("slack");
    if (integration.calendar_connected) connected.push("calendar");
    return connected;
  };

  const getUserInitials = () => {
    if (!user?.user_name) return "U";
    return user.user_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex h-screen bg-[#f5f7f3]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-[#dfe5dc] bg-white shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-[#e8eee5] px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#20251f]">
            <Mark />
            <span>Ops Ninja</span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-[#e8eee5] px-3 py-2">
          <div className="flex gap-1">
            <button
              onClick={() => setSidebarView("projects")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                sidebarView === "projects"
                  ? "bg-[#f4f8f2] text-[#59745b]"
                  : "text-[#7a8278] hover:bg-[#f5f7f3] hover:text-[#596257]"
              }`}
            >
              <Icon name="folder" />
              <span>Projects</span>
            </button>
            <button
              onClick={() => setSidebarView("integrations")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                sidebarView === "integrations"
                  ? "bg-[#f4f8f2] text-[#59745b]"
                  : "text-[#7a8278] hover:bg-[#f5f7f3] hover:text-[#596257]"
              }`}
            >
              <Icon name="zap" />
              <span>Integrations</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {sidebarView === "projects" && (
            <div className="space-y-2">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-lg bg-[#e8eee5]"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-lg bg-[#fef2f2] p-3 text-sm text-[#9a4b1e]">
                  {error}
                </div>
              ) : projects.length === 0 ? (
                <div className="rounded-lg bg-[#f4f8f2] p-4 text-center">
                  <Icon name="folder" />
                  <p className="mt-2 text-sm text-[#596257]">No projects yet</p>
                  <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#59745b] hover:text-[#20251f]">
                    <Icon name="plus" />
                    Create one
                  </button>
                </div>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.project_id}
                    onClick={() => handleProjectClick(project)}
                    className={`w-full rounded-lg px-3 py-3 text-left transition-all ${
                      selectedProject?.project_id === project.project_id
                        ? "bg-[#20251f] text-white shadow-md"
                        : "bg-white text-[#20251f] hover:bg-[#f5f7f3]"
                    }`}
                  >
                    <div className="font-semibold">{project.name}</div>
                    {project.description && (
                      <div
                        className={`mt-1 truncate text-xs ${
                          selectedProject?.project_id === project.project_id
                            ? "text-[#c6ccc2]"
                            : "text-[#7a8278]"
                        }`}
                      >
                        {project.description}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          )}

          {sidebarView === "integrations" && (
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-lg bg-[#e8eee5]"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {["jira", "slack", "calendar"].map((integration) => {
                    const isConnected =
                      getConnectedIntegrations().includes(integration);
                    return (
                      <div
                        key={integration}
                        className={`rounded-lg border px-3 py-3 transition-all ${
                          isConnected
                            ? "border-[#b7d0b7] bg-[#f4f8f2]"
                            : "border-[#dfe5dc] bg-white hover:border-[#d9e0d5]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-md font-bold text-white ${
                                isConnected
                                  ? "bg-[#16a34a]"
                                  : "bg-[#c6ccc2]"
                              }`}
                            >
                              {integration === "jira"
                                ? "J"
                                : integration === "slack"
                                  ? "S"
                                  : "C"}
                            </div>
                            <div>
                              <div className="font-medium capitalize text-[#20251f]">
                                {integration}
                              </div>
                              <div className="text-xs text-[#7a8278]">
                                {isConnected ? "Connected" : "Not connected"}
                              </div>
                            </div>
                          </div>
                          <div className="text-lg">
                            {isConnected ? (
                              <Icon name="check" />
                            ) : (
                              <Icon name="circle" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="border-t border-[#dfe5dc] p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#59745b] to-[#40503f] font-semibold text-white">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-[#20251f]">
                  {user?.user_name || "User"}
                </p>
                <p className="truncate text-xs text-[#7a8278]">
                  {user?.email || "email@example.com"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f5f7f3] px-3 py-2 text-sm font-medium text-[#596257] transition-colors hover:bg-[#e8eee5] hover:text-[#20251f]"
            >
              <Icon name="logout" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {selectedProject ? (
            <div>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-[-0.02em] text-[#20251f]">
                  {selectedProject.name}
                </h1>
                {selectedProject.description && (
                  <p className="mt-3 text-lg text-[#596257]">
                    {selectedProject.description}
                  </p>
                )}
              </div>

              {/* Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Project Details Card */}
                <div className="rounded-2xl border border-[#d9e0d5] bg-white/80 p-6 shadow-sm backdrop-blur transition-shadow hover:shadow-md lg:col-span-1">
                  <h2 className="mb-4 text-lg font-semibold text-[#20251f]">
                    Project Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#59745b]">
                        Project ID
                      </p>
                      <p className="mt-2 font-mono text-sm text-[#596257]">
                        {selectedProject.project_id.slice(0, 8)}...
                      </p>
                    </div>
                    <div className="border-t border-[#e8eee5]" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#59745b]">
                        Created
                      </p>
                      <p className="mt-2 text-sm text-[#596257]">
                        {new Date(
                          selectedProject.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="border-t border-[#e8eee5]" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#59745b]">
                        Created By
                      </p>
                      <p className="mt-2 text-sm text-[#596257]">
                        {selectedProject.created_by}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="rounded-2xl border border-[#d9e0d5] bg-white/80 p-6 shadow-sm backdrop-blur transition-shadow hover:shadow-md lg:col-span-2">
                  <h2 className="mb-4 text-lg font-semibold text-[#20251f]">
                    Quick Actions
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#20251f] px-4 py-2.5 font-medium text-white transition-all hover:bg-[#40503f] active:scale-95">
                      <Icon name="plus" />
                      Upload Meeting
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d9e0d5] px-4 py-2.5 font-medium text-[#20251f] transition-colors hover:bg-[#f5f7f3]">
                      View Meetings
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d9e0d5] px-4 py-2.5 font-medium text-[#20251f] transition-colors hover:bg-[#f5f7f3]">
                      View Actions
                    </button>
                  </div>
                </div>

                {/* Integrations Status Card */}
                <div className="rounded-2xl border border-[#d9e0d5] bg-white/80 p-6 shadow-sm backdrop-blur transition-shadow hover:shadow-md lg:col-span-3">
                  <h2 className="mb-4 text-lg font-semibold text-[#20251f]">
                    Connected Integrations
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {["jira", "slack", "calendar"].map((integration) => {
                      const isConnected =
                        getConnectedIntegrations().includes(integration);
                      return (
                        <div
                          key={integration}
                          className={`rounded-xl border-2 p-4 text-center transition-all ${
                            isConnected
                              ? "border-[#b7d0b7] bg-[#f4f8f2]"
                              : "border-[#dfe5dc] bg-white hover:border-[#d9e0d5]"
                          }`}
                        >
                          <div
                            className={`mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white ${
                              isConnected
                                ? "bg-[#16a34a]"
                                : "bg-[#c6ccc2]"
                            }`}
                          >
                            {integration === "jira"
                              ? "J"
                              : integration === "slack"
                                ? "S"
                                : "C"}
                          </div>
                          <p className="font-semibold capitalize text-[#20251f]">
                            {integration}
                          </p>
                          <p
                            className={`mt-1 text-xs font-medium ${
                              isConnected
                                ? "text-[#16a34a]"
                                : "text-[#7a8278]"
                            }`}
                          >
                            {isConnected ? "✓ Connected" : "○ Not connected"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#dfe5dc] py-20">
              <div className="text-center">
                <Icon name="folder" />
                <h2 className="mt-4 text-2xl font-bold text-[#20251f]">
                  No projects yet
                </h2>
                <p className="mt-2 text-[#596257]">
                  Create your first project to get started
                </p>
                <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#20251f] px-6 py-3 font-semibold text-white transition-all hover:bg-[#40503f] active:scale-95">
                  <Icon name="plus" />
                  Create Project
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
