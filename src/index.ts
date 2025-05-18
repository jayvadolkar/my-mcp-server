/**
 * File: src/index.ts
 * CoreHR MCP Server, no constructor, using env injected by Wrangler.
 */

import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCoreHrTools } from "./tools/corehr";
import { z } from "zod";

export interface Env {
  COMPANY: string;
  ENVIRONMENT: string;
  KEKA_GRANT_TYPE: string;
  KEKA_SCOPE: string;
  KEKA_CLIENT_ID: string;
  KEKA_CLIENT_SECRET: string;
  KEKA_API_KEY: string;
  TOKEN_ENDPOINT: string;
}

export class MyMCP extends McpAgent<Env> {
  server = new McpServer({
    name: "CoreHR API MCP Server",
    version: "1.0.0",
  });

  // Override the zero-arg init() from McpAgent
  override async init(): Promise<void> {
    console.log("Initializing CoreHR MCP Server with env:", this.env);

    // Two-arg signature
    registerCoreHrTools(this.server, this.env);

    // Example ping tool
    this.server.tool(
      "ping",
      { message: z.string().optional() },
      async (args) => ({
        content: [
          {
            type: "text",
            text: `Pong! ${args.message ?? "Server is operational"}`,
          },
        ],
      })
    );

    console.log("CoreHR MCP Server initialization complete.");
  }
}

export default {
  // The module-worker fetch handler
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse") {
      // Static serveSSE handles instantiation internally
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        JSON.stringify({
          status: "running",
          name: "CoreHR API MCP Server",
          company: env.COMPANY,
          environment: env.ENVIRONMENT,
          endpoints: ["/sse", "/mcp"],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response("Not found. Available: /, /sse, /mcp", { status: 404 });
  },
};
