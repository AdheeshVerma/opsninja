import { Agent } from "@strands-agents/sdk";
import { meetingMinutesSchema, type MeetingMinutes } from "../utils/agent.types";
import { createMeetingModel } from "../utils/model";

const MOM_SYSTEM_PROMPT = `You convert raw meeting transcripts into accurate Minutes of Meeting.
Extract only information supported by the transcript. Do not invent owners, dates, projects,
"jira" only when the transcript asks to create or track a Jira issue, and "slack" only when
it asks to notify or message Slack. Use "none" for all other actions. Use a concise slug for
each action id. Return structured data only.`;

export const createMeetingMinutesAgent = () =>
  new Agent({
    id: "meeting-minutes-agent",
    name: "Meeting Minutes Agent",
    description:
      "Extracts a trustworthy, structured MOM from a meeting transcript.",
    model: createMeetingModel(),
    systemPrompt: MOM_SYSTEM_PROMPT,
    structuredOutputSchema: meetingMinutesSchema,
    printer: false,
  });

export class TranscriptAgent {
  async createMinutes(transcript: string): Promise<MeetingMinutes> {
    if (!transcript.trim()) {
      throw new Error("A meeting transcript is required");
    }

    const result = await createMeetingMinutesAgent().invoke(
      `Create Minutes of Meeting for this transcript:\n\n${transcript.trim()}`,
    );
    const parsed = meetingMinutesSchema.safeParse(result.structuredOutput);

    if (!parsed.success) {
      throw new Error(
        "The meeting-minutes agent returned invalid structured output",
      );
    }

    return parsed.data;
  }
}

export default new TranscriptAgent();
