// src/tools/corehr/requestExit.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐param schema */
export const deactivateEmployeeParams = z.object({
  id: z.string().describe("Employee identifier (UUID)")
});

/** 2️⃣ Request‐body schema */
export const deactivateEmployeeSchema = z.object({
  exitType:        z.coerce.number().int().describe("ExitType: 0=None,1=EmployeeResignation,2=CompanyAction"),
  exitReason:      z.string().nullable().describe("Reason for exit (nullable). if want. pass UUID of exit reason fro getexitreasons API"), 
  resignationDate: z.string().describe("ISO 8601 resignation datetime"),
  lastWorkingDate: z.string().nullable().describe("ISO 8601 last working datetime (nullable). if only date is provided, consider time as 00:00:00"),
  isOkToRehire:    z.boolean().describe("Flag if employee is OK to rehire. true=yes, false=no"),
  comments:        z.string().nullable().describe("Additional comments (nullable)")
});

/**
 * 3️⃣ Call the Keka API to create/update an exit request
 */
export async function deactivateEmployee(
  env: Env,
  id: string,
  payload: z.infer<typeof deactivateEmployeeSchema>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hris/employees/${encodeURIComponent(
    id
  )}/exitrequest`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept":        "application/json",
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}
