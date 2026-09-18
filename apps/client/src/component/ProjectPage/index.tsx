"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects, useDeleteProject } from "@/hooks/useProject";
import CreateProjectModal from "@/component/CreateProjectModal";
import ConfirmDialog from "@/component/ConfirmDialog";
import UserMenu from "@/component/UserMenu";

export default function ProjectPage() {
  const { data: projects, isLoading, isError } = useProjects();
  const deleteProject = useDeleteProject();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleDeleteProject = async () => {
    if (projectToDelete) {
      await deleteProject.mutateAsync(projectToDelete);
      setProjectToDelete(null);
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
          <Link href="/integrations" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Integrations
          </Link>
          <Link href="/home" className="inline-flex items-center justify-center min-h-[36px] px-4 text-sm font-semibold rounded-pill border border-border-strong bg-surface hover:bg-surface-muted transition-all">
            Workspace
          </Link>
          <UserMenu />
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-start justify-between mb-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage mb-2">
              Shared context
            </p>
            <h1 className="text-4xl font-bold text-text-primary mb-3">Projects</h1>
            <p className="text-base text-text-secondary">
              Every project has a durable record of decisions, meeting intelligence, and pending follow-through.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center min-h-[42px] px-5 text-sm font-semibold text-white rounded-pill bg-brand hover:bg-brand-hover shadow-sm hover:-translate-y-0.5 transition-all"
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
          >
            New project
          </button>
        </div>

        {isLoading && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sage">
            Loading projects…
          </p>
        )}

        {isError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
            Failed to load projects. Please check your connection and try again.
          </div>
        )}

        {!isLoading && !isError && projects && (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-16 px-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">No projects yet</h3>
                <p className="text-sm text-text-secondary mb-6">
                  Create your first project to start organizing your meeting intelligence and action items.
                </p>
                <button
                  className="inline-flex items-center justify-center min-h-[42px] px-5 text-sm font-semibold text-white rounded-pill bg-brand hover:bg-brand-hover shadow-sm transition-all"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create your first project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link
                    className="block p-6 bg-surface border border-border rounded-lg hover:border-border-strong hover:shadow-md transition-all"
                    href={`/project/${project.project_id}`}
                    key={project.project_id}
                  >
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                      {project.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={projectToDelete !== null}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
        onConfirm={handleDeleteProject}
        onCancel={() => setProjectToDelete(null)}
      />
    </main>
  );
}
