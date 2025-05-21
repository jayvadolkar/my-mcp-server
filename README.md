# Cloudflare Workers MCP Server

A **Model Context Protocol** (MCP) server built on _Cloudflare Workers_ in TypeScript, exposing HR, Payroll, and PSA tools via Zod‐validated endpoints. Created with **Claude filesystem MCP** and a dash of _“vibe coding”_.

## 📦 Features

*   **Core HR**: Employee, document, leave & attachment tools
*   **Payroll**: Salaries, pay‐cycles, pay‐groups, payments, F&F settlements
*   **PSA**: Clients, projects, phases, tasks, allocations, time‐entries
*   **Schema Registry**: Runtime lookup for all request/response Zod schemas
*   Fully typed in `zod` with `.describe()` for automatic docs
*   Deployed via `wrangler publish`, dev locally with `wrangler dev`

## 🚀 Quick Start

### 1\. Clone & Install

```
git clone https://github.com/your-org/worker-mcp-server.git
cd worker-mcp-server
npm install
```

### 2\. Configure Environment Variables

In the root, create `.dev.vars` or set in Cloudflare dashboard:

```

COMPANY=your-company
ENVIRONMENT=dev
KDK_CLIENT_ID=...
KDK_CLIENT_SECRET=...
# any other Keka API secrets
```

### 3\. Run Locally

```
wrangler dev --local .dev.vars
```

### 4\. Deploy to Cloudflare

```
wrangler publish
```

## 🔧 Configuration

*   **src/index.ts** reads `env.COMPANY` & `env.ENVIRONMENT`
*   Register additional tools in `src/tools/*/index.ts`
*   Add new Zod schemas in `src/tools/*responseschemas.ts` and register in `schemaRegistry.ts`

## 📜 Changelog

*   **v1.0.0** – Initial MVP: Core HR, Leave, Documents
*   **v1.1.0** – Added Payroll endpoints & schemas
*   **v1.2.0** – Integrated PSA: Clients, Projects, Tasks, Billing
*   **v1.3.0** – Schema registry overhaul; unified pagination wrapper

## 🔮 Future Scope

*   🛠️ _Real‐time_ webhooks for time‐entry & payroll events
*   📊 Admin UI for live tool invocation & schema browsing
*   🔐 Role‐based access control with JWT & API key support
*   🔗 Integration with other microservices via Pub/Sub / KV store

## 📚 Resources

*   [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
*   [MCP SDK for Server](https://github.com/model-context-protocol/sdk)
*   [Zod Schema Validation](https://github.com/colinhacks/zod)

- - -

Made with ❤️ in TypeScript, powered by “vibe coding”.