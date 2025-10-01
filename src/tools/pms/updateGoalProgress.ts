// src/tools/pms/updateGoalProgress.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const updateGoalProgressParams = z.object({
  goalId: z.string().describe("Goal identifier UUID")
});

export const updateGoalProgressBody = z.object({
  currentValue: z.number().describe("Updated current value"),
  status: z.number().int().describe("Goal status: 0=NotStarted, 1=OnTrack, 2=NeedAttention, 3=AtRisk, 4=Closed"),
  updatedBy: z.string().describe("UUID of user making the update"),
  note: z.string().nullable().optional().describe("Optional progress note")
});

export async function updateGoalProgress(
  env: Env,
  goalId: string,
  body: z.infer<typeof updateGoalProgressBody>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/pms/goals/${encodeURIComponent(goalId)}/progress`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}