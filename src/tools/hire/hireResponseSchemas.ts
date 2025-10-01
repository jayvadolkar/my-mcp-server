// src/tools/hire/hireResponseSchemas.ts
import { z } from "zod";

/** ── Common Enums ───────────────────────────────────────────────── */
export const JobStatusEnum = z.enum(["0", "1", "2", "3", "4"]).describe("0=Draft, 1=Online, 2=Archived, 3=Offline, 4=Confidential");
export const FieldTypeEnum = z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]).describe("1=TextBox, 2=TextArea, 3=DropdownMenu, 4=Checkbox, 5=RadioButton, 6=Date, 9=Number");
export const JobTypeEnum = z.enum(["1", "2"]).describe("1=PartTime, 2=FullTime");
export const InterviewTypeEnum = z.enum(["1", "2"]).describe("1=Online, 2=FaceToFace");
export const GenderEnum = z.enum(["0", "1", "2", "3", "4"]).describe("0=NotSpecified, 1=Male, 2=Female, 3=Nonbinary, 4=PreferNotToRespond");
export const PreboardingStageEnum = z.enum(["0", "1", "2", "3", "4", "5"]).describe("0=Start, 1=CollectInfo, 2=VerifyInfo, 3=ManageOffer, 4=OfferAcceptance, 5=Hired");
export const PreboardingStatusEnum = z.enum(["0", "1", "2", "3", "4", "5"]).describe("0=Initiated, 1=Completed, 2=Cancelled, 3=Archived, 4=CandidatureRevoked, 5=MarkedAsNoShow");
export const ApplicationStatusEnum = z.enum(["0", "1", "2", "3", "4"]).describe("Application status enum");
export const AssessmentStatusEnum = z.enum(["0", "1", "2", "3", "4"]).describe("Assessment status enum");

/** ── 1. Job Boards Response ───────────────────────────────────────────────── */
const jobBoardIntegrationSchema = z.object({
  jobBoardName: z.string().describe("Name of the job board"),
  jobBoardIdentifier: z.string().describe("Job board identifier"),
  isActive: z.boolean().describe("Whether this integration is active")
});

export const jobBoardsResponseSchema = z.array(jobBoardIntegrationSchema)
  .describe("Response for GET /v1/hire/jobboards");

/** ── 2. Jobs Response ───────────────────────────────────────────────── */
const locationSchema = z.object({
  name: z.string().nullable().describe("Location name"),
  city: z.string().nullable().describe("City"),
  state: z.string().nullable().describe("State"),
  countryName: z.string().nullable().describe("Country name")
});

const hiringTeamSchema = z.object({
  identifier: z.string().nullable().describe("Team member identifier"),
  displayName: z.string().nullable().describe("Display name"),
  type: z.number().describe("JobRecruiterType enum")
});

const jobCustomFieldSchema = z.object({
  fieldName: z.string().nullable().describe("Field name"),
  required: z.boolean().describe("Whether field is required"),
  fieldType: FieldTypeEnum.describe("Field type"),
  value: z.string().nullable().describe("Field value")
});

const jobSchema = z.object({
  id: z.string().nullable().describe("Job ID"),
  title: z.string().nullable().describe("Job title"),
  description: z.string().nullable().describe("Job description"),
  noOfOpenings: z.string().nullable().describe("Number of openings"),
  departmentName: z.string().nullable().describe("Department name"),
  jobType: z.string().nullable().describe("Job type"),
  isReferralEnabled: z.boolean().describe("Whether referrals are enabled"),
  isCreatedFromRequisition: z.boolean().describe("Created from requisition"),
  requisitionIdentifier: z.string().nullable().describe("Requisition ID"),
  canAllowInternalEmployees: z.boolean().describe("Allow internal employees"),
  orgJobId: z.string().nullable().describe("Organization job ID"),
  jobLocations: z.array(locationSchema).nullable().describe("Job locations"),
  hiringTeam: z.array(hiringTeamSchema).nullable().describe("Hiring team"),
  careerPortalUrl: z.string().nullable().describe("Career portal URL"),
  targetHireDate: z.string().nullable().describe("Target hire date"),
  status: z.number().describe("Job status"),
  canListOnCareersSite: z.boolean().describe("Can list on careers site"),
  createdOn: z.string().nullable().describe("Creation date"),
  publishedOn: z.string().nullable().describe("Published date"),
  experience: z.string().nullable().describe("Experience required"),
  customFields: z.array(jobCustomFieldSchema).nullable().describe("Custom fields")
});

