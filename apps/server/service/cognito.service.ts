import { CognitoJwtVerifier } from "aws-jwt-verify";

interface CognitoTokens {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

class CognitoService {
  private readonly tokenEndpoint: string;

  private readonly clientId: string;
  private readonly clientSecret?: string;
  private readonly redirectUri: string;

  private readonly idTokenVerifier;

  constructor() {
    const region = process.env.AWS_COGNITO_REGION || "us-east-1";
    const userPoolId = process.env.AWS_COGNITO_USER_POOL_ID || "mock-user-pool";
    const clientId = process.env.AWS_COGNITO_CLIENT_ID || "mock-client-id";
    const clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET;
    const domain =
      process.env.AWS_COGNITO_DOMAIN ||
      "https://mock.auth.us-east-1.amazoncognito.com";
    const redirectUri =
      process.env.AWS_COGNITO_REDIRECT_URI ||
      "http://localhost:8000/api/v1/auth/cognito/callback";

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;

    this.tokenEndpoint = `${domain}/oauth2/token`;

    try {
      this.idTokenVerifier = CognitoJwtVerifier.create({
        userPoolId,
        clientId,
        tokenUse: "id",
      });
    } catch {
      this.idTokenVerifier = null as any;
    }
  }

  async exchangeCode(code: string): Promise<CognitoTokens> {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: this.clientId,
      code,
      redirect_uri: this.redirectUri,
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    if (this.clientSecret) {
      const credentials = Buffer.from(
        `${this.clientId}:${this.clientSecret}`,
      ).toString("base64");

      headers["Authorization"] = `Basic ${credentials}`;
    }

    const response = await fetch(this.tokenEndpoint, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.text();

      throw new Error(`Cognito token exchange failed: ${error}`);
    }

    return response.json() as Promise<CognitoTokens>;
  }

  async getIdentity(tokens: CognitoTokens) {
    if (!tokens?.id_token) {
      throw new Error("Cognito ID token is missing");
    }

    return this.idTokenVerifier.verify(tokens.id_token);
  }
}

export default new CognitoService();
