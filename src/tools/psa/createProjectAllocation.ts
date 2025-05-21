// src/tools/psa/createProjectAllocations.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const createProjectAllocationsPath = z
  .object({
    projectId: z.string().uuid().describe("UUID of the PSA project"),
  })
  .describe("Path parameters for creating a project allocation");

/** 2️⃣ Body‐params schema */
export const createProjectAllocationsBody = z
  .object({
    employeeId:          z.string().uuid().describe("UUID of the employee to allocate"),
    allocationPercentage: z.number().int().describe("Allocation percentage (0–100)"),
    billingRoleId:       z.string().uuid().describe("UUID of the billing role"),
    billingRate:         z.number().describe("Billing rate for this allocation"),
    startDate:           z.string().datetime().describe("Allocation start date (ISO 8601)"),
    endDate:             z.string().datetime().describe("Allocation end date (ISO 8601)"),
  })
  .describe("Payload for creating a project allocation");

/**
 * 3️⃣ Call the PSA API to create a new allocation under a project
 */
export async function createProjectAllocations(
  env: Env,
  path: z.infer<typeof createProjectAllocationsPath>,
  body: z.infer<typeof createProjectAllocationsBody>
) {
  const token = await getAuthToken(env);
  const { projectId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/projects/${projectId}/allocations`;

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
    throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
