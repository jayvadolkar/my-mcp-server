// src/tools/skills/getEmployeeSkills.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path params schema */
export const getEmployeeSkillsParams = z.object({
  employeeId: z
    .string()
    .describe("The employee identifier (UUID)")
});

/** 2️⃣ Query‐params schema */
export const getEmployeeSkillsQuery = z
  .object({
    lastModified: z
      .string()
      .datetime()
      .optional()
      .describe("Filter by last modified date-time (ISO 8601)"),
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
  .describe("Query parameters for fetching employee skills");

/**
 * 3️⃣ Call the Keka API to fetch employee skills
 */
export async function getEmployeeSkills(
  env: Env,
  params: z.infer<typeof getEmployeeSkillsParams>,
  query: z.infer<typeof getEmployeeSkillsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/employees/${encodeURIComponent(params.employeeId)}/skills`);

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
