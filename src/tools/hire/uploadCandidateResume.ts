import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const uploadCandidateResumeParams = z.object({
  candidateId: z.string().describe("Candidate ID")
}).describe("Upload candidate resume parameters");

export async function uploadCandidateResume(
  env: Env,
  params: z.infer<typeof uploadCandidateResumeParams>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hire/jobs/candidate/${params.candidateId}/resume`;

  // Note: This is a file upload endpoint, actual implementation would need FormData
  // This is a placeholder implementation
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    // body would contain multipart/form-data with file
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}