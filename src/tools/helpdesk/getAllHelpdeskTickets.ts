// src/tools/helpdesk/getAllHelpdeskTickets.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Query-params schema */
export const getAllHelpdeskTicketsQuery = z
  .object({
    status: z
      .string()
      .optional()
      .describe("Filter by status (0 = Open, 1 = InProgress, 2 = OnHold, 3 = Resolved, 4 = Closed, 5 = Cancelled)"),
    priority: z
      .string()
      .optional()
      .describe("Filter by priority (0 = None, 1 = Low, 2 = Medium, 3 = High)"),
    assignedToIds: z
      .string()
      .optional()
      .describe("Comma-separated list of employee IDs to filter by assigned person"),
    lastModified: z
      .string()
      .datetime()
      .optional()
      .describe("Filter by last modified date-time (ISO 8601)"),
    categoryIds: z
      .string()
      .optional()
      .describe("Comma-separated list of category IDs"),
    employeeIds: z
      .string()
      .optional()
      .describe("Comma-separated list of employee IDs who raised the tickets"),
    pageNumber: z
      .coerce
      .number()
      .int()
      .optional()
      .default(1)
      .describe("Page number (default 1)"),
    pageSize: z
      .coerce
      .number()
      .int()
      .optional()
      .default(100)
      .describe("Results per page (max 200, default 100)"),
  })
  .describe("Query parameters for fetching all helpdesk tickets");

/**
 * 2️⃣ Call the Keka API to fetch all helpdesk tickets
 */
export async function getAllHelpdeskTickets(
  env: Env,
  query: z.infer<typeof getAllHelpdeskTicketsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/helpdesk/tickets`);

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
