export interface Project {
  project_id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  created_by: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
}
