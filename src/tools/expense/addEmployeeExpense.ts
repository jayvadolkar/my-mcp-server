// src/tools/expense/addEmployeeExpense.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const addEmployeeExpenseParams = z.object({
  employeeId: z.string().uuid().describe("Employee UUID")
});

export async function addEmployeeExpense(
  env: Env,
  employeeId: string
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/expense/employees/${encodeURIComponent(employeeId)}/expenses`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}