// src/tools/pms/pmsResponseSchemas.ts
import { z } from 'zod';

// Enums
export const TimeFrameStatus = z.enum([
 "Active",
 "Hidden"
]).describe("Status of a time frame. Active=0, Hidden=1");

export const Frequency = z.enum([
 "Daily",
 "Weekly",
 "Monthly",
 "Quarterly",
 "HalfYearly",
 "Yearly",
 "Custom"
]).describe("Frequency of time frames. Daily=0, Weekly=1, Monthly=2, Quarterly=3, HalfYearly=4, Yearly=5, Custom=6");

export const GoalStatus = z.enum([
 "NotStarted",
 "OnTrack",
 "NeedAttention",
 "AtRisk",
 "Closed"
]).describe("Status of a goal. NotStarted=0, OnTrack=1, NeedAttention=2, AtRisk=3, Closed=4");

export const GoalMetricType = z.enum([
 "Percentage",
 "Checkbox",
 "Number"
]).describe("Type of goal metric. Percentage=0, Checkbox=1, Number=3");

export const GoalType = z.enum([
 "Individual",
 "Company",
 "Group"
]).describe("Type of goal. Individual=0, Company=1, Group=2");

export const BadgeStatus = z.enum([
 "Enabled",
 "Disabled"
]).describe("Status of a badge. Enabled=0, Disabled=1");

export const ReviewStatus = z.enum([
 "NotStarted",
 "Nominating",
 "InNominationApproval",
 "InProgress",
 "InCalibration",
 "Finalized",
 "Cancelled",
 "CalibrationInitiated",
 "CalibrationCompleted",
 "WritingReviewSummary",
 "AwaitingForRelease",
 "Completed",
 "Released"
]).describe("Status of a review. NotStarted=0, Nominating=1, InNominationApproval=2, InProgress=3, InCalibration=4, Finalized=5, Cancelled=6, CalibrationInitiated=7, CalibrationCompleted=8, WritingReviewSummary=9, AwaitingForRelease=10, Completed=11, Released=12");

// Common schemas
export const apiEmployeeLookupSchema = z.object({
 id: z.string().nullable().describe("Unique identifier of the employee"),
 employeeNumber: z.string().nullable().describe("Employee number/code in the HR system"),
 employeeName: z.string().nullable().describe("Full name of the employee")
}).describe("Employee lookup information used in various PMS contexts");

export const apiBadgeLookupSchema = z.object({
 id: z.string().nullable().describe("Unique identifier of the badge"),
 name: z.string().nullable().describe("Name of the badge")
}).describe("Badge reference information for praise");

export const apiTimeFrameSchema = z.object({
 id: z.string().nullable().describe("Unique identifier of the time frame"),
 name: z.string().nullable().describe("Name of the time frame (e.g., 'Q1 2024', 'Annual 2024')"),
 frequency: z.number().int().describe("Frequency type: 0=Daily, 1=Weekly, 2=Monthly, 3=Quarterly, 4=HalfYearly, 5=Yearly, 6=Custom"),
 startDate: z.string().describe("ISO 8601 date when the time frame starts"),
 endDate: z.string().describe("ISO 8601 date when the time frame ends"),
 isClosed: z.boolean().describe("Whether the time frame is closed for new goals"),
 isLocked: z.boolean().describe("Whether the time frame is locked from edits"),
 status: z.number().int().describe("Status: 0=Active, 1=Hidden")
}).describe("Time frame for goals and performance cycles");

