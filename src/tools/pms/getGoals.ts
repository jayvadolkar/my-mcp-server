// src/tools/pms/getGoals.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const getGoalsQuery = z.object({
  goalIds: z.string().optional().describe("Comma separated list of goal IDs to filter"),
  timeFrameIds: z.string().optional().describe("Comma separated list of time frame IDs to filter"),
  employeeIds: z.string().optional().describe("Comma separated list of employee IDs to filter"),
  from: z.string().optional().describe("Start date in ISO 8601 format (defaults to 'to' - 60 days)"),
  to: z.string().optional().describe("End date in ISO 8601 format (defaults to 'from' + 60 days)"),
  pageNumber: z.coerce.number().int().optional().describe("Page number"),
  pageSize: z.coerce.number().int().optional().describe("Results per page (max 200)")
});

export async function getGoals(
  env: Env,
  query: z.infer<typeof getGoalsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/pms/goals`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}