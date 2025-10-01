// src/tools/psa/getProjectTaskTimeEntries.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const getProjectTaskTimeEntriesPath = z
  .object({
    projectId: z.string().uuid().describe("UUID of the PSA project"),
    taskId:    z.string().uuid().describe("UUID of the task"),
  })
  .describe("Path parameters for fetching time entries");

/** 2️⃣ Query‐params schema */
export const getProjectTaskTimeEntriesQuery = z
  .object({
    from:        z.string().datetime().describe("Start of time‐entry range (ISO 8601)"),
    to:          z.string().datetime().describe("End of time‐entry range (ISO 8601). To date cannot be beyond 90 days of from date"),
    employeeIds: z.string().optional().describe("Comma-separated list of employee UUIDs"),
    pageNumber:  z.coerce.number().int().optional().default(1).describe("Page number (default 1)"),
    pageSize:    z.coerce.number().int().optional().default(100).describe("Results per page (default 100)"),
  })
  .describe("Query parameters to filter time entries");

/**
 * 3️⃣ Call the PSA API to fetch task time entries
 */
export async function getProjectTaskTimeEntries(
  env: Env,
  path: z.infer<typeof getProjectTaskTimeEntriesPath>,
  query: z.infer<typeof getProjectTaskTimeEntriesQuery>
) {
  const token = await getAuthToken(env);
  const { projectId, taskId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(
    `${baseUrl}/psa/projects/${projectId}/tasks/${taskId}/timeentries`
  );
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