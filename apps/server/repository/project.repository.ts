import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import db from "../utils/db";
import type { Project, UpdateProjectDTO } from "../utils/type";

class ProjectRepository {
  private tableName = "Projects";

  private getClient() {
    return db.getClient();
  }

  async createProject(project: Project): Promise<Project> {
    const client = this.getClient();
    await client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: project,
      }),
    );
    return project;
  }

  async findProjectById(projectId: string): Promise<Project | null> {
    const client = this.getClient();
    const result = await client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          project_id: projectId,
        },
      }),
    );
    return (result.Item as Project) || null;
  }

  async findAllProjects(createdBy?: string): Promise<Project[]> {
    const client = this.getClient();
    if (createdBy) {
      const result = await client.send(
        new ScanCommand({
          TableName: this.tableName,
          FilterExpression: "created_by = :createdBy",
          ExpressionAttributeValues: {
            ":createdBy": createdBy,
          },
        }),
      );
      return (result.Items as Project[]) || [];
    }

    const result = await client.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );
    return (result.Items as Project[]) || [];
  }

  async updateProject(
    projectId: string,
    updates: UpdateProjectDTO,
  ): Promise<Project | null> {
    const client = this.getClient();
    const entries = Object.entries(updates).filter(
      ([key, v]) =>
        v !== undefined &&
        key !== "project_id" &&
        key !== "created_by" &&
        key !== "created_at" &&
        key !== "updated_at",
    );

    if (entries.length === 0) {
      return await this.findProjectById(projectId);
    }

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of entries) {
      const attrName = `#${key}`;
      const attrVal = `:${key}`;
      updateExpressions.push(`${attrName} = ${attrVal}`);
      expressionAttributeNames[attrName] = key;
      expressionAttributeValues[attrVal] = value;
    }

    updateExpressions.push("#updated_at = :updated_at");
    expressionAttributeNames["#updated_at"] = "updated_at";
    expressionAttributeValues[":updated_at"] = new Date().toISOString();

    const result = await client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          project_id: projectId,
        },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }),
    );

    return (result.Attributes as Project) || null;
  }

  async deleteProject(projectId: string): Promise<boolean> {
    const client = this.getClient();
    await client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          project_id: projectId,
        },
      }),
    );
    return true;
  }
}

export default new ProjectRepository();
