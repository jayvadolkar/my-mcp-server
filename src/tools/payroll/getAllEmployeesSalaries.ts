// src/tools/payroll/getSalaries.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Query‐params schema */
export const getEmployesSalariesQuery = z
  .object({
    employeeIds: z
      .string()
      .optional()
      .describe("Comma-separated list of employee UUIDs (e.g. 'id1,id2')"),
    paygroupIds: z
      .string()
      .optional()
      .describe("Comma-separated list of paygroup UUIDs"),
    employmentStatus: z
      .string()
      .optional()
      .describe("Filter by employment status (e.g. 'Working', 'Relieved')"),
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
  .describe("Parameters for fetching salary details");

/**
 * 2️⃣ Call the Keka API to fetch salaries
 */
export async function getEmployesSalaries(
  env: Env,
  query: z.infer<typeof getEmployesSalariesQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/payroll/salaries`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
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
