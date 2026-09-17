import z from "zod";

const meetingActionModel = z.object({
  action_id: z.string(),
  meeting_id: z.string(),
  action_by: z.string(),
  action_status: z.enum([
    "success",
    "failed",
    "pending",
    "un_initialized",
    "initialized",
  ]),
  action_type: z.enum([
    "create_jira_issue",
    "send_slack_message",
    "create_calendar_event",
  ]),
  error_message: z.string().optional(),
  integration_platform: z.enum(["jira", "slack", "calendar"]),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export default meetingActionModel;
