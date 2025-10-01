// src/tools/time/createOd.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Body‐params schema */
export const createOdBody = z
  .object({
    employeeId: z
      .string()
      .uuid()
      .describe("UUID of the employee requesting OD"),
    fromDate: z
      .string()
      .datetime()
      .describe("ISO 8601 start of OD period"),
    toDate: z
      .string()
      .datetime()
      .describe("ISO 8601 end of OD period"),
    fromSession: z.coerce
      .number()
      .int()
      .describe("Session index at start (e.g. 0 = FirstHalf1 = SecondHalf)"),
    toSession: z.coerce
      .number()
      .int()
      .describe("Session index at end(e.g. 0 = FirstHalf1 = SecondHalf)"),
    note: z.string().optional().describe("Optional note for OD request"),
  })
  .describe("Payload for creating an On-Duty (OD) entry");

/**
 * 2️⃣ Call the Keka API to create an OD entry
 */
export async function createOd(
  env: Env,
  body: z.infer<typeof createOdBody>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/time/od`;

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
    await handleApiError(res, "POST", url);
  }

  return res.json();
}
