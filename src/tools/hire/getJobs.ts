// src/tools/hire/getJobs.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";


export const getJobsQuery = z.object({
  lastModified: z.string().optional().describe("ISO 8601 datetime"),
  JobStatus: z.coerce.number().int().optional().describe("Job status enum: 0=Draft, 1=Online, 2=Archived, 3=Offline, 4=Confidential"),
  jobBoardIdentifier: z.string().optional().describe("Job board identifier"),
  pageNumber: z.coerce.number().int().default(1).describe("Page number (default 1)"),
  pageSize: z.coerce.number().int().default(100).describe("Results per page (max 200, default 100)")
}).describe("Jobs query parameters");

export async function getJobs(env: Env, query: z.infer<typeof getJobsQuery>) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hire/jobs`);

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