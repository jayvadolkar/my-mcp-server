// src/tools/hire/getJobBoards.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

export async function getJobBoards(env: Env) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/hire/jobboards`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    await handleApiError(res, "GET", url);
  }
  return res.json();
}