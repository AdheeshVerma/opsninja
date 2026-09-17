import z from "zod";

const chatModel = z.object({
  chat_id: z.string(),
  created_by: z.string(),
  project_id: z.string(),
  chat_name: z.string().optional(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export default chatModel;
