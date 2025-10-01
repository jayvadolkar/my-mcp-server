// src/tools/expense/expenseResponseSchemas.ts
import { z } from 'zod';

// Enums
export const ExpenseClaimApprovalStatus = z.enum([
  "None",
  "Pending", 
  "Submitted",
  "Approved",
  "Rejected",
  "Paid",
  "InApprovalProcess"
]).describe("Approval status of an expense claim. None=0, Pending=1, Submitted=2, Approved=3, Rejected=4, Paid=5, InApprovalProcess=6");

export const ExpenseLinkableEntityType = z.enum([
  "None",
  "Project",
  "CostCenter"
]).describe("Type of entity that can be linked to an expense. None=0, Project=1, CostCenter=2");

export const ExpenseType = z.enum([
  "None",
  "General",
  "Mileage",
  "PerDiem",
  "AirTravel",
  "Accommodation",
  "LocalConveyance",
  "CashAdvance"
]).describe("Type/category of expense. None=0, General=1, Mileage=2, PerDiem=3, AirTravel=4, Accommodation=5, LocalConveyance=6, CashAdvance=7");

export const ExpenseClaimPaymentStatus = z.enum([
  "None",
  "Pending",
  "Paid"
]).describe("Payment status of an expense claim. None=0, Pending=1, Paid=2");

export const ExpenseRequestStatus = z.enum([
  "None",
  "Pending",
  "Submitted",
  "Rejected",
  "Approved"
]).describe("Status of an individual expense request. None=0, Pending=1, Submitted=2, Rejected=3, Approved=4");

export const ExpenseBookingStatus = z.enum([
  "None",
  "Pending",
  "Confirmed",
  "Rejected"
]).describe("Booking status for travel-related expenses. None=0, Pending=1, Confirmed=2, Rejected=3");

export const FieldType = z.enum([
  "Text",
  "Number",
  "Date",
  "Boolean",
  "Select",
  "MultiSelect",
  "Email",
  "Phone",
  "URL",
  "TextArea",
  "Currency",
  "Percentage",
  "File",
  "Time",
  "Custom"
]).describe("Type of form field. Text=0, Number=1, Date=2, Boolean=3, Select=4, MultiSelect=5, Email=6, Phone=7, URL=8, TextArea=9, Currency=10, Percentage=11, File=12, Time=13, Custom=100");

// Helper to convert enum to number
const enumToNumber = {
  ExpenseClaimApprovalStatus: { None: 0, Pending: 1, Submitted: 2, Approved: 3, Rejected: 4, Paid: 5, InApprovalProcess: 6 },
  ExpenseLinkableEntityType: { None: 0, Project: 1, CostCenter: 2 },
  ExpenseType: { None: 0, General: 1, Mileage: 2, PerDiem: 3, AirTravel: 4, Accommodation: 5, LocalConveyance: 6, CashAdvance: 7 },
  ExpenseClaimPaymentStatus: { None: 0, Pending: 1, Paid: 2 },
  ExpenseRequestStatus: { None: 0, Pending: 1, Submitted: 2, Rejected: 3, Approved: 4 },
  ExpenseBookingStatus: { None: 0, Pending: 1, Confirmed: 2, Rejected: 3 },
  FieldType: { Text: 0, Number: 1, Date: 2, Boolean: 3, Select: 4, MultiSelect: 5, Email: 6, Phone: 7, URL: 8, TextArea: 9, Currency: 10, Percentage: 11, File: 12, Time: 13, Custom: 100 }
};

// Common schemas
export const customFieldSchema = z.object({
  id: z.string().nullable().describe("Unique identifier for the custom field"),
  title: z.string().nullable().describe("Display name of the custom field"),
  value: z.string().nullable().describe("Value stored in this custom field")
}).describe("Custom field data attached to an expense record");

export const linkedEntitySchema = z.object({
  id: z.string().nullable().describe("Unique identifier of the linked entity (project/cost center)"),
  name: z.string().nullable().describe("Display name of the linked entity"),
  entityType: z.number().int().describe("Type of linked entity: 0=None, 1=Project, 2=CostCenter")
}).describe("Entity (project or cost center) linked to this expense for accounting purposes");

export const documentAttachmentSchema = z.object({
  id: z.string().nullable().describe("Unique identifier of the document attachment"),
  name: z.string().nullable().describe("Filename of the attached document")
}).describe("Reference to a document attached to an expense");

