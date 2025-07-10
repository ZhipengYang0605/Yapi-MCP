import { config as loadEnv } from "dotenv";
import chalk from "chalk";
import { resolve } from "node:path";
import type { YApiAuthOptions } from "~/services/yapi.js";

interface ServerConfigType {
  auth: YApiAuthOptions;
  port: number;
}

export const getServerConfig = (isStdioMode: boolean) => {

  loadEnv({ path: resolve(process.cwd(), ".env"), override: true });

  const auth: YApiAuthOptions = {
    yapiToken: process.env.YAPI_TOKEN_KEY ?? '',
    debugToken: process.env.DEBUG_TOKEN_KEY ?? '',
    yapiBaseUrl: process.env.YAPI_BASE_URL ?? '',
    debugBaseUrl: process.env.DEBUG_API_BASE_URL ?? '',
    debugAppClientSecret: process.env.DEBUG_APP_CLIENT_SECRET ?? '',
    debugAppClientId: process.env.DEBUG_APP_CLIENT_ID ?? '',
  };

  const config: Omit<ServerConfigType, "auth"> = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 2222,
  };

  if (!isStdioMode) {
    console.log(chalk.blue.bold("\nServer config:"));
    console.log(chalk.yellow("-PORT: "), config.port);
    console.log(chalk.yellow("-YAPI_TOKEN_KEY: "), auth.yapiToken);
    console.log(chalk.yellow("-YAPI_BASE_URL: "), auth.yapiBaseUrl);
    console.log(chalk.yellow("-DEBUG_TOKEN_KEY: "), auth.debugToken);
    console.log(chalk.yellow("-DEBUG_API_BASE_URL: "), auth.debugBaseUrl);
    console.log(chalk.yellow("-DEBUG_APP_CLIENT_SECRET: "), auth.debugAppClientSecret);
    console.log(chalk.yellow("-DEBUG_APP_CLIENT_ID: "), auth.debugAppClientId);
    console.log();
  }

  return {
    ...config,
    auth,
  }
};
