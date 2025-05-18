/**
 * File: src/tools/corehr/getAllEmployees.ts
 * 
 * Employee Retrieval Tool Implementation
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAuthToken, getApiBaseUrl, updateTokenCache } from "../../auth";

/**
 * Fetches all employees from the Keka API with optional filtering.
 */
export async function getAllEmployees(
  env: any, 
  state: { activeTokens: Record<string, string> }, 
  filters: any = {}
): Promise<any> {
  // Get authentication token
  const token = await getAuthToken(env, state);
  const baseUrl = getApiBaseUrl(env);
  
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.pageNumber) queryParams.append('pageNumber', filters.pageNumber.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());
    if (filters.searchKey) queryParams.append('searchKey', filters.searchKey);
    if (filters.department) queryParams.append('department', filters.department);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.status) queryParams.append('status', filters.status);
  }
  
  // Add default page size if not specified
  if (!filters?.pageSize) {
    queryParams.append('pageSize', '50');
  }
  
  try {
    // Construct the API URL
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const url = `${baseUrl}/employees${queryString}`;
    
    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Handle error responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    // Parse and return the response
    const result = await response.json();
    return result;
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching employees:', error);
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }
}

/**
 * Registers employee tools with the MCP server.
 */
export function registerCoreHrTools(
  server: McpServer, 
  env: any, 
  state: { activeTokens: Record<string, string> }
): void {
  // Register the getAllEmployees tool
  server.tool(
  'getAllEmployees',
  {
    filters: z.object({
      pageNumber: z.number().optional().describe('Page number for pagination'),
      pageSize: z.number().optional().describe('Number of employees per page'),
      searchKey: z.string().optional().describe('Search term for employee name, email, etc.'),
      department: z.string().optional().describe('Filter by department'),
      location: z.string().optional().describe('Filter by location'),
      status: z.string().optional().describe('Filter by employment status'),
    }).optional().describe('Optional filters to apply to the employee list'),
  },
  async (args) => {
      try {
        // Get the filters from the arguments
        const filters = args.filters || {};
        
        // Call the API function to get employees
        const response = await getAllEmployees(env, state, filters);
        
        // Update token cache
        const newToken = await getAuthToken(env, state);
        const newState = updateTokenCache(state, env, newToken);
        
        // Format the response
        const totalEmployees = response.totalRecords || 0;
        const currentPage = response.pageNumber || 1;
        const employeeList = response.data || [];
        
        let responseText = `Found ${totalEmployees} employees (Page ${currentPage}):\n\n`;
        
        if (employeeList.length === 0) {
          responseText += "No employees found matching the criteria.";
        } else {
          // Format employee data for readability
          const formattedEmployees = employeeList.map((emp: any) => ({
            id: emp.id,
            name: `${emp.firstName} ${emp.lastName}`,
            email: emp.email,
            department: emp.department?.name || 'N/A',
            position: emp.position?.name || 'N/A',
            manager: emp.manager ? `${emp.manager.firstName} ${emp.manager.lastName}` : 'N/A',
            status: emp.status || 'Active',
          }));
          
          // Convert to JSON string
          responseText += JSON.stringify(formattedEmployees, null, 2);
        }
        
        return {
          content: [
            {
              type: 'text', 
              text: responseText
            }
          ],
        };
      } catch (err) {
        const error = err as Error;
        console.error('Error in getAllEmployees tool:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error getting employees: ${error.message}`
            }
          ],
        };
      }
    }
  );
  
  console.log("Registered CoreHR tools");
}