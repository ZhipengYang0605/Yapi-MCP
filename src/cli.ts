import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { startHttpServer } from "~/server.js";
import { getServerConfig } from "~/config.js";
import { createServer } from "~/mcp.js";
import { Logger} from '~/utils/index.js';

loadEnv({ path: resolve(process.cwd(), '.env') });

export const startServer = async () => {
  const isStdioMode = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");
  const config = getServerConfig(isStdioMode);
  const server = createServer(config.auth, {
    isHTTP: !isStdioMode,
  });

  if (isStdioMode) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    Logger.log(`Initializing YApi MCP Server in Stdio mode Successfully`);
  } else {
    Logger.log(`Initializing YApi MCP Server in HTTP mode on port ${config.port}...`);
    await startHttpServer(config.port, server);
  }
}

if (process.argv[1]) {
  startServer().catch((error) => {
    Logger.error("Failed to start server:", error);
    process.exit(1);
  });
}