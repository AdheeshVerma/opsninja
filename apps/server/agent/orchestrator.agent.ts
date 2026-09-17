import { Agent } from "@strands-agents/sdk";
import jiraAgent, { type JiraCredentials } from "./jira.agent";
import slackAgent, { type SlackCredentials } from "./slack.agent";
import { createMeetingModel } from "../utils/model";
import vaultService from "../service/vault.service";

export type OrchestratorContext = {
  jira?: JiraCredentials;
  slack?: SlackCredentials;
};

const ORCHESTRATOR_SYSTEM_PROMPT = `You are the meeting knowledge orchestrator. The Obsidian vault is the source of truth for meeting history and completed actions.
Decide whether vault or integration context is necessary before calling a tool; do not retrieve data by default. Use the smallest relevant tool call when a user refers to a prior meeting, action, decision, Jira issue, or Slack message.
You cannot perform external write actions in this conversation. When asked to create or send something, retrieve enough context to explain the proposed action and explicitly ask the user to approve it. Never claim an action was performed unless a vault record proves it.`;

export const createOrchestratorAgent = (context: OrchestratorContext = {}) =>
  new Agent({
    id: "meeting-orchestrator-agent",
    name: "Meeting Knowledge Orchestrator",
    description:
      "Answers questions from the vault and routes read-only Jira and Slack retrieval.",
    model: createMeetingModel(),
    systemPrompt: ORCHESTRATOR_SYSTEM_PROMPT,
    tools: [
      vaultService.createTools(),
      ...(context.jira ? jiraAgent.createTools(context.jira) : []),
      ...(context.slack ? slackAgent.createTools(context.slack) : []),
    ],
    toolExecutor: "sequential",
    printer: false,
  });

const getResponseText = (agent: Agent) =>
  agent.messages
    .at(-1)
    ?.content.filter((block) => block.type === "textBlock")
    .map((block) => block.text)
    .join("") ?? "";

export class OrchestratorAgent {
  async respond(message: string, context: OrchestratorContext = {}) {
    if (!message.trim()) throw new Error("A chat message is required");
    const agent = createOrchestratorAgent(context);
    const result = await agent.invoke(message.trim(), {
      limits: { turns: 8, totalTokens: 16_000 },
    });
    return {
      answer: getResponseText(agent),
      stopReason: result.stopReason,
    };
  }
}

export default new OrchestratorAgent();
