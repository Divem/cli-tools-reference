# 飞书开发方式颗粒度对比：API · CLI · MCP · SKILL

开发者在接入飞书等平台时，常纠结于用 API、CLI、MCP 还是 SKILL。本文用同一个真实任务走一遍四种方式，帮你建立选型直觉。

## 任务定义

> 从 B 站视频采集评论 → 写入飞书多维表格 → 通知群里的人

---

## 一、API 层（最细颗粒度）

每次调用只做一件事，一个 HTTP 请求 = 一个原子操作。

**Step 1：创建电子表格（1 次 API 调用）**

```
POST /open-apis/sheets/v3/spreadsheets
Authorization: Bearer t-xxx          # tenant_access_token 或 user_access_token
Content-Type: application/json

{
  "title": "B站视频评论 - BV1ooDyBmE6v"
}
→ 返回 spreadsheet_token
```

**Step 2：写入表头（1 次 API 调用）**

```
PUT /open-apis/sheets/v2/spreadsheets/{token}/values
Range: Sheet1!A1:H1

Body: [["序号","用户名","等级","评论内容","点赞数","发布时间","回复数","是否一级"]]
```

**Step 3：批量写入数据（1 次 API 调用）**

```
PUT /open-apis/sheets/v2/spreadsheets/{token}/values
Range: Sheet1!A2:H51

Body: [[1,"lmpker",6,"不错",79,"2026/04/12 09:04:23",8,"yes"], ...]
```

**Step 4：设置列宽（1 次 API 调用）**

```
PUT /open-apis/sheets/v2/spreadsheets/{token}/dimension_range
Body: {"dimension":{"sheetId":0,"majorDimension":"COLUMNS","startIndex":0,"endIndex":8},"dimensionProperties":{"fixedSize":20}}
```

**Step 5：获取群聊信息（1 次 API 调用）**

```
GET /open-apis/im/v1/chats?page_size=20&query_type=group
→ 返回 chat_id
```

**Step 6：发送飞书消息（1 次 API 调用）**

```
POST /open-apis/im/v1/messages?receive_id_type=chat_id
Body: {
  "receive_id": "oc_xxxx",
  "msg_type": "interactive",
  "content": "{\"config\":{\"wide_screen_mode\":true},\"header\":{\"title\":{\"tag\":\"plain_text\",\"content\":\"评论采集完成\"}},\"elements\":[{\"tag\":\"div\",\"text\":{\"tag\":\"plain_text\",\"content\":\"已采集 170 条评论\"}}]}"
}
```

**总计：6 次 API 调用**，开发者需要：
- 处理 OAuth 鉴权 token 刷新
- 手动管理 spreadsheet_token、sheet_id、chat_id 等中间状态
- 拼接请求 URL、构造 JSON body、解析响应
- 处理分页、限流、错误重试

---

## 二、CLI 层（中颗粒度）

一条 CLI 命令封装了多次 API 调用 + 状态管理 + 错误处理。

**Step 1：创建表格并写入数据（2 条 CLI）**

```bash
# +create 内部：创建表格 API + 设置列宽 API
lark-cli sheets +create \
  --title "B站视频评论 - BV1ooDyBmE6v" \
  --headers '["序号","用户名","等级","评论内容","点赞数","发布时间","回复数","是否一级评论"]' \
  --data '[[1,"lmpker",6,"不错",79,"2026/04/12 09:04:23",8,"yes"], ...]'

# +append 内部：写入值 API（自动处理分页）
lark-cli sheets +append \
  --spreadsheet-token "A0StsA30qh..." \
  --sheet-id "eb15be" \
  --range "A52:H101" \
  --values '[[51,...],[52,...],...]'
```

**Step 2：发送飞书消息（1 条 CLI）**

```bash
# 内部：查找群聊 API + 发消息 API
lark-cli im +send \
  --chat-name "产品群" \
  --msg "已采集 170 条B站评论，已写入飞书表格"
```

**总计：3 条 CLI 命令**（原 6 次 API），开发者不需要：
- 关心 OAuth token 刷新（lark-cli 内置处理）
- 手动拼接 URL 和 JSON body（参数直接传）
- 管理 spreadsheet_token 等中间状态（`--spreadsheet-token` 传入即可）

---

## 三、MCP 层（粗颗粒度）

一个 MCP tool 封装了整个业务流程，AI 只需一次调用。

```json
{
  "name": "bilibili_comments_to_feishu",
  "description": "采集B站视频评论并写入飞书表格，完成后发送群通知",
  "parameters": {
    "bv_id": {"type": "string", "description": "B站视频BV号"},
    "limit": {"type": "number", "default": 100},
    "notify_chat": {"type": "string", "description": "飞书群名"}
  }
}
```

**AI 调用：一次搞定**

```json
{
  "tool": "bilibili_comments_to_feishu",
  "input": {
    "bv_id": "BV1ooDyBmE6v",
    "limit": 100,
    "notify_chat": "产品群"
  }
}
```

