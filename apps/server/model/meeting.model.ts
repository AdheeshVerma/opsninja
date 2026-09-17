import z from "zod";

const meetingModel = z.object({
  meeting_id: z.string(),
  project_id: z.string(),
  uploaded_by: z.string(),
  meeting_platform: z.enum(["google_meet", "zoom", "slack", "discord"]),
  original_transcript: z.string(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export default meetingModel;
