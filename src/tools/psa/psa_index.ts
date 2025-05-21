import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";

import { getClients, getClientsQuery } from "./getAllClients";
import { createClient, createClientBody } from "./createClient";
import { getClient, getClientPath } from "./getAClient";
import { updateClient, updateClientBody, updateClientPath } from "./updateClient";
import { getBillingRoles, getBillingRolesPath, getBillingRolesQuery } from "./getBiillingRoles";
import { createCreditNote, createCreditNoteBody, createCreditNotePath } from "./createCreditNote";
import { getInvoices, getInvoicesPath, getInvoicesQuery } from "./getInvoices";
import { receivePayment, receivePaymentBody, receivePaymentPath } from "./postRecievePayments";
import { getTaxes, getTaxesPath, getTaxesQuery } from "./getTaxes";
import { getTaxGroups, getTaxGroupsPath, getTaxGroupsQuery } from "./getTaxGroups";
import { getProjectPhases, getProjectPhasesPath, getProjectPhasesQuery } from "./getProjectPhases";
import { createProjectPhase, createProjectPhasePath, createProjectPhaseQuery } from "./createProjectPhase";
import { getProjects, getProjectsQuery } from "./getProjects";
import { createProject, createProjectBody } from "./createProject";
import { getProjectById, getProjectByIdPath } from "./getProjectById";
import { updateProject, updateProjectBody, updateProjectPath } from "./updateAProject";
import { getProjectAllocations, getProjectAllocationsPath, getProjectAllocationsQuery } from "./getAProjectAllocation";
import { createProjectAllocations, createProjectAllocationsBody, createProjectAllocationsPath } from "./createProjectAllocation";
import { getProjectTimesheetEntries, getProjectTimesheetEntriesPath, getProjectTimesheetEntriesQuery } from "./getProjectTimesheetEntries";
import { getProjectResources, getProjectResourcesQuery } from "./getProjectResources";
import { getProjectTasks, getProjectTasksPath, getProjectTasksQuery } from "./getProjectTasks";
import { createProjectTask, createProjectTaskBody, createProjectTaskPath } from "./createProjectTask";
import { updateProjectTask, updateProjectTaskBody, updateProjectTaskPath } from "./updateProjectTask";
import { getProjectTaskTimeEntries, getProjectTaskTimeEntriesPath, getProjectTaskTimeEntriesQuery } from "./getProjectTaskTimeEntires";
import { addEmployeeTimeEntries, addEmployeeTimeEntriesBody, addEmployeeTimeEntriesPath } from "./addEmployeeTimeEntries";




