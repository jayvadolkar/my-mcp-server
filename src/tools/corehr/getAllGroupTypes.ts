// src/tools/corehr/getGroupTypes.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Query‐params schema */
export const getGroupTypesQuery = z
  .object({
    pageNumber: z.coerce.number().int().optional().default(1).describe("Page number (default 1)"),
    pageSize: z.coerce.number().int().optional().default(200).describe("Number of results per page (max 200, default 100)"),
  })
  .describe("Pagination parameters for group types");

/**
 * 2️⃣ Call the Keka API to fetch group types
 */
export async function getGroupTypes(
  env: Env,
  query: z.infer<typeof getGroupTypesQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/grouptypes`);

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
