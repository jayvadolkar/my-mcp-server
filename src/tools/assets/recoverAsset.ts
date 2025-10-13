// src/tools/assets/recoverAsset.ts
import { z } from "zod";
import { getAuthToken } from "../../auth";
import { Env } from "../../index";
import { handleApiError } from "../common/errorHandler";

/** 1️⃣ Parameters schema for the tool */
export const recoverAssetParams = z.object({
  assetId: z.string().uuid().describe("The asset identifier (UUID)"),
});

/**
 * 2️⃣ Call the Keka API to recover an asset
 */
export async function recoverAsset(
  env: Env,
  assetId: string
) {
  const token = await getAuthToken(env);
  const url = `https://${env.COMPANY}.${env.ENVIRONMENT}.com/api/v1/assets/${encodeURIComponent(assetId)}/recover`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    await handleApiError(res, "PUT", url);
  }
  return res.json();
}
