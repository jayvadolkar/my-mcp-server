import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";
import { getAllRequisitionRequests, getAllRequisitionRequestsQuery } from "./getAllRequisitionRequests";

export function registerRequisitionTools(server: McpServer, env: Env) {
  // ── GET /requisition/requests ───────────────────────────────────────────────
  server.tool(
    "getAllRequisitionRequests",
    "Use this tool to fetch all requisition requests. Status enums: 1 = Pending, 2 = InApproval, 3 = Approved, 4 = Rejected. JobType enums: 1 = PartTime, 2 = FullTime. RequisitionType enums: 1 = New, 2 = Replacement.",
    { query: getAllRequisitionRequestsQuery },
    async ({ query }) => {
      try {
        const requisitionRequests = await getAllRequisitionRequests(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(requisitionRequests, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching requisition requests: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
}
