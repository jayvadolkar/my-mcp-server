// src/tools/payroll/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";

import { getEmployesSalaries, getEmployesSalariesQuery } from "./getAllEmployeesSalaries";
import { getSalaryComponents, getSalaryComponentsParams } from "./getAllSalaryComponents";
import { getPayGroups, getPayGroupsQuery } from "./getAllPayGroups";
import { getPayCycles, getPayCyclesPath, getPayCyclesQuery } from "./getPayAllCycles";
import { getPayRegister, getPayRegisterPath, getPayRegisterQuery } from "./getPayRegister";
import { getPayBatches, getPayBatchesQuery, getPayBatchesPath } from "./getPayBatches";
import { getPayments, getPaymentsPath, getPaymentsQuery } from "./getAllBatchPayments";
import { updatePaymentStatus, updatePaymentStatusBody, updatePaymentStatusPath } from "./updatePaymentStatus";
import { getPayBands, getPayBandsQuery } from "./getPayBands";
import  { getPayGradesQuery, getPayGrades} from "./getPayGrades"
import { getEmployeeFnFDetails ,getEmployeeFnFDetailsQuery } from "./getEmployeeFnFDetails";
import { getBonusTypes, getBonusTypesQuery } from "./getBonusTypes";
import { getFinancialDetails, getFinancialDetailsQuery } from "./getFinancialDetailsofEmployees";
import { getSalaryStructures, getSalaryStructuresQuery } from "./getAllSalaryStructures";
import { addEmployeeSalary, addEmployeeSalaryBody, addEmployeeSalaryPath } from "./addEmployeeSalary";
import { getForm16, getForm16Path, getForm16Query } from "./getform16";
import { updateEmployeeSalary, updateEmployeeSalaryBody, updateEmployeeSalaryPath } from "./reviseEmployeeSalary";
//import { updateAdhocTransactions, updateAdhocTransactionsBody, updateAdhocTransactionsPath } from "./updateAdhocTransactions"; due to API issue

