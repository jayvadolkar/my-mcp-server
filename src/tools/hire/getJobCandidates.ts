// src/tools/hire/getJobCandidates.ts


import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/**
 * Fetches job candidates from the API.
 * @param env - The environment configuration.
 * @param query - The query parameters for fetching job candidates.
 * @returns A promise that resolves to the job candidates data.
 */
// @ts-ignore
export const getJobCandidatesQuery = z.object({
  jobId: z.string().describe("Job ID"),
  isArchived: z.boolean().default(false).describe("Include archived candidates"),
  lastModified: z.string().optional().describe("ISO 8601 datetime"),
  pageNumber: z.coerce.number().int().default(1).describe("Page number (default 1)"),
  pageSize: z.coerce.number().int().default(100).describe("Results per page (max 200, default 100)")
}).describe("Job candidates query parameters");

export async function getJobCandidates(
  env: Env,
  query: z.infer<typeof getJobCandidatesQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hire/jobs/${query.jobId}/candidates`);

  const { jobId, ...queryParams } = query;
  Object.entries(queryParams).forEach(([key, value]) => {
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