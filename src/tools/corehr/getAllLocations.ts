// src/tools/corehr/getLocations.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query‐params schema */
export const getLocationsQuery = z
  .object({
    lastModified: z.string().optional().describe("ISO 8601 timestamp to filter by last modified"),
    pageNumber:   z.coerce.number().int().optional().default(1).describe("Page number (default 1)"),
    pageSize: z.coerce.number()
      .int()
      .optional()
      .default(100).describe("Results per page (max 200, default 100)"),
  })
  .describe("Locations query parameters");

/**
 * 2️⃣ Call the Keka API to fetch locations
 */
export async function getLocations(
  env: Env,
  query: z.infer<typeof getLocationsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/locations`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `GET ${url.toString()} failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}
