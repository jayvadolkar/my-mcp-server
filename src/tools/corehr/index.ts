// src/tools/corehr/index.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetAllEmployees } from "./getAllEmployees";
// import { registerTool2 } from "./tool2";
// import { registerTool3 } from "./tool3";

export function registerCoreHrTools(server: McpServer) {
  registerGetAllEmployees(server);
  // registerTool2(server);
  // registerTool3(server);
}
