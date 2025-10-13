// src/tools/assets/updateAssetAssignment.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Request body schema for asset assignment */
export const updateAssetAssignmentBody = z
  .object({
    assignedTo: z
      .string()
      .optional()
      .nullable()
      .describe("Employee ID to assign the asset to"),
    assignedOn: z
      .string()
      .datetime()
      .optional()
      .nullable()
      .describe("Date and time when the asset is assigned (ISO 8601 format)"),
    assetConditionId: z
      .string()
      .optional()
      .nullable()
      .describe("Asset condition identifier"),
    note: z
      .string()
      .optional()
      .nullable()
      .describe("Additional notes for the assignment"),
  })
  .describe("Asset assignment details");

/** 2️⃣ Parameters schema for the tool */
export const updateAssetAssignmentParams = z.object({
  assetId: z.string().uuid().describe("The asset identifier (UUID)"),
  body: updateAssetAssignmentBody,
});

/**
 * 3️⃣ Call the Keka API to update asset assignment
 */
export async function updateAssetAssignment(
  env: Env,
  assetId: string,
  body: z.infer<typeof updateAssetAssignmentBody>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/assets/${encodeURIComponent(assetId)}/allocation`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}
