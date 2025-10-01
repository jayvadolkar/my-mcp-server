import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const getCandidateResumeParams = z.object({
  candidateId: z.string().describe("Candidate ID"),
  pageNumber: z.coerce.number().int().default(1).describe("Page number (default 1)"),
  pageSize: z.coerce.number().int().default(100).describe("Results per page (max 200, default 100)")
}).describe("Get candidate resume parameters");

export async function getCandidateResume(
  env: Env,
  params: z.infer<typeof getCandidateResumeParams>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hire/jobs/candidate/${params.candidateId}/resume`);

  const { candidateId, ...queryParams } = params;
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