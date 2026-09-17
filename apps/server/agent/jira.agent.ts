import { tool, type Tool } from "@strands-agents/sdk";
import { z } from "zod";
import jiraService, {
  jiraPrioritySchema,
  type JiraCredentials,
} from "../service/jira.service";

export type { JiraCredentials };

export class JiraAgent {
  createTools(
    credentials: JiraCredentials,
    options: { allowMutations?: boolean } = {},
  ): Tool[] {
    const readTools: Tool[] = [
      tool({
        name: "jira_get_issue",
        description: "Get a Jira issue by key or ID.",
        inputSchema: z.object({ issueIdOrKey: z.string().min(1) }),
        callback: ({ issueIdOrKey }) =>
          jiraService.getIssue(credentials, issueIdOrKey),
      }),
      tool({
        name: "jira_list_projects",
        description: "List Jira projects available to the connected account.",
        inputSchema: z.object({}),
        callback: () => jiraService.listProjects(credentials),
      }),
    ];

    if (!options.allowMutations) return readTools;

    return [
      ...readTools,
      tool({
        name: "jira_create_issue",
        description:
          "Create a Jira issue. This tool is only registered for a human-approved action.",
        inputSchema: z.object({
          projectKey: z.string().min(1),
          summary: z.string().min(1),
          description: z.string().optional(),
          priority: jiraPrioritySchema.optional(),
          issueType: z.string().optional(),
          assigneeAccountId: z.string().optional(),
        }),
        callback: (input) => jiraService.createIssue(credentials, input),
      }),
      tool({
        name: "jira_update_issue",
        description:
          "Update Jira issue fields. This tool is only registered for a human-approved action.",
        inputSchema: z.object({
          issueIdOrKey: z.string().min(1),
          fields: z.record(z.string(), z.unknown()),
        }),
        callback: ({ issueIdOrKey, fields }) =>
          jiraService.updateIssue(credentials, issueIdOrKey, fields),
      }),
      tool({
        name: "jira_add_comment",
        description:
          "Add a comment to a Jira issue. This tool is only registered for a human-approved action.",
        inputSchema: z.object({
          issueIdOrKey: z.string().min(1),
          comment: z.string().min(1),
        }),
        callback: ({ issueIdOrKey, comment }) =>
          jiraService.addComment(credentials, issueIdOrKey, comment),
      }),
    ];
  }
}

export default new JiraAgent();
