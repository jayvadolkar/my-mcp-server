// src/tools/pms/getPraise.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const getPraiseQuery = z.object({
  praiseIds: z.string().optional().describe("Comma separated list of praise IDs to filter"),
  from: z.string().optional().describe("Start date in ISO 8601 format (defaults to 'to' - 30 days)"),
  to: z.string().optional().describe("End date in ISO 8601 format (defaults to today). MAx can be  60 days from the from date"),
  pageNumber: z.coerce.number().int().optional().describe("Page number"),
  pageSize: z.coerce.number().int().optional().describe("Results per page (max 200)")
});

export async function getPraise(
  env: Env,
  query: z.infer<typeof getPraiseQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/pms/praise`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}