export const jobsResponseSchema = z.array(jobSchema)
  .describe("Response for GET /v1/hire/jobs");

/** ── 3. Job Application Fields Response ───────────────────────────────────────────────── */
const fieldOptionSchema = z.object({
  id: z.string().nullable().describe("Option ID"),
  value: z.string().nullable().describe("Option value")
});

const jobApplicationFieldSchema = z.object({
  fieldName: z.string().nullable().describe("Field name"),
  id: z.string().nullable().describe("Field identifier"),
  required: z.boolean().describe("Whether field is required"),
  fieldType: FieldTypeEnum.describe("Field type"),
  fieldOptions: z.array(fieldOptionSchema).nullable().describe("Field options")
});

export const jobApplicationFieldsResponseSchema = z.array(jobApplicationFieldSchema)
  .describe("Response for GET /v1/hire/jobs/{jobId}/applicationfields");

/** ── 4. Job Candidates Response ───────────────────────────────────────────────── */
const educationSchema = z.object({
  degree: z.string().nullable().describe("Degree"),
  branch: z.string().nullable().describe("Branch"),
  dateOfJoining: z.string().nullable().describe("Date of joining"),
  dateOfCompletion: z.string().nullable().describe("Date of completion"),
  university: z.string().nullable().describe("University"),
  location: z.string().nullable().describe("Location")
});

const experienceSchema = z.object({
  companyName: z.string().nullable().describe("Company name"),
  designation: z.string().nullable().describe("Designation"),
  isCurrentlyWorking: z.boolean().describe("Currently working"),
  dateOfJoining: z.string().nullable().describe("Date of joining"),
  dateOfRelieving: z.string().nullable().describe("Date of relieving"),
  location: z.string().nullable().describe("Location")
});

const tagSchema = z.object({
  identifier: z.string().nullable().describe("Tag identifier"),
  name: z.string().nullable().describe("Tag name"),
  description: z.string().nullable().describe("Tag description")
});

const jobApplicationDetailsSchema = z.object({
  jobHiringStageId: z.string().nullable().describe("Job hiring stage ID"),
  movedtoStageOn: z.string().nullable().describe("Moved to stage on"),
  screeningQuestionsResponse: z.record(z.string()).nullable().describe("Screening questions response"),
  appliedOn: z.string().nullable().describe("Applied on"),
  status: ApplicationStatusEnum.describe("Application status"),
  sourcedBy: z.string().nullable().describe("Sourced by"),
  sourceTitle: z.string().nullable().describe("Source title"),
  assignedTo: z.string().nullable().describe("Assigned to"),
  assignedOn: z.string().nullable().describe("Assigned on")
});

const jobCandidateSchema = z.object({
  id: z.string().nullable().describe("Candidate ID"),
  firstName: z.string().nullable().describe("First name"),
  lastName: z.string().nullable().describe("Last name"),
  middleName: z.string().nullable().describe("Middle name"),
  gender: GenderEnum.describe("Gender"),
  email: z.string().nullable().describe("Email"),
  phone: z.string().nullable().describe("Phone"),
  educationDetails: z.array(educationSchema).nullable().describe("Education details"),
  candidateTags: z.array(tagSchema).nullable().describe("Candidate tags"),
  experienceDetails: z.array(experienceSchema).nullable().describe("Experience details"),
  skills: z.array(z.string()).nullable().describe("Skills"),
  additionalCandidateDetails: z.record(z.string()).nullable().describe("Additional details"),
  jobApplicationDetails: jobApplicationDetailsSchema.describe("Job application details"),
  archivedDetails: z.record(z.string()).nullable().describe("Archived details")
});

export const jobCandidatesResponseSchema = z.array(jobCandidateSchema)
  .describe("Response for GET /v1/hire/jobs/{jobId}/candidates");

/** ── 5. Update Candidate Response ───────────────────────────────────────────────── */
export const updateCandidateResponseSchema = z.string()
  .describe("Response for PUT /v1/hire/jobs/{jobId}/candidate/{candidateId}");

/** ── 6. Add Candidate Note Response ───────────────────────────────────────────────── */
export const addCandidateNoteResponseSchema = z.string()
  .describe("Response for POST /v1/hire/jobs/{jobId}/candidate/{candidateId}/notes");

/** ── 7. Post Job Candidate Response ───────────────────────────────────────────────── */
export const postJobCandidateResponseSchema = z.string()
  .describe("Response for POST /v1/hire/jobs/{jobId}/candidate");

/** ── 8. Interviews Response ───────────────────────────────────────────────── */
const timeSchema = z.object({
  hours: z.number().describe("Hours"),
  minutes: z.number().describe("Minutes")
});