export function registerPsaTools(server: McpServer, env: Env) {

    // ── GET /psa/clients ─────────────────────────────
  server.tool(
    "getClients",
    "use this tool to Fetch a list of PSA clients with optional filters",
    { query: getClientsQuery },
    async ({ query }) => {
      try {
        const data = await getClients(env, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Error fetching clients: ${e.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── POST /psa/clients ─────────────────────────────
  server.tool(
    "createClient",
    "Use this too to Create a new PSA client",
    { body: createClientBody },
    async ({ body }) => {
      try {
        const data = await createClient(env, body);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error creating client: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/clients/{clientId} ────────────────────
  server.tool(
    "getClient",
    "use this tool to Fetch details of one PSA client by ID",
    { path: getClientPath },
    async ({ path }) => {
      try {
        const data = await getClient(env, path);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Error fetching client: ${e.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── PUT /psa/clients/{clientId}
  server.tool(
    "updateClient",
    "use this tool to Update an existing PSA client",
    {
      path: updateClientPath,
      body: updateClientBody,
    },
    async ({ path, body }) => {
      try {
        const data = await updateClient(env, path, body);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Error updating client: ${e.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/clients/{clientId}/billingroles ─────────────────────────
  server.tool(
    "getBillingRoles",
    "use  this tool to fetch paginated billing roles for a PSA client",
    {
      path:  getBillingRolesPath,
      query: getBillingRolesQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getBillingRoles(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching billing roles: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── PUT /psa/clients/{clientId}/creditnote ─────────────────────
  server.tool(
    "createCreditNote",
    "use this tool to Create or update a credit note for a PSA client",
    {
      path: createCreditNotePath,
      body: createCreditNoteBody,
    },
    async ({ path, body }) => {
      try {
        const data = await createCreditNote(env, path, body);
        return {
          content: [
            { type: "text", text: JSON.stringify(data, null, 2) },
          ],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating credit note: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/clients/{clientId}/invoices ─────────────────────
  server.tool(
    "getInvoices",
    "Fetch paginated list of invoices for a PSA client",
    {
      path:  getInvoicesPath,
      query: getInvoicesQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getInvoices(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching invoices: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /psa/clients/{clientId}/invoices/{invoiceId}/receivepayment ─────────────
  server.tool(
    "post_receivePayment",
    "use this tool Record a payment against a PSA client invoice",
    {
      path: receivePaymentPath,
      body: receivePaymentBody,
    },
    async ({ path, body }) => {
      try {
        const data = await receivePayment(env, path, body);
        return {
          content: [
            { type: "text", text: JSON.stringify(data, null, 2) },
          ],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error recording payment: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/legalentity/{legalEntityId}/taxes ─────────────────────────
  server.tool(
    "getTaxes",
    "Fetch paginated list of tax definitions for a legal entity",
    {
      path:  getTaxesPath,
      query: getTaxesQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getTaxes(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching taxes: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/legalentity/{legalEntityId}/taxgroups ─────────────────────────
  server.tool(
    "getTaxGroups",
    "Fetch paginated list of tax groups for a legal entity",
    {
      path:  getTaxGroupsPath,
      query: getTaxGroupsQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getTaxGroups(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching tax groups: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/projects/{projectId}/phases ─────────────────────────
  server.tool(
    "getProjectPhases",
    "Fetch paginated list of phases for a given PSA project, optionally filtered by last modified timestamp",
    {
      path:  getProjectPhasesPath,
      query: getProjectPhasesQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getProjectPhases(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching project phases: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /psa/projects/{projectId}/phases ───────────────────────
  server.tool(
    "createProjectPhase",
    "Create a new phase under a given PSA project",
    {
      path:  createProjectPhasePath,
      query: createProjectPhaseQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await createProjectPhase(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error creating project phase: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/projects ────────────────────────────────────────
  server.tool(
    "getProjects",
    "use this tool to Fetc list of PSA projects.",
    { query: getProjectsQuery },
    async ({ query }) => {
      try {
        const data = await getProjects(env, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching projects: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /psa/projects ───────────────────────────────────────
  server.tool(
    "createProject",
    "use this tool to Create a new PSA project under a client",
    { body: createProjectBody },
    async ({ body }) => {
      try {
        const data = await createProject(env, body);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (e: any) {
        return { content: [{ type: "text", text: `Error creating project: ${e.message}` }], isError: true };
      }
    }
  );
  //── GET /psa/projects/{id} ───────────────────────────────────
  server.tool(
    "getProjectById",
    "use this tool to Fetch details of one PSA project by ID",
    { path: getProjectByIdPath },
    async ({ path }) => {
      try {
        const data = await getProjectById(env, path);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Error fetching project: ${e.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── PUT /psa/projects/{projectId} ───────────────────────────
  server.tool(
    "updateProject",
    "Update an existing PSA project",
    {
      path: updateProjectPath,
      body: updateProjectBody,
    },
    async ({ path, body }) => {
      try {
        const data = await updateProject(env, path, body);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Error updating project: ${e.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/projects/{projectId}/allocations ─────────────────────────
  server.tool(
    "getProjectAllocations",
    "Fetch paginated allocations for a given PSA project, optionally filtered by last modified timestamp",
    {
      path:  getProjectAllocationsPath,
      query: getProjectAllocationsQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getProjectAllocations(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching allocations: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /psa/projects/{projectId}/allocations ─────────────────────
  server.tool(
    "createProjectAllocations",
    "Create a new allocation for a PSA project",
    {
      path: createProjectAllocationsPath,
      body: createProjectAllocationsBody,
    },
    async ({ path, body }) => {
      try {
        const data = await createProjectAllocations(env, path, body);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating allocation: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/projects/{projectId}/timeentries ─────────────────────
  server.tool(
    "getProjectTimesheetEntries",
    "Fetch paginated time entries for a PSA project, filtered by date range and optional employee IDs",
    {
      path:  getProjectTimesheetEntriesPath,
      query: getProjectTimesheetEntriesQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getProjectTimesheetEntries(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching time entries: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /psa/project/resources ───────────────────────────────
  server.tool(
    "getProjectResources",
    "Fetch paginated list of project resources, optionally filtered by employee IDs",
    { query: getProjectResourcesQuery },
    async ({ query }) => {
      try {
        const data = await getProjectResources(env, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching project resources: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "getProjectTasks",
    "Fetch paginated list of tasks for a given PSA project, optionally filtered by last modified timestamp",
    {
      path:  getProjectTasksPath,
      query: getProjectTasksQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getProjectTasks(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching project tasks: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /psa/projects/{projectId}/tasks ───────────────────────
  server.tool(
    "createProjectTask",
    "Create a new task under a given PSA project",
    {
      path: createProjectTaskPath,
      body: createProjectTaskBody,
    },
    async ({ path, body }) => {
      try {
        const data = await createProjectTask(env, path, body);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error creating project task: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── PUT /psa/projects/{projectId}/tasks/{taskId} ───────────────
  server.tool(
    "updateProjectTask",
    "Update an existing task under a given PSA project",
    { 
        path: updateProjectTaskPath, 
        body: updateProjectTaskBody },
        
    async ({ path, body }) => {
      try {
        const data = await updateProjectTask(env, path, body);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (e: any) {
        return { content: [{ type: "text", text: `Error updating project task: ${e.message}` }], isError: true };
      }
    }
  );

  // ── GET /psa/projects/{projectId}/tasks/{taskId}/timeentries ─────────────────
  server.tool(
    "getProjectTaskTimeEntries",
    "Fetch paginated time entries for a specific task within a PSA project, filtered by date and employee",
    {
      path:  getProjectTaskTimeEntriesPath,
      query: getProjectTaskTimeEntriesQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getProjectTaskTimeEntries(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching time entries: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /psa/employees/{employeeId}/timeentries ──────────────────────────
  server.tool(
    "addEmployeeTimeEntries",
    "Add multiple project-task timesheet entries for an employee",
    {
      path: addEmployeeTimeEntriesPath,
      body: addEmployeeTimeEntriesBody,
    },
    async ({ path, body }) => {
      try {
        const data = await addEmployeeTimeEntries(env, path, body);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (e: any) {
        return { content: [{ type: "text", text: `Error adding time entries: ${e.message}` }], isError: true };
      }
    }
  );


}
