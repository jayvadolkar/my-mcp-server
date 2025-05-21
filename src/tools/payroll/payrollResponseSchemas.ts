// src/tools/payroll/payrollResponseSchemas.ts
import { z } from "zod";

/** Reusable pagination wrapper */
const paginationWrapper = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      succeeded:     z.boolean().describe("Was the request successful?"),
      message:       z.string().describe("Server message"),
      errors:        z.array(z.string()).describe("List of error messages"),
      data:          z.array(item).describe("Payload array"),
      pageNumber:    z.number().int().describe("Current page index"),
      pageSize:      z.number().int().describe("Records per page"),
      firstPage:     z.string().url().describe("URL to first page"),
      lastPage:      z.string().url().describe("URL to last page"),
      totalPages:    z.number().int().describe("Total pages available"),
      totalRecords:  z.number().int().describe("Total records available"),
      nextPage:      z.string().url().nullable().describe("URL to next page"),
      previousPage:  z.string().url().nullable().describe("URL to previous page"),
    })
    .describe("Standard paginated response");

/** 1️⃣ Salaries list */
const salaryComponentSchema = z
  .object({
    id:     z.string().uuid(),
    title:  z.string(),
    amount: z.number().describe("Component amount"),
  })
  .describe("One earning or deduction component");

const salaryRecordSchema = z
  .object({
    id:              z.string().uuid(),
    employee:        z.object({
                       id:             z.string().uuid(),
                       employeeNumber: z.string(),
                       employeeName:   z.string(),
                     }).describe("Basic employee info"),
    ctc:             z.number().describe("CTC amount"),
    gross:           z.number().describe("Gross amount"),
    remunerationType:z.number().int().describe("Remuneration type enum"),
    effectiveFrom:   z.string().datetime(),
    earnings:        z.array(salaryComponentSchema),
    deductions:      z.array(salaryComponentSchema),
  })
  .describe("One salary record");

export const salariesResponseSchema = paginationWrapper(salaryRecordSchema)
  .describe("GET /payroll/salaries");

/** 2️⃣ Salary components */
const salaryComponentDefSchema = z
  .object({
    id:             z.string().uuid(),
    identifier:     z.string(),
    title:          z.string(),
    accountingCode: z.string(),
  })
  .describe("One salary component definition");

export const salaryComponentsResponseSchema = paginationWrapper(salaryComponentDefSchema)
  .describe("GET /payroll/salarycomponents");

/** 3️⃣ Paygroups */
const payGroupSchema = z
  .object({
    identifier:      z.string(),
    name:            z.string(),
    description:     z.string(),
    legalEntityId:   z.string(),
    legalEntityName: z.string(),
  })
  .describe("One paygroup");

export const payGroupsResponseSchema = paginationWrapper(payGroupSchema)
  .describe("GET /payroll/paygroups");

/** 4️⃣ Paycycles */
const payCycleSchema = z
  .object({
    identifier: z.string(),
    month:      z.string(),
    startDate:  z.string(),
    endDate:    z.string(),
    runStatus:  z.number().int().describe("Run status enum"),
  })
  .describe("One paycycle");

export const payCyclesResponseSchema = paginationWrapper(payCycleSchema)
  .describe("GET /payroll/paygroups/{payGroupId}/paycycles");

