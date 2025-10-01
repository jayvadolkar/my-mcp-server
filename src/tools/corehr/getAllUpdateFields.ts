// src/tools/corehr/getUpdateFields.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Query‐params schema */
export const updateFieldsQuery = 
z.object({
    pageNumber: z.coerce.number().int().optional().default(1).describe("Page number (default 1)"),
    pageSize:   z.coerce.number().int().optional().default(100).describe("Results per page (max 200, default 100)"),
  })
  .describe("This tool can be used to fetch a list of all the fields that can be updated for an employee. The field types are 1 - Integer, 2 - Decimal, 3 - String, 4 - Boolean, 5 - Enum, 6 - DateTime, 7 - MultiDropdown, 8 - Checkbox, 9 - Dropdown, 10 - TextBox, 11 - TextArea, 12 - Date, 13 - Number");

/**
 * 2️⃣ Call the Keka API to fetch update‐fields metadata
 */
export async function getUpdateFields(
  env: Env,
  query: z.infer<typeof updateFieldsQuery>
) {
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(`${baseUrl}/hris/employees/updatefields`);
  // append pagination params
  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept":        "application/json"
    },
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url.toString());
  }
  return res.json(); // caller can JSON.stringify or further parse
}
