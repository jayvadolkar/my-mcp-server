// src/tools/corehr/updateJobDetails.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐param schema */
export const updateJobDetailsParams = z.object({
  id: z.string().describe("Employee identifier (UUID)")
});

/** 1️⃣ Custom fields export */
const customFieldSchema = z.object({
  id:    z.string().describe("Custom field ID"),
  value: z.string().describe("Custom field value")
});

/** 2️⃣ Request‐body schema */
export const updateJobDetailsSchema = z.object({
  employeeNumber:              z.string().optional().describe("Employee number. This is the job number assigned to the employee"),
  location:                    z.string().optional().describe("Office location ID. this id can be fetched from the getallgrouptypes API. The systemGroupType:3 as 3=OrgLocation"),
  businessUnit:                z.string().optional().describe("Business unit ID. This id can be fetched from the getallgrouptypes API. The systemGroupType:1 as 1=BusinessUnit"),
  department:                  z.string().optional().describe("Department or sub department ID. if sub department is assigned, that will be linked. this id can be fetched from the getallgrouptypes API. The systemGroupType:3 as 2=Department"),
  jobTitle:                    z.string().optional().describe("Job title ID. this can be fetched from getalljobtitles API"),
  reportingManager:            z.string().optional().describe("Reporting manager ID. If the name of the manager is passed, fetch employee ID using getallemployees API (passing name in searchKey) and pass the Employee ID (UUID) here"),
  dottedLineManager:           z.string().optional().describe("Dotted-line manager ID. If the name of the dotted line manager is passed, fetch employee ID using getallemployees API (passing name in searchKey) and pass the Employee ID (UUID) here"),
  attendanceNumber:            z.string().optional().describe("Attendance number. This is the number assigned to the employee for attendance purposes. This is a unique number for each employee"),
  timeType:                    z.number().int().optional().describe("TimeType: 0=None,1=FullTime,2=PartTime"),
  attendanceCaptureScheme:     z.string().optional().describe("Attendance capture scheme ID. This id can be fetched from the getallcaptureschemes API"),
  expensePolicy:               z.string().optional().describe("Expense policy ID. This id can be fetched from the getallexpensepolicies API"),
  noticePeriod:                z.string().optional().describe("Notice period ID. This id can be fetched from the getallnoticeperiods API"),
  holidayList:                 z.string().optional().describe("Holiday list ID. This id can be fetched from the getholidaylists API"),
  costCenter:                  z.string().optional().describe("Cost center ID. this id can be fetched from the getallgrouptypes API. The systemGroupType:4 as 4=OrgLocation"),
  leavePlan:                   z.string().optional().describe("Leave plan ID. This id can be fetched from the getallleaveplans API"),
  payBand:                     z.string().optional().describe("Pay band ID. This id can be fetched from the getallpaybands API"),
  payGrade:                    z.string().optional().describe("Pay grade ID. This id can be fetched from the getallpaygrades API"),
  shiftPolicy:                 z.string().optional().describe("Shift policy ID. This id can be fetched from the getallshiftpolicies API"),
  weeklyOffPolicy:             z.string().optional().describe("Weekly off policy ID"),
  attendancePenalisationPolicy:z.string().optional().describe("Attendance penalisation policy ID"),
  customFields:                z.array(customFieldSchema).optional().describe("Custom fields. This is a map of custom field IDs to their values. The ID must be a valid custom field ID, and the value must be a string. IDs can be obtained from getallupdatefields API"),
  workerType:                  z.number().int().optional().describe("WorkerType: 0=None,1=Permanent,2=Contingent"),
  contingentTypeId:            z.string().optional().describe("Contingent type ID (UUID)")
});

/** 3️⃣ API call */
export async function updateJobDetails(
  env: Env,
  id: string,
  payload: z.infer<typeof updateJobDetailsSchema>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hris/employees/${encodeURIComponent(id)}/jobdetails`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Accept":        "application/json",
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`PUT ${url} failed: ${res.status} ${res.statusText}`);
  }
  // According to spec, returns BooleanResponse { succeeded, message?, errors?, data }
  return res.json();
}
