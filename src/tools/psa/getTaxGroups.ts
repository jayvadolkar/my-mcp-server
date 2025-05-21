// src/tools/psa/getTaxGroups.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getTaxGroupsPath = z
  .object({
    legalEntityId: z.string().uuid().describe("UUID of the legal entity"),
  })
  .describe("Path parameters for fetching tax groups");

/** 2️⃣ Query‐params schema */
export const getTaxGroupsQuery = z
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
  .describe("Pagination parameters for tax groups list");

/**
 * 3️⃣ Call the Keka API to fetch tax groups for a legal entity
 */
export async function getTaxGroups(
  env: Env,
  path: z.infer<typeof getTaxGroupsPath>,
  query: z.infer<typeof getTaxGroupsQuery>
) {
  const token = await getAuthToken(env);
  const { legalEntityId } = path;
  const url = new URL(
    `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/legalentity/${legalEntityId}/taxgroups`
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
      Accept:        "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `GET ${url.toString()} failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}
