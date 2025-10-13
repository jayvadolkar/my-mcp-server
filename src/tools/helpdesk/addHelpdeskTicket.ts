// src/tools/helpdesk/addHelpdeskTicket.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Parameters schema - empty since no body is specified in the API */
export const addHelpdeskTicketParams = z.object({});

/**
 * 2️⃣ Call the Keka API to add a helpdesk ticket
 */
export async function addHelpdeskTicket(env: Env) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/helpdesk/tickets`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    await handleApiError(res, "POST", url);
  }
  return res.json();
}
