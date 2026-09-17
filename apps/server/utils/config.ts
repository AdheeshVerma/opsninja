import * as AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
dotenv.config();

type SecretValues = Record<string, string>;

let secrets: SecretValues | null = null;

const getBootstrapEnv = (key: string) => process.env[key]?.trim();

const getSecretId = () =>
  getBootstrapEnv("AWS_SECRETS_MANAGER_SECRET_ID") ??
  getBootstrapEnv("SECRETS_MANAGER_SECRET_ID");

const getSecretRegion = () =>
  getBootstrapEnv("AWS_SECRETS_MANAGER_REGION") ??
  getBootstrapEnv("SECRETS_MANAGER_REGION") ??
  "us-east-1";

const createSecretsManagerClient = () => {
  const accessKeyId = getBootstrapEnv("AWS_SECRETS_MANAGER_ACCESS_KEY_ID");
  const secretAccessKey = getBootstrapEnv(
    "AWS_SECRETS_MANAGER_SECRET_ACCESS_KEY",
  );
  const sessionToken = getBootstrapEnv("AWS_SECRETS_MANAGER_SESSION_TOKEN");

  return new AWS.SecretsManager({
    region: getSecretRegion(),
    ...(accessKeyId && secretAccessKey
      ? {
          accessKeyId,
          secretAccessKey,
          sessionToken,
        }
      : {}),
  });
};

const decodeSecretString = (secretString?: string, secretBinary?: any) => {
  if (secretString) {
    return secretString;
  }

  if (secretBinary) {
    return Buffer.from(secretBinary as Uint8Array).toString("utf8");
  }

  throw new Error("Secrets Manager returned an empty secret");
};

const parseSecretValues = (rawSecret: string): SecretValues => {
  const parsed = JSON.parse(rawSecret) as Record<string, unknown>;

  return Object.fromEntries(
    Object.entries(parsed)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]),
  );
};

export const loadConfig = async () => {
  if (secrets) {
    return secrets;
  }

  const secretId = getSecretId();

  if (!secretId) {
    throw new Error(
      "AWS_SECRETS_MANAGER_SECRET_ID or SECRETS_MANAGER_SECRET_ID is required",
    );
  }

  const response = await createSecretsManagerClient()
    .getSecretValue({
      SecretId: secretId,
    })
    .promise();

  secrets = parseSecretValues(
    decodeSecretString(response.SecretString, response.SecretBinary),
  );

  return secrets;
};

const getSecrets = () => {
  if (!secrets) {
    throw new Error("Application config has not been loaded");
  }

  return secrets;
};

export function getConfigValue(key: string): string | undefined;
export function getConfigValue(key: string, fallback: string): string;
export function getConfigValue(key: string, fallback?: string) {
  return getSecrets()[key] ?? fallback;
}

export const requireConfigValue = (key: string) => {
  const value = getConfigValue(key);

  if (!value) {
    throw new Error(`${key} is required in Secrets Manager`);
  }

  return value;
};

export const isProduction = () => getConfigValue("NODE_ENV") === "production";
