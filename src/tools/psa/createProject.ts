// src/tools/psa/createProject.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Body‐params schema */
export const createProjectBody = z
  .object({
    clientId:    z.string().uuid().describe("UUID of the PSA client"),
    code:        z.string().describe("Unique project code"),
    endDate:     z.string().datetime().describe("Project end date (ISO 8601)"),
    name:        z.string().describe("Project name"),
    startDate:   z.string().datetime().describe("Project start date (ISO 8601)"),
    description: z.string().optional().describe("Project description"),
    status:      z.number().int().describe("Project status enum 0 = InProgress, 1 = Completed, 2 = Cancelled"),
    isBillable:  z.boolean().describe("Whether the project is billable. True=Billable, False=Not billable"),
  })
  .describe("Payload for creating a new PSA project");

/**
 * 2️⃣ Call the Keka API to create a PSA project
 */
export async function createProject(
  env: Env,
  body: z.infer<typeof createProjectBody>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/projects`;

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
