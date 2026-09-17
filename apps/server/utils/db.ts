import DynamoDB from "@opsninja/db";
import { getConfigValue } from "./config";

let instance: DynamoDB | null = null;

const getDbInstance = () => {
  if (!instance) {
    instance = DynamoDB.getInstance(
      getConfigValue("AWS_DYNAMO_DB_REGION", "us-east-1"),
      getConfigValue("AWS_DYNAMO_DB_ACCESS_KEY", "mock-key"),
      getConfigValue("AWS_DYNAMO_DB_ACCESS_SECRET", "mock-secret"),
    );
  }

  return instance;
};

const TABLE_MAPPING: Record<string, string> = {
  Users: "user_id",
  Integrations: "integration_id",
  Projects: "project_id",
  Chats: "chat_id",
  Messages: "message_id",
  Meetings: "meeting_id",
  MeetingRecords: "record_id",
  Actions: "action_id",
};

export async function seedDB() {
  if (
    !getConfigValue("AWS_DYNAMO_DB_REGION") ||
    !getConfigValue("AWS_DYNAMO_DB_ACCESS_KEY")
  ) {
    console.log(
      "[DB] AWS DynamoDB credentials not configured — skipping seedDB",
    );
    return;
  }

  const tableQuery: any[] = [];
  const db = getDbInstance();

  for (const key of Object.keys(TABLE_MAPPING)) {
    tableQuery.push(
      db.createTable(
        key,
        [{ attributeName: TABLE_MAPPING[key] ?? "", keyType: "HASH" }],
        "PAY_PER_REQUEST",
      ),
    );
  }

  await Promise.all(tableQuery);
}

export default {
  getClient() {
    return getDbInstance().getClient();
  },
};