**总计：1 次 MCP 调用**（内部执行了全部 6 次 API），但有隐性成本：
- MCP 协议要求**每轮对话都注入所有已注册 tool 的完整 schema**（名称 + 描述 + 参数定义）
- 单个 tool 约 150-300 tokens（含参数的 JSON Schema）
- 实际项目中一个 MCP Server 通常注册 20-50 个 tool → **每轮对话消耗 5,000-15,000 tokens 纯 tool 描述**
- 如果接入多个 MCP Server（飞书 + GitHub + Slack + ...），tool 描述轻松突破 30,000 tokens
- 这些 token **每轮都要重复发送**，无论本轮是否调用任何 tool，直接推高 API 费用

---

## 四、SKILL 层（编排层）

SKILL 不是接口，不是协议，而是一份**操作手册**。它告诉 AI 如何组合 CLI / MCP / API 完成任务。

```
SKILL: bilibili-comment-crawler
├── SKILL.md（操作手册）
│   ├── 采集：python3 scripts/bilibili_comments.py --cookie "$BILIBILI_COOKIE" ...
│   ├── 创建表格：lark-cli sheets +create --title "..." --headers '...' --values "..."
│   └── 通知群聊：lark-cli im +send --chat-name "..." --msg "..."
├── scripts/bilibili_comments.py（Python 采集脚本）
│   └── 内部调用 curl → B站 API（3-6 次 HTTP 请求）
└── cookie.json（配置文件）
```

**SKILL 不消耗 Token**（未被触发时）。只在 AI 遇到匹配的任务时才加载 SKILL.md 到上下文。

但 SKILL 也有代价：
- 依赖 AI 的理解和执行能力，复杂编排可能执行出错或漏步骤
- SKILL.md 需要人工维护，底层 CLI/API 接口变了 SKILL 也要跟着更新

---

## 五、颗粒度对比总览

以"B站评论 → 飞书表格"这个任务为例：

| 方式 | 调用次数 | AI 侧开销 | 灵活性 | 安全性 | 稳定性 | 首次开发成本 |
|------|---------|----------|--------|--------|--------|------------|
| **API** | 6 次 | 0 | 最高（自由拼装） | 最低（裸接口） | 最低（需自己处理所有错误） | 高（鉴权+拼装+调试） |
| **CLI** | 3 条命令 | ~0（`--help` 按需） | 高（管道符组合） | 中（OS 权限） | 高（内置错误处理） | 中（装 CLI 即可用） |
| **MCP** | 1 次调用 | 5K-30K+ tokens（所有 tool schema 每轮注入） | 低（固定流程） | 最高（tool 白名单） | 最高（预置流程） | 高（需开发 MCP Server） |
| **SKILL** | 1 次触发 | ~2000 tokens（仅触发时加载一次） | 最高（自由编排） | 取决于底层 | 取决于底层+AI 执行能力 | 低（写 Markdown 即可） |

---

## 六、SKILL 的组合模式

SKILL 是编排层，它组合底层的能力。同一个任务可以用不同的底层实现：

| 组合模式 | 底层构成 | 特点 |
|---------|---------|------|
| SKILL = 多个 API | 人工写每个 curl 调用 | 最灵活，最累 |
| SKILL = 多个 CLI | CLI 命令串联 | **最常见，平衡灵活性和效率** |
| SKILL = 1 个 MCP | 直接调一个 MCP tool | 最省事，最不灵活 |
| SKILL = CLI + MCP 混合 | 灵活操作走 CLI，权限操作走 MCP | 按需选择 |
| SKILL = 多个 SKILL | 高级 SKILL 编排子 SKILL | 复杂工作流 |

### 最常见模式：SKILL = 多个 CLI

```yaml
SKILL: bilibili-comment-crawler
  Step 1: python3 scripts/bilibili_comments.py  # 内部调 6 次 API
  Step 2: lark-cli sheets +create ...
  Step 3: lark-cli sheets +append ...
  Step 4: lark-cli im +send ...
  → 底层：3 条 CLI 命令 + 1 个脚本
```

### 混合模式：SKILL = CLI + MCP

```yaml
SKILL: 数据采集与分享
  Step 1: MCP: read_spreadsheet          # 只读，安全，走权限控制
  Step 2: CLI: python3 scripts/scrape.py # 灵活控制采集逻辑
  Step 3: CLI: lark-cli sheets +write    # 写入，可控
  Step 4: MCP: send_message              # 发通知，需要权限控制
  → 底层：2 条 CLI + 2 个 MCP tool
```

---

## 七、如何选择

**默认推荐：SKILL + CLI。** 除非有明确理由，否则从这个组合开始。

| 场景 | 推荐 | 原因 |
|------|------|------|
| AI 需要自由组合工具 | **CLI** | 管道符组合，非预置流程 |
| 企业部署，需要权限控制 | **MCP** | tool 白名单，预置流程 |
| 多步复杂工作流 | **SKILL + CLI** | SKILL 编排，CLI 执行 |
| 只需偶尔调用一个固定能力 | **MCP** | 一次调用搞定 |
| 共享给团队使用 | **SKILL** | 一份文档 + 脚本 = 完整能力包 |

**核心比喻：**
- API 是砖块，CLI 是预制板，MCP 是精装房，SKILL 是施工方案
- 砖块最灵活但最累，精装房最省事但最难改
- 施工方案指挥用哪些材料、按什么顺序组装——可以同时用砖块和预制板
