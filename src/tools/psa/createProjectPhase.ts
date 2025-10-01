// src/tools/psa/createProjectPhase.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const createProjectPhasePath = z
  .object({
    projectId: z.string().uuid().describe("UUID of the PSA project"),
  })
  .describe("Path parameters for creating a project phase");

/** 2️⃣ Query‐params schema */
export const createProjectPhaseQuery = z
  .object({
    phaseName: z
      .string()
      .describe("Name of the phase to create"),
  })
  .describe("Query parameter for new phase name");

/**
 * 3️⃣ Call the Keka API to create a new project phase
 */
export async function createProjectPhase(
  env: Env,
  path: z.infer<typeof createProjectPhasePath>,
  query: z.infer<typeof createProjectPhaseQuery>
) {
  const token = await getAuthToken(env);
  const { projectId } = path;
  const url = new URL(
    `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/projects/${projectId}/phases`
  );
  url.searchParams.append("phaseName", query.phaseName);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url.toString());
  }
  return res.json();
}
