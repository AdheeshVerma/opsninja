import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import db from "../utils/db";
import userModel, { type User } from "../model/user.model";

export interface CognitoUserIdentity {
  sub: string;
  email?: string;
  phone_number?: string;
  "cognito:username"?: string;
}

type StoredUser = Omit<User, "created_at" | "updated_at"> & {
  created_at: string;
  updated_at: string;
};

class UserService {
  async getOrCreateFromCognito(identity: CognitoUserIdentity) {
    if (!identity.sub) {
      throw new Error("Cognito identity is missing sub");
    }

    if (!identity.email) {
      throw new Error("Cognito identity is missing email");
    }

    const existingUser = await this.findByCognitoSub(identity.sub);

    if (existingUser) {
      return existingUser;
    }

    const user = userModel.parse({
      user_id: randomUUID(),
      user_name: this.getUserName(identity),
      user_email: identity.email,
      cognito_sub: identity.sub,
    });

    const item = this.serializeUser(user);

    await db.getClient().send(
      new PutCommand({
        TableName: "Users",
        Item: item,
        ConditionExpression: "attribute_not_exists(user_id)",
      }),
    );

    return item;
  }

  private async findByCognitoSub(cognitoSub: string) {
    let lastEvaluatedKey: Record<string, unknown> | undefined;

    do {
      const result = await db.getClient().send(
        new ScanCommand({
          TableName: "Users",
          FilterExpression: "cognito_sub = :cognitoSub",
          ExpressionAttributeValues: {
            ":cognitoSub": cognitoSub,
          },
          ExclusiveStartKey: lastEvaluatedKey,
        }),
      );

      const [user] = (result.Items ?? []) as StoredUser[];

      if (user) {
        return user;
      }

      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);
  }

  private serializeUser(user: User): StoredUser {
    return {
      ...user,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  }

  private getUserName(identity: CognitoUserIdentity) {
    const emailUserName = identity.email?.split("@")[0];

    return (
      emailUserName ||
      identity["cognito:username"] ||
      identity.phone_number ||
      identity.sub
    );
  }
}

export default new UserService();
