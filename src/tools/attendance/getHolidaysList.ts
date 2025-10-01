// src/tools/time/getHolidays.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const getHolidaysPath = z
  .object({
    calendarId: z
      .string()
      .uuid()
      .describe("UUID of the holiday calendar"),
  })
  .describe("Path parameters for holidays endpoint");

/** 2️⃣ Query‐params schema */
export const getHolidaysQuery = z
  .object({
    calendarYear: z
      .coerce.number()
      .int()
      .describe("Year for which to fetch holidays (e.g. 2025)"),
    pageNumber: z
      .coerce.number()
      .int()
      .optional()
      .default(1)
      .describe("Page number (default 1)"),
    pageSize: z
      .coerce.number()
      .int()
      .optional()
      .default(100)
      .describe("Results per page (max 500, default 100)"),
  })
  .describe("Query parameters for fetching holidays");

/**
 * 3️⃣ Call Keka API to fetch holiday list
 */
export async function getHolidays(
  env: Env,
  path: z.infer<typeof getHolidaysPath>,
  query: z.infer<typeof getHolidaysQuery>
) {
  const { calendarId } = path;
  const { calendarYear, pageNumber, pageSize } = query;
  const token = await getAuthToken(env);
  const baseUrl = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1`;
  const url = new URL(
    `${baseUrl}/time/holidayscalendar/${calendarId}/holidays`
  );

  url.searchParams.append("calendarYear", String(calendarYear));
  url.searchParams.append("pageNumber", String(pageNumber));
  url.searchParams.append("pageSize", String(pageSize));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) {
    await handleApiError(res, "GET", url.toString());
  }
  return res.json();
}
