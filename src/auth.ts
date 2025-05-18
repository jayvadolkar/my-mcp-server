// src/auth.ts - Authentication handling

import { Env } from "./index";

/**
 * Get authentication token for Keka API
 * @param env Cloudflare Workers environment object
 * @returns Authentication token
 */
export async function getAuthToken(env: Env): Promise<string> {
  try {
    // Use the TOKEN_ENDPOINT from your env
    const tokenEndpoint = `https://login.${env.ENVIRONMENT}.com/connect/token`;

    const formData = new URLSearchParams();
    formData.append("grant_type", env.KEKA_GRANT_TYPE);
    formData.append("scope", env.KEKA_SCOPE);
    formData.append("client_id", env.KEKA_CLIENT_ID);
    formData.append("client_secret", env.KEKA_CLIENT_SECRET);
    formData.append("api_key", env.KEKA_API_KEY);

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get auth token: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw new Error(
      `Error getting auth token: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
