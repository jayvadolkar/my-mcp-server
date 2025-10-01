// src/tools/expense/updateEmployeeExpense.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export const updateEmployeeExpenseParams = z.object({
  employeeId: z.string().uuid().describe("Employee UUID"),
  expenseId: z.string().uuid().describe("Expense UUID")
});

export async function updateEmployeeExpense(
  env: Env,
  employeeId: string,
  expenseId: string
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/expense/employees/${encodeURIComponent(employeeId)}/expenses/${encodeURIComponent(expenseId)}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}