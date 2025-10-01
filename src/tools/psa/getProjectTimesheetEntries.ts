// src/tools/psa/getProjectTimesheetEntries.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const getProjectTimesheetEntriesPath = z
  .object({
    projectId: z.string().uuid().describe("UUID of the PSA project"),
  })
  .describe("Path parameters for fetching project time entries");

/** 2️⃣ Query‐params schema */
export const getProjectTimesheetEntriesQuery = z
  .object({
    from: z
      .string()
      .datetime()
      .describe("ISO 8601 start datetime for entries"),
    to: z
      .string()
      .datetime()
      .describe("ISO 8601 end datetime for entries"),
    employeeIds: z
      .string()
      .optional()
      .describe("Comma-separated list of employee UUIDs to filter"),
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
  .describe("Query parameters for fetching time entries");

/**
 * 3️⃣ Call the PSA API to fetch time entries
 */
export async function getProjectTimesheetEntries(
  env: Env,
  path: z.infer<typeof getProjectTimesheetEntriesPath>,
  query: z.infer<typeof getProjectTimesheetEntriesQuery>
) {
  const token = await getAuthToken(env);
  const { projectId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/psa/projects/${projectId}/timeentries`);
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
