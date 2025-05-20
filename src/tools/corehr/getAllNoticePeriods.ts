// src/tools/corehr/getNoticePeriods.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query-params schema */
export const getNoticePeriodsQuery = z
  .object({
    noticePeriodIds: z.string().optional().describe("Comma-separated list of Notice Period IDs (UUIDs)"),
    pageNumber: z.coerce.number().int().optional().describe("Page number (default 1)"),
    pageSize: z.coerce.number().int().optional().default(100).describe("Results per page (max 200, default 100)"),
  })
  .describe("Notice periods query parameters");

/**
 * 2️⃣ Call the Keka API to fetch notice periods
 */
export async function getNoticePeriods(
  env: Env,
  query: z.infer<typeof getNoticePeriodsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/noticeperiods`);

  // Append query params
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
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
