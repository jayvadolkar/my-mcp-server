// src/tools/payroll/getPayBatches.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getPayBatchesPath = z
  .object({
    paygroupId: z.string().describe("UUID of the paygroup"),
    paycycleId: z.string().describe("UUID of the paycycle"),
  })
  .describe("Path parameters for fetching pay batches");

/** 2️⃣ Query‐params schema */
export const getPayBatchesQuery = z
  .object({
    status: z
      .string()
      .optional()
      .describe("Filter by batch status. 0 = UnPaid, 1 = Paid"),
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
  .describe("Parameters for fetching pay batches");

/**
 * 3️⃣ Call the Keka API to fetch pay batches
 */
export async function getPayBatches(
  env: Env,
  path: z.infer<typeof getPayBatchesPath>,
  query: z.infer<typeof getPayBatchesQuery>
) {
  const token = await getAuthToken(env);
  const { paygroupId, paycycleId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(
    `${baseUrl}/payroll/paygroups/${paygroupId}/paycycles/${paycycleId}/paybatches`
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
    throw new Error(
      `GET ${url.toString()} failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}
