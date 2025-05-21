// src/tools/psa/receivePayment.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";

/** 1️⃣ Path‐params schema */
export const receivePaymentPath = z
  .object({
    clientId:  z.string().uuid().describe("UUID of the PSA client"),
    invoiceId: z.string().uuid().describe("UUID of the invoice"),
  })
  .describe("Path parameters for receiving a payment");

/** 2️⃣ Body‐params schema */
export const receivePaymentBody = z
  .object({
    paymentAmount:    z.number().describe("Amount being paid"),
    paymentDate:      z.string().datetime().describe("Date of payment (ISO 8601)"),
    referenceNumber:  z.string().describe("Payment reference or transaction ID"),
    paymentMode:      z.number().int().describe("Enum for payment mode (e.g. 0=Cash,1=Card,…)"),
  })
  .describe("Payload for receiving a payment against an invoice");

/**
 * 3️⃣ Call the Keka API to record a payment
 */
export async function receivePayment(
  env: Env,
  path: z.infer<typeof receivePaymentPath>,
  body: z.infer<typeof receivePaymentBody>
) {
  const token = await getAuthToken(env);
  const { clientId, invoiceId } = path;
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/psa/clients/${clientId}/invoices/${invoiceId}/receivepayment`;

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
