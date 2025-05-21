// src/tools/attendance/getAttendance.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query‐params schema */
export const getAttendanceQuery = z
  .object({
    employeeIds: z
      .string()
      .describe(
        "Comma-separated list of employee UUIDs (e.g. 'id1,id2,id3')"
      ),
    from: z
      .string()
      .datetime()
      .describe("ISO 8601 start of date range (inclusive)"),
    to: z
      .string()
      .datetime()
      .describe("ISO 8601 end of date range (inclusive)"),
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
  .describe("Parameters for fetching attendance records");

/**
 * 2️⃣ Call the Keka API to fetch attendance
 */
export async function getAttendance(
  env: Env,
  query: z.infer<typeof getAttendanceQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/time/attendance`);
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