/** 5️⃣ Payregister */
const payRegisterRecordSchema = z
  .object({
    identifier:               z.string(),
    employeeNumber:           z.string(),
    employeeName:             z.string(),
    panNumber:                z.string(),
    bankName:                 z.string(),
    accountNumber:            z.string(),
    ifscCode:                 z.string(),
    dateJoined:               z.string().datetime(),
    jobTitle:                 z.string(),
    department:               z.string(),
    location:                 z.string(),
    payGroup:                 z.string(),
    employmentStatus:         z.number().int().describe("Employment status enum"),
    workerType:               z.number().int().describe("Worker type enum"),
    costCenter:               z.string(),
    businessUnit:             z.string(),
    remunerationType:         z.number().int(),
    gender:                   z.number().int().describe("Gender enum"),
    dateOfBirth:              z.string().datetime(),
    exitDate:                 z.string().datetime(),
    cycleIdentifier:          z.string(),
    cycleFrom:                z.string().datetime(),
    cycleTo:                  z.string().datetime(),
    cycleMonthName:           z.string(),
    cycleMonth:               z.number().int(),
    cycleYear:                z.number().int(),
    cyclePayDays:             z.number().int(),
    workingDays:              z.number().int(),
    lossOfPayDays:            z.number().int(),
    noOfPayDays:              z.number().int(),
    renumerationAmount:       z.number(),
    status:                   z.number().int(),
    statusDescription:        z.string(),
    earnings:                 z.array(
                                salaryComponentDefSchema.extend({ amount: z.number() })
                              ),
    contributions:            z.array(
                                salaryComponentDefSchema.extend({ amount: z.number() })
                              ),
    deductions:               z.array(
                                salaryComponentDefSchema.extend({ amount: z.number() })
                              ),
    reimbursements:           z.array(
                                salaryComponentDefSchema.extend({ amount: z.number() })
                              ),
    outsideGrossPayables:     z.array(
                                salaryComponentDefSchema.extend({ amount: z.number() })
                              ),
    outsideCTCPayables:       z.array(
                                salaryComponentDefSchema.extend({ amount: z.number() })
                              ),
    grossAmount:              z.number(),
    totalOutsideGrossAmount:  z.number(),
    total:                    z.number(),
    totalContributions:       z.number(),
    totalDeductions:          z.number(),
    totalReimbursements:      z.number(),
    cashAdvanceAmount:        z.number(),
    cashAdvanceSettlementAmount: z.number(),
    netAmount:                z.number(),
    currencyCode:             z.string(),
  })
  .describe("One pay register entry");

export const payRegisterResponseSchema = paginationWrapper(payRegisterRecordSchema)
  .describe("GET /payroll/paygroups/{payGroupId}/paycycles/{payCycleId}/payregister");

/** 6️⃣ Paybatches */
const payBatchSchema = z
  .object({
    id:          z.string(),
    identifier:  z.string(),
    name:        z.string(),
    description: z.string(),
    forPeriod:   z.string(),
    status:      z.number().int().describe("Batch status enum"),
    paymentFor:  z.string(),
  })
  .describe("One paybatch");

export const payBatchesResponseSchema = paginationWrapper(payBatchSchema)
  .describe("GET /payroll/paygroups/{payGroupId}/paycycles/{payCycleId}/paybatches");

/** 7️⃣ Payments list */
const paymentRecordSchema = z
  .object({
    id:                  z.string(),
    identifier:          z.string(),
    employeeNumber:      z.string(),
    employeeName:        z.string(),
    forPeriod:           z.string(),
    amount:              z.number(),
    salaryPaymentMode:   z.string(),
    bankName:            z.string(),
    ifscCode:            z.string(),
    accountNumber:       z.string(),
    status:              z.number().int().describe("Payment status enum"),
  })
  .describe("One payment record");

export const paymentsResponseSchema = paginationWrapper(paymentRecordSchema)
  .describe("GET /payroll/paygroups/{payGroupId}/paycycles/{payCycleId}/paybatches/{payBatchId}/payments");

/** 8️⃣ Bulk‐update payments */
export const updatePaymentsResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      z.boolean().describe("Operation successful flag"),
  })
  .describe("PUT /payroll/.../payments");

/** 9️⃣ Paybands */
const payBandSchema = z
  .object({
    id:   z.string(),
    name: z.string(),
  })
  .describe("One payband");

export const payBandsResponseSchema = paginationWrapper(payBandSchema)
  .describe("GET /payroll/paybands");

/** 🔟 Paygrades */
const payGradeSchema = z
  .object({
    id:   z.string(),
    name: z.string(),
  })
  .describe("One paygrade");

export const payGradesResponseSchema = paginationWrapper(payGradeSchema)
  .describe("GET /payroll/paygrades");

/** 1️⃣1️⃣ Full‐and‐final settlement */
const fnfComponentSchema = z
  .object({
    id:                  z.string().uuid(),
    componentIdentifier: z.string(),
    componentTitle:      z.string(),
    amount:              z.number(),
  })
  .describe("One F&F component");

