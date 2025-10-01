// src/tools/corehr/getCurrencies.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Query‐params schema */
export const getCurrenciesQuery = z
  .object({
    pageNumber: z.coerce.number().int().optional().default(1).describe("Page number (default 1)"),
    pageSize: z.coerce.number().int().optional().default(100).describe("Results per page (max 200, default 100)"),
  })
  .describe("Currencies query parameters");

/**
 * 2️⃣ Call the Keka API to fetch currencies
 */
export async function getCurrencies(
  env: Env,
  query: z.infer<typeof getCurrenciesQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/currencies`);

  // Append pagination params
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, String(value));
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}
