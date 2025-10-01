// src/tools/payroll/getPayRegister.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const getPayRegisterPath = z
  .object({
    paygroupId: z
      .string()
      .describe("UUID of the paygroup"),
    paycycleId: z
      .string()
      .describe("UUID of the paycycle"),
  })
  .describe("Path parameters for fetching pay register");

/** 2️⃣ Query‐params schema */
export const getPayRegisterQuery = z
  .object({
    includeOutSideCTCPayables: z
      .coerce
      .boolean()
      .optional()
      .default(false)
      .describe("Whether to include outside-CTC payables"),
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
  .describe("Parameters for fetching pay register");

/**
 * 3️⃣ Call the Keka API to fetch the pay register
 */
export async function getPayRegister(
  env: Env,
  path: z.infer<typeof getPayRegisterPath>,
  query: z.infer<typeof getPayRegisterQuery>
) {
  const token = await getAuthToken(env);
  const { paygroupId, paycycleId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(
    `${baseUrl}/payroll/paygroups/${paygroupId}/paycycles/${paycycleId}/payregister`
  );

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
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
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}
