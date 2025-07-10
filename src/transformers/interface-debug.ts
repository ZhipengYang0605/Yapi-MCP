import type { YApiInterfaceDetail } from "~/types/yapi.type.js";

/**
 * 将查询到的接口query参数数据组合成对象，一般来讲 query 参数都是 string 类型
 */
export function transformReqQueryParams(reqQueryParams: YApiInterfaceDetail["req_query"]) {
  const querys: Record<string, string> = {};
  reqQueryParams.forEach((param) => {
    querys[param.name] = param.example;
  });
  return querys;
}

/**
 * 将接口的body参数转换为对象
 */
export function transformReqBodyParams<T extends Record<string, any>>(reqBodyParams: T): T {
  const result: Record<string, any> = {};

  if (!reqBodyParams.properties) {
    return result as T;
  }

  const properties = reqBodyParams.properties as Record<string, any>;

  for (const [key, property] of Object.entries(properties)) {
    if (property.type === "object") {
      // 递归处理对象类型
      result[key] = transformReqBodyParams(property);
    } else if (property.type === "array") {
      // 处理数组类型
      if (property.items) {
        if (property.items.type === "object") {
          // 如果数组元素是对象，递归处理
          result[key] = [transformReqBodyParams(property.items)];
        } else {
          // 如果数组元素是基本类型，使用mock值
          result[key] = [convertMockValue(property.items.mock?.mock || "", property.items.type)];
        }
      } else {
        result[key] = [];
      }
    } else {
      // 处理基本类型
      result[key] = convertMockValue(property.mock?.mock || "", property.type);
    }
  }

  return result as T;
}

function convertMockValue(mockValue: string, type: string): any {
  if (mockValue === "") {
    // 如果没有mock值，根据类型返回默认值
    switch (type) {
      case "string":
        return "";
      case "integer":
        return 0;
      case "number":
        return 0;
      case "boolean":
        return false;
      default:
        return null;
    }
  }

  // 根据类型转换mock值
  switch (type) {
    case "string":
      return mockValue;
    case "integer":
      return parseInt(mockValue, 10);
    case "number":
      return parseFloat(mockValue);
    case "boolean":
      return mockValue.toLowerCase() === "true";
    default:
      return mockValue;
  }
}
