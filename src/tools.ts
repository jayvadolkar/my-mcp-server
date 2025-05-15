// src/auth.ts

export interface AuthConfig {
  environment:   string;
  grant_type:    string;
  scope:         string;
  client_id:     string;
  client_secret: string;
  api_key:       string;
  company:       string;
}

// Reads from process.env (Node) or globalThis (Workers)
function getRuntimeConfig(): AuthConfig {
  const e = typeof process !== "undefined" ? process.env : (globalThis as any);
  return {
    environment:   e.ENVIRONMENT!,
    grant_type:    e.GRANT_TYPE!,
    scope:         e.SCOPE!,
    client_id:     e.CLIENT_ID!,
    client_secret: e.CLIENT_SECRET!,
    api_key:       e.API_KEY!,
    company:       e.COMPANY!,
  };
}

// Hard-coded defaults for quick tests
const defaultConfig: AuthConfig = {
  environment:   "kekademo",
  grant_type:    "kekaapi",
  scope:         "kekaapi",
  client_id:     "130e4b45-0a6a-4213-a056-07a48e51b717",
  client_secret: "K4sMNMLVBr0UkQEDkCL4",
  api_key:       "D1My8wefkHBUur_szeRNDsQ9crnRvXRMw_cM6vR2tlI=",
  company:       "googleindia",
};

/**
 * Fetches a Bearer token.
 * @param useConfig  true = use env vars, false = use defaultConfig
 */
export async function getAuthToken(useConfig: boolean): Promise<string> {
  const cfg = useConfig ? getRuntimeConfig() : defaultConfig;

  // build token URL exactly as requested
  const tokenUrl = `https://login.${cfg.environment}.com/connect/token`;

  const body = new URLSearchParams({
    grant_type:    cfg.grant_type,
    scope:         cfg.scope,
    client_id:     cfg.client_id,
    client_secret: cfg.client_secret,
    api_key:       cfg.api_key,
  });

  const resp = await fetch(tokenUrl, {
    method:  "POST",
    headers: {
      "Accept":       "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Token fetch failed: ${resp.status} ${err}`);
  }

  const { access_token } = (await resp.json()) as { access_token: string };
  return access_token;
}
