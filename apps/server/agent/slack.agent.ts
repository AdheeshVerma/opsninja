import { tool, type Tool } from "@strands-agents/sdk";
import { z } from "zod";
import slackService, {
  type SlackCredentials,
} from "../service/slack.service";

export type { SlackCredentials };

export class SlackAgent {
  createTools(
    credentials: SlackCredentials,
    options: { allowMutations?: boolean } = {},
  ): Tool[] {
    const readTools: Tool[] = [
      tool({
        name: "slack_list_channels",
        description: "List available Slack channels.",
        inputSchema: z.object({}),
        callback: () => slackService.listChannels(credentials),
      }),
      tool({
        name: "slack_get_channel",
        description: "Look up a Slack channel by name or ID.",
        inputSchema: z.object({ channel: z.string().min(1) }),
        callback: ({ channel }) => slackService.getChannel(credentials, channel),
      }),
      tool({
        name: "slack_search_messages",
        description: "Search Slack messages when their context is needed.",
        inputSchema: z.object({ query: z.string().min(1) }),
        callback: ({ query }) => slackService.searchMessages(credentials, query),
      }),
    ];

    if (!options.allowMutations) return readTools;

    return [
      ...readTools,
      tool({
        name: "slack_send_message",
        description:
          "Send a Slack message. This tool is only registered for a human-approved action.",
        inputSchema: z.object({
          channel: z.string().min(1),
          message: z.string().min(1),
        }),
        callback: ({ channel, message }) =>
          slackService.sendMessage(credentials, channel, message),
      }),
    ];
  }
}

export default new SlackAgent();
