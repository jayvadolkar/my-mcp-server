// src/tools/psa/getTaxes.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const getTaxesPath = z
  .object({
    legalEntityId: z.string().uuid().describe("UUID of the legal entity"),
  })
  .describe("Path parameters for fetching tax definitions");

/** 2️⃣ Query‐params schema */
export const getTaxesQuery = z
  .object({
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
  .describe("Pagination parameters for tax list");

/**
 * 3️⃣ Call the Keka API to fetch taxes for a legal entity
 */
export async function getTaxes(
  env: Env,
  path: z.infer<typeof getTaxesPath>,
  query: z.infer<typeof getTaxesQuery>
) {
  const token = await getAuthToken(env);
  const { legalEntityId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/psa/legalentity/${legalEntityId}/taxes`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
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
