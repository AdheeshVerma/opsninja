import type { Request, Response } from "express";
import crypto from "crypto";
import { URLSearchParams } from "node:url";
import cognitoService from "../service/cognito.service";
import integrationService from "../service/integration.service";
export const PROVIDER_MAPPING: Record<string, string> = {
  jira: "/api/v1/auth/jira/callback",
  google: "/api/v1/auth/google/callback",
  cognito: "/api/v1/auth/cognito/callback",
};

type AtlassianState = {
  status: "PENDING";
  userId: string;
  siteUrl?: string;
};

type AtlassianTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
};

type AtlassianAccessibleResource = {
  id: string;
  name: string;
  url: string;
  scopes: string[];
};

const ATLASSIAN_STATE_MAP: Record<string, AtlassianState> = {};

export const AtlassianOAuthInitiator = (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id?.toString();
    const siteUrl = req.query.site_url?.toString();

    if (!userId) {
      return res.status(400).json({
        error: "Missing user_id query parameter",
      });
    }

    const state = crypto.randomBytes(32).toString("hex");
    const key = `oauth:jira:state:${state}`;

    ATLASSIAN_STATE_MAP[key] = {
      status: "PENDING",
      userId,
      siteUrl,
    };

    const params = new URLSearchParams({
      audience: "api.atlassian.com",
      client_id: process.env.ATLASSIAN_CLIENT_ID!,
      scope:
        "read:jira-work manage:jira-project read:jira-user write:jira-work manage:jira-webhook manage:jira-data-provider manage:jira-configuration offline_access",
      redirect_uri: process.env.ATLASSIAN_CALLBACK_URI!,
      state,
      response_type: "code",
      prompt: "consent",
    });

    const authorizationUrl = `https://auth.atlassian.com/authorize?${params.toString()}`;

    return res.redirect(authorizationUrl);
  } catch (error) {
    console.log(error);
    return res.status(302).redirect(`${process.env.FAILED_OAUTH_URL}`);
  }
};

export const AtlassianOAuthHandler = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    const key = `oauth:jira:state:${state}`;
    const pendingState = ATLASSIAN_STATE_MAP[key];
    if (
      !state ||
      !pendingState ||
      ATLASSIAN_STATE_MAP[key]?.status !== "PENDING" ||
      typeof code !== "string"
    ) {
      throw new Error("invalid state");
    }

    delete ATLASSIAN_STATE_MAP[key];

    const response = await fetch("https://auth.atlassian.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: process.env.ATLASSIAN_CLIENT_ID,
        client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ATLASSIAN_CALLBACK_URI,
      }),
    });

    const token = (await response.json()) as AtlassianTokenResponse;

    if (!response.ok) {
      throw new Error(`Atlassian token exchange failed`);
    }

    const resourcesResponse = await fetch(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          Accept: "application/json",
        },
      },
    );

    const resources =
      (await resourcesResponse.json()) as AtlassianAccessibleResource[];

    if (!resourcesResponse.ok) {
      throw new Error("Unable to fetch Atlassian accessible resources");
    }

    const requestedSiteUrl = pendingState.siteUrl?.replace(/\/$/, "");
    const jiraResource =
      resources.find(
        (resource) =>
          requestedSiteUrl &&
          resource.url.replace(/\/$/, "") === requestedSiteUrl,
      ) ??
      resources.find((resource) =>
        resource.scopes.some((scope) => scope.includes("jira")),
      );

    if (!jiraResource) {
      throw new Error("No Jira site is available for this Atlassian token");
    }

    // await integrationService.saveIntegration({
    //   integration_id: crypto.randomUUID(),
    //   user_id: pendingState.userId,
    //   atlassian_cloud_id: jiraResource.id,
    //   atlassian_site_url: jiraResource.url,
    //   atlassian_access_token: token.access_token,
    //   atlassian_refresh_token: token.refresh_token,
    //   atlassian_token_expires_at: new Date(
    //     Date.now() + token.expires_in * 1000,
    //   ).toISOString(),
    // });

    return res.status(301).redirect(process.env.SUCCESS_OAUTH_URL!);
  } catch (error) {
    console.log(error);
    return res.status(302).redirect(`${process.env.FAILED_OAUTH_URL}`);
  }
};

export const cognitoOAuthHandler = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: "Authorization code missing",
    });
  }

  const tokens = await cognitoService.exchangeCode(code as string);
  const identity = await cognitoService.getIdentity(tokens);
  console.log(identity);
  // TODO: handle the user logic with dynamodb
  return res.status(302).redirect(process.env.SUCCESS_OAUTH_URL!);
};
