// src/tools/time/attendanceResponseSchemas.ts
import { z } from "zod";

/** Reusable pagination wrapper */
const paginationWrapper = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      succeeded: z.boolean().describe("Was the request successful?"),
      message: z.string().describe("Server message"),
      errors: z.array(z.string()).describe("List of error messages"),
      data: z.array(item).describe("Payload array"),
      pageNumber: z.number().int().describe("Current page index"),
      pageSize: z.number().int().describe("Records per page"),
      firstPage: z.string().url().describe("URL to first page"),
      lastPage: z.string().url().describe("URL to last page"),
      totalPages: z.number().int().describe("Total pages available"),
      totalRecords: z.number().int().describe("Total records available"),
      nextPage: z.string().url().nullable().describe("URL to next page"),
      previousPage: z.string().url().nullable().describe("URL to previous page"),
    })
    .describe("Standard paginated response");

/** Common address object */
const addressSchema = z
  .object({
    addressLine1: z.string(),
    addressLine2: z.string().nullable(),
    countryCode: z.string().length(2),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  })
  .describe("Postal address");

/** 1️⃣ Attendance entry */
const timeEntryRecord = z
  .object({
    timestamp: z.string().datetime().describe("Punch timestamp (ISO 8601)"),
    employeeIdentifier: z.string().uuid().describe("Employee UUID"),
    punchStatus: z.number().int().describe("0=Clock-in;1=Clock-out"),
    attendanceLogSource: z.number().int() .describe("Log source enum"),
    manualClockinType: z.number().int().describe("Manual clock-in type enum"),
    premiseName: z.string().describe("Premise where punched"),
    locationAddress: addressSchema,
  })
  .describe("One clock-in/out record");

/** Full-day attendance record */
export const attendanceListResponseSchema = paginationWrapper(
  z
    .object({
      id: z.string().uuid().describe("Attendance record UUID"),
      employeeNumber: z.string().describe("Employee number"),
      employeeIdentifier: z.string().uuid().describe("Employee UUID"),
      attendanceDate: z.string().datetime().describe("Date of attendance in ISO 8601"),
      dayType: z.number().int().describe("Day type enum 0 = WorkingDay, 1 = Holiday, 2 = FullDayWeeklyOff, 3 = FirstHalfWeeklyOff, 4 = SecondHalfWeeklyOff"),
      shiftStartTime: z.string().datetime().describe("Datetime in ISO 8601 format"),
      shiftEndTime: z.string().datetime().describe("Datetime in ISO 8601 format"),
      shiftDuration: z.number().describe("Shift length in minutes"),
      shiftBreakDuration: z.number().describe("Break duration in minutes"),
      shiftEffectiveDuration: z.number().describe("Effective shift minutes"),
      totalGrossHours: z.number().describe("Gross work minutes"),
      totalEffectiveHours: z.number().describe("Effective work minutes"),
      totalBreakDuration: z.number().describe("Total break minutes"),
      totalEffectiveOvertimeDuration: z.number().describe("Effective overtime minutes"),
      totalGrossOvertimeDuration: z.number().describe("Gross overtime minutes"),
      firstInOfTheDay: timeEntryRecord.describe("First punch of the day"),
      lastOutOfTheDay: timeEntryRecord.describe("Last punch of the day"),
    })
    .describe("One attendance record")
).describe("GET /attendance/attendancerecords");

/** 2️⃣ Capture-schemes */
export const captureSchemeResponseSchema = paginationWrapper(
  z
    .object({
      id: z.string().uuid().describe("UUID of the capture schema"),
      name: z.string().describe("Name of the capturescheme"),
    })
    .describe("One capture-scheme config")
).describe("GET /attendance/capturescheme");

/** 3️⃣ Shift-policies */
export const shiftPoliciesResponseSchema = paginationWrapper(
  z
    .object({
      id: z.string().uuid().describe("UUID of the shift policy"),
      name: z.string().describe("Name of the shift policy"),
    })
    .describe("One shift-policy config")
).describe("GET /attendance/shiftpolicies");

/** 4️⃣ Penalisation (tracking) policies */
export const penalisationPoliciesResponseSchema = paginationWrapper(
  z
    .object({
      id: z.string().uuid().describe("UUID of the penalisation policy"),
      name: z.string().describe("Name of the penalisation policy"),
    })
    .describe("One penalisation policy config")
).describe("GET /attendance/penalisationpolicies");

/** 5️⃣ Weekly-off policies */ 
export const weeklyOffPoliciesResponseSchema = paginationWrapper(
  z
    .object({
      id: z.string().uuid().describe("UUID of the weekly off policy"),
      name: z.string().describe("Name of the weekly off policy"),
    })
    .describe("One weekly-off policy config")
).describe("GET /attendance/weeklyoffpolicies");

/** 6️⃣ Holidays for a calendar */
export const holidaysResponseSchema = paginationWrapper(
  z
    .object({
      id: z.string().uuid().describe("Holiday UUID"),
      name: z.string().describe("Holiday name"),
      date: z.string().datetime().describe("Holiday date"),
      isFloater: z.boolean().describe("Is this a floater holiday?"),
    })
    .describe("One holiday entry")
).describe("GET /attendance/holidayscalendar/{calendarId}/holidays");

/** 7️⃣ Holiday-calendars list */
export const holidaysCalendarResponseSchema = paginationWrapper(
  z
    .object({
      id: z.string().uuid().describe("UUID of the holiday calender/holiday calender ID"),
      name: z.string().describe("Name of the holiday calender"),
    })
    .describe("One holiday-calendar")
).describe("GET /attendance/holidayscalendar");

/** 8️⃣ & 9️⃣ OD & WFH (boolean data) */
const booleanResponse = z
  .object({
    succeeded: z.boolean(),
    message: z.string(),
    errors: z.array(z.string()),
    data: z.boolean().describe("Operation successful flag"),
  })
  .describe("Simple boolean-data response");

export const odResponseSchema = booleanResponse.describe("POST /time/od");
export const wfhResponseSchema = booleanResponse.describe("POST /time/wfh");

/** 🔟 Create time-entry returns its UUID */
export const createTimeEntryResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message: z.string(),
    errors: z.array(z.string()),
    data: z
      .string()
      .uuid()
      .describe("UUID of the created time-entry"),
  })
  .describe("POST /attendance/employee/{id}/timeentry");