export const fileAttachmentSchema = z.object({
  id: z.number().int().describe("Sequential identifier for the file attachment"),
  identifier: z.string().nullable().describe("Unique string identifier for the file"),
  fileId: z.string().uuid().nullable().describe("UUID of the file in the storage system"),
  location: z.string().nullable().describe("Storage location path of the file"),
  size: z.number().describe("File size in bytes"),
  contentType: z.string().nullable().describe("MIME type of the file (e.g., image/jpeg, application/pdf)"),
  name: z.string().nullable().describe("Original filename uploaded by the user"),
  uploadedBy: z.string().nullable().describe("Name or ID of the user who uploaded the file"),
  uploadedOn: z.string().describe("ISO 8601 timestamp when the file was uploaded"),
  downloadUrl: z.string().nullable().describe("Pre-signed URL for downloading the file")
}).describe("Detailed information about a file attachment including metadata and download URL");

export const expenseSchema = z.object({
  id: z.string().uuid().describe("Unique identifier of the expense record"),
  title: z.string().nullable().describe("Title or description of the expense"),
  date: z.string().describe("ISO 8601 date when the expense was incurred"),
  expenseCategoryId: z.string().uuid().describe("UUID of the expense category this belongs to"),
  amount: z.string().nullable().describe("Amount of the expense as a string (to preserve decimal precision)"),
  comment: z.string().nullable().describe("Additional notes or comments about the expense"),
  linkedEntity: linkedEntitySchema.describe("Project or cost center this expense is charged to"),
  attachments: z.array(documentAttachmentSchema).nullable().describe("List of document attachments for this expense"),
  customFields: z.array(customFieldSchema).nullable().describe("Custom field values specific to this expense"),
  fileAttachments: z.array(fileAttachmentSchema).nullable().describe("Detailed file attachment information with download URLs")
}).describe("Complete expense record with all details, attachments, and custom fields");

export const fieldChoiceSchema = z.object({
  id: z.string().nullable().describe("Unique identifier for this choice option"),
  value: z.string().nullable().describe("Display value of the choice option")
}).describe("Single choice option for a select/multi-select field");

export const fieldItemSchema = z.object({
  id: z.string().nullable().describe("Unique identifier of the field definition"),
  fieldName: z.string().nullable().describe("Display name of the field shown to users"),
  required: z.boolean().describe("Whether this field must be filled when creating expenses"),
  fieldType: z.number().int().describe("Type of field: 0=Text, 1=Number, 2=Date, 3=Boolean, 4=Select, 5=MultiSelect, etc."),
  isSystemDefined: z.boolean().describe("True if this is a built-in field, false if custom-created"),
  fieldOptions: z.array(fieldChoiceSchema).nullable().describe("Available options for select/multi-select fields"),
  countryCode: z.string().nullable().describe("ISO country code if field is country-specific"),
  entityFieldType: z.string().nullable().describe("Internal entity type mapping for system integration")
}).describe("Field definition for expense category attributes");

export const expenseCategorySchema = z.object({
  id: z.string().uuid().describe("Unique identifier of the expense category"),
  name: z.string().nullable().describe("Display name of the expense category"),
  description: z.string().nullable().describe("Detailed description of what expenses belong in this category"),
  code: z.string().nullable().describe("Short code for the category (e.g., 'TRAVEL', 'MEALS')"),
  categoryType: z.number().int().describe("Type of expense category: 0=None, 1=General, 2=Mileage, 3=PerDiem, 4=AirTravel, 5=Accommodation, 6=LocalConveyance, 7=CashAdvance"),
  attributes: z.array(fieldItemSchema).nullable().describe("Custom fields/attributes required for expenses in this category")
}).describe("Expense category definition with associated attributes and validation rules");

export const advanceExpenseSchema = z.object({
  id: z.string().nullable().describe("Unique identifier of the advance expense item"),
  title: z.string().nullable().describe("Description of what the advance is for"),
  categoryId: z.string().nullable().describe("UUID of the expense category"),
  categoryType: z.number().int().describe("Type of advance: 0=None, 1=General, 2=Mileage, 3=PerDiem, 4=AirTravel, 5=Accommodation, 6=LocalConveyance, 7=CashAdvance"),
  currency: z.string().nullable().describe("ISO 4217 currency code (e.g., 'USD', 'EUR')"),
  amount: z.number().describe("Amount of the advance requested"),
  linkedEntity: linkedEntitySchema.describe("Project or cost center this advance is charged to"),
  comment: z.string().nullable().describe("Additional notes or justification for the advance"),
  status: z.number().int().describe("Request status: 0=None, 1=Pending, 2=Submitted, 3=Rejected, 4=Approved"),
  bookingStatus: z.number().int().describe("Travel booking status: 0=None, 1=Pending, 2=Confirmed, 3=Rejected"),
  additionalAttributes: z.record(z.string().nullable()).nullable().describe("Key-value pairs of additional attributes specific to this advance type"),
  customFields: z.array(customFieldSchema).nullable().describe("Custom field values for this advance request")
}).describe("Individual advance expense item within an advance request");

