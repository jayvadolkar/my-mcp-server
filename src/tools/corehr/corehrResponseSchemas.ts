// src/tools/corehr/corehrResponseSchemas.ts
import { z } from "zod";

/** Re-usable pagination wrapper */
const paginationWrapper = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      succeeded: z.boolean().describe("Was the request successful?"),
      message: z.string().describe("Server message"),
      errors: z.array(z.string()).describe("List of error messages"),
      data: z.array(item).describe("Payload array"),
      pageNumber: z.number().int().describe("Current page index"),
      pageSize: z.number().int().describe("Records per page"),
      firstPage: z.string().url().describe("URL to first page"),
      lastPage: z.string().url().describe("URL to last page"),
      totalPages: z.number().int().describe("Total pages available"),
      totalRecords: z.number().int().describe("Total records available"),
      nextPage: z.string().url().nullable().describe("URL to next page"),
      previousPage: z.string().url().nullable().describe("URL to previous page"),
    })
    .describe("Standard paginated response");

/** --- Enumerations --- */
export const TimeType = z.number().int().describe("0=None; 1=FullTime; 2=PartTime");
export const WorkerType = z.number().int().describe("0=None; 1=Permanent; 2=Contingent");
export const MaritalStatus = z.number().int().describe("0=None; 1=Single; 2=Married; 3=Widowed; 4=Separated");
export const Gender = z.number().int().describe("0=NotSpecified;1=Male;2=Female;3=Nonbinary;4=PreferNotToRespond");
export const EmploymentStatus = z.number().int().describe("0=Working;1=Relieved");
export const AccountStatus = z.number().int().describe("0=NotRegistered;1=Registered;2=Disabled");
export const InvitationStatus = z.number().int().describe("0=NotInvited;1=Invited");
export const ExitStatus = z.number().int().describe("0=None;1=Initiated;2=Completed");
export const ExitType = z.number().int().describe("0=None;1=EmployeeResignation;2=CompanyAction");
export const BloodGroup = z.number().int().describe("0 =Not Available, 1=A Positive, 2 + A- (A Negative), 3=B+ (B Positive), 4=B- (B Negative), 5=AB+ (AB Positive), 6=AB- (AB Negative), 7=O+ (O Positive), 8=O- (O Negative), 9=A2+ (A2 Positive), 10=A1+ (A1 Positive), 11=A1- (A1 Negative), 12=A1B- (A1B Negative), 13=A1B+ (A1B Positive), 14=A2- (A2 Negative),15=A2B+ (A2B Positive), 16=A2B- (A2B Negative), 17=B1+ (B1 Positive) ");
export const RelationType = z.number().int().describe("0=Others;1=Spouse;2=Father;…;9=MotherInLaw");
export const FieldType = z.number().int().describe("1=Integer;2=Decimal;3=String;4=Boolean;5=Enum;6=DateTime, 7 - MultiDropdown, 8 - Checkbox9 - Dropdown, 10 - TextBox, 11 - TextArea, 12 - Date, 13=Number");
export const SystemGroupType = z.number().int().describe("SystemGroupTypes are 0 = None, 1 = BusinessUnit, 2 = Department, 3 = OrgLocation, 4 = CostCenter, 5 = Paygroup, 6 = ProjectTeam, 7 = Team, 8 = ClientTeam, 9 = LegalEntity");
/** --- Common sub-objects --- */
const addressSchema = z
  .object({
    addressLine1: z.string(),
    addressLine2: z.string().nullable(),
    countryCode: z.string().length(2),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  })
  .describe("Postal address");

const imageSchema = z
  .object({
    fileName: z.string(),
    thumbs: z.record(z.string()),
  })
  .describe("Employee image metadata");

const personRef = z
  .object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  })
  .describe("Basic person reference");

