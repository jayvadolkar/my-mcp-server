// src/tools/psa/updateProject.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const updateProjectPath = z
  .object({
    projectId: z.string().uuid().describe("UUID of the PSA project"),
  })
  .describe("Path parameters for updating a PSA project");

/** 2️⃣ Body‐params schema */
export const updateProjectBody = z
  .object({
    name:        z.string().describe("Updated project name"),
    description: z.string().optional().describe("Updated project description"),
    code:        z.string().describe("Updated project code"),
    status:      z.number().int().describe("Updated project status enum. 0 = InProgress, 1 = Completed, 2 = Cancelled"),
    startDate:   z.string().datetime().describe("Updated project start date (ISO 8601)"),
    endDate:     z.string().datetime().describe("Updated project end date (ISO 8601)"),
    isBillable:  z.boolean().describe("Whether the project is billable"),
  })
  .describe("Payload for updating a PSA project");

/**
 * 3️⃣ Call the Keka API to update a PSA project
 */
export async function updateProject(
  env: Env,
  path: z.infer<typeof updateProjectPath>,
  body: z.infer<typeof updateProjectBody>
) {
  const token = await getAuthToken(env);
  const { projectId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/projects/${projectId}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":  "application/json",
      Accept:          "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}
