import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";


// 1️⃣ Define the exact shape of the POST body
export const createEmployeeSchema = z.object({
  employeeNumber:   z.string().describe("Unique employee identifier UUID"),
  displayName:      z.string().describe("Full name for display. if not provided, it will be auto-generated as firstName + middleName + lastName"),
  firstName:        z.string().describe("First name of the employee."),
  middleName:       z.string().optional().describe("Middle name (if any)"),
  lastName:         z.string().describe("Surname or last name of the employee"),
  email:            z.string().email().describe("Work email address of the employee. Should be unique and in email format"),
  mobileNumber:     z.string().describe("Mobile phone number"),
  gender:           z.number().int().describe("0 - NotSpecified, 1 - Male, 2 - Female, 3 - Nonbinary, 4 - PreferNotToRespond"),
  dateOfBirth:      z.string().describe("ISO 8601 date/time of birth. If only date is provided, it will be auto-generated as YYYY-MM-DD and time will be set to 00:00:00"),
  dateJoined:       z.string().describe("ISO  datetime of joining date. If only date is provided, it will be auto-generated as YYYY-MM-DD and time will be set to 00:00:00"),
  department:       z.string().describe("Department UUID or identifier. If name provided, we have to call the get all groups API to get the UUID"),
  businessUnit:     z.string().describe("Business unit UUID or identifier. If name provided, we have to call the get all groups API to get the UUID"),
  jobTitle:         z.string().describe("Primary job title uUID or identifier. If name provided, we have to call the get all job titles API to get the UUID"),
  secondaryJobTitle:z.string().optional().describe("Secondary title (if any) UUID or identifier. If name provided, we have to call the get all job titles API to get the UUID"),
  location:         z.string().describe("Office location UUID or identifier. If name provided, we have to call the get all locations API to get the UUID"),
  legalEntity:      z.string().describe("Legal entity UUID or identifier. If name provided, we have to call the get all groups API to get the UUID"),
  nationality:      z.string().describe("Nationality"),
});

/**
 * 2️⃣ Call the Keka API to create an employee
 */
export async function createEmployee(
  env: Env,
  payload: z.infer<typeof createEmployeeSchema>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/employees`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept":        "application/json",
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