/** --- 1. GET /hris/employees (paginated list) --- */
const employeeSummarySchema = z
  .object({
    id: z.string().uuid(),
    employeeNumber: z.string(),
    firstName: z.string(),
    middleName: z.string().nullable(),
    lastName: z.string(),
    displayName: z.string(),
    email: z.string().email(),
    city: z.string(),
    countryCode: z.string().length(2),
    image: imageSchema,
    jobTitle: z
      .object({ identifier: z.string(), title: z.string() })
      .describe("Primary job title"),
    secondaryJobTitle: z.string().nullable(),
    reportsTo: personRef.nullable(),
    l2Manager: personRef.nullable(),
    dottedLineManager: personRef.nullable(),
    contingentType: z
      .object({ id: z.string(), name: z.string() })
      .describe("Contingent classification"),
    timeType: TimeType,
    workerType: WorkerType,
    isPrivate: z.boolean(),
    isProfileComplete: z.boolean(),
    maritalStatus: MaritalStatus,
    marriageDate: z.date().nullable(),
    gender: Gender,
    joiningDate: z.date(),
    totalExperienceInDays: z.number().int(),
    professionalSummary: z.string().nullable(),
    dateOfBirth: z.date().nullable(),
    resignationSubmittedDate: z.date().nullable(),
    exitDate: z.date().nullable(),
    employmentStatus: EmploymentStatus,
    accountStatus: AccountStatus,
    invitationStatus: InvitationStatus,
    exitStatus: ExitStatus,
    exitType: ExitType,
    exitReason: z.string().nullable(),
    personalEmail: z.string().email().nullable(),
    workPhone: z.string().nullable(),
    homePhone: z.string().nullable(),
    mobilePhone: z.string().nullable(),
    bloodGroup: BloodGroup,
    nationality: z.string(),
    attendanceNumber: z.string().nullable(),
    probationEndDate: z.date().nullable(),
    currentAddress: addressSchema,
    permanentAddress: addressSchema,
    relations: z
      .array(
        personRef
          .extend({
            relationType: RelationType,
            displayName: z.string(),
            dateOfBirth: z.date().nullable(),
            profession: z.string().nullable(),
            mobile: z.string().nullable(),
          })
          .describe("One dependent or emergency contact")
      )
      .describe("Employee relations"),
    educationDetails: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            degree: z.string(),
            branch: z.string(),
            university: z.string(),
            cgpa: z.number(),
            yearOfJoining: z.date(),
            yearOfCompletion: z.date(),
            customFields: z
              .array(
                z
                  .object({
                    id: z.string().uuid(),
                    title: z.string(),
                    type: z.string(),
                    value: z.string(),
                  })
                  .describe("Custom education field")
              )
              .describe("Additional education metadata"),
          })
          .describe("One education record")
      )
      .describe("Education history"),
    experienceDetails: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            companyName: z.string(),
            jobTitle: z.string(),
            location: z.string(),
            description: z.string().nullable(),
            dateOfJoining: z.date(),
            dateOfRelieving: z.date().nullable(),
            customFields: z
              .array(
                z
                  .object({
                    id: z.string().uuid(),
                    title: z.string(),
                    type: z.string(),
                    value: z.string(),
                  })
                  .describe("Custom experience field")
              )
              .describe("Extra experience metadata"),
          })
          .describe("One past role")
      )
      .describe("Work history"),
    customFields: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            title: z.string(),
            type: z.string(),
            value: z.string(),
          })
          .describe("Custom profile field")
      )
      .describe("Arbitrary extra fields"),
    groups: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            title: z.string(),
            groupType: SystemGroupType,
          })
          .describe("Assignment to one group")
      )
      .describe("Groups the employee belongs to"),
    leavePlanInfo: z
      .object({ identifier: z.string(), title: z.string() })
      .nullable(),
    holidayCalendarId: z.string().nullable(),
    bandInfo: z.object({ identifier: z.string(), title: z.string() }).nullable(),
    payGradeInfo: z
      .object({ identifier: z.string(), title: z.string() })
      .nullable(),
    shiftPolicyInfo: z
      .object({ identifier: z.string(), title: z.string() })
      .nullable(),
    weeklyOffPolicyInfo: z
      .object({ identifier: z.string(), title: z.string() })
      .nullable(),
    captureSchemeInfo: z
      .object({ identifier: z.string(), title: z.string() })
      .nullable(),
    trackingPolicyInfo: z
      .object({ identifier: z.string(), title: z.string() })
      .nullable(),
    expensePolicyInfo: z
      .object({ identifier: z.string(), title: z.string() })
      .nullable(),
    overtimePolicyInfo: z
      .object({ identifier: z.string(), title: z.string() })
      .nullable(),
  })
  .describe("Summary of one employee");

export const employeesListResponseSchema = paginationWrapper(
  employeeSummarySchema
).describe("GET /hris/employees");

