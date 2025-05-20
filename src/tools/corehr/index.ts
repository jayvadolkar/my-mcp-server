import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllEmployees, filtersSchema,} from "./getAllEmployees";
import { createEmployee, createEmployeeSchema } from "./createAnEmployee";
import { getEmployee, getEmployeeParams } from "./getAnEmployee";
import { updatePersonalDetails, updatePersonalDetailsSchema, updatePersonalDetailsParams} from "./updateEmployeePersonalDetails";
import { updateJobDetails, updateJobDetailsParams, updateJobDetailsSchema } from "./updateEmployeeJobDetails";
import { getUpdateFields, updateFieldsQuery } from "./getAllUpdateFields";
import { getGroups, getGroupsQuery } from "./getAllGroups";
import { getGroupTypes, getGroupTypesQuery } from "./getAllGroupTypes";
import { getDepartments, getDepartmentsQuery } from "./getAllDepartments";
import { getLocations, getLocationsQuery } from "./getAllLocations";
import { getJobTitles, getJobTitlesQuery } from "./getAllJobTitles";
import { Env } from "../../index";


export function registerCoreHrTools(server: McpServer, env: Env) {
  // GET /hris/employees
  server.tool(
    "getAllEmployees",
    "Get all employees from Keka. This tool can be used to fetch a list of employees based on various filter criteria.",
    { filters: filtersSchema },
    async ({ filters }) => {
      try {
        const employees = await getAllEmployees(env, filters);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(employees, null, 2),
             },
          ],
        };
      } catch (error: unknown) {
        console.error("Error in getAllEmployees tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // POST /hris/employees
  server.tool(
    "createAnEmployee",
    "You can create an employee in Keka",
    { data: createEmployeeSchema },
    async ({ data }) => {
      try {
        const result = await createEmployee(env, data);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Error: ${e.message}` }],
          isError: true,
        };
      }
    }
  );
  // ── GET /hris/employees/{id} ────────────────────────────────────────────────
  server.tool(
    "getAnEmployee",
    "Get an employee by UUID. This tool can be used to fetch the details of a specific employee by their unique identifier.",
    { id: getEmployeeParams.shape.id },
    async ({ id }) => {
      try {
        const employee = await getEmployee(env, id);
        return {
          content: [
            { type: "text", text: JSON.stringify(employee, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // ── PUT /hris/employees/{id}/personal-details ────────────────────────────
  server.tool(
    "updateEmployeePersonalDetails",
    "Update an employee's personal details. This tool can be used to update various personal details of an employee, such as their name, email, and phone number.",
    {
      id:   updatePersonalDetailsParams.shape.id,
      data: updatePersonalDetailsSchema
    },
    async ({ id, data }) => {
      try {
        const updated = await updatePersonalDetails(env, id, data);
        return {
          content: [
            { type: "text", text: JSON.stringify(updated, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error updating personal details: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // ── PUT /hris/employees/{id}/job-details ────────────────────────────────
  server.tool(
    "updateEmployeeJobDetails",
    "Update an employee's job details. This tool can be used to update various job-related details of an employee, such as their department, designation, and various other job-related attributes.",
    {
      id:   updateJobDetailsParams.shape.id,
      data: updateJobDetailsSchema,
    },
    async ({ id, data }) => {
      try {
        const result = await updateJobDetails(env, id, data);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error updating job details: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // ── GET /hris/employees/updatefields ─────────────────────────────────────
  server.tool(
    "getUpdateFields",
    "This tool can be used to fetch a list of all the fields that can be updated for an employee. The field types are 1 - Integer, 2 - Decimal, 3 - String, 4 - Boolean, 5 - Enum, 6 - DateTime, 7 - MultiDropdown, 8 - Checkbox, 9 - Dropdown, 10 - TextBox, 11 - TextArea, 12 - Date, 13 - Number",
    { query: updateFieldsQuery },
    async ({ query }) => {
      try {
        const fields = await getUpdateFields(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(fields, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching update fields: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // ── GET /hris/groups ───────────────────────────────────────────────────────
  server.tool(
    "getGroups",
    "This tool can be used to fetch a list of all the groups in Keka. The group types are 1 - Department, 2 - Designation, 3 - Location, 4 - Grade, 5 - Employment Type, 6 - Custom Group",
    { query: getGroupsQuery },
    async ({ query }) => {
      try {
        const groups = await getGroups(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(groups, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching groups: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // ── GET /hris/grouptypes ─────────────────────────────────────────────────
  server.tool(
    "getAllGroupTypes",
    "This tool can be used to fetch a list of all the group types in Keka. The group types are 1 - Department, 2 - Designation, 3 - Location, 4 - Grade, 5 - Employment Type, 6 - Custom Group",
    { query: getGroupTypesQuery },
    async ({ query }) => {
      try {
        const groupTypes = await getGroupTypes(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(groupTypes, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching group types: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // ── GET /hris/departments ────────────────────────────────────────────────
  server.tool(
    "getDepartments",
    "This tool can be used to fetch a list of all the departments in Keka. The department IDs are UUIDs.",
    { query: getDepartmentsQuery },
    async ({ query }) => {  
      try {
        const departments = await getDepartments(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(departments, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching departments: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // ── GET /hris/locations ─────────────────────────────────────────────────
  server.tool(
    "getLocations",
    "This tool can be used to fetch a list of all the locations in Keka. The location IDs are UUIDs.",
    { query: getLocationsQuery },
    async ({ query }) => {
      try {
        const locations = await getLocations(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(locations, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching locations: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // ── GET /hris/jobtitles ─────────────────────────────────────────────────
  server.tool(
    "getJobTitles",
    "This tool can be used to fetch a list of all the job titles in Keka. The job title IDs are UUIDs.",
    { query: getJobTitlesQuery },
    async ({ query }) => {
      try {
        const jobTitles = await getJobTitles(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(jobTitles, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching job titles: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

}

