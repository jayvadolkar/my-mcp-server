// src/tools/corehr/getGroups.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query‐params schema */
export const getGroupsQuery = z
  .object({
    groupTypeIds:     z.string().optional().describe("Comma-separated list of Group Type IDs (UUIDs). Group Type IDs can be obtained from the getgrouptypes API."),
    lastModified:     z.string().optional().describe("ISO 8601 timestamp to filter by last modified"),
    pageNumber:       z.number().int().optional().default(1).describe("Page number (default 1)"),
    pageSize:         z.number().int().optional().default(100).describe("Results per page (max 200, default 100)"),
  })
  .describe("Groups query parameters. and in response SystemGroupTypes are 0 = None, 1 = BusinessUnit, 2 = Department, 3 = OrgLocation, 4 = CostCenter, 5 = Paygroup, 6 = ProjectTeam, 7 = Team, 8 = ClientTeam, 9 = LegalEntity");

/**
 * 2️⃣ Call the Keka API to fetch groups
 */
export async function getGroups(
  env: Env,
  query: z.infer<typeof getGroupsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/groups`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
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
