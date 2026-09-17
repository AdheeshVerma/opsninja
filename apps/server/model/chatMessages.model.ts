import z from "zod";

const messageModel = z.object({
  message_id: z.string(),
  chat_id: z.string(),
  message: z.string(),
  message_type: z.enum(["SYSTEM", "USER"]),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export default messageModel;
