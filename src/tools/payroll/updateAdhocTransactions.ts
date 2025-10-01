// src/tools/payroll/updateAdhocTransactions.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const updateAdhocTransactionsPath = z
  .object({
    paygroupId: z.string().uuid().describe("UUID of the paygroup"),
    paycycleId: z.string().uuid().describe("UUID of the paycycle"),
  })
  .describe("Path parameters for ad-hoc transactions endpoint");

/** 2️⃣ Body‐params schema */
export const updateAdhocTransactionsBody = z
  .array(
    z
      .object({
        employeeId: z
          .string()
          .uuid()
          .describe("UUID of the employee"),
        amount: z
          .union([z.string(), z.number()])
          .describe("Transaction amount (string or number)"),
        typeId: z
          .string()
          .uuid()
          .describe("UUID of the ad-hoc type"),
        comment: z.string().describe("Comment or note"),
      })
      .describe("One ad-hoc transaction record")
  )
  .describe("Array of ad-hoc transactions to apply");

/**
 * 3️⃣ Call the Keka API to apply ad-hoc transactions
 */
export async function updateAdhocTransactions(
  env: Env,
  path: z.infer<typeof updateAdhocTransactionsPath>,
  body: z.infer<typeof updateAdhocTransactionsBody>
) {
  const token = await getAuthToken(env);
  const { paygroupId, paycycleId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/payroll/paygroups/${paygroupId}/paycycles/${paycycleId}/adhoctransactions`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/*+json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}
