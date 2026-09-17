import NeptuneClient from "@opsninja/graph-db";
import { getConfigValue } from "./config";

let instance: ReturnType<typeof NeptuneClient.getInstance> | null = null;

export default {
  getClient() {
    if (!instance) {
      instance = NeptuneClient.getInstance(
        getConfigValue("AWS_NEPTUNE_ENDPOINT", ""),
      );
    }

    return instance;
  },
};
