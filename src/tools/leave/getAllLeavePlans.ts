// src/tools/leave/getLeavePlans.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Query‐params schema */
export const getLeavePlansQuery = z
  .object({
    leavePlanIds: z
      .string()
      .optional()
      .describe("Comma-separated list of Leave Plan IDs (UUIDs)"),
    pageNumber: z
      .coerce
      .number()
      .int()
      .default(1)
      .describe("Page number (default 1)"),
    pageSize: z
      .coerce
      .number()
      .int()
      .default(100)
      .describe("Results per page (max 200, default 100)"),
  })
  .describe("Leave plans query parameters");

/**
 * 2️⃣ Call the Keka API to fetch leave plans
 */
export async function getLeavePlans(
  env: Env,
  query: z.infer<typeof getLeavePlansQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/time/leaveplans`);

  // Append query params
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
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}
