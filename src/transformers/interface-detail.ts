import type { YApiInterfaceDetail } from "~/types/yapi.type.js";

function recursiveFormatData(data: Record<string, any>, table: string) {
  const buildRows = (obj: Record<string, any>, indent = 0, isArrayItem = false) => {
    for (const key in obj.properties) {
      const prop = obj.properties[key];
      const isRequired = obj.required?.includes(key) ?? false;
      const mockValue = prop.mock?.mock ?? "";
      const description = prop.description ?? "";

      // 缩进符号处理
      const indentSymbol = "&nbsp;&nbsp;&nbsp;&nbsp;".repeat(indent);
      const prefix = indent > 0 ? (isArrayItem ? "📋 " : "📄 ") : "🔹 ";
      const displayName = isArrayItem ? `**${key}[]**` : `**${key}**`;
      const requiredBadge = isRequired ? "`必填`" : "`可选`";
      const typeBadge = `\`${prop.type}\``;

      table += `| ${indentSymbol}${prefix}${displayName} | ${typeBadge} | ${requiredBadge} | \`${mockValue || "-"}\` | ${description || "-"} |\n`;

      // 递归处理子属性
      if (prop.properties) {
        buildRows(prop, indent + 1);
      } else if (prop.items?.properties) {
        buildRows(prop.items, indent + 1, true);
      }
    }
  };

  buildRows(data);
  return table;
}

/**
 * 格式化接口整体描述输出
 */
export function formatInterfaceDesc(data: YApiInterfaceDetail) {
  let result = "---\n";
  result += "## 📋 接口详情\n";
  result += "---\n\n";
  
  // 基本信息卡片样式
  if (data.title) result += `**🎯 接口名称:** \`${data.title}\`\n\n`;
  if (data.path) result += `**🔗 接口路径:** \`${data.path}\`\n\n`;
  if (data.method) result += `**🚀 请求方法:** \`${data.method}\`\n\n`;
  if (data.desc) result += `**📝 接口描述:** ${data.desc}\n\n`;

  return result;
}

/**
 * 格式化query参数输出
 */
export function formatInterfaceQueryParams(data: YApiInterfaceDetail) {
  if (data.req_query && data.req_query.length > 0) {
    let result = "---\n";
    result += "## 🔍 请求参数 (Query Parameters)\n";
    result += "---\n\n";
    result += "| 参数名 | 必填 | 示例值 | 描述 |\n";
    result += "|:-------|:----:|:-------|:-----|\n";
    data.req_query.forEach((param) => {
      const requiredBadge = param.required === "1" ? "`✅ 是`" : "`❌ 否`";
      const example = param.example ? `\`${param.example}\`` : "-";
      result += `| **${param.name || "-"}** | ${requiredBadge} | ${example} | ${param.desc || "-"} |\n`;
    });
    result += "\n";
    return result;
  }

  return "";
}

/**
 * 格式化body参数输出
 */
export function formatInterfaceBodyParams(data: YApiInterfaceDetail) {
  if (data.req_body_other) {
    let result = "---\n";
    result += "## 📦 请求体 (Request Body)\n";
    result += "---\n\n";
    result += "| 字段名 | 类型 | 必填 | 默认值 | 描述 |\n";
    result += "|:-------|:----:|:----:|:-------|:-----|\n";
    result = recursiveFormatData(JSON.parse(data.req_body_other ?? {}), result);
    result += "\n";
    return result;
  }
  return "";
}

/**
 * 格式化响应数据输出
 */
export function formatInterfaceResponse(data: YApiInterfaceDetail) {
  if (data.res_body) {
    let result = "---\n";
    result += "## 📤 响应数据 (Response)\n";
    result += "---\n\n";
    result += "| 字段名 | 类型 | 必填 | 默认值 | 描述 |\n";
    result += "|:-------|:----:|:----:|:-------|:-----|\n";
    result = recursiveFormatData(JSON.parse(data.res_body ?? {}), result);
    result += "\n";
    return result;
  }
  return "";
}

/**
 * 格式化原始数据输出（可选，用于调试）
 */
export function formatInterfaceRawData(data: YApiInterfaceDetail) {
  let result = "---\n";
  result += "## 🔧 原始数据 (Raw Data)\n";
  result += "---\n\n";
  result += "```json\n";
  result += JSON.stringify(data, null, 2);
  result += "\n```\n\n";
  return result;
}

/**
 * 格式化调试参数输出
 */
export function formatDebugParams(queryParams: Record<string, any>, bodyParams: Record<string, any>): string {
  let result = "---\n";
  result += "## 🔧 调试参数\n";
  result += "---\n\n";

  if (Object.keys(queryParams).length > 0) {
    result += "### 📤 请求 Query 参数\n";
    result += "```json\n";
    result += JSON.stringify(queryParams, null, 2);
    result += "\n```\n\n";
  }

  if (Object.keys(bodyParams).length > 0) {
    result += "### 📦 请求 Body 参数\n";
    result += "```json\n";
    result += JSON.stringify(bodyParams, null, 2);
    result += "\n```\n\n";
  }

  return result;
}

/**
 * 格式化调试响应结果
 */
export function formatDebugResponse(response: any): string {
  let result = "---\n";
  result += "## 📥 调试响应结果\n";
  result += "---\n\n";
  
  result += "<div style='background: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #28a745;'>\n\n";
  result += "**✅ 调试成功!** 接口调用完成，响应数据如下：\n\n";
  result += "</div>\n\n";
  
  result += "```json\n";
  result += JSON.stringify(response, null, 2);
  result += "\n```\n\n";
  
  result += "---\n";
  result += "*📅 调试时间: " + new Date().toLocaleString('zh-CN') + "*\n";
  
  return result;
}

export function formatInterfaceDetail(data: YApiInterfaceDetail): string {
  if (!data || typeof data !== "object") {
    return "❌ **未获取到有效的接口数据**";
  }
  
  let result = "# 🚀 YApi 接口文档\n\n";
  result += `${formatInterfaceDesc(data)}${formatInterfaceQueryParams(data)}${formatInterfaceBodyParams(data)}${formatInterfaceResponse(data)}${formatInterfaceRawData(data)}`;
  result += "---\n";
  result += "*📅 生成时间: " + new Date().toLocaleString('zh-CN') + "*\n";
  
  return result;
}
