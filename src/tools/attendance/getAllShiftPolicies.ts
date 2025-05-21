// src/tools/time/getShiftPolicies.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query‐params schema */
export const getShiftPoliciesQuery = z
  .object({
    shiftPolicyIds: z
      .string()
      .describe(
        "Comma-separated list of shift-policy UUIDs (e.g. 'id1,id2')"
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
  .describe("Parameters for fetching shift-policy configurations");

/**
 * 2️⃣ Call the Keka API to fetch shift policies
 */
export async function getShiftPolicies(
  env: Env,
  query: z.infer<typeof getShiftPoliciesQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/time/shiftpolicies`);
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
    throw new Error(
      `GET ${url.toString()} failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}
