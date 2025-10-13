import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";
import { getEmployeeSkills, getEmployeeSkillsParams, getEmployeeSkillsQuery } from "./getEmployeeSkills";
import { getAllSkills, getAllSkillsQuery } from "./getAllSkills";
import { addEmployeeSkills, addEmployeeSkillsParams, addEmployeeSkillsData } from "./addEmployeeSkills";

export function registerSkillsTools(server: McpServer, env: Env) {
  // ── GET /hris/skills ────────────────────────────────────────────────────────
  server.tool(
    "getAllSkills",
    "Use this tool to fetch all available skills in the organization",
    { query: getAllSkillsQuery },
    async ({ query }) => {
      try {
        const skills = await getAllSkills(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(skills, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching all skills: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

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

  // ── POST /hris/employees/{employeeId}/skills ────────────────────────────────
  server.tool(
    "addEmployeeSkills",
    "Use this tool to add skills to an employee. Provide an array of skill objects with skillId and optional rating",
    {
      params: addEmployeeSkillsParams,
      data: addEmployeeSkillsData
    },
    async ({ params, data }) => {
      try {
        const result = await addEmployeeSkills(env, params, data);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error adding employee skills: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
}
