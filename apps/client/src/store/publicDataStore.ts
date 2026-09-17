"use client";

import { create } from "zustand";
import type {
  PublicChat,
  PublicChatMessage,
  PublicIntegration,
  PublicMeeting,
  PublicMeetingAction,
  PublicMeetingRecord,
  PublicProject,
  PublicUser,
} from "@/types/public-data";

type PublicDataState = {
  users: PublicUser[];
  projects: PublicProject[];
  chats: PublicChat[];
  messages: PublicChatMessage[];
  meetings: PublicMeeting[];
  meetingRecords: PublicMeetingRecord[];
  meetingActions: PublicMeetingAction[];
  integrations: PublicIntegration[];
  activeProjectId?: string;
  activeChatId?: string;
  activeMeetingId?: string;
  setUsers: (users: PublicUser[]) => void;
  setProjects: (projects: PublicProject[]) => void;
  setChats: (chats: PublicChat[]) => void;
  setMessages: (messages: PublicChatMessage[]) => void;
  setMeetings: (meetings: PublicMeeting[]) => void;
  setMeetingRecords: (meetingRecords: PublicMeetingRecord[]) => void;
  setMeetingActions: (meetingActions: PublicMeetingAction[]) => void;
  setIntegrations: (integrations: PublicIntegration[]) => void;
  setActiveProjectId: (projectId?: string) => void;
  setActiveChatId: (chatId?: string) => void;
  setActiveMeetingId: (meetingId?: string) => void;
  resetPublicData: () => void;
};

const initialState = {
  users: [],
  projects: [],
  chats: [],
  messages: [],
  meetings: [],
  meetingRecords: [],
  meetingActions: [],
  integrations: [],
  activeProjectId: undefined,
  activeChatId: undefined,
  activeMeetingId: undefined,
};

export const usePublicDataStore = create<PublicDataState>((set) => ({
  ...initialState,
  setUsers: (users) => set({ users }),
  setProjects: (projects) => set({ projects }),
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  setMeetings: (meetings) => set({ meetings }),
  setMeetingRecords: (meetingRecords) => set({ meetingRecords }),
  setMeetingActions: (meetingActions) => set({ meetingActions }),
  setIntegrations: (integrations) => set({ integrations }),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
  setActiveChatId: (activeChatId) => set({ activeChatId }),
  setActiveMeetingId: (activeMeetingId) => set({ activeMeetingId }),
  resetPublicData: () => set(initialState),
}));
