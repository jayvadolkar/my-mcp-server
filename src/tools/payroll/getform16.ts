// src/tools/payroll/getForm16.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getForm16Path = z
  .object({
    employeeId: z.string().uuid().describe("UUID of the employee"),
  })
  .describe("Path parameters for fetching Form16");

/** 2️⃣ Query‐params schema */
export const getForm16Query = z
  .object({
    legalEntityId: z
      .string()
      .uuid()
      .describe("UUID of the legal entity"),
    financialYear: z
      .coerce.number()
      .int()
      .describe("Financial year (e.g. 2024)"),
  })
  .describe("Parameters for fetching Form16");

/**
 * 3️⃣ Call the Keka API to fetch the Form 16 PDF or data
 */
export async function getForm16(
  env: Env,
  path: z.infer<typeof getForm16Path>,
  query: z.infer<typeof getForm16Query>
) {
  const token = await getAuthToken(env);
  const { employeeId } = path;
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(
    `${baseUrl}/payroll/employees/${employeeId}/form16`
  );
  url.searchParams.append("legalEntityId", query.legalEntityId);
  url.searchParams.append("financialYear", String(query.financialYear));

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
