# server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Configuration

Only Secrets Manager bootstrap values should be set as environment variables:

```bash
AWS_SECRETS_MANAGER_SECRET_ID=""
AWS_SECRETS_MANAGER_REGION="us-east-1"
```

When local IAM role credentials are not available, these optional bootstrap
values can also be set:

```bash
AWS_SECRETS_MANAGER_ACCESS_KEY_ID=""
AWS_SECRETS_MANAGER_SECRET_ACCESS_KEY=""
AWS_SECRETS_MANAGER_SESSION_TOKEN=""
```

The secret value should be a JSON object containing the application settings,
for example `ATLASSIAN_CLIENT_ID`, `ATLASSIAN_CLIENT_SECRET`,
`ATLASSIAN_CALLBACK_URI`, `FAILED_OAUTH_URL`, `SUCCESS_OAUTH_URL`,
`AWS_DYNAMO_DB_REGION`, `AWS_DYNAMO_DB_ACCESS_KEY`,
`AWS_DYNAMO_DB_ACCESS_SECRET`, Cognito settings, S3 settings, `JWT_SECRET`,
`FRONTEND_URL`, `PORT`, and `NODE_ENV`.

This project was created using `bun init` in bun v1.3.6. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
