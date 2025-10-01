// src/tools/hire/addCandidateNote.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const addCandidateNoteParams = z.object({
  jobId: z.string().describe("Job ID"),
  candidateId: z.string().describe("Candidate ID"),
  data: z.object({
    comments: z.string().optional().nullable().describe("Comments"),
    tags: z.array(z.string()).optional().nullable().describe("Candidate tags")
  }).describe("Candidate note data")
}).describe("Add candidate note parameters");

export async function addCandidateNote(
  env: Env,
  params: z.infer<typeof addCandidateNoteParams>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hire/jobs/${params.jobId}/candidate/${params.candidateId}/notes`;

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
