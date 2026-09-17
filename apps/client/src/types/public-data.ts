export type PublicUser = {
  user_id: string;
  user_name: string;
  user_email: string;
  atlassian_connected: boolean;
  slack_connected: boolean;
  calendar_connected: boolean;
  profile_pic: string;
  created_at: string;
  updated_at: string;
};

export type PublicProject = {
  project_id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type PublicChat = {
  chat_id: string;
  created_by: string;
  project_id: string;
  chat_name?: string;
  created_at: string;
  updated_at: string;
};

export type PublicChatMessage = {
  message_id: string;
  chat_id: string;
  message: string;
  message_type: "SYSTEM" | "USER";
  created_at: string;
  updated_at: string;
};

export type MeetingPlatform = "google_meet" | "zoom" | "slack" | "discord";

export type PublicMeeting = {
  meeting_id: string;
  project_id: string;
  uploaded_by: string;
  meeting_platform: MeetingPlatform;
  created_at: string;
  updated_at: string;
};

export type PublicMeetingRecord = {
  record_id: string;
  meeting_id: string;
  summary: string;
  created_at: string;
  updated_at: string;
};

export type MeetingActionStatus =
  | "success"
  | "failed"
  | "pending"
  | "un_initialized"
  | "initialized";

export type MeetingActionType =
  | "create_jira_issue"
  | "send_slack_message"
  | "create_calendar_event";

export type IntegrationPlatform = "jira" | "slack" | "calendar";

export type PublicMeetingAction = {
  action_id: string;
  meeting_id: string;
  action_by: string;
  action_status: MeetingActionStatus;
  action_type: MeetingActionType;
  error_message?: string;
  integration_platform: IntegrationPlatform;
  created_at: string;
  updated_at: string;
};

export type PublicIntegration = {
  integration_id: string;
  user_id: string;
  atlassian_site_url?: string;
  connected_platforms: IntegrationPlatform[];
  created_at: string;
  updated_at: string;
};
