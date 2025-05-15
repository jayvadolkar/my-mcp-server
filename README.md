# Building a Remote MCP Server on Cloudflare (Without Auth)

This example allows you to deploy a remote MCP server that doesn't require authentication on Cloudflare Workers. 

## Get started: 

[![Deploy to Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/ai/tree/main/demos/remote-mcp-authless)

This will deploy your MCP server to a URL like: `remote-mcp-server-authless.<your-account>.workers.dev/sse`

Alternatively, you can use the command line below to get the remote MCP Server created on your local machine:
```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
```

## Customizing your MCP Server

To add your own [tools](https://developers.cloudflare.com/agents/model-context-protocol/tools/) to the MCP server, define each tool inside the `init()` method of `src/index.ts` using `this.server.tool(...)`. 

## Connect to Cloudflare AI Playground

You can connect to your MCP server from the Cloudflare AI Playground, which is a remote MCP client:

1. Go to https://playground.ai.cloudflare.com/
2. Enter your deployed MCP server URL (`remote-mcp-server-authless.<your-account>.workers.dev/sse`)
3. You can now use your MCP tools directly from the playground!

## Connect Claude Desktop to your MCP server

You can also connect to your remote MCP server from local MCP clients, by using the [mcp-remote proxy](https://www.npmjs.com/package/mcp-remote). 

To connect to your MCP server from Claude Desktop, follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and within Claude Desktop go to Settings > Developer > Edit Config.

Update with this configuration:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse"  // or remote-mcp-server-authless.your-account.workers.dev/sse
      ]
    }
  }
}
```

Restart Claude and you should see the tools become available. 

# MyMCP Server

A **ModelContextProtocol** (MCP) agent server that wraps Keka HRIS, Workforce, and other enterprise APIs behind simple, authenticated tools. You can deploy this on Cloudflare Workers (or any Node 18+ runtime) and call it via SSE or HTTP to invoke any of your registered “tools.”

---

## 📂 Repository Structure

```
my-mcp-server/
├── src/
│   ├── auth.ts               # OAuth token helper (env vs. defaults)
│   ├── index.ts              # MCP agent setup & tool registration
│   └── tools/                # All domain‐specific tools
│       ├── corehr/
│       │   ├── getAllEmployees.ts
│       │   └── index.ts      # Registers CoreHR tools
│       ├── workforce/
│       │   ├── tool4.ts
│       │   └── index.ts      # Registers Workforce tools
│       └── …                 # Add more domains (payroll, benefits, etc.)
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # You are here!
```

---

## 🚀 Prerequisites

* **Node.js 18+** (or Cloudflare Workers runtime)
* **npm** or **yarn**
* **Git** (for version control & GitHub)
* *(Optional)* **Claude Desktop** or **MCP CLI** for local SSE testing

---

## ⚙️ Installation & Setup

1. **Clone the repo**

   ```bash
   git clone git@github.com:jayvadolkar1/my-mcp-server.git
   cd my-mcp-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure your environment**

   We use **environment variables** to drive all auth, endpoints, and domain logic. Create a `.env` file or export them in your shell:

   ```bash
   export COMPANY="my-company"
   export ENVIRONMENT="dev"          # dev, staging, prod, etc.
   export KEKA_GRANT_TYPE="kekaapi"
   export KEKA_SCOPE="kekaapi"
   export KEKA_CLIENT_ID="<your-client-id>"
   export KEKA_CLIENT_SECRET="<your-client-secret>"
   export KEKA_API_KEY="<your-api-key>"
   export TOKEN_ENDPOINT="https://login.keka.com/connect/token"
   export MCP_SERVER_URL="https://my-mcp-server.jayvadolkar1.workers.dev/sse"
   ```

   In **Claude Desktop** or your MCP CLI config, add under your server entry:

   ```json
   "env": {
     "COMPANY":         "${COMPANY}",
     "ENVIRONMENT":     "${ENVIRONMENT}",
     "KEKA_GRANT_TYPE": "${KEKA_GRANT_TYPE}",
     "KEKA_SCOPE":      "${KEKA_SCOPE}",
     "KEKA_CLIENT_ID":  "${KEKA_CLIENT_ID}",
     "KEKA_CLIENT_SECRET":"${KEKA_CLIENT_SECRET}",
     "KEKA_API_KEY":    "${KEKA_API_KEY}",
     "TOKEN_ENDPOINT":  "${TOKEN_ENDPOINT}"
   }
   ```

4. **Build & run**

   ```bash
   npm run build   # compiles TS to JS
   npm start       # or `node dist/index.js` in Node
   ```

   To deploy on Cloudflare Workers, configure `wrangler.toml` and run:

   ```bash
   npx wrangler publish
   ```

---

## 🔄 Switching Between Test & Production

Every tool uses a boolean `useConfig` argument (default: `true`):

* **`true`** → Read **all** credentials, endpoints, and domain values from your **environment variables**.
* **`false`** → Fall back to built‑in **hard‑coded defaults** in `auth.ts`:

  ```ts
  {
    environment:   "kekademo",
    grant_type:    "kekaapi",
    scope:         "kekaapi",
    client_id:     "130e4b45-0a6a-4213-a056-07a48e51b717",
    client_secret: "K4sMNMLVBr0UkQEDkCL4",
    api_key:       "D1My8wefkHBUur_szeRNDsQ9crnRvXRMw_cM6vR2tlI=",
    company:       "googleindia",
  }
  ```

**Example invocation:**

```json
{
  "name": "getAllEmployees",
  "arguments": {
    "useConfig": false,
    "filters": { "pageNumber": 1, "pageSize": 50 }
  }
}
```

---

## 🛠️ Adding New Tools

1. **Create a new domain folder** under `src/tools/` (e.g. `payroll`, `benefits`).
2. Inside it, add `index.ts` that exports a `registerXxxTools(server: McpServer)` function.
3. Write each tool in its own `.ts` file, using `server.tool(name, schema, handler)`.
4. In `src/index.ts`, import and call your new registrar in the `init()` method:

   ```ts
   import { registerPayrollTools } from "./tools/payroll";
   // …
   async init() {
     registerCoreHrTools(this.server);
     registerWorkforceTools(this.server);
     registerPayrollTools(this.server);
   }
   ```

---

## 📡 Calling Your Tools

### HTTP POST

```http
POST /mcp HTTP/1.1
Host: localhost:8787
Content-Type: application/json

{
  "name": "getAllEmployees",
  "arguments": {
    "useConfig": true,
    "filters": { "searchKey": "erling Haland" }
  }
}
```

### SSE Stream

```http
// connect to /sse, then send JSON messages down-stream
{ "name": "getAllEmployees", "arguments": { "useConfig": true, "filters": {} } }
```

---

## 🛡️ Pushing to GitHub

1. **Initialize & commit**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. **Create a private repo** via `gh` or the web:

   ```bash
   gh repo create jayvadolkar1/my-mcp-server --private --source=. --push
   ```
3. **Keep your `.gitignore`** up-to-date (node\_modules, env files).

---

## 🤝 Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/new-tool`.
3. Commit your changes and `git push origin feature/new-tool`.
4. Open a Pull Request.

Please follow the existing folder & naming conventions. All tools must accept the `useConfig` flag and leverage `getAuthToken()`.

---

Built with ❤️ by Jay. GG! Feel free to raise issues or improvements! 🚀