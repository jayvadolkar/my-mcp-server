import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllEmployees, filtersSchema } from "./getAllEmployees";
import { Env } from "../../index";

/**
 * Register all CoreHR tools with the MCP server
 * @param server MCP server instance
 * @param env Cloudflare Workers environment
 */
export function registerCoreHrTools(server: McpServer, env: Env) {
  server.tool(
    "getAllEmployees",
    { filters: filtersSchema },
    async ({ filters }) => {
      try {
        const employees = await getAllEmployees(env, filters);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(employees, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        console.error("Error in getAllEmployees tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // register more tools here…
}