export const advancesRequestSchema = z.object({
  id: z.string().nullable().describe("Unique identifier of the advance request"),
  employeeNumber: z.string().nullable().describe("Employee number/code in the HR system"),
  employeeId: z.string().nullable().describe("UUID of the employee making the request"),
  employeeName: z.string().nullable().describe("Full name of the employee"),
  claimNumber: z.string().nullable().describe("System-generated claim number for tracking"),
  title: z.string().nullable().describe("Title/purpose of the advance request"),
  approvalStatus: z.number().int().describe("Approval status: 0=None, 1=Pending, 2=Submitted, 3=Approved, 4=Rejected, 5=Paid, 6=InApprovalProcess"),
  paymentStatus: z.number().int().describe("Payment status: 0=None, 1=Pending, 2=Paid"),
  submittedOn: z.string().nullable().describe("ISO 8601 timestamp when the request was submitted"),
  advances: z.array(advanceExpenseSchema).nullable().describe("List of individual advance items in this request")
}).describe("Complete advance request with all advance items and approval/payment status");

export const expenseClaimSchema = z.object({
  id: z.string().uuid().describe("Unique identifier of the expense claim"),
  employeeIdentifier: z.string().uuid().describe("UUID of the employee who submitted the claim"),
  employeeName: z.string().nullable().describe("Full name of the employee"),
  claimNumber: z.string().nullable().describe("System-generated claim number for tracking"),
  title: z.string().nullable().describe("Title/description of the expense claim"),
  paymentStatus: z.number().int().describe("Payment status: 0=None, 1=Pending, 2=Paid"),
  submittedOn: z.string().describe("ISO 8601 timestamp when the claim was submitted"),
  approvalStatus: z.number().int().describe("Approval status: 0=None, 1=Pending, 2=Submitted, 3=Approved, 4=Rejected, 5=Paid, 6=InApprovalProcess"),
  expenses: z.array(expenseSchema).nullable().describe("List of individual expense items in this claim")
}).describe("Complete expense claim containing multiple expense items with approval workflow status");

export const apiLookupSchema = z.object({
  id: z.string().nullable().describe("Unique identifier of the lookup item"),
  name: z.string().nullable().describe("Display name of the lookup item")
}).describe("Generic lookup/reference data structure used for dropdowns and references");

// Response wrappers
export const stringResponseSchema = z.object({
  succeeded: z.boolean().describe("Indicates if the API request was successful"),
  message: z.string().nullable().describe("Human-readable message about the operation result"),
  errors: z.array(z.string()).nullable().describe("List of error messages if the request failed"),
  data: z.string().nullable().describe("String data returned by the API")
}).describe("API response wrapper for string data");

export const booleanResponseSchema = z.object({
  succeeded: z.boolean().describe("Indicates if the API request was successful"),
  message: z.string().nullable().describe("Human-readable message about the operation result"),
  errors: z.array(z.string()).nullable().describe("List of error messages if the request failed"),
  data: z.boolean().describe("Boolean result of the operation")
}).describe("API response wrapper for boolean results");

export const documentFileUrlResponseSchema = z.object({
  succeeded: z.boolean().describe("Indicates if the API request was successful"),
  message: z.string().nullable().describe("Human-readable message about the operation result"),
  errors: z.array(z.string()).nullable().describe("List of error messages if the request failed"),
  data: z.object({
    fileURL: z.string().nullable().describe("Pre-signed URL for downloading the file attachment")
  }).describe("Object containing the download URL")
}).describe("API response containing a pre-signed URL for file download");

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

export const expenseCategoryPagedResponseSchema = paginationWrapper(
  expenseCategorySchema,
  "Paginated response containing expense categories with navigation links"
);

export const advancesRequestDtoResponseSchema = z.object({
  succeeded: z.boolean().describe("Indicates if the API request was successful"),
  message: z.string().nullable().describe("Human-readable message about the operation result"),
  errors: z.array(z.string()).nullable().describe("List of error messages if the request failed"),
  data: advancesRequestSchema.describe("Single advance request with all details")
}).describe("API response wrapper for a single advance request");

export const expenseClaimPagedResponseSchema = paginationWrapper(
  expenseClaimSchema,
  "Paginated response containing expense claims with navigation links"
);

export const apiLookupPagedResponseSchema = paginationWrapper(
  apiLookupSchema,
  "Paginated response containing lookup/reference data with navigation links"
);

// Request body schemas
export const expenseClaimUpdateDtoSchema = z.object({
  paymentStatus: z.number().int().describe("New payment status: 0=None, 1=Pending, 2=Paid"),
  paymentDate: z.string().nullable().optional().describe("ISO 8601 date when payment was made (required when marking as Paid)"),
  comment: z.string().nullable().optional().describe("Optional comment about the payment status update")
}).describe("Request body for updating expense claim payment status");