// src/tools/psa/addEmployeeTimeEntries.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const addEmployeeTimeEntriesPath = z
  .object({
    employeeId: z.string().uuid().describe("UUID of the employee"),
  })
  .describe("Path parameters for adding time entries");

/** 2️⃣ Body‐params schema */
export const addEmployeeTimeEntriesBody = z
  .array(
    z
      .object({
        projectId:       z.string().uuid().describe("UUID of the project"),
        taskId:          z.string().uuid().describe("UUID of the task"),
        numberOfMinutes: z.number().int().describe("Time spent in minutes"),
        date:            z.string().datetime().describe("Date of the entry (ISO 8601)"),
        comment:         z.string().optional().describe("Optional comment"),
        startTime:       z.number().int().describe("Start time as epoch millis"),
        endTime:         z.number().int().describe("End time as epoch millis"),
      })
      .describe("One timesheet entry")
  )
  .describe("Array of project‐task timesheet entries");

/**
 * 3️⃣ Call the PSA API to add time entries for an employee
 */
export async function addEmployeeTimeEntries(
  env: Env,
  path: z.infer<typeof addEmployeeTimeEntriesPath>,
  body: z.infer<typeof addEmployeeTimeEntriesBody>
) {
  const token = await getAuthToken(env);
  const { employeeId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/employees/${employeeId}/timeentries`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":  "application/json",
      Accept:          "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}