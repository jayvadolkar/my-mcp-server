import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const getJobApplicationFieldsParams = z.object({
  jobId: z.string().describe("Job ID")
}).describe("Job application fields parameters");

export async function getJobApplicationFields(
  env: Env,
  params: z.infer<typeof getJobApplicationFieldsParams>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hire/jobs/${params.jobId}/applicationfields`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url);
  }
  return res.json();
}