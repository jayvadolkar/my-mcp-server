// src/tools/corehr/getDepartments.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Query‐params schema */
export const getDepartmentsQuery = z
  .object({
    departmentIds: z.string().optional().describe("Comma-separated list of Department IDs (UUIDs). The UUID for the department can be found  as part of many API responses. For example, when you fetch all employees, the department ID is included in the employee object."),
    lastModified: z.string().optional().describe("ISO 8601 timestamp to filter by last modified. Only departments modified after this timestamp will be returned. if only date is provided, the time will be set to 00:00:00.000Z. If only time is provided, the date will be set to today."),
    pageNumber: z.coerce.number().int().optional().default(1).describe("Page number (default 1)"),
    pageSize: z.coerce.number().int().optional().default(100).describe("Results per page (max 200, default 100)")
  })
  .describe("Departments query parameters");

/**
 * 2️⃣ Call the Keka API to fetch departments
 */
export async function getDepartments(
  env: Env,
  query: z.infer<typeof getDepartmentsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/departments`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, String(value));
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json"
    }
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}
