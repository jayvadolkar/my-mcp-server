import { z } from "zod";

/** Reusable pagination wrapper */
const paginationWrapper = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      succeeded:    z.boolean().describe("Was the request successful?"),
      message:      z.string().describe("Server message"),
      errors:       z.array(z.string()).describe("List of error messages"),
      data:         z.array(item).describe("Payload array"),
      pageNumber:   z.number().int().describe("Current page index"),
      pageSize:     z.number().int().describe("Records per page"),
      firstPage:    z.string().url().describe("URL to first page"),
      lastPage:     z.string().url().describe("URL to last page"),
      totalPages:   z.number().int().describe("Total pages available"),
      totalRecords: z.number().int().describe("Total records available"),
      nextPage:     z.string().url().nullable().describe("URL to next page"),
      previousPage: z.string().url().nullable().describe("URL to previous page"),
    })
    .describe("Standard paginated response");

/** 1️⃣ PSA Client record */
const billingAddressSchema = z
  .object({
    addressLine1: z.string(),
    addressLine2: z.string().nullable(),
    countryCode:  z.string().length(2),
    city:         z.string(),
    state:        z.string(),
    zip:          z.string(),
  })
  .describe("Client billing address");

const clientContactSchema = z
  .object({
    id:        z.string().uuid(),
    clientId:  z.string().uuid(),
    name:      z.string(),
    email:     z.string().email(),
    phone:     z.string(),
  })
  .describe("One client contact");

const clientSchema = z
  .object({
    id:               z.string().uuid(),
    name:             z.string(),
    code:             z.string(),
    description:      z.string().optional(),
    billingAddress:   billingAddressSchema,
    clientContacts:   z.array(clientContactSchema),
    attributes:       z.record(z.string()).describe("Additional arbitrary attributes"),
    additionalFields: z.array(
      z.object({
        id:    z.string().uuid(),
        title: z.string(),
        value: z.string(),
      })
    ),
  })
  .describe("One PSA client record");

export const getClientsResponseSchema = paginationWrapper(clientSchema)
  .describe("GET /psa/clients");

/** 2️⃣ Create client response (data = new clientId) */
export const createClientResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      z.string().uuid().describe("New client UUID"),
  })
  .describe("POST /psa/clients");

/** 3️⃣ Get single client by ID */
export const getClientResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      clientSchema,
  })
  .describe("GET /psa/clients/{id}");

/** 4️⃣ Update client response (data = success flag) */
export const updateClientResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      z.boolean().describe("Operation successful flag"),
  })
  .describe("PUT /psa/clients/{id}");

/** 5️⃣ Billing role */
const billingRoleSchema = z
  .object({
    id:   z.string().uuid(),
    name: z.string(),
    billingRate: z.object({
      unit: z.number().int().describe("Unit enum"),
      rate: z.number().describe("Rate amount"),
    }),
  })
  .describe("One billing role");
export const getBillingRolesResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      billingRoleSchema,
  })
  .describe("GET /psa/clients/{id}/billingroles");

/** 6️⃣ Create credit note response (data = CN UUID) */
export const createCreditNoteResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      z.string().uuid().describe("Credit note UUID"),
  })
  .describe("PUT /psa/clients/{clientId}/creditnote");

/** 7️⃣ Invoice record */
const invoiceLineItemSchema = z
  .object({
    id:            z.string().uuid(),
    description:   z.string(),
    type:          z.number().int().describe("Line item type enum"),
    quantity:      z.number(),
    unitPrice:     z.number(),
    taxId:         z.string().uuid(),
    taxGroupId:    z.string().uuid(),
    projectId:     z.string().uuid(),
    projectType:   z.number().int(),
    taxAmount:     z.number(),
    totalAmount:   z.number(),
    discount:      z.number(),
  })
  .describe("One invoice line item");

