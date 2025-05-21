// src/tools/psa/createClient.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Body‐params schema */
export const createClientBody = z
  .object({
    code:        z.string().describe("Unique client code"),
    name:        z.string().describe("Client name"),
    description: z.string().optional().describe("Client description"),
    billingInfo: z
      .object({
        billingCurrencyId: z.string().uuid().describe("Currency UUID for billing. you can get currencies IDs from getallcurrencies API"),
        billingAddress: z
          .object({
            addressLine1: z.string(),
            addressLine2: z.string().optional(),
            countryCode: z.string().length(2),
            city:        z.string(),
            state:       z.string(),
            zip:         z.string(),
          })
          .describe("Billing address"),
      })
      .describe("Billing configuration for the client"),
    phone:   z.string().optional().describe("Contact phone number"),
    website: z.string().url().optional().describe("Client website URL"),
    email:   z.string().email().optional().describe("Contact email"),
  })
  .describe("Payload for creating a new PSA client");

/**
 * 2️⃣ Call the Keka API to create a PSA client
 */
export async function createClient(
  env: Env,
  body: z.infer<typeof createClientBody>
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/clients`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":  "application/json",
      Accept:          "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
