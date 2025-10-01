// src/tools/time/getWeeklyOffPolicies.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Query‐params schema */
export const getWeeklyOffPoliciesQuery = z
  .object({
    weeklyoffPolicyIds: z
      .string()
      .describe(
        "Comma-separated list of weekly-off-policy UUIDs (e.g. 'id1,id2')"
      ),
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
      .describe("Results per page (max 500, default 100)"),
  })
  .describe("Parameters for fetching weekly-off policy configurations");

/**
 * 2️⃣ Call the Keka API to fetch weekly-off policies
 */
export async function getWeeklyOffPolicies(
  env: Env,
  query: z.infer<typeof getWeeklyOffPoliciesQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/time/weeklyoffpolicies`);
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

