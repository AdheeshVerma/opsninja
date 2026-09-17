import NeptuneClient from "@opsninja/graph-db";

const instanceUrl = process.env.AWS_NEPTUNE_ENDPOINT ?? "";
const instance = NeptuneClient.getInstance(instanceUrl);

export default instance;
