export interface User {
  user_id: string;
  user_name: string;
  email: string;
  profile_pic?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  project_id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  integration_id: string;
  user_id: string;
  platform: "jira" | "slack" | "calendar";
  access_token?: string;
  refresh_token?: string;
  connected: boolean;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  chat_id: string;
  project_id: string;
  chat_name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  message_id: string;
  chat_id: string;
  message: string;
  message_type: "USER" | "SYSTEM";
  structured_response?: string;
  proposed_actions?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  action_id: string;
  meeting_id: string;
  project_id: string;
  title: string;
  description?: string;
  assignee?: string;
  action_type: "jira" | "slack" | "manual";
  action_status: "pending" | "in_progress" | "completed" | "failed";
  priority?: "high" | "medium" | "low";
  target?: string;
  error_message?: string;
  executed_by?: string;
  executed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingRecord {
  meeting_id: string;
  project_id: string;
  uploaded_by: string;
  meeting_platform: string;
  original_transcript: string;
  summary?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface SendMessageResponse {
  user_message: Message;
  agent_reply: Message;
  proposed_actions: ActionProposal[];
}

export interface ActionProposal {
  type: "jira" | "slack" | "manual";
  title: string;
  description?: string;
  target?: string;
  priority?: "high" | "medium" | "low";
}
