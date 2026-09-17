import z from "zod";

const meetingRecordModel = z.object({
  record_id: z.string(),
  meeting_id: z.string(),
  summary: z.string(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export default meetingRecordModel;
