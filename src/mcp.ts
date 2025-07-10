import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { transformReqQueryParams, transformReqBodyParams } from "./transformers/interface-debug.js";
import { YApiService, type YApiAuthOptions } from "./services/yapi.js";
import { Logger } from "./utils/index.js";
import {
  formatInterfaceDetail,
  formatInterfaceDesc,
  formatInterfaceQueryParams,
  formatInterfaceBodyParams,
  formatInterfaceResponse,
  formatDebugParams,
  formatDebugResponse,
} from "./transformers/interface-detail.js";

type CreateServerOptions = {
  isHTTP?: boolean;
};

const serverInfo = {
  name: "Yapi-MCP",
  version: process.env.NPM_PACKAGE_VERSION ?? "unknown",
};

export function createServer(
  authOptions: YApiAuthOptions,
  { isHTTP = false }: CreateServerOptions,
) {
  const server = new McpServer(serverInfo);
  const yapiService = new YApiService(authOptions);

  Logger.isHTTP = isHTTP;

  registerTools(server, yapiService);
  return server;
}

function registerTools(server: McpServer, yapiService: YApiService) {
  server.registerTool(
    "get_interface",
    {
      title: "获取接口数据详情",
      description:
        "获取接口数据（有详细接口数据定义文档），输出格式为markdown，包含表格、代码块、emoji图标等美化元素",
      inputSchema: {
        projectId: z
          .string()
          .describe(
            "项目ID, 一般出现url中, 例如: https://yapi.runcobo.com/project/<projectId>/interface/api/<interfaceId>",
          ),
        interfaceId: z
          .string()
          .describe(
            "接口ID, 一般出现url中, 例如: https://yapi.runcobo.com/project/<projectId>/interface/api/<interfaceId>",
          ),
      },
    },
    async ({ interfaceId, projectId }) => {
      try {
        const interfaceDetail = await yapiService.getInterfaceDetail(interfaceId, projectId);
        Logger.log("获取接口数据详情成功，正在发送给客户端...");
        return {
          content: [
            {
              type: "text",
              text: formatInterfaceDetail(interfaceDetail),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        Logger.error(`接口请求失败:`, message);
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `接口请求失败：${message}`,
            },
          ],
        };
      }
    },
  );

  server.registerTool(
    "debug_api",
    {
      title: "调试接口",
      description:
        "根据输入yapi接口链接调试接口，输出格式为markdown，包含接口详情、调试参数、响应结果等美化展示",
      inputSchema: {
        projectId: z
          .string()
          .describe(
            "项目ID, 一般出现url中, 例如: https://yapi.runcobo.com/project/<projectId>/interface/api/<interfaceId>",
          ),
        interfaceId: z
          .string()
          .describe(
            "接口ID, 一般出现url中, 例如: https://yapi.runcobo.com/project/<projectId>/interface/api/<interfaceId>",
          ),
        debugQueryParams: z
          .record(z.any())
          .optional()
          .describe("可选, 调试接口的query参数, 即拼接在 url 后面的参数, 一般用于 GET 请求"),
        debugBodyParams: z
          .record(z.any())
          .optional()
          .describe("可选, 调试接口的body参数, 一般用于 POST 请求"),
      },
    },
    async ({ interfaceId, projectId, debugQueryParams, debugBodyParams }) => {
      try {
        const interfaceDetail = await yapiService.getInterfaceDetail(interfaceId, projectId);
        const { method, path: url, req_query, req_body_other } = interfaceDetail;
        const queryParams = debugQueryParams || transformReqQueryParams(req_query);
        const bodyParams =
          debugBodyParams ||
          transformReqBodyParams(req_body_other ? JSON.parse(req_body_other) : {});
        const response = await yapiService.debugApi({
          method,
          url,
          queryParams,
          bodyParams,
        });

        let result = "# 🧪 接口调试结果\n\n";
        result += `${formatInterfaceDesc(interfaceDetail)}${formatInterfaceQueryParams(interfaceDetail)}${formatInterfaceBodyParams(interfaceDetail)}${formatInterfaceResponse(interfaceDetail)}`;
        result += formatDebugParams(queryParams, bodyParams);
        result += formatDebugResponse(response);

        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        Logger.error(`接口请求失败:`, message);
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `接口请求失败：${message}`,
            },
          ],
        };
      }
    },
  );
}
