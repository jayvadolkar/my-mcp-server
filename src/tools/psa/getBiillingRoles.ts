// src/tools/psa/getBillingRoles.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const getBillingRolesPath = z
  .object({
    clientId: z.string().uuid().describe("UUID of the PSA client"),
  })
  .describe("Path parameters for fetching billing roles");

/** 2️⃣ Query‐params schema */
export const getBillingRolesQuery = z
  .object({
    lastModified: z
      .string()
      .datetime()
      .optional()
      .describe("Only include roles modified since this ISO 8601 datetime"),
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
  .describe("Query parameters for fetching billing roles");

/**
 * 3️⃣ Call the Keka API to fetch billing roles for a client
 */
export async function getBillingRoles(
  env: Env,
  path: z.infer<typeof getBillingRolesPath>,
  query: z.infer<typeof getBillingRolesQuery>
) {
  const token = await getAuthToken(env);
  const { clientId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/psa/clients/${clientId}/billingroles`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
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
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}