/** 2. POST /hris/employees */
export const createEmployeeResponseSchema = z
  .object({
    succeeded: z.boolean().describe("Was the request successful?"),
    message: z.string().describe("Server message"),
    errors: z.array(z.string()).describe("List of errors"),
    data: z.string().uuid().describe("New employee UUID"),
  })
  .describe("POST /hris/employees");

/** 3. GET /hris/employees/{id} */
export const employeeDetailResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message: z.string(),
    errors: z.array(z.string()),
    data: employeeSummarySchema, // full detail re-uses same shape
  })
  .describe("GET /hris/employees/{id}");

/** 4 & 5. PUT personaldetails & jobdetails */
const booleanResponse = z
  .object({
    succeeded: z.boolean(),
    message: z.string(),
    errors: z.array(z.string()),
    data: z.boolean().describe("Operation successful flag"),
  })
  .describe("Simple boolean-data response");

export const updatePersonalDetailsResponseSchema = booleanResponse.describe(
  "PUT /hris/employees/{id}/personaldetails"
);
export const updateJobDetailsResponseSchema = booleanResponse.describe(
  "PUT /hris/employees/{id}/jobdetails"
);

/** 6. GET /hris/employees/updatefields */
const fieldSchema = z
  .object({
    id: z.string().uuid(),
    fieldName: z.string(),
    required: z.boolean(),
    fieldType: FieldType,
    isSystemDefined: z.boolean(),
    fieldOptions: z.array(
      z.object({ id: z.string().uuid(), value: z.string() })
    ),
    countryCode: z.string().length(2),
    entityFieldType: z.string(),
  })
  .describe("One updatable field definition");

export const updateFieldsResponseSchema = z
  .object({
    succeeded: z.boolean(),
    message: z.string(),
    errors: z.array(z.string()),
    data: z
      .object({
        profileFields: z.array(fieldSchema),
        jobFields: z.array(fieldSchema),
      })
      .describe("Field definitions for profile & job sections"),
  })
  .describe("GET /hris/employees/updatefields");

/** 7–14: the various list endpoints */
const simpleItem = (props: Record<string, z.ZodTypeAny>) =>
  z.object(props).describe("One record");

export const groupsResponseSchema = paginationWrapper(
  simpleItem({
    id: z.string().uuid(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    groupTypeId: z.string(),
  })
).describe("GET /hris/groups");

export const groupTypesResponseSchema = paginationWrapper(
  simpleItem({
    id: z.string().uuid(),
    name: z.string(),
    isSystemDefined: z.boolean(),
    systemGroupType: SystemGroupType,
  })
).describe("GET /hris/grouptypes");

export const departmentsResponseSchema = paginationWrapper(
  simpleItem({
    id: z.string().uuid(),
    parentId: z.string().nullable(),
    name: z.string(),
    description: z.string(),
    isArchived: z.boolean(),
    departmentHeads: z.array(personRef),
  })
).describe("GET /hris/departments");

export const locationsResponseSchema = paginationWrapper(
  simpleItem({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    address: addressSchema,
  })
).describe("GET /hris/locations");

export const jobTitlesResponseSchema = paginationWrapper(
  simpleItem({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
  })
).describe("GET /hris/jobtitles");

export const currenciesResponseSchema = paginationWrapper(
  simpleItem({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
  })
).describe("GET /hris/currencies");

export const noticePeriodsResponseSchema = paginationWrapper(
  simpleItem({
    id: z.string().uuid(),
    name: z.string(),
  })
).describe("GET /hris/noticeperiods");

export const contingentTypesResponseSchema = paginationWrapper(
  simpleItem({
    id: z.string().uuid(),
    name: z.string(),
  })
).describe("GET /hris/contingenttypes");

/** 15 & 16. POST/PUT /hris/employees/{id}/exitrequest */
export const exitRequestResponseSchema = booleanResponse.describe(
  "POST or PUT /hris/employees/{id}/exitrequest"
);

/** 17. GET /hris/exitreasons */
export const exitReasonsResponseSchema = z
  .object({
    exitReason: z
      .array(simpleItem({ id: z.string().uuid(), name: z.string() }))
      .describe("Employee exit reasons"),
    terminationReason: z
      .array(simpleItem({ id: z.string().uuid(), name: z.string() }))
      .describe("Company termination reasons"),
  })
  .describe("GET /hris/exitreasons");
