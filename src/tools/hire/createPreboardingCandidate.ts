import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const createPreboardingCandidateSchema = z.object({
  firstName: z.string().optional().nullable().describe("First name"),
  middleName: z.string().optional().nullable().describe("Middle name"),
  lastName: z.string().optional().nullable().describe("Last name"),
  email: z.string().optional().nullable().describe("Email"),
  countryCode: z.string().optional().nullable().describe("Country code"),
  mobileNumber: z.string().optional().nullable().describe("Mobile number"),
  jobtitle: z.string().optional().nullable().describe("Job title"),
  gender: z.coerce.number().describe("Gender: 0=NotSpecified, 1=Male, 2=Female, 3=Nonbinary, 4=PreferNotToRespond"),
  department: z.string().optional().nullable().describe("Department"),
  workLocation: z.string().optional().nullable().describe("Work location"),
  expectedDateOfJoining: z.string().optional().nullable().describe("Expected date of joining (ISO 8601)"),
  stage: z.coerce.number().describe("Preboarding stage: 0=Start, 1=CollectInfo, 2=VerifyInfo, 3=ManageOffer, 4=OfferAcceptance, 5=Hired"),
  status: z.coerce.number().describe("Preboarding status: 0=Initiated, 1=Completed, 2=Cancelled, 3=Archived, 4=CandidatureRevoked, 5=MarkedAsNoShow")
}).describe("Create preboarding candidate data");

export async function createPreboardingCandidate(
  env: Env,
  data: z.infer<typeof createPreboardingCandidateSchema>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hire/preboarding/candidates`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}