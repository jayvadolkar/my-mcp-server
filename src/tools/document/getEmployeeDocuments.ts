// src/tools/corehr/getEmployeeDocuments.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const getEmployeeDocumentsParams = z.object({
  employeeId:      z.string().uuid().describe("Employee UUID. Can be fetched from getemployee API and part of many apis response body"),
  documentTypeId:  z.string().uuid().describe("Document Type UUID")
});

/** 2️⃣ Query‐params schema with coercion */
export const getEmployeeDocumentsQuery = z
  .object({
    pageNumber: z.coerce.number().int().default(1).describe("Page number (default 1)"),
    pageSize:   z.coerce.number().int().default(100).describe("Results per page (max 200, default 100)")
  })
  .describe("Pagination parameters");

/**
 * 3️⃣ Call the Keka API to fetch documents by type for an employee
 */
export async function getEmployeeDocuments(
  env: Env,
  employeeId: string,
  documentTypeId: string,
  query: z.infer<typeof getEmployeeDocumentsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(
    `${baseUrl}/hris/employees/${encodeURIComponent(employeeId)}/documenttypes/${encodeURIComponent(documentTypeId)}/documents`
  );

  // Append pagination params
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, String(value));
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept":        "application/json"
    },
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}
