import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse, MeetingRecord } from "@/types/api.types";

export const getMeetings = async (projectId: string): Promise<MeetingRecord[]> => {
  const { data } = await axiosInstance.get<ApiResponse<MeetingRecord[]>>(
    `/api/v1/projects/${projectId}/meetings`
  );
  return data.data;
};

export const getMeeting = async (projectId: string, meetingId: string): Promise<MeetingRecord> => {
  const { data } = await axiosInstance.get<ApiResponse<MeetingRecord>>(
    `/api/v1/projects/${projectId}/meetings/${meetingId}`
  );
  return data.data;
};

export const getMeetingSummary = async (
  projectId: string,
  meetingId: string
): Promise<MeetingRecord> => {
  const { data } = await axiosInstance.get<ApiResponse<MeetingRecord>>(
    `/api/v1/projects/${projectId}/meetings/${meetingId}/summary`
  );
  return data.data;
};

export const uploadTranscript = async (
  projectId: string,
  payload: {
    meeting_platform: string;
    original_transcript: string;
  }
): Promise<MeetingRecord> => {
  const { data } = await axiosInstance.post<ApiResponse<MeetingRecord>>(
    `/api/v1/projects/${projectId}/meetings`,
    payload
  );
  return data.data;
};
