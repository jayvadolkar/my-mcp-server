// src/tools/attendance/createTimeEntry.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const createTimeEntryPath = z
  .object({
    id: z.string().uuid().describe("UUID of the employee for time entry"),
  })
  .describe("Path parameters for creating a time entry");

/** 2️⃣ Body‐params schema */
export const createTimeEntryBody = z
  .object({
    timestamp: z
      .string()
      .datetime()
      .describe("ISO 8601 timestamp of the punch event. if date is only given, consider current time "),
    employeeIdentifier: z
      .string()
      .uuid()
      .describe("UUID of the employee"),
    punchStatus: z
      .number()
      .int()
      .describe("0 = Clock-in, 1 = Clock-out, etc."),
    attendanceLogSource: z
      .number()
      .int()
      .describe("Source of the log (e.g. 1 = Mobile App)"),
    manualClockinType: z
      .number()
      .int()
      .describe("0 = None, 1 = Manual In, 2 = Manual Out"),
    premiseName: z
      .string()
      .describe("Name of the premise or location"),
    locationAddress: z
      .object({
        addressLine1: z.string(),
        addressLine2: z.string().nullable(),
        countryCode: z.string().length(2),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      })
      .describe("Address where the punch was recorded"),
  })
  .describe("Payload for creating a time entry");

/**
 * 3️⃣ Call the Keka API to create a time entry
 */
export async function createTimeEntry(
  env: Env,
  path: z.infer<typeof createTimeEntryPath>,
  body: z.infer<typeof createTimeEntryBody>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/attendance/employee/${path.id}/timeentry`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