const interviewSchema = z.object({
  id: z.string().nullable().describe("Interview ID"),
  candidateId: z.string().nullable().describe("Candidate ID"),
  jobId: z.string().nullable().describe("Job ID"),
  interviewDate: z.string().nullable().describe("Interview date"),
  startTime: timeSchema.describe("Start time"),
  endTime: timeSchema.describe("End time"),
  timeZoneId: z.string().nullable().describe("Timezone ID"),
  scheduledBy: z.string().nullable().describe("Scheduled by"),
  scheduledDate: z.string().nullable().describe("Scheduled date"),
  interviewType: z.string().nullable().describe("Interview type"),
  stageId: z.string().nullable().describe("Stage ID"),
  panelMembers: z.string().nullable().describe("Panel members")
});

export const interviewsResponseSchema = z.array(interviewSchema)
  .describe("Response for GET /v1/hire/jobs/{jobId}/candidate/{candidateId}/interviews");

/** ── 9. Scorecards Response ───────────────────────────────────────────────── */
const scorecardSectionSchema = z.object({
  sectionName: z.string().nullable().describe("Section name"),
  skillTitle: z.string().nullable().describe("Skill title"),
  skillScore: z.string().nullable().describe("Skill score"),
  sectionComments: z.string().nullable().describe("Section comments")
});

const scorecardSchema = z.object({
  id: z.string().nullable().describe("Scorecard ID"),
  jobId: z.string().nullable().describe("Job ID"),
  candidateId: z.string().nullable().describe("Candidate ID"),
  stageId: z.string().nullable().describe("Stage ID"),
  interviewId: z.string().nullable().describe("Interview ID"),
  overallFeedbackDecision: z.string().nullable().describe("Overall feedback decision"),
  overallComments: z.string().nullable().describe("Overall comments"),
  feedbackSubmittedByName: z.string().nullable().describe("Feedback submitted by"),
  sections: z.array(scorecardSectionSchema).nullable().describe("Scorecard sections")
});

export const scorecardsResponseSchema = z.array(scorecardSchema)
  .describe("Response for GET /v1/hire/jobs/{jobId}/candidate/{candidateId}/scorecards");

/** ── 10. Candidate Resume Response ───────────────────────────────────────────────── */
const fileDownloadUrlSchema = z.object({
  fileUrl: z.string().nullable().describe("File download URL")
});

export const candidateResumeResponseSchema = fileDownloadUrlSchema
  .describe("Response for GET /v1/hire/jobs/candidate/{candidateId}/resume");

export const uploadCandidateResumeResponseSchema = z.string()
  .describe("Response for POST /v1/hire/jobs/candidate/{candidateId}/resume");

/** ── 11. Preboarding Candidates Response ───────────────────────────────────────────────── */
const preboardingCandidateSchema = z.object({
  id: z.string().nullable().describe("Candidate ID"),
  firstName: z.string().nullable().describe("First name"),
  middleName: z.string().nullable().describe("Middle name"),
  lastName: z.string().nullable().describe("Last name"),
  email: z.string().nullable().describe("Email"),
  countryCode: z.string().nullable().describe("Country code"),
  mobileNumber: z.string().nullable().describe("Mobile number"),
  jobtitle: z.string().nullable().describe("Job title"),
  gender: GenderEnum.describe("Gender"),
  department: z.string().nullable().describe("Department"),
  workLocation: z.string().nullable().describe("Work location"),
  expectedDateOfJoining: z.string().nullable().describe("Expected date of joining"),
  stage: PreboardingStageEnum.describe("Preboarding stage"),
  status: PreboardingStatusEnum.describe("Preboarding status")
});

const preboardingCandidatesPagedResultSchema = z.object({
  items: z.array(preboardingCandidateSchema).nullable().describe("Preboarding candidates"),
  page: z.number().describe("Current page"),
  pageSize: z.number().describe("Page size"),
  totalItems: z.number().describe("Total items"),
  totalPages: z.number().describe("Total pages"),
  sortBy: z.string().nullable().describe("Sort by field"),
  sortOrder: z.string().nullable().describe("Sort order")
});

export const preboardingCandidatesResponseSchema = preboardingCandidatesPagedResultSchema
  .describe("Response for GET /v1/hire/preboarding/candidates");

export const createPreboardingCandidateResponseSchema = z.string()
  .describe("Response for POST /v1/hire/preboarding/candidates");

