// src/tools/corehr/getEmployee.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

// 📦 Path params schema
export const getEmployeeParams = z.object({
  id: z.string().describe("The Employee identifier UUID")
});

/**
 * Fetch a single employee by ID
 */
export async function getEmployee(env: Env, id: string) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hris/employees/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to get employee ${id}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
