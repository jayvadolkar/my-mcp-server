import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";
import { getAllAssets, getAllAssetsQuery } from "./getAllAssets";
import { updateAssetAssignment, updateAssetAssignmentParams } from "./updateAssetAssignment";
import { recoverAsset, recoverAssetParams } from "./recoverAsset";
import { getAllAssetTypes, getAllAssetTypesQuery } from "./getAllAssetTypes";
import { getAllAssetCategories, getAllAssetCategoriesQuery } from "./getAllAssetCategories";
import { getAllAssetConditions, getAllAssetConditionsQuery } from "./getAllAssetConditions";

export function registerAssetsTools(server: McpServer, env: Env) {
  // ── GET /assets ─────────────────────────────────────────────────────────────
  server.tool(
    "getAllAssets",
    "Use this tool to fetch all assets. AssetStatus enums: 0 = Available, 1 = Assigned, 2 = Retired",
    { query: getAllAssetsQuery },
    async ({ query }) => {
      try {
        const assets = await getAllAssets(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(assets, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching all assets: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // ── PUT /assets/{assetId}/allocation ────────────────────────────────────────
  server.tool(
    "updateAssetAssignment",
    "Use this tool to update asset assignment/allocation. Assign or reassign an asset to an employee with condition and notes.",
    updateAssetAssignmentParams.shape,
    async ({ assetId, body }) => {
      try {
        const result = await updateAssetAssignment(env, assetId, body);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error updating asset assignment: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // ── PUT /assets/{assetId}/recover ──────────────────────────────────────────
  server.tool(
    "recoverAsset",
    "Use this tool to recover an asset. This marks the asset as recovered and updates its status.",
    recoverAssetParams.shape,
    async ({ assetId }) => {
      try {
        const result = await recoverAsset(env, assetId);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error recovering asset: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // ── GET /assets/types ───────────────────────────────────────────────────────
  server.tool(
    "getAllAssetTypes",
    "Use this tool to fetch all asset types. Returns a paginated list of asset type IDs and names.",
    { query: getAllAssetTypesQuery },
    async ({ query }) => {
      try {
        const assetTypes = await getAllAssetTypes(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(assetTypes, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching asset types: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // ── GET /assets/categories ──────────────────────────────────────────────────
  server.tool(
    "getAllAssetCategories",
    "Use this tool to fetch all asset categories. Returns a paginated list of asset category IDs and names.",
    { query: getAllAssetCategoriesQuery },
    async ({ query }) => {
      try {
        const assetCategories = await getAllAssetCategories(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(assetCategories, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching asset categories: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );

  // ── GET /assets/conditions ──────────────────────────────────────────────────
  server.tool(
    "getAllAssetConditions",
    "Use this tool to fetch all asset conditions. Returns a paginated list of asset condition IDs and names.",
    { query: getAllAssetConditionsQuery },
    async ({ query }) => {
      try {
        const assetConditions = await getAllAssetConditions(env, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(assetConditions, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching asset conditions: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
}
