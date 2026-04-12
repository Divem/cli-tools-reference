# Pencil CLI 参考手册

> 本机版本：**@pencil.dev/cli 0.2.4** | 安装路径：`~/.nvm/versions/node/v22.22.1/lib/node_modules/@pencil.dev/cli`
> 登录账号：imyuanwen@gmail.com | 后端 API：https://api.pencil.dev

Pencil CLI 是 Pencil.dev 推出的 AI 驱动设计文件操作命令行工具。通过自然语言 Prompt 直接生成或修改 `.pen` 设计文件，支持交互式 Shell（MCP 工具调用）、批量任务、多模型选择和图片导出，适合将 AI 设计能力集成到开发工作流中。

## 目录

- [安装信息](#安装信息)
- [基础语法](#基础语法)
- [认证管理](#认证管理)
- [单次命令模式](#单次命令模式)
- [交互式 Shell](#交互式-shell)
  - [启动方式](#启动方式)
  - [Shell 内置命令](#shell-内置命令)
  - [MCP 工具一览](#mcp-工具一览)
- [batch_design 操作详解](#batch_design-操作详解)
  - [Insert (I) — 插入节点](#insert-i--插入节点)
  - [Copy (C) — 复制节点](#copy-c--复制节点)
  - [Update (U) — 更新节点](#update-u--更新节点)
  - [Replace (R) — 替换节点](#replace-r--替换节点)
  - [Move (M) — 移动节点](#move-m--移动节点)
  - [Delete (D) — 删除节点](#delete-d--删除节点)
  - [Generate Image (G) — 生成图片](#generate-image-g--生成图片)
- [batch_get 查询详解](#batch_get-查询详解)
- [其他 MCP 工具](#其他-mcp-工具)
- [模型选择](#模型选择)
- [环境变量](#环境变量)
- [批量任务](#批量任务)
- [导出功能](#导出功能)
- [常用命令示例](#常用命令示例)

---

## 安装信息

### 安装方式

```bash
npm install -g @pencil.dev/cli
```

### 本机配置

| 项目 | 值 |
|------|------|
| 版本 | 0.2.4 |
| 可执行文件 | `~/.nvm/versions/node/v22.22.1/bin/pencil` |
| 配置目录 | `~/.pencil/` |
| 会话文件 | `~/.pencil/session-cli.json` |
| 后端 API | `https://api.pencil.dev` |
| 设计文件格式 | `.pen` |

### 目录结构

```
~/.pencil/
├── apps/                  # 应用配置
├── resources/             # 资源文件
├── session-cli.json       # CLI 会话凭证
└── session-desktop.json   # Desktop 会话凭证
```

---

## 基础语法

```bash
pencil [command] [options]
```

### 命令速查

| 命令 | 说明 |
|------|------|
| `pencil login` | 交互式登录（邮箱 + 密码或 OTP） |
| `pencil status` | 查看认证状态 |
| `pencil version` | 显示版本号 |
| `pencil interactive` | 启动交互式 Shell（Agent 模式） |
| `pencil --out <file> --prompt "..."` | 单次 AI 生成 |

---

## 认证管理

### 登录

```bash
# 交互式登录（邮箱 + 密码/OTP）
pencil login
```

登录后凭证保存在 `~/.pencil/session-cli.json`。

### 查看状态

```bash
pencil status
```

### CI/CD 使用

```bash
# 通过环境变量传入 CLI Key
PENCIL_CLI_KEY=pencil_cli_... pencil --out design.pen --prompt "Create a form"
```

认证优先级：`PENCIL_CLI_KEY` > `~/.pencil/session-cli.json`

---

## 单次命令模式

通过 `--prompt` 参数一次性生成或修改设计文件。

### 完整参数

| 参数 | 短选项 | 说明 |
|------|--------|------|
| `--in <path>` | `-i` | 输入 `.pen` 文件（省略则为空白画布） |
| `--out <path>` | `-o` | 输出 `.pen` 文件路径（必填） |
| `--prompt <text>` | `-p` | AI Agent Prompt（必填） |
| `--model <id>` | `-m` | 指定模型（默认 Claude Opus） |
| `--custom` | `-c` | 使用自定义 Claude 模型配置 |
| `--list-models` | | 列出可用模型并退出 |
| `--tasks <path>` | `-t` | JSON 批量任务文件 |
| `--workspace <path>` | `-w` | Agent 运行的工作区目录 |
| `--export <path>` | `-e` | 导出最终结果图片 |
| `--export-scale <n>` | | 导出缩放倍数（默认 1） |
| `--export-type <type>` | | 导出格式：png/jpeg/webp/pdf（默认 png） |
| `--preview-output <path>` | | 预览图保存路径（默认 ~/.pencil/latest-preview.png） |
| `--enable-preview` | | 每次设计变更后保存预览图 |
| `--verbose-mcp` | | 在响应中包含完整 MCP 工具错误详情 |
| `--help` | `-h` | 显示帮助 |

### 示例

```bash
# 从零创建设计
pencil -o landing.pen -p "Create a landing page with hero section"

# 基于现有文件修改
pencil -i existing.pen -o modified.pen -p "Add a footer with social links"

# 指定模型
pencil -o form.pen -p "Create a login form" -m claude-sonnet-4-6

# 生成并导出图片
pencil -o design.pen -p "Create a pricing page" -e ./exports/pricing.png --export-scale 2
```

---

## 交互式 Shell

交互式 Shell 是 Pencil CLI 的核心模式，通过 MCP 工具直接操作 `.pen` 文件，适合复杂设计任务。Agent（如 Claude）应使用此模式进行设计。

### 启动方式

```bash
# 连接桌面应用
pencil interactive --app desktop -i design.pen

# 无头模式：新建文件
pencil interactive -o output.pen

# 无头模式：编辑现有文件
pencil interactive -i input.pen -o output.pen
```

### 启动参数

| 参数 | 短选项 | 说明 |
|------|--------|------|
| `--app <name>` | `-a` | 连接运行中的 Pencil 应用名（如 desktop） |
| `--in <path>` | `-i` | 输入 `.pen` 文件（省略则为空白画布） |
| `--out <path>` | `-o` | 输出 `.pen` 文件（无头模式必填） |
| `--preview-output <path>` | | 预览图保存路径 |
| `--enable-preview` | | 启用变更预览 |

### Shell 内置命令

| 命令 | 说明 |
|------|------|
| `tool_name({ key: value })` | 调用 MCP 工具（JS 对象参数） |
| `tool_name()` | 调用无参数的 MCP 工具 |
| `save()` | 保存文档到磁盘 |
| `exit()` | 退出交互式 Shell |

> **注意**：文件路径自动注入，无需手动传递 `filePath` 参数。

### MCP 工具一览

| 工具 | 说明 |
|------|------|
| `get_editor_state` | 获取编辑器状态和文档信息 |
| `get_guidelines` | 获取设计指南和样式模板 |
| `batch_get` | 批量查询节点 |
| `batch_design` | 批量执行设计操作 |
| `get_screenshot` | 获取节点截图 |
| `export_nodes` | 导出节点为图片 |
| `find_empty_space_on_canvas` | 在画布上查找空白区域 |
| `get_variables` | 获取变量和主题定义 |
| `set_variables` | 更新变量和主题 |
| `replace_all_matching_properties` | 全局替换匹配属性 |
| `search_all_unique_properties` | 搜索所有唯一属性值 |
| `snapshot_layout` | 检查布局结构 |

---

## batch_design 操作详解

核心设计操作工具，支持在一次调用中执行多个插入/复制/更新/替换/移动/删除/图片生成操作。

### 关键规则

- 每次调用最多 **25 个操作**，超出应拆分为多次调用
- 如果任一操作失败，本次调用的所有操作会回滚
- 每次 `I()`、`C()`、`R()` 操作**必须**有绑定名
- 绑定名仅在**同一次调用**内有效
- `document` 是预定义绑定，引用文档根节点，仅用于创建顶级屏幕/容器
- `placeholder: true` 将 frame 标记为容器，用于接收子内容

### Insert (I) — 插入节点

```javascript
nodeId = I(parent, nodeData)
```

- 插入单个节点，`id` 自动生成，不要手动设置 `id`
- 要添加子节点，需在后续 `I()` 中使用绑定名引用
- 组件（`reusable: true`）以 `ref` 方式插入实例

```javascript
// 插入一个容器 Frame
hero = I(document, {type:"frame", name:"Hero", width:1440, height:900, fill:"#0A0A0A"})

// 在 hero 中插入文本
title = I(hero, {type:"text", content:"Ship faster.", fontSize:72, fill:"#FFFFFF"})

// 插入组件实例
card = I(body, {type:"ref", ref:"CardComp"})
```

### Copy (C) — 复制节点

```javascript
copiedId = C(path, parent, copyNodeData)
```

- 复制 `reusable` 节点会创建连接的实例（`ref` 节点）
- 如需修改复制节点的后代，**必须**在 `C()` 的 `descendants` 属性中操作，不能用后续 `U()` 修改

```javascript
// 复制并偏移定位
dashboardV2 = C("Xk9f2", document, {name:"Dashboard V2", positionDirection:"right", positionPadding:100})

// 复制组件并修改后代属性
label1 = C("NKYzH", container, {descendants:{"ZopUS/jEYMs":{content:"First Name"}}})
```

### Update (U) — 更新节点

```javascript
U(path, updateData)
```

- 更新现有节点属性，**不能**修改 `id`、`type`、`ref`
- **不能**更新 `children`（用 `R()` 替代）
- 更新组件实例后代时使用 `instanceId/childId` 路径

```javascript
// 更新普通节点
U("MmNEt", {layout:"horizontal", gap:16})

// 更新组件实例的子节点
U("submit-button/label", {content:"Submit"})
```

### Replace (R) — 替换节点

```javascript
replacedId = R(path, nodeData)
```

- 用新节点完全替换指定路径的节点
- 适合替换组件实例中的部分内容

```javascript
// 替换组件实例中的子节点
newTitle = R("cardInstance/headerSlot", {type:"text", content:"Custom Title"})
```

### Move (M) — 移动节点

```javascript
M(nodeId, parent, index?)
```

- `nodeId` 必须是有效节点 ID（不是路径或绑定名）
- `parent` 可选，省略则移到文档根级
- `index` 可选，省略则放到末尾

### Delete (D) — 删除节点

```javascript
D(nodeId)
```

- `nodeId` 必须是有效节点 ID（不是路径或绑定名）

### Generate Image (G) — 生成图片

```javascript
G(nodeId, type, prompt)
```

- **没有** `image` 节点类型，图片以 **fill** 方式应用到 frame/rectangle
- `type`: `"ai"`（AI 生成）或 `"stock"`（Unsplash 素材）
- AI prompt: 详细描述性文本
- Stock prompt: 1-3 个关键词，简单具体

```javascript
// 创建 frame 后应用 AI 图片
heroImg = I("parentId", {type:"frame", name:"Hero Image", width:400, height:300})
G(heroImg, "ai", "modern office workspace bright")

// 对已有节点应用图片
G("logo-frame", "ai", "minimalist coffee shop logo, flat design")

// 使用素材图
G("bg-frame", "stock", "mountain landscape")
```

---

## batch_get 查询详解

批量查询节点，支持按模式搜索和按 ID 读取。

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `nodeIds` | `string[]` | 按节点 ID 读取，优先批量读取 |
| `patterns` | `object[]` | 搜索模式列表 |
| `parentId` | `string` | 限定搜索范围（省略则搜全文档） |
| `readDepth` | `number` | 读取深度（默认 1，仅返回节点及直接子节点） |
| `searchDepth` | `number` | 搜索深度（省略则无限制） |
| `resolveInstances` | `boolean` | 为 `true` 时展开 `ref` 节点为完整结构 |
| `resolveVariables` | `boolean` | 为 `true` 时显示变量计算值 |
| `includePathGeometry` | `boolean` | 为 `true` 时返回完整 path 几何数据 |

### 搜索模式 (patterns)

```javascript
// 列出文档顶级节点
batch_get()

// 查找所有可复用组件
batch_get({ patterns: [{ reusable: true }], readDepth: 2, searchDepth: 3 })

// 按名称搜索
batch_get({ patterns: [{ name: "Button" }] })

// 按类型搜索
batch_get({ patterns: [{ type: "frame" }] })

// 读取特定节点
batch_get({ nodeIds: ["frameId1", "frameId2"], readDepth: 3 })

// 组合搜索
batch_get({
  parentId: "designSystemId",
  patterns: [{ reusable: true }],
  readDepth: 2
})
```

### 遍历大型文档的策略

1. 先读取顶级节点了解整体结构
2. 按需深入读取子节点 ID
3. 注意 `readDepth > 3` 可能返回大量数据
4. 优先批量读取，避免逐个查询

---

## 其他 MCP 工具

### get_editor_state

```javascript
get_editor_state({ include_schema: true })
```

获取编辑器状态、用户选区和文档信息。**首次操作必须调用并传入 `include_schema: true`** 加载 `.pen` 文件 schema。

### get_guidelines

```javascript
// 列出所有指南和样式
get_guidelines()

// 加载特定指南
get_guidelines({ category: "guide", name: "Landing Page" })

// 加载特定样式
get_guidelines({ category: "style", name: "Aerial Gravitas" })

// 带参数加载
get_guidelines({ category: "guide", name: "guide_name", params: { key: "value" } })
```

`category`: `"guide"`（任务指南）或 `"style"`（视觉风格）

### find_empty_space_on_canvas

```javascript
find_empty_space_on_canvas({ width: 1440, height: 900, padding: 100, direction: "right" })
find_empty_space_on_canvas({ width: 400, height: 300, padding: 50, direction: "bottom", nodeId: "frameId" })
```

| 参数 | 说明 |
|------|------|
| `width` | 需要的宽度 |
| `height` | 需要的高度 |
| `padding` | 与其他元素的最小间距 |
| `direction` | 方向：top/right/bottom/left |
| `nodeId` | 可选，围绕指定节点查找空间 |

### get_screenshot

```javascript
get_screenshot({ nodeId: "hero" })
```

获取节点的截图，用于验证设计效果。

### export_nodes

```javascript
export_nodes({ nodeIds: ["hero", "sidebar"], outputDir: "./exports", format: "png", scale: 2 })
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `nodeIds` | 节点 ID 数组（必填） | — |
| `outputDir` | 输出目录（必填） | — |
| `format` | 格式：png/jpeg/webp/pdf | png |
| `scale` | 缩放倍数 | 2 |
| `quality` | JPEG/WEBP 质量（1-100） | JPEG: 95, WEBP: 100 |

### get_variables / set_variables

```javascript
// 获取变量和主题
get_variables()

// 更新变量（合并）
set_variables({ variables: { primaryColor: "#FF5722", fontSize: { type: "dimension", value: 16, unit: "px" } } })

// 替换所有变量
set_variables({ replace: true, variables: { ... } })
```

### replace_all_matching_properties

```javascript
replace_all_matching_properties({
  parents: ["frameId1", "frameId2"],
  properties: {
    fillColor: [{ from: "#000000", to: "#333333" }],
    fontSize: [{ from: [14, 16], to: [16, 18] }]
  }
})
```

### search_all_unique_properties

```javascript
search_all_unique_properties({
  parents: ["designSystemId"],
  properties: ["fillColor", "textColor", "fontSize", "fontFamily", "gap", "padding"]
})
```

### snapshot_layout

```javascript
// 检查整体布局
snapshot_layout({ maxDepth: 2 })

// 只查看有问题的布局（重叠、裁剪等）
snapshot_layout({ problemsOnly: true })

// 查看特定节点的布局
snapshot_layout({ parentId: "frameId", maxDepth: 3 })
```

---

## 模型选择

### 可用模型

| 模型 ID | 说明 |
|---------|------|
| `claude-opus-4-6` | 最强能力，成本较高（默认） |
| `claude-sonnet-4-6` | 速度快，性能均衡 |
| `claude-haiku-4-5` | 最快速度，成本最低 |

### 使用方式

```bash
# 单次命令模式
pencil -o design.pen -p "Create a dashboard" -m claude-sonnet-4-6

# 查看所有可用模型
pencil --list-models
```

---

## 环境变量

| 变量 | 说明 |
|------|------|
| `PENCIL_CLI_KEY` | CLI API Key（CI/CD 使用，优先于本地会话） |
| `ANTHROPIC_API_KEY` | Anthropic API Key |
| `PENCIL_API_BASE` | 后端 API 地址（默认 https://api.pencil.dev） |
| `DEBUG` | 启用调试日志 |

---

## 批量任务

通过 JSON 文件定义批量设计任务。

```bash
pencil --tasks tasks.json
```

任务文件格式参考 `--tasks` 参数说明，适合 CI/CD 中批量生成设计。

---

## 导出功能

### 单次命令导出

```bash
# 生成设计并导出 PNG
pencil -o design.pen -p "Create a pricing page" -e ./exports/pricing.png

# 指定格式和缩放
pencil -o design.pen -p "Create a card" -e ./exports/card.webp --export-type webp --export-scale 3

# 导出为 PDF
pencil -o design.pen -p "Create a report" -e ./exports/report.pdf --export-type pdf
```

### 交互式 Shell 导出

```bash
pencil > export_nodes({ nodeIds: ["hero", "features", "pricing"], outputDir: "./exports", format: "png", scale: 2 })
```

### 预览

```bash
# 启用预览（每次变更后自动保存预览图）
pencil -o design.pen -p "Create a landing page" --enable-preview --preview-output ./previews/latest.png
```

---

## 常用命令示例

### 单次命令

```bash
# 从零创建落地页
pencil -o landing.pen -p "Create a modern SaaS landing page with hero section, features, pricing, and footer"

# 修改现有设计
pencil -i dashboard.pen -o dashboard-v2.pen -p "Change the color scheme to dark mode, update all text colors to white"

# 快速原型
pencil -o prototype.pen -p "Create a mobile app login screen with email and social login options"

# 使用低成本模型快速迭代
pencil -o wireframe.pen -p "Create a low-fidelity wireframe for an e-commerce checkout flow" -m claude-haiku-4-5
```

### 交互式设计工作流

```bash
# 启动无头模式会话
pencil interactive -o design.pen

# 会话内的典型操作流程
pencil > get_editor_state({ include_schema: true })
pencil > get_guidelines()
pencil > get_guidelines({ category: "style", name: "Aerial Gravitas" })
pencil > find_empty_space_on_canvas({ width: 1440, height: 900, padding: 100, direction: "right" })

# 创建页面结构
pencil > batch_design({ operations: 'hero=I(document,{type:"frame",name:"Hero",x:0,y:0,width:1440,height:900,fill:"#0A0A0A",layout:"vertical",clip:true})' })
pencil > batch_design({ operations: 'heading=I("hero",{type:"text",content:"Ship faster.",fontSize:72,fontWeight:"bold",fill:"#FFFFFF"})\nsub=I("hero",{type:"text",content:"The best platform for your team.",fontSize:24,fill:"#AAAAAA"})' })

# 验证效果
pencil > get_screenshot({ nodeId: "hero" })

# 导出
pencil > export_nodes({ nodeIds: ["hero"], outputDir: "./exports" })

# 保存
pencil > save()
pencil > exit()
```

### 编辑现有设计

```bash
# 连接桌面应用编辑
pencil interactive -a desktop -i design.pen

# 查看文档结构
pencil > batch_get()
pencil > batch_get({ patterns: [{ reusable: true }], readDepth: 2 })

# 修改组件实例
pencil > batch_design({ operations: 'btn=I("containerId",{type:"ref",ref:"ButtonComp",width:"fill_container"})\nU(btn+"/label",{content:"Get Started"})' })

# 验证并保存
pencil > get_screenshot({ nodeId: "containerId" })
pencil > save()
```

### CI/CD 集成

```bash
# 使用 API Key 批量生成
PENCIL_CLI_KEY=pencil_cli_xxx pencil -o icon.pen -p "Create an app icon for a fitness app"

# 生成并导出到指定目录
pencil -o banner.pen -p "Create a social media banner 1200x630" -e ./assets/banner.png --export-scale 2 --export-type png
```
