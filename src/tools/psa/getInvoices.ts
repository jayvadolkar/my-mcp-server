// src/tools/psa/getInvoices.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getInvoicesPath = z
  .object({
    clientId: z.string().uuid().describe("UUID of the PSA client"),
  })
  .describe("Path parameters for fetching client invoices");

/** 2️⃣ Query‐params schema */
export const getInvoicesQuery = z
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
  .describe("Pagination parameters for invoices list");

/**
 * 3️⃣ Call the Keka API to fetch invoices for a client
 */
export async function getInvoices(
  env: Env,
  path: z.infer<typeof getInvoicesPath>,
  query: z.infer<typeof getInvoicesQuery>
) {
  const token = await getAuthToken(env);
  const { clientId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/psa/clients/${clientId}/invoices`);

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
