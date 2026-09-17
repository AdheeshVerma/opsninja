import DynamoDB from "@opsninja/db";

const region = process.env.AWS_DYNAMO_DB_REGION || "us-east-1";
const accesskey = process.env.AWS_DYNAMO_DB_ACCESS_KEY || "mock-key";
const accessSecret = process.env.AWS_DYNAMO_DB_ACCESS_SECRET || "mock-secret";

let instance: DynamoDB;
try {
  instance = DynamoDB.getInstance(region, accesskey, accessSecret);
} catch {
  instance = null as any;
}

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
    !process.env.AWS_DYNAMO_DB_REGION ||
    !process.env.AWS_DYNAMO_DB_ACCESS_KEY
  ) {
    console.log(
      "[DB] AWS DynamoDB credentials not configured — skipping seedDB",
    );
    return;
  }
  if (!instance) return;

  const tableQuery: any[] = [];

  for (const key of Object.keys(TABLE_MAPPING)) {
    tableQuery.push(
      instance.createTable(
        key,
        [{ attributeName: TABLE_MAPPING[key] ?? "", keyType: "HASH" }],
        "PAY_PER_REQUEST",
      ),
    );
  }

  await Promise.all(tableQuery);
}

export default instance;
