// src/tools/payroll/getPayCycles.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const getPayCyclesPath = z
  .object({
    paygroupId: z
      .string()
      .describe("UUID of the paygroup"),
  })
  .describe("Path parameters for fetching pay cycles");

/** 2️⃣ Query‐params schema */
export const getPayCyclesQuery = z
  .object({
    month: z
      .coerce.number()
      .int()
      .min(1)
      .max(12)
      .describe("Month number (1–12)"),
    year: z
      .coerce.number()
      .int()
      .describe("Year (e.g. 2025)"),
    runStatus: z
      .string()
      .optional()
      .describe("Filter by pay run status (e.g. 'Completed', 'Pending')"),
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
  .describe("Parameters for fetching pay cycles");

/**
 * 3️⃣ Call the Keka API to fetch pay cycles for a paygroup
 */
export async function getPayCycles(
  env: Env,
  path: z.infer<typeof getPayCyclesPath>,
  query: z.infer<typeof getPayCyclesQuery>
) {
  const token = await getAuthToken(env);
  const { paygroupId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(
    `${baseUrl}/payroll/paygroups/${paygroupId}/paycycles`
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
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}
