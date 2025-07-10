# 🚀 YApi-MCP

一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的 YApi 接口文档服务器，为 LLM 模型提供 YApi 接口查询和调试能力。

## 📋 项目功能介绍

### 🎯 核心功能

- **📖 接口文档获取**: 从 YApi 平台获取详细的接口文档信息
- **🧪 接口调试**: 支持在线调试 YApi 接口，实时测试接口功能
- ** Markdown 格式化**: 自动生成美观的 Markdown 格式接口文档
- **🔧 双模式运行**: 支持 HTTP 服务器模式和 STDIO 模式

### ️ 主要特性

- **🎨 美观输出**: 使用表格、代码块、emoji 图标等美化元素
- **📊 结构化数据**: 清晰的参数表格和响应数据结构
- **🔍 详细文档**: 包含接口详情、请求参数、响应数据等完整信息
- **⚡ 实时调试**: 支持传入自定义参数进行接口调试
- **🔐 安全认证**: 支持 YApi Token 和调试接口的 HMAC 认证

### 📦 支持的工具

1. **`get_interface`**: 获取接口数据详情

   - 输入: `projectId`, `interfaceId`
   - 输出: 格式化的接口文档（Markdown）
2. **`debug_api`**: 调试接口

   - 输入: `projectId`, `interfaceId`, `debugQueryParams`, `debugBodyParams`
   - 输出: 接口详情 + 调试参数 + 响应结果

## 🚀 项目使用指引

### 环境要求

- Node.js >= 20.0.0
- pnpm (推荐) 或 npm

### 安装配置

1. **克隆项目**

   ```bash
   git clone https://github.com/zeke-yang/yapi-mcp.git
   cd yapi-mcp
   ```
2. **安装依赖**

   ```bash
   pnpm install
   ```
3. **环境配置**

   创建 `.env` 文件并配置以下环境变量：

   ```env
   # YApi 配置
   YAPI_TOKEN_KEY=your_yapi_token
   YAPI_BASE_URL=https://your-yapi-domain.com

   # 调试接口配置
   DEBUG_TOKEN_KEY=your_debug_token
   DEBUG_API_BASE_URL=https://your-debug-api-domain.com
   DEBUG_APP_CLIENT_SECRET=your_client_secret
   DEBUG_APP_CLIENT_ID=your_client_id

   # 服务器配置
   PORT=2222
   ```

### 🏃‍♂️ 运行方式

#### 1. HTTP 服务器模式

```bash
# 开发模式
pnpm run dev

# 生产模式
pnpm run build
pnpm start
```

服务器将在 `http://localhost:2222` 启动

#### 2. STDIO 模式 (CLI)

```bash
# 开发模式
pnpm run dev:cli

# 生产模式
pnpm run build
pnpm run start:cli
```

#### 3. 使用 MCP Inspector 测试

```bash
pnpm run inspect
```

### 📖 使用示例

#### 获取接口详情

```typescript
// 调用 get_interface 工具
const result = await getInterface({
  projectId: "28683",
  interfaceId: "28683"
});

// 输出格式化的 Markdown 文档
console.log(result);
```

#### 调试接口

```typescript
// 调用 debug_api 工具
const result = await debugApi({
  projectId: "28683",
  interfaceId: "28683",
  debugQueryParams: { page: 1, size: 10 },
  debugBodyParams: { name: "test" }
});

// 输出调试结果
console.log(result);
```

### 🔗 与 LLM 集成

#### 在 Cursor Desktop 中使用

1.可配合Cursor中的Rules来完成特定的操作，例如拿到接口详情数据之后生成固定的定义模板等

2.配置MCP

使用Stdio模式（推荐）

```json
{
  "mcpServers": {
    "yapi-mcp": {
      "command": "node",
      "args": [
        "xxxxx", // mcp-server的绝对路径
        "--stdio"
      ],
      "env": {
        "YAPI_TOKEN_KEY": "your yapi token key",
        "YAPI_BASE_URL": "your yapi base url",
        "DEBUG_TOKEN_KEY": "your debug token key",
        "DEBUG_API_BASE_URL": "your debug api base url"
      }
    }
  }
}
```

使用HTTP模式

```json
{
  "mcpServers": {
    "yapi-mcp": {
      "url": "http://localhost:2222/sse"
    }
  }
}
```

### 📝 输出格式示例

#### 接口详情输出

```markdown
#  YApi 接口文档

##  接口详情

**🎯 接口名称:** `用户登录`
**🔗 接口路径:** `/api/login`
**🚀 请求方法:** `POST`
** 接口描述:** 用户登录接口

##  请求参数

| 参数名 | 必填 | 示例值 | 描述 |
|:-------|:----:|:-------|:-----|
| **username** | `✅ 是` | `admin` | 用户名 |
| **password** | `✅ 是` | `123456` | 密码 |

```
