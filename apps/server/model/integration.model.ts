import z from "zod";

const integrationModel = z.object({
  integration_id: z.string(),
  user_id: z.string(),

  atlassian_id: z.string().optional(),
  atlassian_cloud_id: z.string().optional(),
  atlassian_site_url: z.string().optional(),
  atlassian_access_token: z.string().optional(),
  atlassian_refresh_token: z.string().optional(),
  atlassian_token_expires_at: z.string().optional(),

  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export type Integration = z.infer<typeof integrationModel>;

export default integrationModel;