export const apiBaseGoalSchema = z.object({
 id: z.string().nullable().describe("Unique identifier of the goal"),
 employeeId: z.string().nullable().describe("UUID of the employee who owns this goal"),
 employeeNumber: z.string().nullable().describe("Employee number of the goal owner"),
 timeFrameId: z.string().nullable().describe("UUID of the associated time frame"),
 name: z.string().nullable().describe("Name/title of the goal"),
 description: z.string().nullable().describe("Detailed description of the goal"),
 startDate: z.string().describe("ISO 8601 date when the goal period starts"),
 endDate: z.string().describe("ISO 8601 date when the goal period ends"),
 initialValue: z.number().describe("Starting value for measurement"),
 targetValue: z.number().describe("Target value to achieve"),
 currentValue: z.number().describe("Current progress value"),
 progress: z.number().describe("Progress percentage (0-100)"),
 metricType: z.number().int().describe("Metric type: 0=Percentage, 1=Checkbox, 3=Number"),
 status: z.number().int().describe("Goal status: 0=NotStarted, 1=OnTrack, 2=NeedAttention, 3=AtRisk, 4=Closed"),
 tags: z.array(z.string()).nullable().describe("Tags/labels associated with the goal"),
 type: z.number().int().describe("Goal type: 0=Individual, 1=Company, 2=Group"),
 departmentId: z.string().nullable().describe("UUID of the department (for group goals)")
}).describe("Base goal information without hierarchy");

export const apiGoalSchema = apiBaseGoalSchema.extend({
 parentGoal: apiBaseGoalSchema.nullable().describe("Parent goal if this is a child goal"),
 childGoals: z.array(apiBaseGoalSchema).nullable().describe("Child goals aligned to this goal"),
 isPrivate: z.boolean().describe("Whether this goal is private to the employee")
}).describe("Complete goal information including parent-child relationships");

export const apiBadgeSchema = z.object({
 id: z.string().nullable().describe("Unique identifier of the badge"),
 name: z.string().nullable().describe("Name of the badge"),
 description: z.string().nullable().describe("Description of what the badge represents"),
 status: z.number().int().describe("Badge status: 0=Enabled, 1=Disabled")
}).describe("Badge definition for employee recognition");

export const apiPraiseSchema = z.object({
 id: z.string().nullable().describe("Unique identifier of the praise"),
 feedback: z.string().nullable().describe("Feedback/message given with the praise"),
 badge: apiBadgeLookupSchema.describe("Badge associated with this praise"),
 employees: z.array(apiEmployeeLookupSchema).nullable().describe("Employees who received the praise"),
 givenBy: apiEmployeeLookupSchema.describe("Employee who gave the praise"),
 givenOn: z.string().describe("ISO 8601 timestamp when praise was given")
}).describe("Employee praise/recognition record");

export const apiReviewGroupSchema = z.object({
 id: z.string().nullable().describe("Unique identifier of the review group"),
 cycleId: z.string().nullable().describe("UUID of the associated review cycle"),
 name: z.string().nullable().describe("Name of the review group")
}).describe("Review group within a review cycle");

export const apiReviewCycleSchema = z.object({
 id: z.string().nullable().describe("Unique identifier of the review cycle"),
 name: z.string().nullable().describe("Name of the review cycle"),
 startDate: z.string().describe("ISO 8601 date when the review cycle starts")
}).describe("Performance review cycle information");

export const apiReviewRatingSchema = z.object({
 ratingId: z.string().nullable().describe("Unique identifier of the rating dimension"),
 name: z.string().nullable().describe("Name of the rating dimension (e.g., 'Communication', 'Technical Skills')"),
 rating: z.number().nullable().describe("Numerical rating value")
}).describe("Individual rating within a performance review");

export const apiEmployeeReviewSchema = z.object({
 id: z.string().nullable().describe("Unique identifier of the employee review"),
 employeeId: z.string().nullable().describe("UUID of the employee being reviewed"),
 reviewGroupId: z.string().uuid().describe("UUID of the review group"),
 reviewCycleId: z.string().uuid().describe("UUID of the review cycle"),
 summary: z.string().nullable().describe("Overall review summary/comments"),
 ratings: z.array(apiReviewRatingSchema).nullable().describe("Individual ratings for different dimensions"),
 status: z.number().int().describe("Review status: 0=NotStarted through 12=Released")
}).describe("Complete employee performance review");

