// src/tools/psa/getProjectById.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const getProjectByIdPath = z
  .object({
    id: z.string().uuid().describe("UUID of the PSA project"),
  })
  .describe("Path parameters for fetching a single PSA project by ID");

/**
 * 2️⃣ Call the PSA API to fetch one project
 */
export async function getProjectById(
  env: Env,
  path: z.infer<typeof getProjectByIdPath>
) {
  const token = await getAuthToken(env);
  const { id } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/projects/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
