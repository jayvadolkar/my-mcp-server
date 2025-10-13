// src/tools/skills/addEmployeeSkills.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path params schema */
export const addEmployeeSkillsParams = z.object({
  employeeId: z
    .string()
    .describe("The employee identifier (UUID)")
});

/** 2️⃣ Request body schema */
export const addEmployeeSkillsData = z
  .array(
    z.object({
      skillId: z
        .string()
        .describe("The skill identifier (UUID)"),
      rating: z
        .number()
        .int()
        .optional()
        .describe("Skill rating (integer)")
    })
  )
  .describe("Array of skills to add to the employee");

/**
 * 3️⃣ Call the Keka API to add employee skills
 */
export async function addEmployeeSkills(
  env: Env,
  params: z.infer<typeof addEmployeeSkillsParams>,
  data: z.infer<typeof addEmployeeSkillsData>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = `${baseUrl}/hris/employees/${encodeURIComponent(params.employeeId)}/skills`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}
