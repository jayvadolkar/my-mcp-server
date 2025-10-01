// src/tools/pms/addPraise.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const addPraiseBody = z.object({
  employeeIds: z.array(z.string()).describe("Array of employee UUIDs to praise"),
  feedback: z.string().describe("Feedback message"),
  badgeId: z.string().describe("UUID of badge to award"),
  givenBy: z.string().describe("UUID of employee giving praise")
});

export async function addPraise(
  env: Env,
  body: z.infer<typeof addPraiseBody>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/pms/praise`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}