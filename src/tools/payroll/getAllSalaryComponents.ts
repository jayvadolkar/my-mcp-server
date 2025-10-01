// src/tools/payroll/getSalaryComponents.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Params schema (no params) */
export const getSalaryComponentsParams = z
  .object({}).describe("No parameters required");

/**
 * 2️⃣ Call the Keka API to fetch all salary components
 */
export async function getSalaryComponents(env: Env) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/payroll/salarycomponents`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url);
  }
  return res.json();
}
