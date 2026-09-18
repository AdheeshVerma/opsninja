import { GoogleModel } from "@strands-agents/sdk/models/google";
import { requireConfigValue } from "./config";

export const createMeetingModel = () =>
  new GoogleModel({
    apiKey: requireConfigValue("GEMINI_API_KEY"),
    modelId: "gemini-2.5-flash",
  });
