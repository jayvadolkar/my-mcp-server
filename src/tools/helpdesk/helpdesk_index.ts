import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";
import { getAllHelpdeskTickets, getAllHelpdeskTicketsQuery } from "./getAllHelpdeskTickets";
import { addHelpdeskTicket, addHelpdeskTicketParams } from "./addHelpdeskTicket";

export function registerHelpdeskTools(server: McpServer, env: Env) {
  // ── GET /helpdesk/tickets ───────────────────────────────────────────────────
  server.tool(
    "getAllHelpdeskTickets",
    "Use this tool to fetch all helpdesk tickets. TicketStatus enums: 0 = Open, 1 = InProgress, 2 = OnHold, 3 = Resolved, 4 = Closed, 5 = Cancelled. TicketPriority enums: 0 = None, 1 = Low, 2 = Medium, 3 = High.",
    { query: getAllHelpdeskTicketsQuery },
    async ({ query }) => {
      try {
        const tickets = await getAllHelpdeskTickets(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(tickets, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching helpdesk tickets: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // ── POST /helpdesk/tickets ──────────────────────────────────────────────────
  server.tool(
    "addHelpdeskTicket",
    "Use this tool to add a new helpdesk ticket.",
    addHelpdeskTicketParams.shape,
    async () => {
      try {
        const result = await addHelpdeskTicket(env);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error adding helpdesk ticket: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
}
