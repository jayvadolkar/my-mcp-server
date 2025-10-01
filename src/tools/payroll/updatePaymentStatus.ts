// src/tools/payroll/updatePaymentStatustatus.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const updatePaymentStatusPath = z
  .object({
    paygroupId: z.string().describe("UUID of the paygroup"),
    paycycleId: z.string().describe("UUID of the paycycle"),
    paybatchId: z.string().describe("UUID of the paybatch"),
  })
  .describe("Path parameters for bulk payment update");

/** 2️⃣ Body‐params schema */
export const updatePaymentStatusBody = z
  .array(
    z
      .object({
        paymentIdentifier: z
          .string()
          .uuid()
          .describe("UUID of the payment to update"),
        status: z
          .number()
          .int()
          .describe("New payment status enum (e.g. 0=Pending,1=Completed)"),
        transactionOn: z
          .string()
          .datetime()
          .describe("ISO 8601 timestamp of the transaction"),
        note: z.string().optional().describe("Optional note/comment"),
      })
      .describe("One payment update payload")
  )
  .describe("Array of payment updates");

/**
 * 3️⃣ Call the Keka API to bulk‐update payments
 */
export async function updatePaymentStatus(
  env: Env,
  path: z.infer<typeof updatePaymentStatusPath>,
  body: z.infer<typeof updatePaymentStatusBody>
) {
  const token = await getAuthToken(env);
  const { paygroupId, paycycleId, paybatchId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/payroll/paygroups/${paygroupId}/paycycles/${paycycleId}/paybatches/${paybatchId}/payments`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}
