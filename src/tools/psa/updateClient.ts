// src/tools/psa/updateClient.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Path‐params schema */
export const updateClientPath = z
  .object({
    clientId: z.string().uuid().describe("UUID of the PSA client"),
  })
  .describe("Path parameters for updating a PSA client");

/** 2️⃣ Body‐params schema */
export const updateClientBody = z
  .object({
    billingAddress: z
      .object({
        addressLine1: z.string(),
        addressLine2: z.string().optional(),
        countryCode: z.string().length(2),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      })
      .describe("Updated billing address"),
    name:        z.string().describe("Updated client name"),
    description: z.string().optional().describe("Updated description"),
    code:        z.string().describe("Updated client code"),
  })
  .describe("Payload for updating a PSA client");

/**
 * 3️⃣ Call the Keka API to update a PSA client
 */
export async function updateClient(
  env: Env,
  path: z.infer<typeof updateClientPath>,
  body: z.infer<typeof updateClientBody>
) {
  const token = await getAuthToken(env);
  const { clientId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/clients/${clientId}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":  "application/*+json",
      Accept:          "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}
