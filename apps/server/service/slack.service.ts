export type SlackCredentials = {
  botToken: string;
};

type SlackApiResponse = {
  ok: boolean;
  error?: string;
  [key: string]: unknown;
};

export class SlackService {
  private async request<T extends SlackApiResponse>(
    credentials: SlackCredentials,
    method: string,
    body?: Record<string, unknown>,
  ): Promise<T> {
    const response = await fetch(`https://slack.com/api/${method}`, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${credentials.botToken}`,
        ...(body ? { "Content-Type": "application/json; charset=utf-8" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = (await response.json()) as T;
    if (!response.ok || !data.ok) {
      throw new Error(`Slack API error: ${data.error ?? response.statusText}`);
    }
    return data;
  }

  async listChannels(credentials: SlackCredentials) {
    return this.request(credentials, "conversations.list", {
      exclude_archived: true,
      limit: 200,
      types: "public_channel,private_channel",
    });
  }

  async getChannel(credentials: SlackCredentials, channel: string) {
    const channels = await this.listChannels(credentials);
    const match = (
      channels.channels as Array<{ id?: string; name?: string }> | undefined
    )?.find(
      (candidate) =>
        candidate.id === channel ||
        candidate.name === channel.replace(/^#/, ""),
    );
    if (!match?.id) throw new Error(`Slack channel not found: ${channel}`);
    return match;
  }

  async searchMessages(credentials: SlackCredentials, query: string) {
    return this.request(credentials, "search.messages", { query, count: 50 });
  }

  async sendMessage(
    credentials: SlackCredentials,
    channel: string,
    message: string,
  ) {
    const resolved = await this.getChannel(credentials, channel);
    return this.request(credentials, "chat.postMessage", {
      channel: resolved.id,
      text: message,
    });
  }
}

export default new SlackService();
