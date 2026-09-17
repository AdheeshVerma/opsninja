import z from "zod";

const userModel = z.object({
  user_id: z.string(),
  user_name: z.string(),
  user_email: z.string(),
  cognito_sub: z.string().optional(),
  atlassian_connected: z.boolean().default(false),
  slack_connected: z.boolean().default(false),
  calendar_connected: z.boolean().default(false),
  profile_pic: z
    .string()
    .default(
      "https://res.cloudinary.com/djy3ewpb8/image/upload/v1779268903/image_mez4at.png",
    ),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export default userModel;
