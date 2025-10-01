// src/tools/hire/postJobCandidate.ts

import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const postJobCandidateParams = z.object({
  jobId: z.string().describe("Job ID"),
  data: z.record(z.string()).describe("Candidate data")
}).describe("Post job candidate parameters");

export async function postJobCandidate(
  env: Env,
  params: z.infer<typeof postJobCandidateParams>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hire/jobs/${params.jobId}/candidate`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params.data),
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}