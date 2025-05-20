// src/tools/corehr/uploadEmployeeDocuments.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path-params schema */
export const uploadEmployeeDocumentsParams = z.object({
  employeeId:     z.string().uuid().describe("Employee UUID"),
  documentTypeId: z.string().uuid().describe("Document Type UUID")
});

/**
 * 2️⃣ Call the Keka API to trigger document upload for an employee
 * (POST with no body)
 */
export async function uploadEmployeeDocuments(
  env: Env,
  employeeId: string,
  documentTypeId: string
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hris/employees/` +
              `${encodeURIComponent(employeeId)}/documenttypes/` +
              `${encodeURIComponent(documentTypeId)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept":        "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
