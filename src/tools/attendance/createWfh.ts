// src/tools/time/createWfh.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Body‐params schema */
export const createWfhBody = z
  .object({
    employeeId: z
      .string()
      .uuid()
      .describe("UUID of the employee requesting WFH"),
    fromDate: z
      .string()
      .datetime()
      .describe("ISO 8601 start of WFH period"),
    toDate: z
      .string()
      .datetime()
      .describe("ISO 8601 end of WFH period"),
    fromSession: z
      .number()
      .int()
      .describe("Session index at start (0 = FirstHalf, 1 = SecondHalf)"),
    toSession: z
      .number()
      .int()
      .describe("Session index at end(0 = FirstHalf, 1 = SecondHalf)"),
    note: z.string().optional().describe("Optional note for WFH request"),
  })
  .describe("Payload for creating a Work-From-Home (WFH) entry");

/**
 * 2️⃣ Call the Keka API to create a WFH entry
 */
export async function createWfh(
  env: Env,
  body: z.infer<typeof createWfhBody>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/time/wfh`;

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