const fnfRecordSchema = z
  .object({
    id:                  z.string().uuid(),
    employeeNumber:      z.string(),
    panNumber:           z.string(),
    uanNumber:           z.string(),
    esiNumber:           z.string(),
    pfNumber:            z.string(),
    terminationType:     z.number().int().describe("Termination type enum"),
    terminationReason:   z.string(),
    resignationNote:     z.string(),
    terminationNoticeDate: z.string().datetime(),
    lastWorkingDay:      z.string().datetime(),
    okToRehire:          z.boolean(),
    comments:            z.string(),
    lossOfPayDays:       z.number().int(),
    noOfPayDays:         z.number().int(),
    leaveEncashmentDays: z.number().int(),
    earnings:            z.array(fnfComponentSchema),
    contributions:       z.array(fnfComponentSchema),
    deductions:          z.array(fnfComponentSchema),
    netAmount:           z.number(),
    netRecovery:         z.number(),
    exitRequestStatus:   z.number().int(),
    settlementDate:      z.string().datetime(),
    payAction:           z.number().int(),
  })
  .describe("One F&F settlement record");

export const fnfResponseSchema = paginationWrapper(fnfRecordSchema)
  .describe("GET /payroll/employees/fnf");

/** 1️⃣2️⃣ Bonus types */
const bonusTypeSchema = z
  .object({
    id:   z.string(),
    name: z.string(),
  })
  .describe("One bonus type");

export const bonusTypesResponseSchema = paginationWrapper(bonusTypeSchema)
  .describe("GET /payroll/bonustypes");

/** 1️⃣3️⃣ Financial details */
const bankDetailsSchema = z
  .object({
    bankId:            z.number().int(),
    bankIdentifier:    z.string(),
    name:              z.string(),
    ifscCode:          z.string(),
    accountNumber:     z.string(),
    nameOnTheAccount:  z.string(),
  })
  .describe("Employee bank details");

const pfAccountSchema = z
  .object({
    establishmentId:        z.string(),
    contributionToPf:       z.boolean(),
    pfDetailsAvailable:     z.boolean(),
    isMemberToEps:          z.boolean(),
    abryEligibility:        z.boolean(),
    universalAccountNumber: z.string(),
    pfJoinDate:             z.string().datetime(),
    nameOnTheAccount:       z.string(),
  })
  .describe("PF account information");

const esiAccountSchema = z
  .object({
    esiEstablishmentId: z.string(),
    esiNumber:          z.string(),
    isESIEligible:      z.boolean(),
  })
  .describe("ESI account information");

const ptDetailsSchema = z
  .object({
    state:             z.string(),
    registeredLocation:z.string(),
  })
  .describe("Professional tax details");

const financialRecordSchema = z
  .object({
    employeeId:             z.string().uuid(),
    employeeNumber:         z.string(),
    employeeName:           z.string(),
    bankDetails:            bankDetailsSchema,
    pfAccountInformation:   pfAccountSchema,
    esiAccountInformation:  esiAccountSchema,
    ptDetails:              ptDetailsSchema,
    lwfStatus:              z.boolean(),
  })
  .describe("One financial details record");

export const financialDetailsResponseSchema = paginationWrapper(financialRecordSchema)
  .describe("GET /payroll/employees/financialdetails");

/** 1️⃣4️⃣ Salary structures */
const salaryStructureSchema = z
  .object({
    id:         z.string(),
    name:       z.string(),
    payGroupId: z.string(),
  })
  .describe("One salary structure");

export const salaryStructuresResponseSchema = paginationWrapper(salaryStructureSchema)
  .describe("GET /payroll/salarystructures");

/** 1️⃣5️⃣ & 1️⃣6️⃣ Create/Update salary */
const booleanDataResponse = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      z.boolean().describe("Operation successful flag"),
  })
  .describe("Simple boolean-data response");

export const createSalaryResponseSchema = booleanDataResponse.describe(
  "POST /payroll/employees/{employeeId}/salary"
);
export const updateSalaryResponseSchema = booleanDataResponse.describe(
  "PUT /payroll/employees/{employeeId}/salary"
);

/** 1️⃣7️⃣ Form16 URL */
export const form16ResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      z.object({ fileURL: z.string().url() }).describe("URL to Form16"),
  })
  .describe("GET /payroll/employees/{employeeId}/form16");

/** 1️⃣8️⃣ Ad-hoc transactions response */
export const adhocTransactionsResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message:   z.string(),
    errors:    z.array(z.string()),
    data:      z.boolean().describe("Operation successful flag"),
  })
  .describe("PUT /payroll/.../adhoctransactions");