const invoiceSchema = z
  .object({
    id:                z.string().uuid(),
    billingLegalEntity: z.string().uuid(),
    invoiceNumber:     z.string(),
    poNumber:          z.string().optional(),
    invoiceDate:       z.string().datetime(),
    invoicePeriod:     z.number().int(),
    dueDate:           z.string().datetime(),
    paymentTerm:       z.string(),
    amount:            z.number(),
    discount:          z.number(),
    taxId:             z.string().uuid(),
    taxGroupId:        z.string().uuid(),
    currency:          z.string(),
    status:            z.number().int(),
    billingAddress:    billingAddressSchema,
    lineItems:         z.array(invoiceLineItemSchema),
    customFields:      z.array(
      z.object({ id: z.string().uuid(), title: z.string(), value: z.string() })
    ),
  })
  .describe("One invoice record");

export const getInvoicesResponseSchema = paginationWrapper(invoiceSchema)
  .describe("GET /psa/clients/{clientId}/invoices");

/** 8️⃣ Receive payment response (data = success) */
export const receivePaymentResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      z.boolean().describe("Operation successful flag"),
  })
  .describe("POST /psa/clients/{clientId}/invoices/{invoiceId}/receivepayment");

/** 9️⃣ Tax definition */
const taxSchema = z
  .object({
    id:       z.string().uuid(),
    name:     z.string(),
    taxRate:  z.number(),
    isEnabled: z.boolean(),
  })
  .describe("One tax definition");

export const getTaxesResponseSchema = paginationWrapper(taxSchema)
  .describe("GET /psa/legalentity/{legalEntityId}/taxes");

/** 🔟 Tax group */
const taxGroupSchema = z
  .object({
    id:        z.string().uuid(),
    name:      z.string(),
    isEnabled: z.boolean(),
    taxes:     z.array(taxSchema),
  })
  .describe("One tax group with included taxes");

export const getTaxGroupsResponseSchema = paginationWrapper(taxGroupSchema)
  .describe("GET /psa/legalentity/{legalEntityId}/taxgroups");

/** 1️⃣1️⃣ Project phase */
const projectPhaseSchema = z.object({ id: z.string().uuid(), name: z.string() });
export const getProjectPhasesResponseSchema = paginationWrapper(projectPhaseSchema)
  .describe("GET /psa/projects/{projectId}/phases");

/** 1️⃣2️⃣ Create phase response (data = phase UUID) */
export const createProjectPhaseResponseSchema = z
  .object({ succeeded: z.boolean(), message: z.string(), errors: z.array(z.string()), data: z.string().uuid() })
  .describe("POST /psa/projects/{projectId}/phases");

/** 1️⃣3️⃣ Project record */
const projectManagerSchema = z
  .object({ id: z.string().uuid(), firstName: z.string(), lastName: z.string(), email: z.string().email() });
const projectSchema = z
  .object({
    id:               z.string().uuid(),
    clientId:         z.string().uuid(),
    name:             z.string(),
    code:             z.string(),
    startDate:        z.string().datetime(),
    endDate:          z.string().datetime(),
    status:           z.number().int(),
    projectManagers:  z.array(projectManagerSchema),
    isBillable:       z.boolean(),
    billingType:      z.number().int(),
    projectBudget:    z.number(),
    budgetedTime:     z.number(),
    isArchived:       z.boolean(),
    customAttributes: z.record(z.string()),
  })
  .describe("One PSA project record");

export const getProjectsResponseSchema = paginationWrapper(projectSchema)
  .describe("GET /psa/projects");

/** 1️⃣4️⃣ Create project response (data = project UUID) */
export const createProjectResponseSchema = z
  .object({ succeeded: z.boolean(), message: z.string(), errors: z.array(z.string()), data: z.string().uuid() })
  .describe("POST /psa/projects");

/** 1️⃣5️⃣ Get single project by ID */
export const getProjectByIdResponseSchema = z
  .object({ succeeded: z.boolean(), message: z.string(), errors: z.array(z.string()), data: projectSchema })
  .describe("GET /psa/projects/{projectId}");

