// src/tools/document/documentResponseSchemas.ts
import { z } from 'zod';

// 1. getAllDocumentTypes.ts
export const documentFieldOptionSchema = z
  .object({
    id: z.string().uuid().describe('Option UUID'),
    value: z.string().describe('Option value'),
  })
  .describe('A single selectable option for a document field');

export const documentFieldSchema = z
  .object({
    id: z.string().uuid().describe('Field UUID'),
    fieldName: z.string().describe('Name of the document field'),
    required: z.boolean().describe('Is this field required?'),
    fieldType: z.number().int().describe('Enum index for field type'),
    isSystemDefined: z.boolean().describe('True if system‐defined field'),
    fieldOptions: z
      .array(documentFieldOptionSchema)
      .describe('List of allowed options (if any)'),
    countryCode: z.string().length(2).describe('ISO country code'),
    entityFieldType: z.string().describe('Internal entity type mapping'),
  })
  .describe('Metadata for one field on a document type');

export const documentTypeSchema = z
  .object({
    id: z.string().uuid().describe('Document type UUID'),
    name: z.string().describe('Human‐readable document type name'),
    documentFields: z
      .array(documentFieldSchema)
      .describe('Schema for each field in this document type'),
  })
  .describe('One available document type');

/** Common pagination + wrapper */
const paginationWrapper = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      succeeded: z.boolean().describe('Was the request successful?'),
      message: z.string().describe('Server message'),
      errors: z.array(z.string()).describe('List of error messages'),
      data: z.array(item).describe('Payload array'),
      pageNumber: z.number().int().describe('Current page index'),
      pageSize: z.number().int().describe('Records per page'),
      firstPage: z.string().url().describe('URL to first page'),
      lastPage: z.string().url().describe('URL to last page'),
      totalPages: z.number().int().describe('Total pages available'),
      totalRecords: z.number().int().describe('Total records available'),
      nextPage: z.string().url().nullable().describe('URL to next page'),
      previousPage: z.string().url().nullable().describe('URL to previous page'),
    })
    .describe('Standard paginated response');

/** 1. document types list */
export const documentTypesResponseSchema = paginationWrapper(
  documentTypeSchema
).describe('Response schema for GET /documents/types');

/**
 * 2. attachment URL
 */
export const EmployeeDocumentAttachmentDownloadUrlResponseSchema = z
  .object({
    succeeded: z.boolean().describe('Was the request successful?'),
    message: z.string().describe('Server message'),
    errors: z.array(z.string()).describe('List of error messages'),
    data: z
      .object({ fileURL: z.string().url().describe('Signed URL to file') })
      .describe('Payload containing the attachment URL'),
  })
  .describe(
    'Response schema for GET /employees/{id}/documents/{docId}/attachment/{attId}'
  );

/**
 * 3. list documents of a given type for an employee
 */
export const documentAttributeSchema = z
  .object({
    id: z.string().uuid().describe('Attribute UUID'),
    title: z.string().describe('Attribute title'),
    type: z.string().describe('Attribute type hint'),
    value: z.string().describe('Attribute value'),
  })
  .describe('One attribute on an employee document');

export const documentListItemSchema = z
  .object({
    id: z.string().uuid().describe('Document UUID'),
    name: z.string().describe('Document name'),
    attributes: z
      .array(documentAttributeSchema)
      .describe('Metadata attributes for this document'),
    attachments: z
      .array(
        z
          .object({
            id: z.string().uuid().describe('Attachment UUID'),
            name: z.string().describe('Attachment filename'),
          })
          .describe('One document attachment')
      )
      .describe('List of attachments uploaded for this document'),
  })
  .describe('One document instance for an employee');

export const documentListResponseSchema = paginationWrapper(
  documentListItemSchema
).describe(
  'Response schema for GET /employees/{id}/documenttypes/{typeId}/documents'
);

/**
 * 4. create a new document of a given type
 */
export const createDocumentResponseSchema = z
  .object({
    succeeded: z.boolean().describe('Was the request successful?'),
    message: z.string().describe('Server message'),
    errors: z.array(z.string()).describe('List of error messages'),
    data: z
      .string()
      .uuid()
      .describe('UUID of the newly created document record'),
  })
  .describe('Response schema for POST /employees/{id}/documenttypes/{typeId}');
