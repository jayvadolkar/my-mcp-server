/**
 * File: src/index.ts
 * 
 * Main entry point for the Keka HRIS MCP Server.
 */
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCoreHrTools } from "./tools/corehr";
import { z } from "zod";

// Define interface for environment variables 
export interface Env {
  COMPANY: string;              
  ENVIRONMENT: string;          
  KEKA_GRANT_TYPE: string;      
  KEKA_SCOPE: string;           
  KEKA_CLIENT_ID: string;       
  KEKA_CLIENT_SECRET: string;   
  KEKA_API_KEY: string;         
}

// Keep track of the latest environment variables
let globalEnv: any = {};

// Create the MyMCP class that extends McpAgent
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "CoreHR API MCP Server",
    version: "1.0.0",
  });
  
  async init() {
    console.log("Initializing CoreHR MCP Server...");
    
    // Use the current global environment
    console.log("Environment for tools:", globalEnv);
    
    // Create state object for the tools
    const state = {
      activeTokens: {}
    };
    
    // Register CoreHR tools with all 3 required arguments
    registerCoreHrTools(this.server, globalEnv, state);
    
    // Add a simple ping tool for testing connectivity
    this.server.tool(
      'ping',
      {
        message: z.string().optional().describe('Optional message to include in the response')
      },
      async (args) => {
        const message = args.message || 'Server is operational';
        return {
          content: [
            { 
              type: 'text', 
              text: `Pong! ${message} (GlobalEnv: ${JSON.stringify(globalEnv)})` 
            }
          ],
        };
      }
    );
    
    // Add a debug tool to check environment variables
    this.server.tool(
      'checkEnv',
      {},
      async () => {
        return {
          content: [
            { 
              type: 'text', 
              text: `Current environment variables: ${JSON.stringify(globalEnv)}` 
            }
          ],
        };
      }
    );
    
    console.log("CoreHR MCP Server initialization complete.");
  }
}

// Create and export the worker handler
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    console.log("Request received at:", request.url);
    console.log("Environment variables from wrangler:", {
      COMPANY: env.COMPANY ? "Set" : "Not set",
      ENVIRONMENT: env.ENVIRONMENT ? "Set" : "Not set",
      KEKA_GRANT_TYPE: env.KEKA_GRANT_TYPE ? "Set" : "Not set",
      KEKA_SCOPE: env.KEKA_SCOPE ? "Set" : "Not set",
      KEKA_CLIENT_ID: env.KEKA_CLIENT_ID ? "Set" : "Not set",
      KEKA_CLIENT_SECRET: env.KEKA_CLIENT_SECRET ? "Set" : "Not set",
      KEKA_API_KEY: env.KEKA_API_KEY ? "Set" : "Not set"
    });
    
    // Set global variables for this request - directly using the format expected by the tools
    globalEnv = {
      COMPANY: env.COMPANY,
      ENVIRONMENT: env.ENVIRONMENT,
      KEKA_GRANT_TYPE: env.KEKA_GRANT_TYPE,
      KEKA_SCOPE: env.KEKA_SCOPE,
      KEKA_CLIENT_ID: env.KEKA_CLIENT_ID,
      KEKA_CLIENT_SECRET: env.KEKA_CLIENT_SECRET,
      KEKA_API_KEY: env.KEKA_API_KEY
    };
    
    // Also set them on the global scope for backward compatibility
    (globalThis as any).COMPANY = env.COMPANY;
    (globalThis as any).ENVIRONMENT = env.ENVIRONMENT;
    (globalThis as any).KEKA_GRANT_TYPE = env.KEKA_GRANT_TYPE;
    (globalThis as any).KEKA_SCOPE = env.KEKA_SCOPE;
    (globalThis as any).KEKA_CLIENT_ID = env.KEKA_CLIENT_ID;
    (globalThis as any).KEKA_CLIENT_SECRET = env.KEKA_CLIENT_SECRET;
    (globalThis as any).KEKA_API_KEY = env.KEKA_API_KEY;
    
    // Set our config in the process.env for libraries that might look there
    if (typeof process !== 'undefined' && process.env) {
      process.env.COMPANY = env.COMPANY;
      process.env.ENVIRONMENT = env.ENVIRONMENT;
      process.env.KEKA_GRANT_TYPE = env.KEKA_GRANT_TYPE;
      process.env.KEKA_SCOPE = env.KEKA_SCOPE;
      process.env.KEKA_CLIENT_ID = env.KEKA_CLIENT_ID;
      process.env.KEKA_CLIENT_SECRET = env.KEKA_CLIENT_SECRET;
      process.env.KEKA_API_KEY = env.KEKA_API_KEY;
    }
    
    // ———————————————— delegate to MCP agent ————————————————
    const url = new URL(request.url);
    
    // Handle SSE connections
    if (url.pathname === "/sse") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }
    
    // Handle MCP HTTP connections
    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }
    
    // Root endpoint for status check
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(JSON.stringify({
        status: "running",
        name: "CoreHR API MCP Server",
        environment: env.ENVIRONMENT,
        company: env.COMPANY,
        endpoints: ["/sse", "/mcp"],
        env_check: {
          COMPANY: env.COMPANY ? "Set" : "Not set",
          ENVIRONMENT: env.ENVIRONMENT ? "Set" : "Not set",
          KEKA_GRANT_TYPE: env.KEKA_GRANT_TYPE ? "Set" : "Not set",
          KEKA_SCOPE: env.KEKA_SCOPE ? "Set" : "Not set",
          KEKA_CLIENT_ID: env.KEKA_CLIENT_ID ? "Set" : "Not set",
          KEKA_CLIENT_SECRET: env.KEKA_CLIENT_SECRET ? "Set" : "Not set",
          KEKA_API_KEY: env.KEKA_API_KEY ? "Set" : "Not set"
        }
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response("Not found. Available endpoints: /, /sse, /mcp", { status: 404 });
  },
};