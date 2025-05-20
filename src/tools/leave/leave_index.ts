import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";
import { getLeaveTypes, getLeaveTypesQuery } from "./getAllLeaveTypes";
import { getLeaveBalance, getLeaveBalanceQuery } from "./getLeaveBalance";
import { getLeaveRequests, getLeaveRequestsQuery }  from "./getAllLeaveRequests";
import { createLeaveRequest, createLeaveRequestSchema } from "./createLeaveRequest";
import { getLeavePlans, getLeavePlansQuery } from "./getAllLeavePlans";




export function registerLeaveTools(server: McpServer, env: Env) {

    // GET all leave types
    server.tool(
    "getLeaveTypes",
    "Use this tool to get all the types of leaves",
    { query: getLeaveTypesQuery },
    async ({ query }) => {
      try {
        const types = await getLeaveTypes(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(types, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching leave types: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // src/tools/leave/getLeaveBalance
  server.tool(
    "getLeaveBalance",
    "use this tool to fetch leave balance of all employees or an employee",
    { query: getLeaveBalanceQuery },
    async ({ query }) => {
      try {
        const types = await getLeaveBalance(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(types, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching leave balance: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

    // ── GET /time/leaverequests ─────────────────────────────────────────────────
  server.tool(
    "getLeaveRequests",
    "Use this tool to get leave requests across org or an employee. LeaveRequestStatus enums are 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Cancelled, 4 = InApprovalProcess",
    { query: getLeaveRequestsQuery },
    async ({ query }) => {
      try {
        const requests = await getLeaveRequests(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(requests, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching leave requests: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
    // ── POST /time/leaverequests ─────────────────────────────────────────────────
  server.tool(
    "createLeaveRequest",
    "Use this tool to create a leaverequest for an employee",
    { data: createLeaveRequestSchema },
    async ({ data }) => {
      try {
        const result = await createLeaveRequest(env, data);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error creating leave request: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
    // ── GET /time/leaveplans ─────────────────────────────────────────────────────
  server.tool(
    "getLeavePlans",
    "use this tool to get all leaves plans",
    { query: getLeavePlansQuery },
    async ({ query }) => {
      try {
        const plans = await getLeavePlans(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(plans, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching leave plans: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

}