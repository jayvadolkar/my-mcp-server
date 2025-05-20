// src/tools/corehr/getJobTitles.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query‐params schema */
export const getJobTitlesQuery = z
  .object({
    lastModified: z.string().optional().describe("ISO 8601 timestamp to filter by last modified"),
    pageNumber: z.number().int().optional().default(1).describe("Page number (default 1). More pages can be fetched using the pageSize and nextPage parameter."),
    pageSize: z
      .number()
      .int()
      .optional()
      .default(100)
      .describe("Results per page (max 200, default 100)"),
  })
  .describe("Job titles query parameters");

/**
 * 2️⃣ Call the Keka API to fetch job titles
 */
export async function getJobTitles(
  env: Env,
  query: z.infer<typeof getJobTitlesQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/jobtitles`);

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
