// src/tools/corehr/updatePersonalDetails.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path params schema */
export const updatePersonalDetailsParams = z.object({
  id: z.string().describe("Employee identifier (UUID)")
});

/** 2️⃣ Relation object schema */
const relationSchema = z.object({
  id:           z.string().optional().describe("Relation record ID (UUID)"),
  relationType: z.coerce.number().int().describe("RelationType: 0=Others, 1=Spouse, 2=Father, 3=Mother, 4=Child, 5=Self, 6=Sibling, 7=Partner, 8=FatherInLaw, 9=MotherInLaw. There can be multiple relations"),
  gender:       z.coerce.number().int().describe("Gender: 0=NotSpecified,1=Male,2=Female,3=Nonbinary,4=PreferNotToRespond/ Only one relation at a time"),
  firstName:    z.string().optional().describe("First name of the relation"),
  lastName:     z.string().optional().describe("Last name of the relation"),
  displayName:  z.string().optional().describe("Display name"),
  email:        z.string().email().optional().describe("Email address"),
  dateOfBirth:  z.string().optional().describe("ISO 8601 birthdate. If only date is provided, it will be auto-generated as YYYY-MM-DD and time will be set to 00:00:00"),
  profession:   z.string().optional().describe("Profession/title"),
  mobile:       z.string().optional().describe("Mobile number")
});

/** 3️⃣ Address object schema (shared) */
const addressSchema = z.object({
  addressLine1: z.string().optional().describe("Address line 1"),
  addressLine2: z.string().optional().describe("Address line 2"),
  countryCode:  z.string().optional().describe("ISO country code"),
  city:         z.string().optional().describe("City"),
  state:        z.string().optional().describe("State/Province"),
  zip:          z.string().optional().describe("Postal/ZIP code")
});

/// 4️⃣ Custom fields body schema
const customFieldSchema = z.object({
  id:    z.string().describe("Custom field ID"),
  value: z.string().describe("Custom field value")
});

/** 4️⃣ Request body schema */
export const updatePersonalDetailsSchema = z
  .object({
    displayName:        z.string().optional().describe("Full display name"),
    firstName:          z.string().optional().describe("First name"),
    middleName:         z.string().optional().describe("Middle name"),
    lastName:           z.string().optional().describe("Last name"),
    gender:             z.coerce.number().int().describe("Gender: 0=NotSpecified,1=Male,2=Female,3=Nonbinary,4=PreferNotToRespond"),
    dateOfBirth:        z.string().optional().describe("ISO 8601 birthdate. If only date is provided, it will be auto-generated as YYYY-MM-DD and time will be set to 00:00:00"),
    workPhone:          z.string().optional().describe("Work phone number"),
    homePhone:          z.string().optional().describe("Home phone number"),
    personalEmail:      z.string().email().optional().describe("Personal email"),
    skypeId:            z.string().optional().describe("Skype ID"),
    maritalStatus:      z.coerce. number().int().describe("MaritalStatus: 0=None,1=Single,2=Married,3=Widowed,4=Separated"),
    marriageDate:       z.string().optional().describe("ISO 8601 marriage date. If only date is provided, it will be auto-generated as YYYY-MM-DD and time will be set to 00:00:00"),
    relations:          z.array(relationSchema).optional().describe("List of relations"),
    bloodGroup:         z.coerce.number().int().optional().describe("BloodGroup: 0 =Not Available, 1=A Positive, 2 + A- (A Negative), 3=B+ (B Positive), 4=B- (B Negative), 5=AB+ (AB Positive), 6=AB- (AB Negative), 7=O+ (O Positive), 8=O- (O Negative), 9=A2+ (A2 Positive), 10=A1+ (A1 Positive), 11=A1- (A1 Negative), 12=A1B- (A1B Negative), 13=A1B+ (A1B Positive), 14=A2- (A2 Negative),15=A2B+ (A2B Positive), 16=A2B- (A2B Negative), 17=B1+ (B1 Positive) "),
    currentAddress:     addressSchema.optional().describe("Current address"),
    permanentAddress:   addressSchema.optional().describe("Permanent address"),
    professionalSummary:z.string().optional().describe("Professional summary"),
    nationality:        z.string().optional().describe("Nationality"),
    customFields: z.array(customFieldSchema).optional().describe("Custom fields. This is a map of custom field IDs to their values. The ID must be a valid custom field ID, and the value must be a string. IDs can be obtained from getallupdatefields API"),
  })
  .partial(); // makes all above optional, but you can remove .partial() if some must remain required

/**
 * 5️⃣ Call the Keka API to update personal details
 */
export async function updatePersonalDetails(
  env: Env,
  id: string,
  payload: z.infer<typeof updatePersonalDetailsSchema>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hris/employees/${encodeURIComponent(id)}/personaldetails`;

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
  return res.json();
}
