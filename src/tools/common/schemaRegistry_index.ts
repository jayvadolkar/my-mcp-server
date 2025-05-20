// src/tools/common/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { schemaRegistryParams, getSchema } from "./schemaRegistry";


export function registerCommonTools(server: McpServer) {
  server.tool(
    "getSchema",
    "This tool to be called when there are some doubts about schema of any other tool",
    { key: schemaRegistryParams.shape.key },
    async ({ key }, extra) => {
      try {
        const info = await getSchema(null, { key });
        return { content: [{ type: "text", text: JSON.stringify(info) }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: err.message }], isError: true };
      }
    }
  );
}
