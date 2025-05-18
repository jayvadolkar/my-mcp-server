/**
 * File: src/tools/corehr/index.ts
 * 
 * CoreHR Tools Registration Module
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCoreHrTools as registerGetAllEmployees } from "./getAllEmployees";

/**
 * Register all CoreHR tools with the MCP server.
 */
export function registerCoreHrTools(
  server: McpServer, 
  env: any, 
  state: { activeTokens: Record<string, string> }
): void {
  // Register employee management tools
  registerGetAllEmployees(server, env, state);
  
  // Log successful registration
  console.log("All CoreHR tools registered successfully");
}