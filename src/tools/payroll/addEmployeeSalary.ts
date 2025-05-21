// src/tools/payroll/addEmployeeSalary.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const addEmployeeSalaryPath = z
  .object({
    employeeId: z.string().uuid().describe("UUID of the employee"),
  })
  .describe("Path parameters for setting an employee's salary");

/** 2️⃣ Body‐params schema */
export const addEmployeeSalaryBody = z
  .object({
    structureId: z
      .string()
      .uuid()
      .describe("Salary structure UUID to apply"),
    amount: z
      .number()
      .int()
      .describe("Base salary amount"),
    effectiveFrom: z
      .string()
      .datetime()
      .describe("ISO 8601 date from which this salary is effective"),
    apiBonusDto: z
      .array(
        z
          .object({
            bounsId: z
              .string()
              .uuid()
              .describe("Bonus type UUID"),
            amount: z
              .number()
              .int()
              .describe("Bonus amount"),
            dueDate: z
              .string()
              .datetime()
              .describe("ISO 8601 due date for this bonus"),
            note: z.string().optional().describe("Optional note for bonus"),
          })
          .describe("One bonus entry")
      )
      .describe("List of bonuses for this salary"),
    isBonusAmountIncludedInSalary: z
      .boolean()
      .describe("True if bonus amounts are included in the base salary"),
    salaryStructureType: z
      .number()
      .int()
      .describe("Enum for salary structure type. 0 = Custom, 1 = RangeBased"),
  })
  .describe("Payload for creating or updating an employee's salary record");

/**
 * 3️⃣ Call the Keka API to set/update employee salary
 */
export async function addEmployeeSalary(
  env: Env,
  path: z.infer<typeof addEmployeeSalaryPath>,
  body: z.infer<typeof addEmployeeSalaryBody>
) {
  const token = await getAuthToken(env);
  const { employeeId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/payroll/employees/${employeeId}/salary`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
