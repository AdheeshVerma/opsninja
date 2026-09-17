import fetch from "node-fetch";
import { z } from "zod";
import integrationModel, { type Integration } from "../model/integration.model";

export type JiraCredentials = {
  cloudId: string;
  accessToken: string;
  siteUrl?: string;
};

export const jiraPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export type JiraPriority = z.infer<typeof jiraPrioritySchema>;

const toAdf = (text: string) => ({
  type: "doc",
  version: 1,
  content: text
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => ({
      type: "paragraph",
      content: [{ type: "text", text: paragraph }],
    })),
});

const jiraPriority = (priority: JiraPriority) =>
  ({ low: "Low", medium: "Medium", high: "High", urgent: "Highest" })[priority];

export class JiraService {
  private parseResponse(responseText: string) {
    if (!responseText) {
      return null;
    }

    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  }

  getCredentials(integration: Integration): JiraCredentials {
    const parsedIntegration = integrationModel.parse(integration);
    const cloudId = parsedIntegration.atlassian_cloud_id;
    const accessToken = parsedIntegration.atlassian_access_token;

    if (!cloudId || !accessToken) {
      throw new Error("Jira integration is missing cloud ID or access token");
    }

    return { cloudId, accessToken };
  }

  async jiraFetch(
    cloudId: string,
    path: string,
    accessToken: string,
    method: string = "GET",
    body?: object,
  ) {
    const res = await fetch(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      },
    );

    const responseText = await res.text();
    const data = this.parseResponse(responseText);

    if (!res.ok) {
      const message =
        data && typeof data === "object" && "errorMessages" in data
          ? JSON.stringify(data)
          : responseText;
      throw new Error(
        `Jira API error: ${res.status} ${res.statusText}${message ? ` - ${message}` : ""}`,
      );
    }
    return data;
  }

  async getProject(
    cloudId: string,
    accessToken: string,
    projectIdOrKey: string,
  ) {
    return this.jiraFetch(
      cloudId,
      `project/${encodeURIComponent(projectIdOrKey)}`,
      accessToken,
    );
  }

  async getAllProjects(cloudId: string, accessToken: string) {
    return this.jiraFetch(cloudId, "project", accessToken);
  }

  async createProject(cloudId: string, accessToken: string, project: object) {
    return this.jiraFetch(cloudId, "project", accessToken, "POST", project);
  }

  async updateProject(
    cloudId: string,
    accessToken: string,
    projectIdOrKey: string,
    project: object,
  ) {
    return this.jiraFetch(
      cloudId,
      `project/${encodeURIComponent(projectIdOrKey)}`,
      accessToken,
      "PUT",
      project,
    );
  }

  async deleteProject(
    cloudId: string,
    accessToken: string,
    projectIdOrKey: string,
  ) {
    return this.jiraFetch(
      cloudId,
      `project/${encodeURIComponent(projectIdOrKey)}`,
      accessToken,
      "DELETE",
    );
  }

  async getRawIssue(
    cloudId: string,
    accessToken: string,
    issueIdOrKey: string,
  ) {
    return this.jiraFetch(
      cloudId,
      `issue/${encodeURIComponent(issueIdOrKey)}`,
      accessToken,
    );
  }

  async createRawIssue(cloudId: string, accessToken: string, issue: object) {
    return this.jiraFetch(cloudId, "issue", accessToken, "POST", issue);
  }

  async updateRawIssue(
    cloudId: string,
    accessToken: string,
    issueIdOrKey: string,
    issue: object,
  ) {
    return this.jiraFetch(
      cloudId,
      `issue/${encodeURIComponent(issueIdOrKey)}`,
      accessToken,
      "PUT",
      issue,
    );
  }

  async deleteIssue(
    cloudId: string,
    accessToken: string,
    issueIdOrKey: string,
  ) {
    return this.jiraFetch(
      cloudId,
      `issue/${encodeURIComponent(issueIdOrKey)}`,
      accessToken,
      "DELETE",
    );
  }

  async assignIssue(
    cloudId: string,
    accessToken: string,
    issueIdOrKey: string,
    accountId: string,
  ) {
    return this.jiraFetch(
      cloudId,
      `issue/${encodeURIComponent(issueIdOrKey)}/assignee`,
      accessToken,
      "PUT",
      { accountId },
    );
  }

  async transitionIssue(
    cloudId: string,
    accessToken: string,
    issueIdOrKey: string,
    transitionId: string,
  ) {
    return this.jiraFetch(
      cloudId,
      `issue/${encodeURIComponent(issueIdOrKey)}/transitions`,
      accessToken,
      "POST",
      { transition: { id: transitionId } },
    );
  }

  async getTransition(
    cloudId: string,
    accessToken: string,
    issueIdOrKey: string,
  ) {
    return this.jiraFetch(
      cloudId,
      `issue/${encodeURIComponent(issueIdOrKey)}/transitions`,
      accessToken,
    );
  }

  async getProjectForIntegration(
    integration: Integration,
    projectIdOrKey: string,
  ) {
    const { cloudId, accessToken } = this.getCredentials(integration);
    return this.getProject(cloudId, accessToken, projectIdOrKey);
  }

  async createIssueForIntegration(integration: Integration, issue: object) {
    const { cloudId, accessToken } = this.getCredentials(integration);
    return this.createRawIssue(cloudId, accessToken, issue);
  }

  async getIssue(credentials: JiraCredentials, issueIdOrKey: string) {
    return this.getRawIssue(
      credentials.cloudId,
      credentials.accessToken,
      issueIdOrKey,
    );
  }

  async listProjects(credentials: JiraCredentials) {
    return this.getAllProjects(credentials.cloudId, credentials.accessToken);
  }

  async createIssue(
    credentials: JiraCredentials,
    input: {
      projectKey: string;
      summary: string;
      description?: string;
      priority?: JiraPriority;
      issueType?: string;
      assigneeAccountId?: string;
    },
  ) {
    const fields: Record<string, unknown> = {
      project: { key: input.projectKey },
      summary: input.summary,
      issuetype: { name: input.issueType ?? "Task" },
    };
    if (input.description) fields.description = toAdf(input.description);
    if (input.priority)
      fields.priority = { name: jiraPriority(input.priority) };
    if (input.assigneeAccountId)
      fields.assignee = { accountId: input.assigneeAccountId };

    return this.createRawIssue(credentials.cloudId, credentials.accessToken, {
      fields,
    });
  }

  async updateIssue(
    credentials: JiraCredentials,
    issueIdOrKey: string,
    fields: Record<string, unknown>,
  ) {
    return this.updateRawIssue(
      credentials.cloudId,
      credentials.accessToken,
      issueIdOrKey,
      { fields },
    );
  }

  async addComment(
    credentials: JiraCredentials,
    issueIdOrKey: string,
    comment: string,
  ) {
    return this.jiraFetch(
      credentials.cloudId,
      `issue/${encodeURIComponent(issueIdOrKey)}/comment`,
      credentials.accessToken,
      "POST",
      { body: toAdf(comment) },
    );
  }
}

export default new JiraService();
