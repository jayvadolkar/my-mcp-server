// src/tools/corehr/getExitReasons.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Query‐params schema */
export const getExitReasonsQuery = z
  .object({
    pageNumber: z
      .number()
      .int()
      .optional()
      .default(1)
      .describe("Page number (default 1)"),
    pageSize: z
      .number()
      .int()
      .optional()
      .default(100)
      .describe("Results per page (max 200, default 100)"),
  })
  .describe("Exit reasons pagination parameters");

/**
 * 2️⃣ Call the Keka API to fetch exit reasons
 */
export async function getExitReasons(
  env: Env,
  query: z.infer<typeof getExitReasonsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/exitreasons`);

  // Append pagination params
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