// Request/Response schemas
export const apiUpdateGoalProgressSchema = z.object({
 currentValue: z.number().describe("Updated current value of the goal"),
 status: z.number().int().describe("Updated goal status: 0=NotStarted, 1=OnTrack, 2=NeedAttention, 3=AtRisk, 4=Closed"),
 updatedBy: z.string().describe("UUID of the user updating the goal"),
 note: z.string().nullable().optional().describe("Optional note about the progress update")
}).describe("Request body for updating goal progress");

export const addPraiseSchema = z.object({
 employeeIds: z.array(z.string()).describe("Array of employee UUIDs to receive the praise"),
 feedback: z.string().describe("Feedback message for the praise"),
 badgeId: z.string().describe("UUID of the badge to award"),
 givenBy: z.string().describe("UUID of the employee giving the praise")
}).describe("Request body for adding new praise");

// Response wrappers
export const stringResponseSchema = z.object({
 succeeded: z.boolean().describe("Indicates if the API request was successful"),
 message: z.string().nullable().describe("Human-readable message about the operation result"),
 errors: z.array(z.string()).nullable().describe("List of error messages if the request failed"),
 data: z.string().nullable().describe("String data returned by the API (e.g., created record ID)")
}).describe("API response wrapper for string data");

export const booleanResponseSchema = z.object({
 succeeded: z.boolean().describe("Indicates if the API request was successful"),
 message: z.string().nullable().describe("Human-readable message about the operation result"),
 errors: z.array(z.string()).nullable().describe("List of error messages if the request failed"),
 data: z.boolean().describe("Boolean result of the operation")
}).describe("API response wrapper for boolean results");

const paginationWrapper = <T extends z.ZodTypeAny>(item: T, description: string) =>
 z.object({
   succeeded: z.boolean().describe("Indicates if the API request was successful"),
   message: z.string().nullable().describe("Human-readable message about the operation result"),
   errors: z.array(z.string()).nullable().describe("List of error messages if the request failed"),
   data: z.array(item).nullable().describe("Array of items for the current page"),
   pageNumber: z.number().int().describe("Current page number (1-based)"),
   pageSize: z.number().int().describe("Number of items per page"),
   firstPage: z.string().nullable().describe("URL to fetch the first page of results"),
   lastPage: z.string().nullable().describe("URL to fetch the last page of results"),
   totalPages: z.number().int().describe("Total number of pages available"),
   totalRecords: z.number().int().describe("Total number of records across all pages"),
   nextPage: z.string().nullable().describe("URL to fetch the next page (null if on last page)"),
   previousPage: z.string().nullable().describe("URL to fetch the previous page (null if on first page)")
 }).describe(description);

export const apiTimeFramePagedResponseSchema = paginationWrapper(
 apiTimeFrameSchema,
 "Paginated response containing time frames with navigation links"
);

export const apiGoalPagedResponseSchema = paginationWrapper(
 apiGoalSchema,
 "Paginated response containing goals with full hierarchy and navigation links"
);

export const apiBadgePagedResponseSchema = paginationWrapper(
 apiBadgeSchema,
 "Paginated response containing badges with navigation links"
);

export const apiPraisePagedResponseSchema = paginationWrapper(
 apiPraiseSchema,
 "Paginated response containing praise records with navigation links"
);

export const apiReviewGroupPagedResponseSchema = paginationWrapper(
 apiReviewGroupSchema,
 "Paginated response containing review groups with navigation links"
);

export const apiReviewCyclePagedResponseSchema = paginationWrapper(
 apiReviewCycleSchema,
 "Paginated response containing review cycles with navigation links"
);

export const apiEmployeeReviewPagedResponseSchema = paginationWrapper(
 apiEmployeeReviewSchema,
 "Paginated response containing employee reviews with navigation links"
);