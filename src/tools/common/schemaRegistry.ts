// src/tools/common/schemaRegistry.ts
import { z, ZodSchema } from "zod";

import * as leave from "../leave/leaveresponseschemas";
import * as document from "../document/documentResponseSchemas";
import * as corehrm from "../corehr/corehrResponseSchemas";
import * as attend from "../attendance/attendanceResponseSchemas"
import * as payroll from "../payroll/payrollResponseSchemas"
import * as psa from "../psa/psaResponseSchema"
import * as expense from "../expense/expenseResponseSchemas"
import * as pms from "../pms/pmsResponseSchemas"

const registry: Record<string, ZodSchema> = {
  //leave
  leaveTypesResponse:           leave.leaveTypesResponseSchema,
  leaveBalanceResponse:         leave.leaveBalanceResponseSchema,
  leaveRequestsResponse:        leave.leaveRequestsResponseSchema,
  createLeaveRequestResponse:   leave.createLeaveRequestResponseSchema,
  leavePlansResponse:           leave.leavePlansResponseSchema,

  // Document
  documentTypesResponse:        document.documentTypesResponseSchema,
  documentAttachmentResponse:   document.EmployeeDocumentAttachmentDownloadUrlResponseSchema,
  documentListResponse:         document.documentListResponseSchema,
  createDocumentResponse:       document.createDocumentResponseSchema,

  //corehr
  employeesListResponse:        corehrm.employeesListResponseSchema,
  createEmployeeResponse:       corehrm.createEmployeeResponseSchema,
  employeeDetailResponse:       corehrm.employeeDetailResponseSchema,
  updatePersonalDetailsResponse: corehrm.updatePersonalDetailsResponseSchema,
  updateJobDetailsResponse:     corehrm.updateJobDetailsResponseSchema,
  updateFieldsResponse:         corehrm.updateFieldsResponseSchema,
  groupsResponse:               corehrm.groupsResponseSchema,
  groupTypesResponse:           corehrm.groupTypesResponseSchema,
  departmentsResponse:          corehrm.departmentsResponseSchema,
  locationsResponse:            corehrm.locationsResponseSchema,
  jobTitlesResponse:            corehrm.jobTitlesResponseSchema,
  currenciesResponse:           corehrm.currenciesResponseSchema,
  noticePeriodsResponse:        corehrm.noticePeriodsResponseSchema,
  contingentTypesResponse:      corehrm.contingentTypesResponseSchema,
  exitRequestResponse:          corehrm.exitRequestResponseSchema,
  exitReasonsResponse:          corehrm.exitReasonsResponseSchema,

  // time-based
  attendanceListResponse:         attend.attendanceListResponseSchema,
  captureSchemeResponse:          attend.captureSchemeResponseSchema,
  shiftPoliciesResponse:          attend.shiftPoliciesResponseSchema,
  penalisationPoliciesResponse:   attend.penalisationPoliciesResponseSchema,
  weeklyOffPoliciesResponse:      attend.weeklyOffPoliciesResponseSchema,
  holidaysResponse:               attend.holidaysResponseSchema,
  holidaysCalendarResponse:       attend.holidaysCalendarResponseSchema,
  odResponse:                     attend.odResponseSchema,
  wfhResponse:                    attend.wfhResponseSchema,
  createTimeEntryResponse:        attend.createTimeEntryResponseSchema,

  // payroll
  salariesResponse:                  payroll.salariesResponseSchema,
  salaryComponentsResponse:          payroll.salaryComponentsResponseSchema,
  payGroupsResponse:                 payroll.payGroupsResponseSchema,
  payCyclesResponse:                 payroll.payCyclesResponseSchema,
  payRegisterResponse:               payroll.payRegisterResponseSchema,
  payBatchesResponse:                payroll.payBatchesResponseSchema,
  paymentsResponse:                  payroll.paymentsResponseSchema,
  updatePaymentsResponse:            payroll.updatePaymentsResponseSchema,
  payBandsResponse:                  payroll.payBandsResponseSchema,
  payGradesResponse:                 payroll.payGradesResponseSchema,
  fnfResponse:                       payroll.fnfResponseSchema,
  bonusTypesResponse:                payroll.bonusTypesResponseSchema,
  financialDetailsResponse:          payroll.financialDetailsResponseSchema,
  salaryStructuresResponse:          payroll.salaryStructuresResponseSchema,
  createSalaryResponse:              payroll.createSalaryResponseSchema,
  updateSalaryResponse:              payroll.updateSalaryResponseSchema,
  form16Response:                    payroll.form16ResponseSchema,
  adhocTransactionsResponse:         payroll.adhocTransactionsResponseSchema,

  // PSA
  getClientsResponse:                 psa.getClientsResponseSchema,
  createClientResponse:              psa.createClientResponseSchema,
  getClientResponse:                 psa.getClientResponseSchema,
  updateClientResponse:              psa.updateClientResponseSchema,
  getBillingRolesResponse:           psa.getBillingRolesResponseSchema,
  createCreditNoteResponse:          psa.createCreditNoteResponseSchema,
  getInvoicesResponse:               psa.getInvoicesResponseSchema,
  receivePaymentResponse:            psa.receivePaymentResponseSchema,
  getTaxesResponse:                  psa.getTaxesResponseSchema,
  getTaxGroupsResponse:              psa.getTaxGroupsResponseSchema,
  getProjectPhasesResponse:          psa.getProjectPhasesResponseSchema,
  createProjectPhaseResponse:        psa.createProjectPhaseResponseSchema,
  getProjectsResponse:               psa.getProjectTasksResponseSchema,
  createProjectResponse:             psa.createProjectResponseSchema,
  getProjectByIdResponse:            psa.getProjectByIdResponseSchema,
  updateProjectResponse:             psa.updateProjectResponseSchema,
  getAllocationsResponse:            psa.getAllocationsResponseSchema,
  createAllocationResponse:          psa.createAllocationResponseSchema,
  getProjectTimeEntriesResponse:     psa.getProjectTimeEntriesResponseSchema,
  getProjectResourcesResponse:       psa.getProjectResourcesResponseSchema,
  getProjectTasksResponse:           psa.getProjectTasksResponseSchema,
  createProjectTaskResponse:         psa.createProjectTaskResponseSchema,
  updateProjectTaskResponse:         psa.updateProjectTaskResponseSchema,
  getProjectTaskTimeEntriesResponse: psa.getProjectTaskTimeEntriesResponseSchema,

  // expense
  expenseCategoriesResponse:       expense.expenseCategoryPagedResponseSchema,
  expenseClaimsResponse:           expense.expenseClaimPagedResponseSchema,
  expensePoliciesResponse:         expense.apiLookupPagedResponseSchema,
  advanceRequestsResponse:         expense.advancesRequestDtoResponseSchema,
  expenseAttachmentUrlResponse:    expense.documentFileUrlResponseSchema,
  stringResponse:                  expense.stringResponseSchema,
  booleanResponse:                 expense.booleanResponseSchema,
  expenseSchema:                   expense.expenseSchema,
  expenseCategorySchema:           expense.expenseCategorySchema,
  expenseClaimSchema:              expense.expenseClaimSchema,
  advanceExpenseSchema:            expense.advanceExpenseSchema,
  advancesRequestSchema:           expense.advancesRequestSchema,
  linkedEntitySchema:              expense.linkedEntitySchema,
  customFieldSchema:               expense.customFieldSchema,
  fileAttachmentSchema:            expense.fileAttachmentSchema,
  expenseClaimApprovalStatus:      expense.ExpenseClaimApprovalStatus,
  expenseLinkableEntityType:       expense.ExpenseLinkableEntityType,
  expenseType:                     expense.ExpenseType,
  expenseClaimPaymentStatus:       expense.ExpenseClaimPaymentStatus,
  expenseRequestStatus:            expense.ExpenseRequestStatus,
  expenseBookingStatus:            expense.ExpenseBookingStatus,
  fieldType:                       expense.FieldType,
  expenseClaimUpdateDto:           expense.expenseClaimUpdateDtoSchema,

  // pms (Performance Management System)
  timeFramesResponse:               pms.apiTimeFramePagedResponseSchema,
  goalsResponse:                    pms.apiGoalPagedResponseSchema,
  updateGoalProgressResponse:       pms.booleanResponseSchema,
  badgesResponse:                   pms.apiBadgePagedResponseSchema,
  praiseResponse:                   pms.apiPraisePagedResponseSchema,
  addPraiseResponse:                pms.stringResponseSchema,
  reviewGroupsResponse:             pms.apiReviewGroupPagedResponseSchema,
  reviewCyclesResponse:             pms.apiReviewCyclePagedResponseSchema,
  reviewsResponse:                  pms.apiEmployeeReviewPagedResponseSchema,
  timeFrameSchema:                  pms.apiTimeFrameSchema,
  baseGoalSchema:                   pms.apiBaseGoalSchema,
  goalSchema:                       pms.apiGoalSchema,
  badgeSchema:                      pms.apiBadgeSchema,
  praiseSchema:                     pms.apiPraiseSchema,
  reviewGroupSchema:                pms.apiReviewGroupSchema,
  reviewCycleSchema:                pms.apiReviewCycleSchema,
  employeeReviewSchema:             pms.apiEmployeeReviewSchema,
  reviewRatingSchema:               pms.apiReviewRatingSchema,
  employeeLookupSchema:             pms.apiEmployeeLookupSchema,
  badgeLookupSchema:                pms.apiBadgeLookupSchema,
  timeFrameStatus:                  pms.TimeFrameStatus,
  frequency:                        pms.Frequency,
  goalStatus:                       pms.GoalStatus,
  goalMetricType:                   pms.GoalMetricType,
  goalType:                         pms.GoalType,
  badgeStatus:                      pms.BadgeStatus,
  reviewStatus:                     pms.ReviewStatus,
  updateGoalProgressDto:            pms.apiUpdateGoalProgressSchema,
  addPraiseDto:                     pms.addPraiseSchema,

};

export const schemaRegistryParams = z.object({
  key: z.string().describe(
    "One of: " + Object.keys(registry).join(", ")
  )
});

export async function getSchema(
  _env: unknown,
  { key }: z.infer<typeof schemaRegistryParams>
) {
  const schema = registry[key];
  if (!schema) throw new Error(`Unknown schema key: ${key}`);
  return {
    name:        key,
    description: schema.description,
    shape:       (schema as any)._def
  };
}
