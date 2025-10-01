// src/tools/expense/getExpenseAttachmentDownloadUrl.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const getExpenseAttachmentDownloadUrlParams = z.object({
  expenseId: z.string().uuid().describe("Expense UUID"),
  attachmentId: z.string().uuid().describe("Attachment UUID")
});

export async function getExpenseAttachmentDownloadUrl(
  env: Env,
  expenseId: string,
  attachmentId: string
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/expense/${encodeURIComponent(expenseId)}/attachment/${encodeURIComponent(attachmentId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url);
  }
  return res.json();
}