// src/tools/pms/getReviews.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const getReviewsQuery = z.object({
  employeeIds: z.string().optional().describe("Comma separated list of employee IDs to filter"),
  reviewGroupIds: z.string().optional().describe("Comma separated list of review group IDs to filter"),
  reviewCycleIds: z.string().optional().describe("Comma separated list of review cycle IDs to filter"),
  pageNumber: z.coerce.number().int().optional().describe("Page number"),
  pageSize: z.coerce.number().int().optional().describe("Results per page (max 200)")
});

export async function getReviews(
  env: Env,
  query: z.infer<typeof getReviewsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/pms/reviews`);

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