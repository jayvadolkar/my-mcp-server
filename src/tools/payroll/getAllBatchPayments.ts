// src/tools/payroll/getPayments.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getPaymentsPath = z
  .object({
    paygroupId: z.string().describe("UUID of the paygroup"),
    paycycleId: z.string().describe("UUID of the paycycle"),
    paybatchId: z.string().describe("UUID of the paybatch"),
  })
  .describe("Path parameters for fetching payments");

/** 2️⃣ Query‐params schema */
export const getPaymentsQuery = z
  .object({
    status: z
      .string()
      .optional()
      .describe("Filter by payment status. 0 = UnPaid, 1 = Paid"),
    pageNumber: z
      .coerce.number()
      .int()
      .optional()
      .default(1)
      .describe("Page number (default 1)"),
    pageSize: z
      .coerce.number()
      .int()
      .optional()
      .default(100)
      .describe("Results per page (default 100)"),
  })
  .describe("Parameters for fetching payment records");

/**
 * 3️⃣ Call the Keka API to fetch payments for a paybatch
 */
export async function getPayments(
  env: Env,
  path: z.infer<typeof getPaymentsPath>,
  query: z.infer<typeof getPaymentsQuery>
) {
  const token = await getAuthToken(env);
  const { paygroupId, paycycleId, paybatchId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(
    `${baseUrl}/payroll/paygroups/${paygroupId}/paycycles/${paycycleId}/paybatches/${paybatchId}/payments`
  );
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`GET ${url.toString()} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
