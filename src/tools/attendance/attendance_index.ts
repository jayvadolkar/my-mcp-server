import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";

import { getAttendance, getAttendanceQuery } from "./getAllAttendanceRecords";
import { getCaptureScheme, getCaptureSchemeQuery } from "./getAllCaptureSchemes";
import { getShiftPolicies, getShiftPoliciesQuery } from "./getAllShiftPolicies";
import { getPenalisationPolicies, getPenalisationPoliciesQuery } from "./getAllPenalisationPolicies";
import { getWeeklyOffPolicies, getWeeklyOffPoliciesQuery } from "./getAllWeeklyOffPolicies";
import { getHolidaysCalendar, getHolidaysCalendarQuery } from "./getHolidaysCalender";
import { getHolidays, getHolidaysPath, getHolidaysQuery } from "./getHolidaysList";
import { createOd, createOdBody } from "./createOd";
import { createWfh, createWfhBody } from "./createWfh";
import { createTimeEntry, createTimeEntryBody, createTimeEntryPath } from "./createTimeEntry";



export function registerAttendanceTools(server: McpServer, env: Env) {
    
    // 1. Get all attendance records
    server.tool(
    "getAllAttendanceRecords",
    "Fetch this tool to fetch all attendance records",
    { query: getAttendanceQuery },
    async ({ query }) => {
      try {
        const data = await getAttendance(env, query);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching attendance: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /time/capturescheme ────────────────────────────────
  server.tool(
    "getCaptureScheme",
    "Fetch paginated capture-scheme configurations by ID",
    { query: getCaptureSchemeQuery },
    async ({ query }) => {
      try {
        const data = await getCaptureScheme(env, query);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching capture scheme: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /time/shiftpolicies ───────────────────────────────
  server.tool(
    "getShiftPolicies",
    "use this tool to get all leave policy ",
    { query: getShiftPoliciesQuery },
    async ({ query }) => {
      try {
        const data = await getShiftPolicies(env, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching shift policies: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /time/penalisationpolicies ────────────────────────
  server.tool(
    "getPenalisationPolicies",
    "Use this tool to Fetch penalisation (tracking) policy configurations",
    { query: getPenalisationPoliciesQuery },
    async ({ query }) => {
      try {
        const data = await getPenalisationPolicies(env, query);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Error fetching penalisation policies: ${e.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── GET /time/weeklyoffpolicies ────────────────────────────
  server.tool(
    "getWeeklyOffPolicies",
    "Fetch paginated weekly-off-policy configurations by ID",
    { query: getWeeklyOffPoliciesQuery },
    async ({ query }) => {
      try {
        const data = await getWeeklyOffPolicies(env, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching weekly-off policies: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /time/holidayscalendar ──────────────────────────────
  server.tool(
    "getHolidaysCalendar",
    "Fetch paginated holiday-calendar records by ID",
    { query: getHolidaysCalendarQuery },
    async ({ query }) => {
      try {
        const data = await getHolidaysCalendar(env, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching holiday-calendars: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /time/holidayscalendar/{calendarId}/holidays ─────────────────────
  server.tool(
    "getHolidays",
    "Fetch paginated holiday list for a given calendar and year (optional)",
    {
      path:  getHolidaysPath,
      query: getHolidaysQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getHolidays(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching holidays: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /time/od ───────────────────────────────────────────
  server.tool(
    "createOd",
    "use this tool to create/Submit an On-Duty (OD) request for an employee",
    { body: createOdBody },
    async ({ body }) => {
      try {
        const data = await createOd(env, body);
        return {
          content: [
            { type: "text", text: JSON.stringify(data, null, 2) },
          ],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating OD request: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /time/wfh ──────────────────────────────────────────
  server.tool(
    "createWfh",
    "use this tool to create/Submit a Work-From-Home (WFH) request for an employee",
    { body: createWfhBody },
    async ({ body }) => {
      try {
        const data = await createWfh(env, body);
        return {
          content: [
            { type: "text", text: JSON.stringify(data, null, 2) },
          ],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating WFH request: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /attendance/employee/{id}/timeentry ───────────────────
  server.tool(
    "createTimeEntry",
    "Submit a manual punch (time entry) for an employee",
    {
      path: createTimeEntryPath,
      body: createTimeEntryBody,
    },
    async ({ path, body }) => {
      try {
        const data = await createTimeEntry(env, path, body);
        return {
          content: [
            { type: "text", text: JSON.stringify(data, null, 2) },
          ],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating time entry: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
