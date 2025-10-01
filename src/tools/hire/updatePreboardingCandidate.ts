export const updatePreboardingCandidateParams = z.object({
  id: z.string().describe("Preboarding candidate ID"),
  data: z.object({
    firstName: z.string().optional().nullable().describe("First name"),
    middleName: z.string().optional().nullable().describe("Middle name"),
    lastName: z.string().optional().nullable().describe("Last name"),
    jobtitle: z.string().optional().nullable().describe("Job title"),
    gender: z.coerce.number().optional().describe("Gender: 0=NotSpecified, 1=Male, 2=Female, 3=Nonbinary, 4=PreferNotToRespond"),
    department: z.string().optional().nullable().describe("Department"),
    workLocation: z.string().optional().nullable().describe("Work location"),
    expectedDateOfJoining: z.string().optional().nullable().describe("Expected date of joining (ISO 8601)"),
    stage: z.coerce.number().optional().describe("Preboarding stage: 0=Start, 1=CollectInfo, 2=VerifyInfo, 3=ManageOffer, 4=OfferAcceptance, 5=Hired")
  }).describe("Update preboarding candidate data")
}).describe("Update preboarding candidate parameters");

export async function updatePreboardingCandidate(
  env: Env,
  params: z.infer<typeof updatePreboardingCandidateParams>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hire/preboarding/candidates/${params.id}`;

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

import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";