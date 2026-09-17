import crypto from "crypto";
import projectRepository from "../repository/project.repository";
import type { CreateProjectDTO, UpdateProjectDTO, Project } from "../utils/type";

class ProjectController {
  async createProject(projectDetails: CreateProjectDTO): Promise<Project> {
    if (!projectDetails.name || typeof projectDetails.name !== "string" || projectDetails.name.trim().length === 0) {
      throw new Error("project name is required");
    }

    const now = new Date().toISOString();
    const project: Project = {
      project_id: crypto.randomUUID(),
      name: projectDetails.name.trim(),
      description: projectDetails.description ? projectDetails.description.trim() : "",
      created_by: projectDetails.created_by || "system",
      created_at: now,
      updated_at: now,
    };

    return await projectRepository.createProject(project);
  }

  async getProject(projectId: string): Promise<Project> {
    if (!projectId) {
      throw new Error("projectId is required");
    }

    const dbProject = await projectRepository.findProjectById(projectId);
    if (!dbProject) {
      throw new Error("project not found");
    }

    return dbProject;
  }

  async getAllProjects(createdBy?: string): Promise<Project[]> {
    return await projectRepository.findAllProjects(createdBy);
  }

  async updateProject(
    projectId: string,
    updates: UpdateProjectDTO,
  ): Promise<Project> {
    if (!projectId) {
      throw new Error("projectId is required");
    }

    const doesProjectExist = await projectRepository.findProjectById(projectId);
    if (!doesProjectExist) {
      throw new Error("project not found");
    }

    const updated = await projectRepository.updateProject(projectId, updates);
    if (!updated) {
      throw new Error("failed to update project");
    }

    return updated;
  }

  async deleteProject(
    projectId: string,
  ): Promise<{ success: boolean; project_id: string }> {
    if (!projectId) {
      throw new Error("projectId is required");
    }

    const doesProjectExist = await projectRepository.findProjectById(projectId);
    if (!doesProjectExist) {
      throw new Error("project not found");
    }

    await projectRepository.deleteProject(projectId);
    return { success: true, project_id: projectId };
  }
}

export default new ProjectController();
