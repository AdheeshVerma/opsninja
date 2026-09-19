import { OpenRouter } from "@openrouter/sdk";
import { requireConfigValue } from "../utils/config";

class EmbeddingService {
  private client?: OpenRouter;

  private getClient() {
    this.client ??= new OpenRouter({
      apiKey: requireConfigValue("OPENROUTER_API_KEY"),
    });
    return this.client;
  }

  async embed(text: string): Promise<number[]> {
    const response = await this.getClient().embeddings.create({
      model: "openai/text-embedding-3-small",
      input: text,
    });
    return response.data?.[0]?.embedding ?? [];
  }
}

export default new EmbeddingService();
