/**
 * File: src/index.ts
 * 
 * Main entry point for the Keka HRIS MCP Server.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import tool registrars from their respective domain files
import { registerCoreHrTools } from "./tools/corehr";

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

// Define the state interface
export interface State {
  activeTokens: Record<string, string>;
}

// Create the MyMCP class
export class MyMCP {
  server: McpServer;
  env: Env;
  state: State;
  ctx: any;
  
  constructor(env: Env, ctx: any) {
    this.env = env;
    this.ctx = ctx;
    this.state = {
      activeTokens: {}
    };
    
    this.server = new McpServer({
      name: "CoreHR API MCP Server",
      version: "1.0.0",
    });
    
    this.init();
  }
  
  async init(): Promise<void> {
    console.log("Initializing CoreHR MCP Server...");
    
    // Validate that all required environment variables are present
    this.validateEnvironment();
    
    // Register all tools from different domains
    registerCoreHrTools(this.server, this.env, this.state);
    
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
              text: `Pong! ${message} (Environment: ${this.env.ENVIRONMENT}, Company: ${this.env.COMPANY})` 
            }
          ],
        };
      }
    );
    
    // Add a tool to clear cached tokens if needed
    this.server.tool(
      'clearTokenCache',
      {},
      async () => {
        // Reset the token cache
        this.setState({
          ...this.state,
          activeTokens: {}
        });
        
        return {
          content: [
            { 
              type: 'text', 
              text: 'Token cache has been cleared successfully.' 
            }
          ],
        };
      }
    );
    
    console.log("CoreHR MCP Server initialization complete.");
  }
  
  /**
   * Sets the state of the MCP agent
   */
  setState(newState: State): void {
    this.state = newState;
  }
  
  /**
   * Validates that all required environment variables are present.
   */
  private validateEnvironment(): void {
    // List of all required environment variables
    const requiredVars = [
      'COMPANY',
      'ENVIRONMENT',
      'KEKA_GRANT_TYPE',
      'KEKA_SCOPE',
      'KEKA_CLIENT_ID',
      'KEKA_CLIENT_SECRET',
      'KEKA_API_KEY'
    ];
    
    // Check if any variables are missing
    const missing = requiredVars.filter(key => !this.env[key as keyof Env]);
    
    // If any variables are missing, throw an error
    if (missing.length > 0) {
      const errorMessage = `Missing required environment variables: ${missing.join(', ')}. Please set these in the Cloudflare Workers dashboard before using this MCP server.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

// Create and export the worker handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const agent = new MyMCP(env, {});
    
    // Handle SSE connections for MCP
    if (request.url.endsWith('/sse')) {
      // Create SSE response
      const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      
      // Handle MCP connections
      // More implementation needed here...
      
      // Return SSE response
      return new Response(readable, {
        headers,
        status: 200,
      });
    }
    
    // Handle other routes
    return new Response('MCP Server is running. Connect to /sse for MCP interactions.', {
      headers: { 'Content-Type': 'text/plain' },
      status: 200,
    });
  }
};
