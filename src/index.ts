/**
 * File: src/index.ts
 * CoreHR MCP Server, no constructor, using env injected by Wrangler.
 */

import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { registerCoreHrTools } from "./tools/corehr/corehr_index";
import { registerDocumentTools } from "./tools/document/document_index";
import { registerLeaveTools } from "./tools/leave/leave_index";
import { registerCommonTools } from "./tools/common/schemaRegistry_index";
import { registerAttendanceTools } from "./tools/attendance/attendance_index";
import { registerPayrollTools } from "./tools/payroll/payroll_index";
import { registerPsaTools } from "./tools/psa/psa_index";
import { registerExpenseTools } from "./tools/expense/expense_index";
import { registerPmsTools } from "./tools/pms/pms_index";
import { registerSkillsTools } from "./tools/skills/skills_index";



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
    console.log("Initializing kekaHR MCP Server with env:", this.env);

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

    // Two-arg signature
    registerCommonTools(this.server)
    registerCoreHrTools(this.server, this.env);
    registerDocumentTools(this.server, this.env);
    registerLeaveTools(this.server, this.env);
    registerAttendanceTools(this.server, this.env);
    registerPayrollTools(this.server, this.env);
    registerPsaTools(this.server, this.env)
    registerExpenseTools(this.server, this.env);
    registerPmsTools(this.server, this.env);
    registerSkillsTools(this.server, this.env);
  
    
   console.log("CoreHR MCP Server initialization complete.");
  }
}

export default {
  // The module-worker fetch handler
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse") {
      // Static serveSSE handles instantiation internally
      return MyMCP.serve("/sse").fetch(request, env, ctx);
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
