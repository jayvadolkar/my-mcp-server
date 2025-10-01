// src/tools/expense/updateExpenseClaimPaymentStatus.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const updateExpenseClaimPaymentStatusParams = z.object({
  id: z.string().uuid().describe("Expense claim UUID")
});

export const updateExpenseClaimPaymentStatusBody = z.object({
  paymentStatus: z.number().int().describe("Payment status code: 0=None, 1=Pending, 2=Paid"),
  paymentDate: z.string().nullable().optional().describe("ISO 8601 date when payment was made"),
  comment: z.string().nullable().optional().describe("Optional comment about the status update")
});

export async function updateExpenseClaimPaymentStatus(
  env: Env,
  id: string,
  body: z.infer<typeof updateExpenseClaimPaymentStatusBody>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/expense/claims/${encodeURIComponent(id)}`;

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