// src/index.ts

import { McpAgent }    from "agents/mcp";
import { McpServer }   from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCoreHrTools }   from "./tools/corehr";
//import { registerWorkforceTools } from "./tools/workforce";

export class MyMCP extends McpAgent {
  server = new McpServer({
    name:    "Enterprise HR/Workforce API Hub",
    version: "1.0.0",
  });

  async init() {
    registerCoreHrTools(this.server);
    //registerWorkforceTools(this.server);
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // ———————————————— parse & set global config ————————————————
    // clear any old config
    delete (globalThis as any).__RUNTIME_CONFIG;

    const auth = request.headers.get("authorization") || "";
    if (auth.toLowerCase().startsWith("bearer ")) {
      const parts = auth.slice(7).split(":");
      const [company, environment, clientId, clientSecret, apiKey] = parts;
      (globalThis as any).__RUNTIME_CONFIG = {
        company,
        environment,
        clientId,
        clientSecret,
        apiKey,
      };
    }

    // ———————————————— delegate to MCP agent ————————————————
    const url = new URL(request.url);
    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      // @ts-ignore
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }
    if (url.pathname === "/mcp") {
      // @ts-ignore
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }
    return new Response("Not found", { status: 404 });
  },
};
