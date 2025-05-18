 My MCP Server — Quickstart Guide body { font-family: Arial, sans-serif; max-width: 800px; margin: 2rem auto; line-height: 1.6; color: #333; } h1, h2, h3, h4 { color: #111; } pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; } code { background: #f4f4f4; padding: .2rem .4rem; border-radius: 4px; } a.button { display: inline-block; margin: 1rem 0; padding: .6rem 1.2rem; background: #f38020; color: white; text-decoration: none; border-radius: 4px; } ul { margin-left: 1.2rem; } nav ol { margin-left: 1.2rem; }

# 📦 My MCP Server

**My MCP Server** is a no-ops, zero-server-maintenance API host that runs entirely on [Cloudflare Workers](https://workers.cloudflare.com). It wraps the Keka HRIS “getAllEmployees” endpoint (and more) behind a simple _Model Context Protocol_ interface.

[🚀 One-Click Deploy to Cloudflare Workers](https://dash.cloudflare.com/?to=/:account/workers/deploy?template=github.com/jayvadolkar/my-mcp-server)

## Table of Contents

1.  [Overview](#overview)
2.  [Prerequisites](#prerequisites)
3.  [Setup & Installation](#setup)
4.  [Running Locally](#local)
5.  [Deploy to Production](#deploy)
6.  [Usage & Endpoints](#usage)
7.  [.gitignore](#gitignore)
8.  [Support](#support)

## 1\. Overview

This project lets you host a fully-functional HRIS API server on Cloudflare in minutes—no servers to provision. It provides:

*   Real-time **SSE** endpoint (`/sse`)
*   Standard HTTP/MCP endpoint (`/mcp`)
*   Tools like `getAllEmployees`, `ping`, and `checkEnv`

## 2\. Prerequisites

*   **Cloudflare account:** Sign up at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up)
*   **Wrangler CLI:** Install with `npm install -g wrangler`
*   **Node.js & npm:** Version 18 or above ([nodejs.org](https://nodejs.org))
*   **Git:** For cloning the repo ([git-scm.com](https://git-scm.com))

## 3\. Setup & Installation

### 3.1 Clone the Repository

```
git clone https://github.com/jayvadolkar/my-mcp-server.git
cd my-mcp-server
```

### 3.2 Install Dependencies

```
npm install
```

### 3.3 Configure Environment Variables

Create a file named `.dev.vars` in the project root. This file keeps your secrets safe and is _not_ checked into Git.

```dotenv
.COMPANY="your-company"  
.ENVIRONMENT="your-env"  
.KEKA_GRANT_TYPE="kekaapi"  
.KEKA_SCOPE="kekaapi"  
.KEKA_CLIENT_ID="PASTE_CLIENT_ID_HERE"  
.KEKA_CLIENT_SECRET="PASTE_CLIENT_SECRET_HERE"  
.KEKA_API_KEY="PASTE_API_KEY_HERE"
```

Wrangler will automatically load these when you run `wrangler dev`.

### 3.4 Build the Project

```
npm run build
```

## 4\. Running Locally

Start a local preview of your Worker:

```
npm start
```

Open your browser at [http://127.0.0.1:8787](http://127.0.0.1:8787) You should see a JSON health check. To try the tools:

*   **ping:**  
    `curl -X POST http://127.0.0.1:8787/mcp \ -d '{"tool":"ping","args":{"message":"hello"}}'`
*   **checkEnv:**  
    `curl -X POST http://127.0.0.1:8787/mcp \ -d '{"tool":"checkEnv","args":{}}'`

## 5\. Deploy to Production

**Option A: One-Click Deploy**  
Click the button at the top of this README to deploy instantly. You’ll be prompted to select your Cloudflare account and to confirm your new Worker.

**Option B: Wrangler CLI**  
If you prefer the terminal:

```
npx wrangler login
npm run build
npx wrangler publish
```

After publishing, your Worker will live at `https://<your-subdomain>.workers.dev`.

## 6\. Usage & Endpoints

### 6.1 Health Check (`GET /`)

Returns JSON like:

```json
{  
  "status":"running",
  "name":"CoreHR API MCP Server",
  "company":"your-company",
  "environment":"your-env",
  "endpoints":["/sse","/mcp"]  
}
```

### 6.2 SSE Endpoint (`/sse`)

Use a browser or SSE client to connect and receive live streams of tool results.

### 6.3 MCP HTTP (`POST /mcp`)

Example with `getAllEmployees`:

```json
{  
  "tool":"getAllEmployees",  
  "args":{  
    "filters":{ "searchKey":"john" }  
  }  
}
```


## 8\. Support & Feedback

Found an issue or need help? Open a GitHub Issue: [https://github.com/jayvadolkar/my-mcp-server/issues](https://github.com/jayvadolkar/my-mcp-server/issues)

Happy deploying! 🚀