export const updatePreboardingCandidateResponseSchema = z.boolean()
  .describe("Response for PUT /v1/hire/preboarding/candidates/{id}");

/** ── 12. Talent Pool Response ───────────────────────────────────────────────── */
const talentPoolSchema = z.object({
  id: z.string().nullable().describe("Talent pool ID"),
  name: z.string().nullable().describe("Talent pool name"),
  addedBy: z.string().nullable().describe("Added by"),
  addedOn: z.string().nullable().describe("Added on")
});

export const talentPoolsResponseSchema = z.array(talentPoolSchema)
  .describe("Response for GET /v1/hire/talentpool");

/** ── 13. Talent Pool Application Fields Response ───────────────────────────────────────────────── */
const talentPoolApplicationFieldSchema = z.object({
  fieldName: z.string().nullable().describe("Field name"),
  required: z.boolean().describe("Whether field is required"),
  fieldType: FieldTypeEnum.describe("Field type"),
  isSystemDefined: z.boolean().describe("Whether field is system defined"),
  fieldOptions: z.array(fieldOptionSchema).nullable().describe("Field options"),
  id: z.string().nullable().describe("Field ID")
});

export const talentPoolApplicationFieldsResponseSchema = z.array(talentPoolApplicationFieldSchema)
  .describe("Response for GET /v1/hire/talentpool/{talentPoolId}/applicationfields");

/** ── 14. Talent Pool Candidates Response ───────────────────────────────────────────────── */
const talentPoolCandidateSchema = z.object({
  id: z.string().nullable().describe("Candidate ID"),
  firstName: z.string().nullable().describe("First name"),
  lastName: z.string().nullable().describe("Last name"),
  middleName: z.string().nullable().describe("Middle name"),
  gender: GenderEnum.describe("Gender"),
  email: z.string().nullable().describe("Email"),
  phone: z.string().nullable().describe("Phone"),
  educationDetails: z.array(educationSchema).nullable().describe("Education details"),
  experienceDetails: z.array(experienceSchema).nullable().describe("Experience details"),
  skills: z.array(z.string()).nullable().describe("Skills"),
  additionalCandidateDetails: z.record(z.string()).nullable().describe("Additional details"),
  talentPoolDetails: z.record(z.string()).nullable().describe("Talent pool details")
});

export const talentPoolCandidatesResponseSchema = z.array(talentPoolCandidateSchema)
  .describe("Response for GET /v1/hire/talentpool/{talentPoolId}/candidates");

export const postTalentPoolCandidateResponseSchema = z.string()
  .describe("Response for POST /v1/hire/talentpool/{talentPoolId}/candidate");

/** ── 15. Assessment Response ───────────────────────────────────────────────── */
const assessmentSchema = z.object({
  assessmentId: z.string().uuid().describe("Assessment ID"),
  vendorAssessmentId: z.string().nullable().describe("Vendor assessment ID"),
  name: z.string().nullable().describe("Assessment name"),
  description: z.string().nullable().describe("Assessment description"),
  duration: z.number().describe("Assessment duration")
});

export const assessmentsResponseSchema = z.array(assessmentSchema)
  .describe("Response for GET /v1/hire/{vendorId}/assessments");

export const createAssessmentResponseSchema = z.string()
  .describe("Response for POST /v1/hire/{vendorId}/assessments");

export const updateAssessmentResponseSchema = z.boolean()
  .describe("Response for PUT /v1/hire/{vendorId}/assessments/{assessmentId}");

export const deleteAssessmentResponseSchema = z.boolean()
  .describe("Response for DELETE /v1/hire/{vendorId}/assessments/{assessmentId}");

/** ── 16. Assessment Request Response ───────────────────────────────────────────────── */
const assessmentRequestSchema = z.object({
  id: z.string().uuid().describe("Assessment request ID"),
  candidateId: z.string().nullable().describe("Candidate ID"),
  candidateName: z.string().nullable().describe("Candidate name"),
  candidateEmail: z.string().nullable().describe("Candidate email"),
  jobId: z.string().nullable().describe("Job ID"),
  assessmentId: z.string().uuid().nullable().describe("Assessment ID"),
  expiryInDays: z.number().describe("Expiry in days"),
  assessmentStatus: AssessmentStatusEnum.describe("Assessment status")
});

export const assessmentRequestsResponseSchema = z.array(assessmentRequestSchema)
  .describe("Response for GET /v1/hire/{vendorId}/assessmentrequests");

export const createAssessmentResultResponseSchema = z.string()
  .describe("Response for POST /v1/hire/{vendorId}/assessmentrequests/{assessmentRequestId}");