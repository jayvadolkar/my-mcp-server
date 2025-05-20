// src/tools/leave/getLeaveRequests.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query‐params schema */
export const getLeaveRequestsQuery = z
  .object({
    employeeIds: z
      .string()
      .optional()
      .describe("Comma-separated list of Employee IDs (UUIDs)"),
    from: z
      .string()
      .optional()
      .describe("ISO 8601 start date/time"),
    to: z
      .string()
      .optional()
      .describe("ISO 8601 end date/time"),
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
  .describe("Leave requests query parameters");

/**
 * 2️⃣ Call the Keka API to fetch leave requests
 */
export async function getLeaveRequests(
  env: Env,
  query: z.infer<typeof getLeaveRequestsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/time/leaverequests`);

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
