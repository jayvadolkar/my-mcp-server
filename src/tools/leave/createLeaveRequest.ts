// src/tools/leave/createLeaveRequest.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Request‐body schema */
export const createLeaveRequestSchema = z.object({
  employeeId:   z.string().uuid().describe("Employee ID (UUID)"),
  requestedBy:  z.string().describe("Who is requesting the leave"),
  fromDate:     z.string().describe("ISO 8601 start of leave"),
  toDate:       z.string().describe("ISO 8601 end of leave"),
  fromSession:  z
    .coerce.number()
    .int()
    .optional()
    .default(0)
    .describe("SessionType: 0=FirstHalf,1=SecondHalf"),
  toSession:    z
    .coerce.number()
    .int()
    .optional()
    .default(0)
    .describe("SessionType: 0=FirstHalf,1=SecondHalf"),
  leaveTypeId:  z.string().uuid().describe("Leave Type ID (UUID)"),
  reason:       z.string().describe("Reason for leave"),
  note:         z
    .string()
    .optional()
    .nullable()
    .describe("Optional note (nullable)")
});

/**
 * 2️⃣ Call the Keka API to create a leave request
 */
export async function createLeaveRequest(
  env: Env,
  payload: z.infer<typeof createLeaveRequestSchema>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/time/leaverequests`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept":        "application/json",
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}
