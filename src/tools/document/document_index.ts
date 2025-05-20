import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "../../index";

import { getAllDocumentTypes, getAllDocumentTypesQuery } from "./getAllDocumentTypes";
import { getEmployeeDocumentAttachmentDownloadUrl, getEmployeeDocumentAttachmentDownloadUrlParams} from "./getEmployeeDocumentAttachmentDownloadUrl";
import { getEmployeeDocuments, getEmployeeDocumentsParams, getEmployeeDocumentsQuery} from "./getEmployeeDocuments";
import { uploadEmployeeDocuments, uploadEmployeeDocumentsParams} from "./uploadEmployeeDocuments";


export function registerDocumentTools(server: McpServer, env: Env) {
    // ── GET /hris/documents/types ────────────────────────────────
    server.tool(
        "getAllDocumentTypes",
        "Use this tool to get all differnt document types of the employee",
        { query: getAllDocumentTypesQuery },
        async ({ query }) => {
          try {
            const types = await getAllDocumentTypes(env, query);
         return {
           content: [
             { type: "text", text: JSON.stringify(types, null, 2) }
           ],
        };
          } catch (e: any) {
            return {
              content: [
                { type: "text", text: `Error fetching document types: ${e.message}` }
          ],
              isError: true
            };
          }
        }
   );
   
   // ── GET /hris/employees/{employeeId}/documents/{documentId}/attachment/{attachmentId} ──
  server.tool(
    "getEmployeeAttachmentDownloadURL",
    "Use this tool to get downloadable URL for documents of an employee",
    {
      employeeId:   getEmployeeDocumentAttachmentDownloadUrlParams.shape.employeeId,
      documentId:   getEmployeeDocumentAttachmentDownloadUrlParams.shape.documentId,
      attachmentId: getEmployeeDocumentAttachmentDownloadUrlParams.shape.attachmentId
    },
    async ({ employeeId, documentId, attachmentId }) => {
      try {
        const attachment = await getEmployeeDocumentAttachmentDownloadUrl(env, employeeId, documentId, attachmentId);
        return {
          content: [
            { type: "text", text: JSON.stringify(attachment, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching attachment: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
  // ── GET /hris/employees/{employeeId}/documenttypes/{documentTypeId}/documents ──
  server.tool(
    "getEmployeeDocuments",
    "Use this tool to get all documents for an employee",
    {
      employeeId:     getEmployeeDocumentsParams.shape.employeeId,
      documentTypeId: getEmployeeDocumentsParams.shape.documentTypeId,
      query:          getEmployeeDocumentsQuery
    },
    async ({ employeeId, documentTypeId, query }) => {
      try {
        const docs = await getEmployeeDocuments(env, employeeId, documentTypeId, query);
        return {
          content: [
            { type: "text", text: JSON.stringify(docs, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error fetching employee documents: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
    // ── POST /hris/employees/{employeeId}/documenttypes/{documentTypeId} ─────────────
  server.tool(
    "uploadEmployeeDocuments",
    "This tool can be used to upload documents for an employee",
    {
      employeeId:     uploadEmployeeDocumentsParams.shape.employeeId,
      documentTypeId: uploadEmployeeDocumentsParams.shape.documentTypeId
    },
    async ({ employeeId, documentTypeId }) => {
      try {
        const result = await uploadEmployeeDocuments(env, employeeId, documentTypeId);
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            { type: "text", text: `Error uploading documents: ${e.message}` }
          ],
          isError: true
        };
      }
    }
  );
}