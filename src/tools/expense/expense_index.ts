// src/tools/expense/expense_index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";

import { getEmployeeExpenses, getEmployeeExpensesParams, getEmployeeExpensesQuery } from "./getEmployeeExpenses";
import { addEmployeeExpense, addEmployeeExpenseParams } from "./addEmployeeExpense";
import { updateEmployeeExpense, updateEmployeeExpenseParams } from "./updateEmployeeExpense";
import { getExpenseAttachmentDownloadUrl, getExpenseAttachmentDownloadUrlParams } from "./getExpenseAttachmentDownloadUrl";
import { getExpenseCategories, getExpenseCategoriesQuery } from "./getExpenseCategories";
import { getAdvanceRequests, getAdvanceRequestsQuery } from "./getAdvanceRequests";
import { updateAdvanceStatus, updateAdvanceStatusParams } from "./updateAdvanceStatus";
import { getExpenseClaims, getExpenseClaimsQuery } from "./getExpenseClaims";
import { updateExpenseClaimPaymentStatus, updateExpenseClaimPaymentStatusParams, updateExpenseClaimPaymentStatusBody } from "./updateExpenseClaimPaymentStatus";
import { getExpensePolicies, getExpensePoliciesQuery } from "./getExpensePolicies";

export function registerExpenseTools(server: McpServer, env: Env) {
  // GET /expense/employees/{employeeId}/expenses
  server.tool(
    "getEmployeeExpenses",
    "Use this tool to get all expenses for an employee",
    {
      employeeId: getEmployeeExpensesParams.shape.employeeId,
      query: getEmployeeExpensesQuery
    },
    async ({ employeeId, query }) => {
      try {
        const expenses = await getEmployeeExpenses(env, employeeId, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(expenses, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching employee expenses: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // POST /expense/employees/{employeeId}/expenses
  server.tool(
    "addEmployeeExpense",
    "Use this tool to add a new expense for an employee",
    {
      employeeId: addEmployeeExpenseParams.shape.employeeId
    },
    async ({ employeeId }) => {
      try {
        const result = await addEmployeeExpense(env, employeeId);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error adding employee expense: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // PUT /expense/employees/{employeeId}/expenses/{expenseId}
  server.tool(
    "updateEmployeeExpense",
    "Use this tool to update an existing expense for an employee",
    {
      employeeId: updateEmployeeExpenseParams.shape.employeeId,
      expenseId: updateEmployeeExpenseParams.shape.expenseId
    },
    async ({ employeeId, expenseId }) => {
      try {
        const result = await updateEmployeeExpense(env, employeeId, expenseId);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error updating employee expense: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // GET /expense/{expenseId}/attachment/{attachmentId}
  server.tool(
    "getExpenseAttachmentDownloadUrl",
    "Use this tool to get the download URL for an expense attachment",
    {
      expenseId: getExpenseAttachmentDownloadUrlParams.shape.expenseId,
      attachmentId: getExpenseAttachmentDownloadUrlParams.shape.attachmentId
    },
    async ({ expenseId, attachmentId }) => {
      try {
        const url = await getExpenseAttachmentDownloadUrl(env, expenseId, attachmentId);
        return {
          content: [
            { type: "text", text: JSON.stringify(url, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching expense attachment URL: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // GET /expense/categories
  server.tool(
    "getExpenseCategories",
    "Use this tool to get all expense categories",
    {
      query: getExpenseCategoriesQuery
    },
    async ({ query }) => {
      try {
        const categories = await getExpenseCategories(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(categories, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching expense categories: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // GET /traveldesk/advancerequests
  server.tool(
    "getAdvanceRequests",
    "Use this tool to fetch advance requests",
    {
      query: getAdvanceRequestsQuery
    },
    async ({ query }) => {
      try {
        const advances = await getAdvanceRequests(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(advances, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching advance requests: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // PUT /traveldesk/advancerequests/{advanceId}
  server.tool(
    "updateAdvanceStatus",
    "Use this tool to update advance request status",
    {
      advanceId: updateAdvanceStatusParams.shape.advanceId
    },
    async ({ advanceId }) => {
      try {
        const result = await updateAdvanceStatus(env, advanceId);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error updating advance status: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // GET /expense/claims
  server.tool(
    "getExpenseClaims",
    "Use this tool to get all expense claims",
    {
      query: getExpenseClaimsQuery
    },
    async ({ query }) => {
      try {
        const claims = await getExpenseClaims(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(claims, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching expense claims: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // PUT /expense/claims/{id}
  server.tool(
    "updateExpenseClaimPaymentStatus",
    "Use this tool to update expense claim payment status",
    {
      id: updateExpenseClaimPaymentStatusParams.shape.id,
      body: updateExpenseClaimPaymentStatusBody
    },
    async ({ id, body }) => {
      try {
        const result = await updateExpenseClaimPaymentStatus(env, id, body);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error updating expense claim payment status: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // GET /expensepolicies
  server.tool(
    "getExpensePolicies",
    "Use this tool to get all expense policies",
    {
      query: getExpensePoliciesQuery
    },
    async ({ query }) => {
      try {
        const policies = await getExpensePolicies(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(policies, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching expense policies: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
}