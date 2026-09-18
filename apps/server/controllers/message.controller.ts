import crypto from "crypto";
import messageRepository from "../repository/message.repository";
import chatRepository from "../repository/chat.repository";
import orchestratorAgent from "../agent/orchestrator.agent";
import type { ConversationTurn } from "../agent/orchestrator.agent";
import embeddingService from "../service/embedding.service";
import graphService from "../service/graph.service";
import { classifyIntent } from "../utils/intent.classifier";
import { extractProposals } from "../utils/parseProposals";
import { parseStructuredResponse } from "../utils/parseStructuredResponse";
import { LIMITS_BY_INTENT } from "../utils/agentConstants";
import type { Message } from "../utils/type";
import type { JiraCredentials } from "../agent/jira.agent";
import type { SlackCredentials } from "../agent/slack.agent";
import type { GraphContext } from "../service/graph.service";

class MessageController {
  async sendMessage(
    chatId: string,
    text: string,
    jiraCredentials?: JiraCredentials,
    slackCredentials?: SlackCredentials,
  ): Promise<{ user_message: Message; agent_reply: Message; proposed_actions: unknown[] }> {
    if (!chatId) throw new Error("chatId is required");
    if (!text?.trim()) throw new Error("message is required");

    const chat = await chatRepository.findChatById(chatId);
    if (!chat) throw new Error("chat not found");

    const now = new Date().toISOString();
    const userMessage: Message = {
      message_id: crypto.randomUUID(),
      chat_id: chatId,
      message: text.trim(),
      message_type: "USER",
      created_at: now,
      updated_at: now,
    };

    await messageRepository.createMessage(userMessage);

    const [allMessages, intent, queryEmbedding] = await Promise.all([
      messageRepository.findMessagesByChatId(chatId),
      classifyIntent(text.trim()),
      embeddingService.embed(text.trim()),
    ]);

    const history: ConversationTurn[] = allMessages
      .filter((m) => m.message_id !== userMessage.message_id)
      .slice(-10)
      .map((m) => ({
        role: m.message_type === "USER" ? "user" : "assistant",
        content: m.message,
      }));

    const graphContext = await graphService.getProjectContext(
      chat.project_id,
      queryEmbedding,
    );
    const contextPrefix = buildContextPrefix(graphContext);

    const limits = LIMITS_BY_INTENT[intent];

    const { answer } = await orchestratorAgent.respond(text.trim(), {
      jira: jiraCredentials,
      slack: slackCredentials,
      systemPrefix: contextPrefix,
      history,
      maxTurns: limits.maxTurns,
      maxTokens: limits.maxTokens,
    });

    const { cleanAnswer, proposals } = extractProposals(answer || "");
    const agentResponse = parseStructuredResponse(cleanAnswer);

    const replyNow = new Date().toISOString();
    const agentReply: Message = {
      message_id: crypto.randomUUID(),
      chat_id: chatId,
      message: cleanAnswer || "No response generated.",
      message_type: "SYSTEM",
      created_at: replyNow,
      updated_at: replyNow,
      structured_response: JSON.stringify(agentResponse),
      proposed_actions: proposals.length ? JSON.stringify(proposals) : undefined,
    };

    await messageRepository.createMessage(agentReply);

    return { user_message: userMessage, agent_reply: agentReply, proposed_actions: proposals };
  }

  async getAllMessages(chatId: string): Promise<Message[]> {
    if (!chatId) throw new Error("chatId is required");
    return await messageRepository.findMessagesByChatId(chatId);
  }
}

export default new MessageController();

function buildContextPrefix(ctx: GraphContext | null): string {
  if (!ctx) return "";
  const lines: string[] = ["--- PROJECT CONTEXT ---"];
  for (const m of ctx.meetings) {
    lines.push(`\nMeeting${m.date ? ` (${m.date})` : ""}: ${m.summary}`);
    if (m.participants.length)
      lines.push(`  Participants: ${m.participants.join(", ")}`);
    if (m.decisions.length)
      lines.push(`  Decisions: ${m.decisions.join("; ")}`);
  }
  if (ctx.recentActions.length) {
    lines.push("\nAction Items:");
    for (const a of ctx.recentActions) {
      lines.push(
        `  - [${a.status}] ${a.title}${a.assignee ? ` (${a.assignee})` : ""}`,
      );
    }
  }
  lines.push("--- END CONTEXT ---");
  return lines.join("\n");
}


