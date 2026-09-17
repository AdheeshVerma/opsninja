import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import db from "../utils/db";
import integrationModel, { type Integration } from "../model/integration.model";

class IntegrationService {
  async saveIntegration(integration: Integration) {
    const item = integrationModel.parse(integration);

    await db.getClient().send(
      new PutCommand({
        TableName: "Integrations",
        Item: item,
      }),
    );

    await db.getClient().send(
      new UpdateCommand({
        TableName: "Users",
        Key: {
          user_id: item.user_id,
        },
        UpdateExpression: "SET atlassian_connected = :connected",
        ExpressionAttributeValues: {
          ":connected": true,
        },
      }),
    );

    return item;
  }
}

export default new IntegrationService();
