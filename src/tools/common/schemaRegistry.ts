// src/tools/common/schemaRegistry.ts
import { z, ZodSchema } from "zod";
import * as leave from "../leave/leaveresponseschemas";
// new Document schemas
import * as document from "../document/documentResponseSchemas";

const registry: Record<string, ZodSchema> = {
  leaveTypesResponse:           leave.leaveTypesResponseSchema,
  leaveBalanceResponse:         leave.leaveBalanceResponseSchema,
  leaveRequestsResponse:        leave.leaveRequestsResponseSchema,
  createLeaveRequestResponse:   leave.createLeaveRequestResponseSchema,
  leavePlansResponse:           leave.leavePlansResponseSchema,

  // Document
  documentTypesResponse:        document.documentTypesResponseSchema,
  documentAttachmentResponse:   document.EmployeeDocumentAttachmentDownloadUrlResponseSchema,
  documentListResponse:         document.documentListResponseSchema,
  createDocumentResponse:       document.createDocumentResponseSchema,
};

export const schemaRegistryParams = z.object({
  key: z.string().describe(
    "One of: " + Object.keys(registry).join(", ")
  )
});

export async function getSchema(
  _env: unknown,
  { key }: z.infer<typeof schemaRegistryParams>
) {
  const schema = registry[key];
  if (!schema) throw new Error(`Unknown schema key: ${key}`);
  return {
    name:        key,
    description: schema.description,
    shape:       (schema as any)._def
  };
}
