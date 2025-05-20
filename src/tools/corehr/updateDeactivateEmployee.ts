// src/tools/corehr/requestExit.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path-params schema */
export const updateDeactivateEmployeetParams = z.object({
  id: z.string().describe("Employee identifier (UUID)")
});

/** 2️⃣ Request-body schema */
export const updateDeactivateEmployeeSchema = z.object({
  exitType:       z.coerce.number().int().describe("ExitType: 0=None,1=EmployeeResignation,2=CompanyAction"),
  exitReason:     z.string().nullable().optional().describe("Reason for exit (nullable). if want. pass UUID of exit reason fro getexitreasons API"),
  resignationDate:z.string().nullable().optional().describe("ISO 8601 resignation date (nullable). if only date is provided, consider time as 00:00:00"),
  lastWorkingDate:z.string().nullable().optional().describe("ISO 8601 last working date (nullable). if only date is provided, consider time as 00:00:00"),
  isOkToRehire:   z.boolean().nullable().optional().describe("Flag if ok to rehire (nullable). true=yes, false=no"),
  comments:       z.string().nullable().optional().describe("Additional comments (nullable)")
});

/**
 * 3️⃣ Call the Keka API to request an exit
 */
export async function updateDeactivateEmployee(
  env: Env,
  id: string,
  payload: z.infer<typeof updateDeactivateEmployeeSchema>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hris/employees/${encodeURIComponent(
    id
  )}/exitrequest`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Accept":        "application/json",
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`PUT ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
