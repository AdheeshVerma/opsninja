"use client";

import { FormEvent, useState } from "react";
import { useCreateProject } from "@/hooks/useProject";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const createProject = useCreateProject();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    await createProject.mutateAsync({
      name: name.trim(),
      description: description.trim(),
      created_by: user.user_id,
    });
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg"
        onSubmit={submit}
      >
        <h2 className="text-xl font-semibold text-text-primary">
          Create project
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Give your operational context a durable home.
        </p>
        <label
          className="mt-5 block text-sm font-semibold text-text-secondary"
          htmlFor="project-name"
        >
          Name
          <input
            className="mt-2 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label
          className="mt-4 block text-sm font-semibold text-text-secondary"
          htmlFor="project-description"
        >
          Description
          <textarea
            className="mt-2 min-h-24 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        {createProject.isError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            Unable to create the project. Please try again.
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="inline-flex min-h-9 items-center rounded-pill border border-border-strong px-4 text-sm font-semibold text-text-secondary"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-9 items-center rounded-pill bg-brand px-4 text-sm font-semibold text-white disabled:opacity-50"
            type="submit"
            disabled={createProject.isPending}
          >
            {createProject.isPending ? "Creating..." : "Create project"}
          </button>
        </div>
      </form>
    </div>
  );
}
