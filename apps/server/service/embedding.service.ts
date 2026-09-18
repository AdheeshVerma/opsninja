import { GoogleGenAI } from "@google/genai";
import { requireConfigValue } from "../utils/config";

class EmbeddingService {
  private client?: GoogleGenAI;

  private getClient() {
    this.client ??= new GoogleGenAI({
      apiKey: requireConfigValue("GEMINI_API_KEY"),
    });
    return this.client;
  }

  async embed(text: string): Promise<number[]> {
    const response = await this.getClient().models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });
    return response.embeddings?.[0]?.values ?? [];
  }
}

export default new EmbeddingService();
