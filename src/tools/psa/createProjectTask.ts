// src/tools/psa/createProjectTask.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const createProjectTaskPath = z
  .object({
    projectId: z.string().uuid().describe("UUID of the PSA project"),
  })
  .describe("Path parameters for creating a project task");

/** 2️⃣ Body‐params schema */
export const createProjectTaskBody = z
  .object({
    endDate:         z.string().datetime().describe("Task end date (ISO 8601)"),
    name:            z.string().describe("Name of the task"),
    projectId:       z.string().uuid().describe("UUID of the project (should match path)"),
    startDate:       z.string().datetime().describe("Task start date (ISO 8601)"),
    description:     z.string().optional().describe("Task description"),
    taskBillingType: z.number().int().describe("Enum: 0=Non-billable,1=Billable, 2=Any"),
    assignedTo:      z.array(z.string().uuid()).describe("List of employee UUIDs assigned"),
    estimatedHours:  z.number().describe("Estimated hours for the task"),
    phaseId:         z.string().uuid().describe("UUID of the project phase"),
  })
  .describe("Payload for creating a new task under a project");

/**
 * 3️⃣ Call the PSA API to create a new task
 */
export async function createProjectTask(
  env: Env,
  path: z.infer<typeof createProjectTaskPath>,
  body: z.infer<typeof createProjectTaskBody>
) {
  const token = await getAuthToken(env);
  const { projectId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/projects/${projectId}/tasks`;

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