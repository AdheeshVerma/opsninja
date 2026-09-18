import crypto from "crypto";
import messageRepository from "../repository/message.repository";
import chatRepository from "../repository/chat.repository";
import orchestratorAgent from "../agent/orchestrator.agent";
import type { Message } from "../utils/type";
import type { JiraCredentials } from "../agent/jira.agent";
import type { SlackCredentials } from "../agent/slack.agent";

class MessageController {
  async sendMessage(
    chatId: string,
    text: string,
    jiraCredentials?: JiraCredentials,
    slackCredentials?: SlackCredentials,
  ): Promise<{ user_message: Message; agent_reply: Message }> {
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

    const { answer } = await orchestratorAgent.respond(text.trim(), {
      jira: jiraCredentials,
      slack: slackCredentials,
    });

    const replyNow = new Date().toISOString();
    const agentReply: Message = {
      message_id: crypto.randomUUID(),
      chat_id: chatId,
      message: answer || "No response generated.",
      message_type: "SYSTEM",
      created_at: replyNow,
      updated_at: replyNow,
    };

    await messageRepository.createMessage(agentReply);

    return { user_message: userMessage, agent_reply: agentReply };
  }

  async getAllMessages(chatId: string): Promise<Message[]> {
    if (!chatId) throw new Error("chatId is required");
    return await messageRepository.findMessagesByChatId(chatId);
  }
}

export default new MessageController();
