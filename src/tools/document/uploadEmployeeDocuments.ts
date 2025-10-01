// src/tools/document/uploadEmployeeDocuments.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path-params schema */
export const uploadEmployeeDocumentsParams = z.object({
  employeeId:     z.string().uuid().describe("Employee UUID"),
  documentId:     z.string().uuid().describe("Document UUID - specific document instance ID")
});

/** 2️⃣ Request body schema for document upload */
export const uploadEmployeeDocumentsBody = z.object({
  file: z.any().describe("File content to upload (binary data)"),
  documentAttributes: z.record(z.string(), z.string()).describe("Map of attribute IDs to their values (e.g., {'b4d1ea24-d6fd-ed11-907a-0022486e73b1': 'my father name 123'})")
});

/**
 * 3️⃣ Call the Keka API to upload document with attributes for an employee
 */
export async function uploadEmployeeDocuments(
  env: Env,
  employeeId: string,
  documentId: string,
  file: File | Blob,
  documentAttributes: Record<string, string>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hris/employees/` +
              `${encodeURIComponent(employeeId)}/documents/` +
              `${encodeURIComponent(documentId)}`;

  // Create FormData for multipart upload
  const formData = new FormData();
  
  // Add the file
  formData.append('file', file);
  
  // Add all document attributes
  Object.entries(documentAttributes).forEach(([attributeId, value]) => {
    formData.append(attributeId, value);
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      // Don't set Content-Type - let fetch set it with boundary for multipart/form-data
      "content-type": "multipart/form-data" 
    },
    body: formData
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}