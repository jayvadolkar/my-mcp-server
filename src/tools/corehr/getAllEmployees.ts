import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";



// Define schema for function parameters
export const filtersSchema = 
  z.object({
    employeeIds: z.string().optional().describe("Comma separated list of one or more Employee UUIDs"),
    employeeNumbers: z.string().optional().describe("Comma separated list of Employee numbers"),
    employmentStatus: z.string().optional().describe("Statuses of employement of an employee (Working, Relieved)"),
    inProbation: z.boolean().optional().default(false).describe("Fetches employees in probation. False - employees not in probation, true - employees in probation"),
    inNoticePeriod: z.boolean().optional().default(false).describe("Fetches employees in notice period. False - employees not in notice period, true - employees in notice period"),
    lastModified: z.string().optional().describe("Date/time when this time off request was last modified, in ISO 8601 format (YYYY-MM-DDThh:mm:ss±hh:mm)."),
    searchKey: z.string().optional().describe("The search key allowed value must have atleast 3 characters. It can be employee first name, last name, Given name"),
    pageNumber: z.number().optional().default(1).describe("int 32, Page number"),
    pageSize: z.number().optional().default(100).describe(" int32, Results per page (max 200)"),
  })
  .optional()
  .default({});

/**
 * Get all employees from Keka HRIS
 * @param env Cloudflare Workers environment
 * @param filters Filter parameters
 * @returns List of employees
 */
export async function getAllEmployees(
  env: Env,
  filters: z.infer<typeof filtersSchema>
) {
  try {
    const token = await getAuthToken(env);

    const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
    const url = new URL(`${baseUrl}/hris/employees`);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    console.log(`Fetching employees from ${url}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get employees: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting employees:", error);
    throw new Error(
      `Error getting employees: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}