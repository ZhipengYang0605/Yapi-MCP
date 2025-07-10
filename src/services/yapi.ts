import { Logger, isEmptyObject } from "~/utils/index.js";
import { fetchWithRetry } from "~/utils/fetch-with-retry.js";
import type { YApiInterfaceDetail } from "~/types/yapi.type.js";
// @ts-ignore
import hmacsha1 from 'hmacsha1';

export interface YApiAuthOptions {
  yapiToken: string;
  debugToken: string;
  yapiBaseUrl: string;
  debugBaseUrl: string;
  debugAppClientSecret: string;
  debugAppClientId: string;
}

export interface YApiBaseResponse<T> {
  errcode: number;
  errmsg: string;
  data: T;
}

export class YApiService {
  declare private readonly yapiBaseUrl: string;
  declare private readonly yapiToken: string;
  declare private readonly debugBaseUrl: string;
  declare private readonly debugToken: string;
  declare private readonly debugAppClientSecret: string;
  declare private readonly debugAppClientId: string;

  constructor(authOptions: YApiAuthOptions) {
    this.yapiToken = authOptions.yapiToken;
    this.debugToken = authOptions.debugToken;
    this.yapiBaseUrl = authOptions.yapiBaseUrl;
    this.debugBaseUrl = authOptions.debugBaseUrl;
    this.debugAppClientSecret = authOptions.debugAppClientSecret;
    this.debugAppClientId = authOptions.debugAppClientId;
  }

  private async requestYapi<T>(endpoint: string): Promise<T> {
    try {
      Logger.log(`Calling ${this.yapiBaseUrl}${endpoint}`);
      endpoint += `${endpoint.includes("?") ? "&" : "?"}token=${this.yapiToken}`
      const ret = (await fetchWithRetry<T>(`${this.yapiBaseUrl}${endpoint}`)) as YApiBaseResponse<T>;
      if (ret.errcode === 0) {
        return ret.data as T;
      }
      throw new Error(ret.errmsg);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to make request to YApi API: ${error.message}`);
      }
      throw new Error(`Failed to make request to YApi API: ${error}`);
    }
  }

  /**
   * 获取接口数据（有详细接口数据定义文档）
   * @see https://yapi.runcobo.com/project/28683/interface/api/28683
   */
  async getInterfaceDetail(interfaceId: string, projectId: string) {
    if (!interfaceId || !projectId) {
      throw new Error("interfaceId and projectId are required");
    }
    const endpoint = `/interface/get?id=${interfaceId}&project_id=${projectId}`;
    const response = await this.requestYapi<YApiInterfaceDetail>(endpoint);
    return response;
  }

  /**
   * 各公司的鉴权方式不一样，可以在这定制鉴权的方法
   */
  async debugApi({
    method,
    url,
    queryParams,
    bodyParams,
  }: {
    method: string;
    url: string;
    queryParams: Record<string, any>;
    bodyParams: Record<string, any>;
  }) {
    try {
      let endpoint = `${this.debugBaseUrl}/${url}`;
      const headers = {
        "Content-Type": "application/json"
      };
  
      if (method.toLocaleUpperCase() === 'GET' && !isEmptyObject(queryParams)) {
        const searchParamsString = new URLSearchParams(queryParams).toString();
        endpoint += `&${searchParamsString}`;
      }
      Logger.log(`Calling ${endpoint}, method: ${method}, headers: ${JSON.stringify(headers)}, body: ${JSON.stringify(bodyParams)}`);
      const response = await fetchWithRetry(endpoint, {
        headers,
        method: method.toLocaleUpperCase(),
        body: bodyParams && !isEmptyObject(bodyParams) ? JSON.stringify(bodyParams) : undefined,
      });
  
      return response as Record<string, any>;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to make request to debug API: ${error.message}`);
      }
      throw new Error(`Failed to make request to debug API: ${error}`);
    }
  }
}
