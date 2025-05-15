// src/auth.ts

export interface AuthConfig {
  company:       string;
  environment:   string;
  clientId:      string;
  clientSecret:  string;
  apiKey:        string;
}

// Playground‐only defaults:
export const defaultAuthConfig: AuthConfig = {
  company:      "googleindia",
  environment:  "kekademo",
  clientId:     "130e4b45-0a6a-4213-a056-07a48e51b717",
  clientSecret: "K4sMNMLVBr0UkQEDkCL4",
  apiKey:       "D1My8wefkHBUur_szeRNDsQ9crnRvXRMw_cM6vR2tlI=",
};

/**
 * Reads the most recently parsed config out of globalThis.
 * Throws if nothing has been set (i.e. no header and no fallback).
 */
export function getRuntimeConfig(): AuthConfig {
  const cfg = (globalThis as any).__RUNTIME_CONFIG as AuthConfig | undefined;
  if (!cfg) {
    throw new Error(
      "Runtime config missing: did you forget the Authorization header or call with useConfig=false?"
    );
  }
  return cfg;
}

/**
 * Your existing token‐fetcher.
 */
export async function getAccessToken({
  clientId,
  clientSecret,
  apiKey,
  environment,
}: {
  clientId:     string;
  clientSecret: string;
  apiKey:       string;
  environment:  string;
}): Promise<string> {
  const url = `https://login.${environment}.com/connect/token`;

  const formBody = new URLSearchParams({
    grant_type:    "kekaapi",
    scope:         "kekaapi",
    client_id:     clientId,
    client_secret: clientSecret,
    api_key:       apiKey,
  });

  const response = await fetch(url, {
    method:  "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept:         "application/json",
    },
    body: formBody.toString(),
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const err = await response.text();
    console.error("Access token fetch failed:", err);
    throw new Error("Failed to get access token");
  }

  type TokenResponse = {
    access_token: string;
    expires_in:   number;
    token_type:   string;
    scope:        string;
  };

  const data = (await response.json()) as TokenResponse;
  if (!data.access_token) {
    throw new Error("No access_token in response");
  }
  return data.access_token;
}
