import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const updateCandidateParams = z.object({
  jobId: z.string().describe("Job ID"),
  candidateId: z.string().describe("Candidate ID"),
  data: z.record(z.any()).describe("Candidate update data")
}).describe("Update candidate parameters");

export async function updateCandidate(
  env: Env,
  params: z.infer<typeof updateCandidateParams>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hire/jobs/${params.jobId}/candidate/${params.candidateId}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params.data),
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}
