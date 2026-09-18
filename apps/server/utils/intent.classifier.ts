import { GoogleGenAI } from "@google/genai";
import { requireConfigValue } from "./config";

export type Intent = "LOOKUP" | "ACTION_REQUEST" | "CONVERSATION" | "AMBIGUOUS";

const VALID_INTENTS: Intent[] = [
  "LOOKUP",
  "ACTION_REQUEST",
  "CONVERSATION",
  "AMBIGUOUS",
];

export async function classifyIntent(text: string): Promise<Intent> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const client = new GoogleGenAI({ apiKey: requireConfigValue("GEMINI_API_KEY") });
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Classify the user message into exactly one of: LOOKUP, ACTION_REQUEST, CONVERSATION, AMBIGUOUS.\n\nLOOKUP — user wants information from past meetings/decisions/actions.\nACTION_REQUEST — user wants to create a Jira issue, send a Slack message, or trigger an external action.\nCONVERSATION — general chat, greetings, or unrelated discussion.\nAMBIGUOUS — cannot determine intent clearly.\n\nRespond with only the label, nothing else.\n\nMessage: ${text}`,
            },
          ],
        },
      ],
    });

    const label = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase() as Intent;
    if (VALID_INTENTS.includes(label)) return label;
    return "AMBIGUOUS";
  } catch {
    return "AMBIGUOUS";
  } finally {
    clearTimeout(timer);
  }
}
