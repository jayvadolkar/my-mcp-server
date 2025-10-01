import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";
import { getEmployeeSkills, getEmployeeSkillsParams, getEmployeeSkillsQuery } from "./getEmployeeSkills";

export function registerSkillsTools(server: McpServer, env: Env) {
  // ── GET /hris/employees/{employeeId}/skills ─────────────────────────────────
  server.tool(
    "getEmployeeSkills",
    "Use this tool to fetch skills for a specific employee by their employee ID",
    {
      params: getEmployeeSkillsParams,
      query: getEmployeeSkillsQuery
    },
    async ({ params, query }) => {
      try {
        const skills = await getEmployeeSkills(env, params, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(skills, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching employee skills: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
}
