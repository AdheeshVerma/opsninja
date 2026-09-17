import z from "zod";

const projectModel = z.object({
  project_id: z.string(),
  name: z.string(),
  description: z.string().default(""),
  created_by: z.string(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export default projectModel;
