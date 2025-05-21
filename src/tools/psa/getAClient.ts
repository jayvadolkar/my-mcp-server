// src/tools/psa/getClient.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getClientPath = z
  .object({
    clientId: z.string().uuid().describe("UUID of the client"),
  })
  .describe("Path parameters for fetching a single client");

/**
 * 2️⃣ Call the Keka API to fetch one PSA client
 */
export async function getClient(
  env: Env,
  path: z.infer<typeof getClientPath>
) {
  const token = await getAuthToken(env);
  const { clientId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/clients/${clientId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `GET ${url} failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}
