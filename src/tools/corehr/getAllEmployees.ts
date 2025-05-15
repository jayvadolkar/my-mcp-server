// src/tools/corehr/getAllEmployees.ts

import { z }   from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAccessToken,
  defaultAuthConfig,
  getRuntimeConfig,
  AuthConfig,
} from "../../auth";


// Schema for query filters, with string→type coercion
const FiltersSchema = z.object({
  employeeIds:      z.string().optional(),
  employeeNumbers:  z.string().optional(),
  employmentStatus: z.string().optional(),
  inProbation:      z.preprocess(v => typeof v==="string"?v==="true":v, z.boolean().optional()),
  inNoticePeriod:   z.preprocess(v => typeof v==="string"?v==="true":v, z.boolean().optional()),
  lastModified:     z.string().optional(),
  searchKey:        z.string().optional(),
  pageNumber:       z.preprocess(v => typeof v==="string"?parseInt(v,10):v, z.number().optional()),
  pageSize:         z.preprocess(v => typeof v==="string"?parseInt(v,10):v, z.number().optional()),
});


export function registerGetAllEmployees(server: McpServer) {
  server.tool(
    "getAllEmployees",

    {
      // 2) Coerce string to boolean, default to FALSE!
      useConfig: z.preprocess(
        val => typeof val === "string" ? val === "true" : val, z.boolean()).default(false),

      filters: FiltersSchema.default({}),
    },

    async ({ useConfig, filters }) => {
      // 3) If useConfig is FALSE, force the hard-coded defaults
      let cfg: AuthConfig;
      if (!useConfig) {
        cfg = defaultAuthConfig;
      } else {
        // useConfig===true → read the header-parsed config
        // this will throw if no header was set
        cfg = getRuntimeConfig();
      }

      // 4) Fetch a fresh token
      const token = await getAccessToken({
        clientId:     cfg.clientId,
        clientSecret: cfg.clientSecret,
        apiKey:       cfg.apiKey,
        environment:  cfg.environment,
      });

      // 5) Build your HRIS URL & query
      const baseUrl = `https://${cfg.company}.${cfg.environment}.com/api/v1/hris`;
      const params  = new URLSearchParams();
      for (const [k, v] of Object.entries(filters)) {
        if (v != null && v !== "") params.append(k, String(v));
      }

      // 6) Call the HRIS API
      const resp = await fetch(`${baseUrl}/employees?${params}`, {
        headers: {
          "Accept":        "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!resp.ok) {
        const err = await resp.text();
        return {
          content: [{ type: "text", text: `Error: ${resp.status} ${err}` }],
          isError: true,
        };
      }

      const data = await resp.json();
      return {
        content: [{
          type: "text",
          text:   JSON.stringify(data, null, 2),
        }],
      };
    }
  );
}