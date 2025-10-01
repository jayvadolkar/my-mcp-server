// src/tools/expense/getExpenseClaims.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const getExpenseClaimsQuery = z.object({
  expenseClaimIds: z.string().optional().describe("Comma separated expense claim IDs"),
  employeeIds: z.string().optional().describe("Comma separated employee IDs"),
  pageNumber: z.coerce.number().int().optional().describe("Page number"),
  pageSize: z.coerce.number().int().optional().describe("Results per page (max 200)")
});

export async function getExpenseClaims(
  env: Env,
  query: z.infer<typeof getExpenseClaimsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/expense/claims`);

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