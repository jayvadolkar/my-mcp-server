// src/tools/psa/createCreditNote.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const createCreditNotePath = z
  .object({
    clientId: z.string().uuid().describe("UUID of the PSA client"),
  })
  .describe("Path parameters for creating a credit note");

/** 2️⃣ Body‐params schema */
export const createCreditNoteBody = z
  .object({
    billingLegalEntity: z
      .string()
      .uuid()
      .describe("UUID of the legal entity to bill"),
    invoiceId: z
      .string()
      .uuid()
      .describe("UUID of the original invoice"),
    taxGroupId: z
      .string()
      .uuid()
      .describe("UUID of the tax group"),
    taxId: z
      .string()
      .uuid()
      .describe("UUID of the specific tax rate"),
    cnDate: z
      .string()
      .datetime()
      .describe("Date of the credit note (ISO 8601)"),
    taxAmount: z
      .number()
      .describe("Total tax amount on the credit note"),
    discount: z
      .number()
      .describe("Total discount on the credit note"),
    totalAmount: z
      .number()
      .describe("Grand total amount of the credit note"),
    clientContactIds: z
      .array(z.string().uuid())
      .describe("List of client contacts UUIDs to notify"),
    lineItems: z
      .array(
        z
          .object({
            lineItemType: z
              .number()
              .int()
              .describe("Enum: 0=Service, 1=Product, etc."),
            description: z.string().describe("Description of the item"),
            quantity: z.number().describe("Quantity of the item"),
            rate: z.number().describe("Unit rate"),
            totalAmount: z.number().describe("Line total before discount/tax"),
            discountType: z
              .number()
              .int()
              .describe("Enum: 0=None,1=Percentage,2=Fixed"),
            discount: z
              .number()
              .describe("Discount amount"),
            taxRate: z
              .number()
              .describe("Applicable tax rate (%)"),
          })
          .describe("One line item")
      )
      .describe("Array of line items"),
    note: z.string().optional().describe("Optional note or comment"),
  })
  .describe("Payload for creating a credit note");

/**
 * 3️⃣ Call the Keka API to create a credit note for a client
 */
export async function createCreditNote(
  env: Env,
  path: z.infer<typeof createCreditNotePath>,
  body: z.infer<typeof createCreditNoteBody>
) {
  const token = await getAuthToken(env);
  const { clientId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/clients/${clientId}/creditnote`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":  "application/json",
      Accept:          "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`PUT ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
