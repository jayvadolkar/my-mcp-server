// src/tools/psa/updateProjectTask.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const updateProjectTaskPath = z
  .object({
    projectId: z.string().uuid().describe("UUID of the PSA project"),
    taskId:    z.string().uuid().describe("UUID of the task to update"),
  })
  .describe("Path parameters for updating a project task");

/** 2️⃣ Body‐params schema */
export const updateProjectTaskBody = z
  .object({
    name:            z.string().describe("Updated task name"),
    description:     z.string().optional().describe("Updated task description"),
    taskBillingType: z.number().int().describe("Enum: 0=Non-billable,1=Billable"),
    assignedTo:      z.array(z.string().uuid()).describe("Updated list of employee UUIDs assigned"),
    startDate:       z.string().datetime().describe("Updated start date (ISO 8601)"),
    endDate:         z.string().datetime().describe("Updated end date (ISO 8601)"),
    estimatedHours:  z.number().describe("Updated estimated hours"),
    phaseId:         z.string().uuid().describe("UUID of the project phase"),
  })
  .describe("Payload for updating a project task");

/**
 * 3️⃣ Call the PSA API to update an existing task
 */
export async function updateProjectTask(
  env: Env,
  path: z.infer<typeof updateProjectTaskPath>,
  body: z.infer<typeof updateProjectTaskBody>
) {
  const token = await getAuthToken(env);
  const { projectId, taskId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/projects/${projectId}/tasks/${taskId}`;

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
    throw new Error(`PUT ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}