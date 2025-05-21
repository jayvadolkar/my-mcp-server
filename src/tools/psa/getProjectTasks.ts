// src/tools/psa/getProjectTasks.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getProjectTasksPath = z
  .object({
    projectId: z.string().uuid().describe("UUID of the PSA project"),
  })
  .describe("Path parameters for fetching project tasks");

/** 2️⃣ Query‐params schema */
export const getProjectTasksQuery = z
  .object({
    lastModified: z
      .string()
      .datetime()
      .optional()
      .describe("Only include tasks modified since this ISO 8601 datetime"),
    pageNumber: z
      .coerce.number()
      .int()
      .optional()
      .default(1)
      .describe("Page number (default 1)"),
    pageSize: z
      .coerce.number()
      .int()
      .optional()
      .default(100)
      .describe("Results per page (default 100)"),
  })
  .describe("Query parameters for fetching project tasks");

/**
 * 3️⃣ Call the Keka API to fetch tasks for a project
 */
export async function getProjectTasks(
  env: Env,
  path: z.infer<typeof getProjectTasksPath>,
  query: z.infer<typeof getProjectTasksQuery>
) {
  const token = await getAuthToken(env);
  const { projectId } = path;
  const url = new URL(
    `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/projects/${projectId}/tasks`
  );

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `GET ${url.toString()} failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}