import { Agent } from "@strands-agents/sdk";
import jiraAgent, { type JiraCredentials } from "./jira.agent";
import slackAgent, { type SlackCredentials } from "./slack.agent";
import { createMeetingModel } from "../utils/model";
import vaultService from "../service/vault.service";
import { trimToolResponse } from "../utils/agentConstants";

export type ConversationTurn = { role: "user" | "assistant"; content: string };

export type OrchestratorContext = {
  jira?: JiraCredentials;
  slack?: SlackCredentials;
  systemPrefix?: string;
  history?: ConversationTurn[];
  maxTurns?: number;
  maxTokens?: number;
};

const ORCHESTRATOR_SYSTEM_PROMPT = `You are the meeting knowledge orchestrator. The Obsidian vault is the source of truth for meeting history and completed actions.
Decide whether vault or integration context is necessary before calling a tool; do not retrieve data by default. Use the smallest relevant tool call when a user refers to a prior meeting, action, decision, Jira issue, or Slack message.
You cannot perform external write actions in this conversation. When asked to create or send something, retrieve enough context to explain the proposed action and explicitly ask the user to approve it. Never claim an action was performed unless a vault record proves it.

When the user requests an external action (create a Jira issue, send a Slack message, etc.), emit one or more action proposal blocks in your response using this exact format:
<<ACTION_PROPOSAL>>{"actionNoteId":"<uuid>","type":"jira|slack","title":"<short title>","description":"<details>","target":"<project key or channel>","assignee":"<name or null>","priority":"high|medium|low"}<<ACTION_PROPOSAL>>

Always wrap your final response in a JSON envelope with typed content blocks. Use this format:
\`\`\`json
{"blocks":[{"type":"text","content":"..."},{"type":"bullet_list","items":["..."]},{"type":"decision_list","items":["..."]},{"type":"action_summary","actions":[{"title":"...","assignee":"...","status":"..."}]}]}
\`\`\`
Only include block types that are relevant. A "text" block suffices for simple answers. Never omit the JSON envelope.`;

function withTrim<T extends { callback: (input: any) => unknown }>(tools: T[]): T[] {
  return tools.map((t) => ({
    ...t,
    callback: async (input: any) => {
      const result = await t.callback(input);
      if (typeof result === "string") return trimToolResponse(result);
      if (result && typeof result === "object")
        return trimToolResponse(JSON.stringify(result));
      return result;
    },
  }));
}

export const createOrchestratorAgent = (context: OrchestratorContext = {}) => {
  const systemPrompt = context.systemPrefix
    ? `${context.systemPrefix}\n\n${ORCHESTRATOR_SYSTEM_PROMPT}`
    : ORCHESTRATOR_SYSTEM_PROMPT;

  return new Agent({
    id: "meeting-orchestrator-agent",
    name: "Meeting Knowledge Orchestrator",
    description:
      "Answers questions from the vault and routes read-only Jira and Slack retrieval.",
    model: createMeetingModel(),
    systemPrompt,
    tools: withTrim([
      vaultService.createTools(),
      ...(context.jira ? jiraAgent.createTools(context.jira) : []),
      ...(context.slack ? slackAgent.createTools(context.slack) : []),
    ]),
    toolExecutor: "sequential",
    printer: false,
  });
};

const getResponseText = (agent: Agent) =>
  agent.messages
    .at(-1)
    ?.content.filter((block: any) => block.type === "textBlock")
    .map((block: any) => block.text)
    .join("") ?? "";

export class OrchestratorAgent {
  async respond(message: string, context: OrchestratorContext = {}) {
    if (!message.trim()) throw new Error("A chat message is required");
    const agent = createOrchestratorAgent(context);

    if (context.history?.length) {
      for (const turn of context.history) {
        agent.messages.push({
          role: turn.role,
          content: [{ type: "textBlock", text: turn.content }],
        });
      }
    }

    const result = await agent.invoke(message.trim(), {
      limits: {
        turns: context.maxTurns ?? 8,
        totalTokens: context.maxTokens ?? 16_000,
      },
    });
    return {
      answer: getResponseText(agent),
      stopReason: result.stopReason,
    };
  }
}

export default new OrchestratorAgent();
