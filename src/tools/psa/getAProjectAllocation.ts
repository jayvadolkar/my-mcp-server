// src/tools/psa/getProjectAllocations.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getProjectAllocationsPath = z
  .object({
    projectId: z.string().uuid().describe("UUID of the PSA project"),
  })
  .describe("Path parameters for fetching project allocations");

/** 2️⃣ Query‐params schema */
export const getProjectAllocationsQuery = z
  .object({
    lastModified: z
      .string()
      .datetime()
      .optional()
      .describe("Include allocations modified since this ISO 8601 datetime"),
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
  .describe("Query parameters for fetching project allocations");

/**
 * 3️⃣ Call the Keka API to fetch allocations for a project
 */
export async function getProjectAllocations(
  env: Env,
  path: z.infer<typeof getProjectAllocationsPath>,
  query: z.infer<typeof getProjectAllocationsQuery>
) {
  const token = await getAuthToken(env);
  const { projectId } = path;
  const url = new URL(
    `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/projects/${projectId}/allocations`
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
