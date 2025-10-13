// src/tools/assets/getAllAssets.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Query‐params schema */
export const getAllAssetsQuery = z
  .object({
    assetIds: z
      .string()
      .optional()
      .describe("Comma-separated list of asset IDs"),
    employeeIds: z
      .string()
      .optional()
      .describe("Comma-separated list of employee IDs"),
    assetStatus: z
      .string()
      .optional()
      .describe("The asset status (0 = Available, 1 = Assigned, 2 = Retired)"),
    lastModified: z
      .string()
      .datetime()
      .optional()
      .describe("Filter by last modified date-time (ISO 8601)"),
    pageNumber: z
      .coerce
      .number()
      .int()
      .optional()
      .default(1)
      .describe("Page number (default 1)"),
    pageSize: z
      .coerce
      .number()
      .int()
      .optional()
      .default(100)
      .describe("Results per page (max 200, default 100)"),
  })
  .describe("Query parameters for fetching all assets");

/**
 * 2️⃣ Call the Keka API to fetch all assets
 */
export async function getAllAssets(
  env: Env,
  query: z.infer<typeof getAllAssetsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/assets`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
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
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}
