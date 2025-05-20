// src/tools/leave/leaveresponseschemas.ts
import { z } from "zod";

/** ── 1. Leave Types Response ───────────────────────────────────────────────── */
export const leaveTypeSchema = z.object({
  identifier:  z.string().describe("Leave type identifier (UUID)"),
  name:        z.string().describe("Leave type name"),
  description: z.string().describe("Leave type description"),
  isPaid:      z.boolean().describe("Whether this leave is paid")
});

export const leaveTypesResponseSchema = z.object({
  succeeded:    z.boolean().describe("True if the request succeeded"),
  message:      z.string().describe("Optional message"),
  errors:       z.array(z.string()).describe("List of error messages"),
  data:         z.array(leaveTypeSchema).describe("Array of leave type records"),
  pageNumber:   z.number().int().describe("Current page number"),
  pageSize:     z.number().int().describe("Page size"),
  firstPage:    z.string().describe("URL to first page"),
  lastPage:     z.string().describe("URL to last page"),
  totalPages:   z.number().int().describe("Total number of pages"),
  totalRecords: z.number().int().describe("Total records across all pages"),
  nextPage:     z.string().describe("URL to next page"),
  previousPage: z.string().describe("URL to previous page")
});

/** ── 2. Leave Balance Response ─────────────────────────────────────────────── */
const leaveBalanceItemSchema = z.object({
  leaveTypeId:       z.string().describe("Leave type identifier"),
  leaveTypeName:     z.string().describe("Leave type name"),
  accruedAmount:     z.number().describe("Days accrued"),
  consumedAmount:    z.number().describe("Days consumed"),
  availableBalance:  z.number().describe("Days available"),
  annualQuota:       z.number().describe("Annual quota")
});

export const leaveBalanceEntrySchema = z.object({
  employeeIdentifier: z.string().describe("Employee UUID"),
  employeeNumber:     z.string().describe("Employee number"),
  employeeName:       z.string().describe("Employee full name"),
  leaveBalance:       z.array(leaveBalanceItemSchema).describe("Array of leave balance entries")
});

export const leaveBalanceResponseSchema = leaveTypesResponseSchema
  .extend({
    data:        z.array(leaveBalanceEntrySchema).describe("Array of leave-balance records")
  })
  .describe("Response for GET /time/leavebalance");

/** ── 3. Leave Requests Response ────────────────────────────────────────────── */
const durationSchema = z.object({
  unit:           z.number().int().describe("Duration unit enum"),
  duration:       z.number().describe("Numeric duration"),
  durationString: z.string().describe("Human-readable duration")
});

const leaveSelectionSchema = z.object({
  leaveTypeIdentifier: z.string().describe("Leave type ID"),
  leaveTypeName:       z.string().describe("Leave type name"),
  count:               z.number().describe("Number of days"),
  duration:            durationSchema
});

const leaveRequestSchema = z.object({
  id:                 z.string().describe("Request ID"),
  employeeIdentifier: z.string().describe("Employee UUID"),
  employeeNumber:     z.string().describe("Employee number"),
  fromDate:           z.string().describe("ISO start datetime"),
  toDate:             z.string().describe("ISO end datetime"),
  fromSession:        z.number().describe("SessionType from enum"),
  toSession:          z.number().describe("SessionType to enum"),
  requestedOn:        z.string().describe("ISO request creation datetime"),
  note:               z.string().describe("Optional note"),
  cancelRejectReason: z.string().describe("Reason if cancelled/rejected"),
  status:             z.number().describe("Request status enum. LeaveRequestStatus enums are 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Cancelled, 4 = InApprovalProcess"),
  selection:          z.array(leaveSelectionSchema).describe("Array of selections"),
  lastActionTakenOn:  z.string().describe("ISO last action datetime")
});

export const leaveRequestsResponseSchema = leaveTypesResponseSchema
  .extend({
    data: z.array(leaveRequestSchema).describe("Array of leave-request records")
  })
  .describe("Response for GET /time/leaverequests");

/** ── 4. Create Leave Request Response ──────────────────────────────────────── */
export const createLeaveRequestResponseSchema = z.object({
  succeeded: z.boolean().describe("True if the request succeeded"),
  message:   z.string().describe("Optional message"),
  errors:    z.array(z.string()).describe("List of error messages"),
  data:      z.string().describe("New request ID or status string")
}).describe("Response for POST /time/leaverequests");

/** ── 5. Leave Plans Response ───────────────────────────────────────────────── */
const leavePlanSchema = z.object({
  id:   z.string().describe("Leave plan ID"),
  name: z.string().describe("Leave plan name")
});

export const leavePlansResponseSchema = leaveTypesResponseSchema
  .extend({
    data: z.array(leavePlanSchema).describe("Array of leave-plan records")
  })
  .describe("Response for GET /time/leaveplans");
