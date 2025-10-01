// src/tools/expense/updateAdvanceStatus.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const updateAdvanceStatusParams = z.object({
  advanceId: z.string().describe("Advance request ID")
});

export async function updateAdvanceStatus(
  env: Env,
  advanceId: string
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/traveldesk/advancerequests/${encodeURIComponent(advanceId)}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}