/** 1️⃣6️⃣ Update project response (data = success) */
export const updateProjectResponseSchema = z
  .object({ succeeded: z.boolean(), message: z.string(), errors: z.array(z.string()), data: z.boolean() })
  .describe("PUT /psa/projects/{projectId}");

/** 1️⃣7️⃣ Allocation record */
const allocationSchema = z
  .object({
    id:                   z.string().uuid(),
    employee:            z.object({ id: z.string().uuid(), firstName: z.string(), lastName: z.string(), email: z.string().email() }),
    startDate:           z.string().datetime(),
    endDate:             z.string().datetime(),
    allocationPercentage: z.number().int(),
    billingRole:         z.object({ id: z.string().uuid(), name: z.string() }),
    billingRate:         z.object({ unit: z.number().int(), rate: z.number() }),
  })
  .describe("One allocation record");

export const getAllocationsResponseSchema = paginationWrapper(allocationSchema)
  .describe("GET /psa/projects/{projectId}/allocations");

/** 1️⃣9️⃣ Create allocation response (data = alloc UUID) */
export const createAllocationResponseSchema = z
  .object({ succeeded: z.boolean(), message: z.string(), errors: z.array(z.string()), data: z.string().uuid() })
  .describe("POST /psa/projects/{projectId}/allocations");

/** 2️⃣0️⃣ Project time entry */
const timeEntrySchema = z
  .object({
    id:           z.string().uuid(),
    date:         z.string().datetime(),
    employeeId:   z.string().uuid(),
    projectId:    z.string().uuid(),
    taskId:       z.string().uuid(),
    totalMinutes: z.number().int(),
    startTime:    z.string(),
    endTime:      z.string(),
    comments:     z.string(),
    isBillable:   z.boolean(),
    status:       z.number().int(),
  })
  .describe("One project time entry");

export const getProjectTimeEntriesResponseSchema = paginationWrapper(timeEntrySchema)
  .describe("GET /psa/projects/{projectId}/timeentries");

/** 2️⃣1️⃣ Project resource mapping */
const resourceSchema = z
  .object({ employeeId: z.string().uuid(), projectId: z.string().uuid(), name: z.string() })
  .describe("One project resource");
export const getProjectResourcesResponseSchema = paginationWrapper(resourceSchema)
  .describe("GET /psa/project/resources");

/** 2️⃣2️⃣ Project task record */
const taskAssignmentSchema = z
  .object({ id: z.string().uuid(), employeeNumber: z.string(), employeeName: z.string() });
const projectTaskSchema = z
  .object({
    id:              z.string().uuid(),
    projectId:       z.string().uuid(),
    name:            z.string(),
    description:     z.string().optional(),
    taskType:        z.number().int(),
    taskBillingType: z.number().int(),
    assignedTo:      z.array(taskAssignmentSchema),
    startDate:       z.string().datetime(),
    endDate:         z.string().datetime(),
    estimatedHours:  z.number(),
  })
  .describe("One project task record");

export const getProjectTasksResponseSchema = paginationWrapper(projectTaskSchema)
  .describe("GET /psa/projects/{projectId}/tasks");

/** 2️⃣3️⃣ Create project task response (data = task UUID) */
export const createProjectTaskResponseSchema = z
  .object({ succeeded: z.boolean(), message: z.string(), errors: z.array(z.string()), data: z.string().uuid() })
  .describe("POST /psa/projects/{projectId}/tasks");

/** 2️⃣4️⃣ Update project task response (data = success) */
export const updateProjectTaskResponseSchema = z
  .object({ succeeded: z.boolean(), message: z.string(), errors: z.array(z.string()), data: z.boolean() })
  .describe("PUT /psa/projects/{projectId}/tasks/{taskId}");

/** 2️⃣5️⃣ Task time entries */
export const getProjectTaskTimeEntriesResponseSchema = paginationWrapper(timeEntrySchema)
  .describe("GET /psa/projects/{projectId}/tasks/{taskId}/timeentries");