export function registerPayrollTools(server: McpServer, env: Env) {

  // ── GET /payroll/salaries ────────────────────────────────────
  server.tool(
    "getAllEmployeesSalaries",
    "Use this tool to fetch salaries of the employees",
    { query: getEmployesSalariesQuery },
    async ({ query }) => {
      try {
        const data = await getEmployesSalaries(env, query);
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
              text: `Error fetching salaries: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/salarycomponents ────────────────────────────
  server.tool(
    "getSalaryComponents",
    "Fetch the list of all salary components",
    { params: getSalaryComponentsParams },
    async () => {
      try {
        const data = await getSalaryComponents(env);
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
              text: `Error fetching salary components: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/paygroups ───────────────────────────────────
  server.tool(
    "getPayGroups",
    "Fetch paginated list of paygroups",
    { query: getPayGroupsQuery },
    async ({ query }) => {
      try {
        const data = await getPayGroups(env, query);
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
              text: `Error fetching paygroups: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/paygroups/{paygroupId}/paycycles ───────────────
  server.tool(
    "getPayCycles",
    "Fetch paginated pay cycles for a given paygroup, month & year",
    {
      path:  getPayCyclesPath,
      query: getPayCyclesQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getPayCycles(env, path, query);
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
              text: `Error fetching pay cycles: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/paygroups/{paygroupId}/paycycles/{paycycleId}/payregister ─────
  server.tool(
    "getPayRegister",
    "Fetch paginated pay register for a given paygroup and paycycle",
    {
      path:  getPayRegisterPath,
      query: getPayRegisterQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getPayRegister(env, path, query);
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
              text: `Error fetching pay register: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/paygroups/{paygroupId}/paycycles/{paycycleId}/paybatches ─────
  server.tool(
    "getPayBatches",
    "Fetch paginated pay batches for a given paygroup and paycycle",
    {
      path: getPayBatchesPath,
      query: getPayBatchesQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getPayBatches(env, path, query);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching pay batches: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/paygroups/{paygroupId}/paycycles/{paycycleId}/paybatches/{paybatchId}/payments ─────
  server.tool(
    "getPaymentsBAtches",
    "use this tool to get pay batches",
    {
      path:  getPaymentsPath,
      query: getPaymentsQuery,
    },
    async ({ path, query }) => {
      try {
        const data = await getPayments(env, path, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(data, null, 2) },
          ],
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching payments: ${e.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  // ── PUT /payroll/paygroups/{paygroupId}/paycycles/{paycycleId}/paybatches/{paybatchId}/payments ─────
  server.tool(
    "updatePaymentsStatus",
    "use this tool to Bulk‐update payment statuses for a specific paybatch",
    {
      path: updatePaymentStatusPath,
      body: updatePaymentStatusBody,
    },
    async ({ path, body }) => {
      try {
        const data = await updatePaymentStatus(env, path, body);
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
              text: `Error updating payments: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

   // ── GET /payroll/paybands ───────────────────────────────────
  server.tool(
    "getPayBands",
    "Fetch paginated list of pay bands",
    { query: getPayBandsQuery },
    async ({ query }) => {
      try {
        const data = await getPayBands(env, query);
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
              text: `Error fetching pay bands: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/paygrades ──────────────────────────────────
  server.tool(
    "getPayGrades",
    "Fetch paginated list of pay grades",
    { query: getPayGradesQuery },
    async ({ query }) => {
      try {
        const data = await getPayGrades(env, query);
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
              text: `Error fetching pay grades: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/employees/fnf ─────────────────────────────────
  server.tool(
    "getFnf",
    "Fetch paginated full-and-final (F&F) settlement details for employees",
    { query: getEmployeeFnFDetailsQuery },
    async ({ query }) => {
      try {
        const data = await getEmployeeFnFDetails(env, query);
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
              text: `Error fetching F&F details: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/bonustypes ───────────────────────────────────
  server.tool(
    "getBonusTypes",
    "Fetch paginated list of bonus types",
    { query: getBonusTypesQuery },
    async ({ query }) => {
      try {
        const data = await getBonusTypes(env, query);
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
              text: `Error fetching bonus types: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/employees/financialdetails ───────────────────
  server.tool(
    "getFinancialDetails",
    "Fetch paginated financial details for one or more employees",
    { query: getFinancialDetailsQuery },
    async ({ query }) => {
      try {
        const data = await getFinancialDetails(env, query);
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
              text: `Error fetching financial details: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── GET /payroll/salarystructures ────────────────────────────
  server.tool(
    "getSalaryStructures",
    "Fetch paginated salary structures filtered by pay-group",
    { query: getSalaryStructuresQuery },
    async ({ query }) => {
      try {
        const data = await getSalaryStructures(env, query);
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
              text: `Error fetching salary structures: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── POST /payroll/employees/{employeeId}/salary ────────────────
  server.tool(
    "addEmployeeSalary",
    "Create or update an employee's salary and bonus configuration",
    {
      path: addEmployeeSalaryPath,
      body: addEmployeeSalaryBody,
    },
    async ({ path, body }) => {
      try {
        const data = await addEmployeeSalary(env, path, body);
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
              text: `Error setting employee salary: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
  // ── PUT /payroll/employees/{employeeId}/salary ────────────────
  server.tool(
    "updateEmployeeSalary",
    "Revise an existing employee salary and bonus configuration",
    {
      path: updateEmployeeSalaryPath,
      body: updateEmployeeSalaryBody,
    },
    async ({ path, body }) => {
      try {
        const data = await updateEmployeeSalary(env, path, body);
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
              text: `Error revising employee salary: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );



  // ── GET /payroll/employees/{employeeId}/form16 ───────────────
  server.tool(
    "getForm16",
    "Retrieve Form 16 for an employee for a given legal entity and financial year",
    {
      path:  getForm16Path,
      query: getForm16Query,
    },
    async ({ path, query }) => {
      try {
        const data = await getForm16(env, path, query);
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
              text: `Error fetching Form16: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
  // ── PUT /payroll/paygroups/{paygroupId}/paycycles/{paycycleId}/adhoctransactions ─────────────
  /* due to API Issue
  
  server.tool(
    "updateAdhocTransactions",
    "Apply bulk ad-hoc transactions for a paycycle",
    {
      path: updateAdhocTransactionsPath,
      body: updateAdhocTransactionsBody,
    },
    async ({ path, body }) => {
      try {
        const data = await updateAdhocTransactions(env, path, body);
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
              text: `Error applying ad-hoc transactions: ${e.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
  */
}




