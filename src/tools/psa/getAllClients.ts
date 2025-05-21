// src/tools/psa/getClients.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query‐params schema */
export const getClientsQuery = z
  .object({
    clientIds: z
      .string()
      .optional()
      .describe("Comma-separated client UUIDs (e.g. 'id1,id2')"),
    lastModified: z
      .string()
      .datetime()
      .optional()
      .describe("Filter clients modified since this ISO 8601 datetime"),
    pageNumber: z
      .coerce.number()
      .int()
      .optional()
      .default(1)
      .describe("Page number (default 1)"),
    pageSize: z
      .coerce.number()
      .int()
      .optional()
      .default(100)
      .describe("Results per page (default 100)"),
  })
  .describe("Query parameters to filter PSA clients");

/**
 * 2️⃣ Call the Keka API to fetch PSA clients
 */
export async function getClients(
  env: Env,
  query: z.infer<typeof getClientsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/psa/clients`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `GET ${url.toString()} failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
