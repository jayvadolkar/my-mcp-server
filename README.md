# KekaHR MCP Server 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Cloudflare_Workers-orange.svg)](https://workers.cloudflare.com/)
[![MCP](https://img.shields.io/badge/MCP-Model_Context_Protocol-blue.svg)](https://modelcontextprotocol.github.io/)

A Model Context Protocol (MCP) server for Keka HRIS API integration. This project enables powerful AI-assisted HR operations by exposing Keka's comprehensive HR APIs through a clean, standardized MCP interface.

## Table of Contents

- [Overview](#overview)
- [Why This Project Exists](#why-this-project-exists)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Deployment](#deployment)
- [Available Tools](#available-tools)
  - [Core HR Tools](#core-hr-tools)
  - [Document Tools](#document-tools)
  - [Leave Management Tools](#leave-management-tools)
  - [Attendance Tools](#attendance-tools)
  - [Payroll Tools](#payroll-tools)
  - [PSA (Professional Services Automation) Tools](#psa-professional-services-automation-tools)
- [Changelog](#changelog)
- [Future Scope](#future-scope)
- [Contributing](#contributing)
- [About KekaHR](#about-kekahr)
- [About MCP](#about-mcp)
- [License](#license)

## Overview

This project implements a Model Context Protocol (MCP) server for the Keka HRIS API, enabling seamless integration between Large Language Models (LLMs) and Keka's HR management system. By leveraging Cloudflare Workers and the MCP framework, this server provides a standardized interface for accessing various HR functionalities like employee management, leave tracking, attendance management, document handling, and payroll processing.

The server acts as a bridge between AI assistants and the Keka HR platform, allowing AI models to perform complex HR operations through natural language instructions.

## Why This Project Exists

As organizations increasingly adopt AI assistants in their workflows, there's a growing need to connect these assistants to enterprise systems. HR management is one area where AI can significantly reduce administrative burden and improve employee experience.

Traditional integrations require custom code for each AI assistant and HR system combination. The Model Context Protocol (MCP) solves this by defining a standard way for AI models to interact with external systems.

This project specifically targets Keka HRIS, a comprehensive human resources management system, making its features accessible to AI assistants through the MCP standard. With this integration, AI assistants can:

- Look up employee information
- Process leave requests
- Manage documents
- Track attendance
- Handle payroll inquiries
- And much more!

All this without requiring custom integrations for each AI assistant vendor.

## Features

- **Authentication Handling**: Secure token-based authentication with Keka API
- **MCP Server Implementation**: Fully compliant MCP server implementation using Cloudflare Workers
- **Comprehensive API Coverage**: Access to all major Keka HRIS modules:
  - Core HR (employee management)
  - Document management
  - Leave management
  - Attendance tracking
  - Payroll processing
  - Professional Services Automation (PSA)
- **Schema Registry**: Built-in schema registry for providing information about data structures
- **Error Handling**: Robust error reporting and propagation
- **Scalable Architecture**: Built on Cloudflare's edge computing platform for global scalability

## Project Structure

```
my-mcp-server/
├── .gitignore
├── package.json
├── tsconfig.json
├── wrangler.jsonc
└── src/
    ├── index.ts                     # Main entry point
    ├── auth.ts                      # Authentication handling
    └── tools/
        ├── common/                  # Common utilities and schema registry
        │   ├── schemaRegistry.ts
        │   └── schemaRegistry_index.ts
        ├── corehr/                  # Core HR API tools
        │   ├── corehrResponseSchemas.ts
        │   ├── corehr_index.ts
        │   └── ...
        ├── document/                # Document management tools
        │   ├── documentResponseSchemas.ts
        │   ├── document_index.ts
        │   └── ...
        ├── leave/                   # Leave management tools
        │   ├── leaveresponseschemas.ts
        │   ├── leave_index.ts
        │   └── ...
        ├── attendance/              # Attendance tracking tools
        │   ├── attendanceResponseSchemas.ts
        │   ├── attendance_index.ts
        │   └── ...
        ├── payroll/                 # Payroll processing tools
        │   ├── payrollResponseSchemas.ts
        │   ├── payroll_index.ts
        │   └── ...
        └── psa/                     # PSA tools
            ├── psaResponseSchema.ts
            ├── psa_index.ts
            └── ...
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare Workers CLI)
- A Cloudflare account
- Keka HRIS API credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kekahr-mcp.git
   cd kekahr-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a local development `.dev.vars` file:
   ```
   COMPANY=your-subdomain-here
   ENVIRONMENT=your-domain-here
   KEKA_API_KEY=your-apikey-here
   KEKA_CLIENT_ID=your-client-id
   KEKA_CLIENT_SECRET=your-secret
   KEKA_GRANT_TYPE=kekaapi
   KEKA_SCOPE=kekaapi
   ```

### Configuration

The main configuration is managed through Wrangler. You need to edit the `wrangler.jsonc` file to set up your environment variables:

```json
"vars": {
  "COMPANY": "your-subdomain-here",
  "ENVIRONMENT": "your-domain-here",
  "KEKA_API_KEY": "your-apikey-here",
  "KEKA_CLIENT_ID": "your-client-id",
  "KEKA_CLIENT_SECRET": "your-secret",
  "KEKA_GRANT_TYPE": "kekaapi",
  "KEKA_SCOPE": "kekaapi"
}
```

Replace these placeholder values with your actual Keka API credentials.

> **Important**: For production deployments, use Cloudflare's secret management rather than storing sensitive values in `wrangler.jsonc`.

### Deployment

1. Login to Cloudflare (if not already logged in):
   ```bash
   wrangler login
   ```

2. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   # or
   wrangler deploy
   ```

3. Once deployed, you'll receive a URL for your MCP server, which can be used to connect AI assistants to your Keka HRIS system.

## Available Tools

The MCP server provides tools across multiple Keka modules. Here's an overview of the available tools:

### Core HR Tools

- `getAllEmployees`: Fetch employee data with filtering options
- `createAnEmployee`: Create a new employee record
- `getAnEmployee`: Get details for a specific employee by ID
- `updateEmployeePersonalDetails`: Update personal details of an employee
- `updateEmployeeJobDetails`: Update job-related details of an employee
- `getUpdateFields`: Get available fields for employee updates
- `getGroups`: Get organizational groups (departments, teams, etc.)
- `getAllGroupTypes`: Get all group types in the organization
- `getAllDepartments`: Get all departments
- `getAllLocations`: Get all office locations
- `getAllJobTitles`: Get all job titles
- `getAllNoticePeriods`: Get all notice periods
- `getAllCurrencies`: Get all currencies
- `getAllContingentTypes`: Get all contingent worker types
- `deactivateAnEmployee`: Update the exit request for an employee
- `deactivateEmployee`: Request an exit for an employee
- `getAllExitReasons`: Get all exit reasons

### Document Tools

- `getAllDocumentTypes`: Get all document types 
- `getEmployeeAttachmentDownloadURL`: Get download URL for employee documents
- `getEmployeeDocuments`: Get all documents for an employee
- `uploadEmployeeDocuments`: Upload documents for an employee

### Leave Management Tools

- `getLeaveTypes`: Get all leave types
- `getLeaveBalance`: Get leave balance for employees
- `getLeaveRequests`: Get leave requests with filtering
- `createLeaveRequest`: Create a new leave request
- `getLeavePlans`: Get all leave plans

### Attendance Tools

- `getAllAttendanceRecords`: Fetch attendance records
- `getCaptureScheme`: Get attendance capture schemes
- `getShiftPolicies`: Get shift policies
- `getPenalisationPolicies`: Get attendance tracking policies
- `getWeeklyOffPolicies`: Get weekly-off policies
- `getHolidaysCalendar`: Get holiday calendars
- `getHolidays`: Get holidays list for a calendar
- `createOd`: Create an On-Duty request
- `createWfh`: Create a Work-From-Home request
- `createTimeEntry`: Create a manual attendance entry

### Payroll Tools

- `getAllEmployeesSalaries`: Fetch employee salary details
- `getSalaryComponents`: Get all salary components
- `getPayGroups`: Get all pay groups
- `getPayCycles`: Get pay cycles for a paygroup
- `getPayRegister`: Get pay register for a cycle
- `getPayBatches`: Get pay batches
- `getPaymentsBatches`: Get payments for a batch
- `updatePaymentsStatus`: Update payment statuses
- `getPayBands`: Get pay bands
- `getPayGrades`: Get pay grades
- `getFnf`: Get full and final settlement details
- `getBonusTypes`: Get bonus types
- `getFinancialDetails`: Get financial details for employees
- `getSalaryStructures`: Get salary structures
- `addEmployeeSalary`: Add a salary record for an employee
- `updateEmployeeSalary`: Update an employee's salary
- `getForm16`: Get Form 16 for an employee

### PSA (Professional Services Automation) Tools

- `getClients`: Fetch PSA clients
- `createClient`: Create a new PSA client
- `getClient`: Get a specific PSA client
- `updateClient`: Update a PSA client
- `getBillingRoles`: Get billing roles for a client
- `createCreditNote`: Create a credit note
- `getInvoices`: Get invoices for a client
- `post_receivePayment`: Record a payment receipt
- `getTaxes`: Get taxes for a legal entity
- `getTaxGroups`: Get tax groups
- `getProjectPhases`: Get phases for a project
- `createProjectPhase`: Create a new project phase
- `getProjects`: Get all projects
- `createProject`: Create a new project
- `getProjectById`: Get a specific project
- `updateProject`: Update a project
- `getProjectAllocations`: Get resource allocations for a project
- `createProjectAllocations`: Create a resource allocation
- `getProjectTimesheetEntries`: Get timesheet entries
- `getProjectResources`: Get project resources
- `getProjectTasks`: Get tasks for a project
- `createProjectTask`: Create a new project task
- `updateProjectTask`: Update a project task
- `getProjectTaskTimeEntries`: Get time entries for a task
- `addEmployeeTimeEntries`: Add timesheet entries for an employee

## Changelog

### v1.0.0 (Initial Release)
- Implemented MCP server architecture
- Added authentication with Keka API
- Integrated Core HR module tools
- Integrated Document module tools
- Integrated Leave Management module tools
- Integrated Attendance module tools
- Integrated Payroll module tools
- Integrated PSA module tools
- Added schema registry

## Future Scope

- **Real-time Updates**: Implement webhooks for real-time synchronization
- **Advanced Analytics**: Add tools for HR analytics and reporting
- **Performance Management**: Add tools for performance reviews and goal tracking
- **Enhanced Security**: Implement more granular access controls
- **Recruitment Module**: Extend to cover Keka's recruitment features
- **Multi-tenant Support**: Support for multiple Keka instances
- **Customizable Schemas**: Allow customization of data schemas
- **AI-driven Insights**: Integrate with Cloudflare AI for HR insights
- **Integration with Other Enterprise Systems**: Expand beyond HR to other enterprise systems

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## About KekaHR

[Keka](https://www.keka.com/) is a comprehensive HR and payroll software designed for modern businesses. It offers a wide range of features including:

- Employee management
- Leave and attendance tracking
- Payroll processing
- Performance management
- Recruitment
- Document management
- Employee self-service

This MCP server connects to Keka's robust API to make these features accessible to AI assistants.

## About MCP

The [Model Context Protocol (MCP)](https://modelcontextprotocol.github.io/) is an open standard that enables AI agents (like large language models) to interact with external systems through a standardized interface. It defines a common way for AI models to discover, understand, and use the capabilities of external systems.

This project implements an MCP server for Keka HRIS, allowing any MCP-compatible AI assistant to work with Keka's HR functions.

## Project Creation

This project was created using Claude-3.7-Sonnet's filesystem support, allowing for rapid development by analyzing and understanding complex directory structures and code patterns. The development approach followed "vibe coding" principles - understanding the essence of the desired functionality and replicating the style, patterns, and best practices across multiple modules.

The MCP server architecture was developed to be extensible, with each module (Core HR, Leave, Attendance, etc.) following consistent patterns for maximum code reuse and maintainability.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by Jay Vadolkar  using Claude-3.7-Sonnet filesystem support and "vibe coding" principles.
