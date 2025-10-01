// src/tools/hire/getCandidateScorecards.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";


export const getCandidateScorecardsQuery = z.object({
  jobId: z.string().describe("Job ID"),
  candidateId: z.string().describe("Candidate ID"),
  pageNumber: z.coerce.number().int().default(1).describe("Page number (default 1)"),
  pageSize: z.coerce.number().int().default(100).describe("Results per page (max 200, default 100)")
}).describe("Candidate scorecards query parameters");

export async function getCandidateScorecards(
  env: Env,
  query: z.infer<typeof getCandidateScorecardsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hire/jobs/${query.jobId}/candidate/${query.candidateId}/scorecards`);

  const { jobId, candidateId, ...queryParams } = query;
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