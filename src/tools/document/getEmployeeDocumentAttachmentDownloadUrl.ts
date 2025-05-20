// src/tools/corehr/getAttachment.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getEmployeeDocumentAttachmentDownloadUrlParams = z.object({
  employeeId:   z.string().uuid().describe("Employee ID UUID. can be fetched from multiple APIs like getallemployees, getanemployee and will part of many others"),
  documentId:   z.string().uuid().describe("Document UUID. Part of Get Employee Documents API"),
  attachmentId: z.string().uuid().describe("Attachment UUID. part of Get Employee Documents API"),
});

/**
 * 2️⃣ Call the Keka API to fetch a document attachment
 */
export async function getEmployeeDocumentAttachmentDownloadUrl(
  env: Env,
  employeeId: string,
  documentId: string,
  attachmentId: string
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hris/employees/` +
    `${encodeURIComponent(employeeId)}/documents/${encodeURIComponent(documentId)}` +
    `/attachment/${encodeURIComponent(attachmentId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept":        "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
