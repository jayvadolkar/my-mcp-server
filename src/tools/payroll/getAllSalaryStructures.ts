// src/tools/payroll/getSalaryStructures.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query‐params schema */
export const getSalaryStructuresQuery = z
  .object({
    payGroupIds: z
      .string()
      .optional()
      .describe("Comma-separated list of pay-group UUIDs (e.g. 'id1,id2')"),
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
      .describe("Results per page (max 500, default 100)"),
  })
  .describe("Parameters for fetching salary structures");

/**
 * 2️⃣ Call the Keka API to fetch salary structures
 */
export async function getSalaryStructures(
  env: Env,
  query: z.infer<typeof getSalaryStructuresQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/payroll/salarystructures`);
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
    throw new Error(
      `GET ${url.toString()} failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}
