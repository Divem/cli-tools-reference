# OpenCode CLI 参考手册

> 版本：1.3.15 | 安装路径：`/opt/homebrew/bin/opencode`

## 目录

- [概述](#概述)
- [快速开始](#快速开始)
- [全局选项](#全局选项)
- [核心命令](#核心命令)
  - [opencode](#opencode-启动-tui)
  - [run](#opencode-run--message)
  - [serve](#opencode-serve)
  - [web](#opencode-web)
  - [attach](#opencode-attach-url)
- [会话管理](#会话管理)
  - [session](#opencode-session)
  - [export](#opencode-export-sessionid)
  - [import](#opencode-import-file)
  - [stats](#opencode-stats)
- [模型与提供商](#模型与提供商)
  - [models](#opencode-models-provider)
  - [providers](#opencode-providers-别名-auth)
- [Agent 管理](#agent-管理)
  - [agent](#opencode-agent)
- [MCP 服务器管理](#mcp-服务器管理)
  - [mcp](#opencode-mcp)
- [ACP 服务器](#acp-服务器)
  - [acp](#opencode-acp)
- [插件管理](#插件管理)
  - [plugin](#opencode-plugin-module-别名-plug)
- [GitHub 集成](#github-集成)
  - [github](#opencode-github)
  - [pr](#opencode-pr-number)
- [调试工具](#调试工具)
  - [debug](#opencode-debug)
- [数据库工具](#数据库工具)
  - [db](#opencode-db)
- [Shell 补全](#shell-补全)
  - [completion](#opencode-completion)
- [系统维护](#系统维护)
  - [upgrade](#opencode-upgrade-target)
  - [uninstall](#opencode-uninstall)
- [文件路径说明](#文件路径说明)
- [配置文件](#配置文件)

---

## 概述

OpenCode 是一个交互式 CLI 工具，提供 TUI（终端用户界面）和 headless 模式，用于与 AI 模型交互、管理会话、操作代码等。它支持多种 AI 提供商、MCP/ACP 协议、GitHub 集成和插件扩展。

## 快速开始

```bash
# 在当前目录启动 TUI 交互界面
opencode

# 在指定项目目录启动
opencode /path/to/project

# 直接运行一条命令（非交互模式）
opencode run "帮我写一个 hello world"

# 继续上一次的会话
opencode -c

# 查看版本
opencode -v
```

## 全局选项

以下选项可用于所有命令：

| 选项 | 说明 | 默认值 |
|---|---|---|
| `-h, --help` | 显示帮助信息 | - |
| `-v, --version` | 显示版本号 | - |
| `--print-logs` | 将日志输出到 stderr | `false` |
| `--log-level` | 日志级别：`DEBUG` / `INFO` / `WARN` / `ERROR` | - |
| `--pure` | 不加载外部插件运行 | `false` |

### 网络选项（serve/web/attach 等共享）

| 选项 | 说明 | 默认值 |
|---|---|---|
| `--port` | 监听端口 | `0`（随机） |
| `--hostname` | 监听主机名 | `127.0.0.1` |
| `--mdns` | 启用 mDNS 服务发现 | `false` |
| `--mdns-domain` | 自定义 mDNS 域名 | `opencode.local` |
| `--cors` | 额外允许的 CORS 域名 | `[]` |

---

## 核心命令

### `opencode`（启动 TUI）

启动 OpenCode 的终端交互界面（默认命令）。

```bash
opencode [project]
```

**参数：**

| 参数 | 说明 |
|---|---|
| `project` | 项目路径（可选） |

**选项：**

| 选项 | 说明 |
|---|---|
| `-m, --model <provider/model>` | 指定使用的模型 |
| `-c, --continue` | 继续上一次会话 |
| `-s, --session <id>` | 继续指定会话 |
| `--fork` | 以 fork 模式继续会话（与 `-c` 或 `-s` 配合使用） |
| `--prompt <text>` | 指定系统提示词 |
| `--agent <name>` | 指定使用的 Agent |

**示例：**

```bash
# 使用特定模型启动
opencode -m anthropic/claude-sonnet-4-20250514

# 继续上次会话
opencode -c

# Fork 上次会话继续
opencode -c --fork

# 在指定目录启动
opencode ~/projects/my-app
```

---

### `opencode run [message..]`

以非交互模式运行 OpenCode，发送消息并获取结果。

```bash
opencode run [message..]
```

**参数：**

| 参数 | 说明 |
|---|---|
| `message` | 要发送的消息（可多个单词） |

**选项：**

| 选项 | 说明 |
|---|---|
| `--command <cmd>` | 运行命令，用 message 作为参数 |
| `-c, --continue` | 继续上次会话 |
| `-s, --session <id>` | 继续指定会话 |
| `--fork` | Fork 模式继续（需要 `-c` 或 `-s`） |
| `--share` | 分享会话 |
| `-m, --model <provider/model>` | 指定模型 |
| `--agent <name>` | 指定 Agent |
| `--format <default\|json>` | 输出格式：`default`（格式化）或 `json`（原始 JSON） |
| `-f, --file <paths>` | 附加文件到消息 |
| `--title <text>` | 会话标题（默认截取 prompt） |
| `--attach <url>` | 附加到运行中的服务器 |
| `-p, --password <pwd>` | 基础认证密码 |
| `--dir <path>` | 运行目录 |
| `--port <num>` | 本地服务器端口 |
| `--variant <level>` | 模型变体（推理强度，如 `high`、`max`、`minimal`） |
| `--thinking` | 显示思考过程 |

**示例：**

```bash
# 简单执行
opencode run "解释这段代码的作用"

# 附加文件
opencode run "审查这个文件" -f src/main.ts

# JSON 输出（适合管道处理）
opencode run "列出所有 TODO" --format json

# 使用特定模型和推理强度
opencode run "重构这段代码" -m anthropic/claude-sonnet-4-20250514 --variant high

# 附加文件并设置标题
opencode run "优化性能" -f src/index.ts -f src/utils.ts --title "性能优化"

# 附加到远程服务器执行
opencode run "检查日志" --attach http://localhost:4096 --dir /app/logs
```

---

### `opencode serve`

启动无头（headless）OpenCode 服务器，不打开 TUI 界面。

```bash
opencode serve
```

**选项：** 同[网络选项](#网络选项serveattach-等共享)

**示例：**

```bash
# 启动服务，监听 8080 端口
opencode serve --port 8080

# 允许局域网访问
opencode serve --hostname 0.0.0.0 --port 4096

# 启用 mDNS 发现
opencode serve --mdns
```

---

### `opencode web`

启动服务器并自动打开 Web 界面。

```bash
opencode web
```

**选项：** 同[网络选项](#网络选项serveattach-等共享)

**示例：**

```bash
# 启动 Web 界面
opencode web --port 3000

# 局域网访问 Web 界面
opencode web --hostname 0.0.0.0 --port 3000 --cors http://myapp.local
```

---

### `opencode attach <url>`

连接到一个运行中的 OpenCode 服务器。

```bash
opencode attach <url>
```

**参数：**

| 参数 | 说明 | 默认值 |
|---|---|---|
| `url` | 服务器 URL | `http://localhost:4096` |

**选项：**

| 选项 | 说明 |
|---|---|
| `--dir <path>` | 运行目录 |
| `-c, --continue` | 继续上次会话 |
| `-s, --session <id>` | 继续指定会话 |
| `--fork` | Fork 模式继续 |
| `-p, --password <pwd>` | 基础认证密码 |

**示例：**

```bash
# 连接本地服务器
opencode attach http://localhost:4096

# 带密码连接远程服务器
opencode attach http://remote:4096 -p mypassword
```

---

## 会话管理

### `opencode session`

管理会话。

```bash
opencode session <command>
```

#### 子命令

##### `session list`

列出所有会话。

```bash
opencode session list
```

| 选项 | 说明 |
|---|---|
| `-n, --max-count <N>` | 限制显示最近 N 个会话 |
| `--format <table\|json>` | 输出格式，默认 `table` |

**示例：**

```bash
# 列出最近 10 个会话
opencode session list -n 10

# JSON 格式输出
opencode session list --format json
```

##### `session delete <sessionID>`

删除指定会话。

```bash
opencode session delete <sessionID>
```

---

### `opencode export [sessionID]`

将会话数据导出为 JSON。

```bash
opencode export [sessionID]
```

**参数：**

| 参数 | 说明 |
|---|---|
| `sessionID` | 要导出的会话 ID（可选，不指定则导出当前会话） |

---

### `opencode import <file>`

从 JSON 文件或 URL 导入会话数据。

```bash
opencode import <file>
```

**参数：**

| 参数 | 说明 |
|---|---|
| `file` | JSON 文件路径或分享 URL |

---

### `opencode stats`

显示 Token 使用和费用统计。

```bash
opencode stats
```

| 选项 | 说明 |
|---|---|
| `--days <N>` | 显示最近 N 天的统计（默认全部） |
| `--tools <N>` | 显示前 N 个工具使用情况（默认全部） |
| `--models [N]` | 显示模型统计（可指定数量） |
| `--project <name>` | 按项目过滤（空字符串表示当前项目） |

**输出示例：**

```
OVERVIEW:
  Sessions: 230 | Messages: 9,633 | Days: 79

COST & TOKENS:
  Total Cost: $1.35 | Avg Cost/Day: $0.02
  Input: 53.1M | Output: 2.9M | Cache Read: 585.3M

TOOL USAGE (Top 5):
  bash     3426 (31.5%)
  read     2988 (27.4%)
  edit      915 ( 8.4%)
  glob      736 ( 6.8%)
  apply_patch 666 ( 6.1%)
```

**示例：**

```bash
# 最近 7 天统计
opencode stats --days 7

# 按项目过滤
opencode stats --project "my-app"

# 显示模型统计
opencode stats --models

# 只显示前 5 个工具
opencode stats --tools 5
```

---

## 模型与提供商

### `opencode models [provider]`

列出所有可用模型。

```bash
opencode models [provider]
```

| 参数 | 说明 |
|---|---|
| `provider` | 按提供商 ID 过滤（可选） |

| 选项 | 说明 |
|---|---|
| `--verbose` | 详细输出（包含费用等元数据） |
| `--refresh` | 从 models.dev 刷新模型缓存 |

**示例：**

```bash
# 列出所有模型
opencode models

# 列出 anthropic 的模型
opencode models anthropic

# 详细模式
opencode models --verbose

# 刷新缓存
opencode models --refresh
```

---

### `opencode providers`（别名：`auth`）

管理 AI 提供商和凭证。

```bash
opencode providers <command>
```

#### 子命令

##### `providers list`（别名：`ls`）

列出所有已配置的提供商和凭证。

```bash
opencode providers list
```

##### `providers login [url]`

登录提供商。

```bash
opencode providers login [url]
```

| 选项 | 说明 |
|---|---|
| `-p, --provider <id>` | 提供商 ID 或名称（跳过选择步骤） |
| `-m, --method <label>` | 登录方式标签（跳过选择步骤） |

**示例：**

```bash
# 交互式登录
opencode providers login

# 直接登录指定提供商
opencode providers login -p anthropic

# 指定登录方式
opencode providers login -p anthropic -m "API Key"
```

##### `providers logout`

登出已配置的提供商。

```bash
opencode providers logout
```

---

## Agent 管理

### `opencode agent`

管理 Agent。

```bash
opencode agent <command>
```

#### 子命令

##### `agent list`

列出所有可用 Agent。

```bash
opencode agent list
```

##### `agent create`

创建新的 Agent。

```bash
opencode agent create
```

| 选项 | 说明 |
|---|---|
| `--path <dir>` | 生成 Agent 文件的目录路径 |
| `--description <text>` | Agent 功能描述 |
| `--mode <all\|primary\|subagent>` | Agent 模式 |
| `--tools <list>` | 启用的工具列表（逗号分隔） |
| `-m, --model <provider/model>` | 使用的模型 |

可用工具：`bash`, `read`, `write`, `edit`, `list`, `glob`, `grep`, `webfetch`, `task`, `todowrite`

**示例：**

```bash
# 交互式创建
opencode agent create

# 指定参数创建
opencode agent create --description "代码审查 Agent" --mode subagent --tools "read,glob,grep"

# 使用特定模型
opencode agent create -m anthropic/claude-sonnet-4-20250514 --description "测试生成 Agent"
```

---

## MCP 服务器管理

### `opencode mcp`

管理 MCP（Model Context Protocol）服务器。

```bash
opencode mcp <command>
```

#### 子命令

##### `mcp add`

添加 MCP 服务器（交互式）。

```bash
opencode mcp add
```

##### `mcp list`（别名：`ls`）

列出 MCP 服务器及其状态。

```bash
opencode mcp list
```

##### `mcp auth [name]`

对 OAuth 支持的 MCP 服务器进行认证。

```bash
opencode mcp auth [name]
```

##### `mcp logout [name]`

移除 MCP 服务器的 OAuth 凭证。

```bash
opencode mcp logout [name]
```

##### `mcp debug <name>`

调试 MCP 服务器的 OAuth 连接。

```bash
opencode mcp debug <name>
```

---

## ACP 服务器

### `opencode acp`

启动 ACP（Agent Client Protocol）服务器。

```bash
opencode acp
```

| 选项 | 说明 | 默认值 |
|---|---|---|
| `--cwd <dir>` | 工作目录 | 当前目录 |

其他选项同[网络选项](#网络选项serveattach-等共享)。

**示例：**

```bash
# 启动 ACP 服务器
opencode acp

# 指定工作目录
opencode acp --cwd /path/to/project --port 4096
```

---

## 插件管理

### `opencode plugin <module>`（别名：`plug`）

安装插件并更新配置。

```bash
opencode plugin <module>
```

**参数：**

| 参数 | 说明 |
|---|---|
| `module` | npm 模块名 |

| 选项 | 说明 |
|---|---|
| `-g, --global` | 安装到全局配置 |
| `-f, --force` | 替换已有的插件版本 |

**示例：**

```bash
# 安装插件
opencode plugin @opencode/plugin-example

# 全局安装
opencode plugin @opencode/plugin-example -g

# 强制替换
opencode plugin @opencode/plugin-example -f
```

---

## GitHub 集成

### `opencode github`

管理 GitHub Agent。

```bash
opencode github <command>
```

#### 子命令

##### `github install`

安装 GitHub Agent。

```bash
opencode github install
```

##### `github run`

运行 GitHub Agent。

```bash
opencode github run
```

| 选项 | 说明 |
|---|---|
| `--event <event>` | 模拟的 GitHub 事件 |
| `--token <pat>` | GitHub Personal Access Token |

**示例：**

```bash
# 安装 GitHub Agent
opencode github install

# 运行指定事件
opencode github run --event "issue_comment.created"

# 使用指定 Token
opencode github run --token github_pat_xxxxx
```

---

### `opencode pr <number>`

拉取并检出 GitHub PR 分支，然后启动 OpenCode。

```bash
opencode pr <number>
```

**参数：**

| 参数 | 说明 |
|---|---|
| `number` | PR 编号 |

**示例：**

```bash
# 检出 PR #42 并启动
opencode pr 42
```

---

## 调试工具

### `opencode debug`

提供多种调试和排错工具。

```bash
opencode debug <command>
```

#### 子命令

##### `debug config`

显示已解析的配置。

```bash
opencode debug config
```

##### `debug paths`

显示全局路径（数据、配置、缓存、状态目录）。

```bash
opencode debug paths
```

##### `debug skill`

列出所有可用技能（Skills）。

```bash
opencode debug skill
```

##### `debug scrap`

列出所有已知项目。

```bash
opencode debug scrap
```

##### `debug agent <name>`

显示指定 Agent 的配置详情。

```bash
opencode debug agent <name>
```

##### `debug wait`

无限等待（用于调试场景）。

```bash
opencode debug wait
```

#### `debug lsp` — LSP 调试

```bash
opencode debug lsp <command>
```

| 子命令 | 说明 |
|---|---|
| `diagnostics <file>` | 获取文件诊断信息 |
| `symbols <query>` | 搜索工作区符号 |
| `document-symbols <uri>` | 获取文档中的符号 |

**示例：**

```bash
opencode debug lsp diagnostics src/index.ts
opencode debug lsp symbols "MyComponent"
opencode debug lsp document-symbols file:///path/to/file.ts
```

#### `debug rg` — ripgrep 调试

```bash
opencode debug rg <command>
```

| 子命令 | 说明 |
|---|---|
| `tree` | 使用 ripgrep 显示文件树 |
| `files` | 使用 ripgrep 列出文件 |
| `search <pattern>` | 使用 ripgrep 搜索文件内容 |

**示例：**

```bash
opencode debug rg tree
opencode debug rg files
opencode debug rg search "TODO"
```

#### `debug file` — 文件系统调试

```bash
opencode debug file <command>
```

| 子命令 | 说明 |
|---|---|
| `read <path>` | 以 JSON 格式读取文件内容 |
| `status` | 显示文件状态信息 |
| `list <path>` | 列出目录中的文件 |
| `search <query>` | 按查询搜索文件 |
| `tree [dir]` | 显示目录树 |

**示例：**

```bash
opencode debug file read src/main.ts
opencode debug file status
opencode debug file list .
opencode debug file search "config"
opencode debug file tree src/
```

#### `debug snapshot` — 快照调试

```bash
opencode debug snapshot <command>
```

| 子命令 | 说明 |
|---|---|
| `track` | 跟踪当前快照状态 |
| `patch <hash>` | 显示指定快照哈希的补丁 |
| `diff <hash>` | 显示指定快照哈希的差异 |

**示例：**

```bash
opencode debug snapshot track
opencode debug snapshot diff abc123
opencode debug snapshot patch abc123
```

---

## 数据库工具

### `opencode db`

数据库操作工具（底层使用 SQLite）。

```bash
opencode db [query]
```

#### 子命令

##### 默认（交互模式或执行查询）

不传参数进入 SQLite 交互 shell，传入 SQL 则直接执行。

```bash
# 交互模式
opencode db

# 执行查询
opencode db "SELECT * FROM sessions LIMIT 10"
```

| 选项 | 说明 |
|---|---|
| `--format <json\|tsv>` | 输出格式，默认 `tsv` |

##### `db path`

打印数据库文件路径。

```bash
opencode db path
```

##### `db migrate`

将 JSON 数据迁移到 SQLite（与现有数据合并）。

```bash
opencode db migrate
```

---

## Shell 补全

### `opencode completion`

生成 Shell 自动补全脚本。

```bash
opencode completion
```

**安装方式：**

```bash
# Bash
opencode completion >> ~/.bashrc
source ~/.bashrc

# Zsh
opencode completion >> ~/.zshrc
source ~/.zshrc

# macOS (Zsh) — 也可写入 zprofile
opencode completion >> ~/.zprofile
source ~/.zprofile

# Fish
opencode completion >> ~/.config/fish/completions/opencode.fish
```

---

## 系统维护

### `opencode upgrade [target]`

升级 OpenCode 到最新版本或指定版本。

```bash
opencode upgrade [target]
```

| 参数 | 说明 |
|---|---|
| `target` | 目标版本，如 `1.3.15` 或 `v1.3.15`（可选） |

| 选项 | 说明 |
|---|---|
| `-m, --method <method>` | 安装方式：`curl` / `npm` / `pnpm` / `bun` / `brew` / `choco` / `scoop` |

**示例：**

```bash
# 升级到最新版
opencode upgrade

# 升级到指定版本
opencode upgrade v1.3.14

# 指定安装方式
opencode upgrade -m brew
```

---

### `opencode uninstall`

卸载 OpenCode 并移除相关文件。

```bash
opencode uninstall
```

| 选项 | 说明 |
|---|---|
| `-c, --keep-config` | 保留配置文件 |
| `-d, --keep-data` | 保留会话数据和快照 |
| `--dry-run` | 预览将被删除的文件，不实际删除 |
| `-f, --force` | 跳过确认提示 |

**示例：**

```bash
# 预览将被删除的内容
opencode uninstall --dry-run

# 卸载但保留配置和数据
opencode uninstall --keep-config --keep-data

# 强制卸载不确认
opencode uninstall -f
```

---

## 文件路径说明

通过 `opencode debug paths` 可以查看所有路径：

| 路径类型 | 默认路径 | 说明 |
|---|---|---|
| `home` | `~` | 用户主目录 |
| `data` | `~/.local/share/opencode` | 数据目录（会话、快照等） |
| `bin` | `~/.cache/opencode/bin` | 二进制缓存 |
| `log` | `~/.local/share/opencode/log` | 日志目录 |
| `cache` | `~/.cache/opencode` | 缓存目录 |
| `config` | `~/.config/opencode` | 配置文件目录 |
| `state` | `~/.local/state/opencode` | 状态文件目录 |

## 配置文件

OpenCode 的配置文件位于 `~/.config/opencode/` 目录下。可以使用 `opencode debug config` 命令查看完整的已解析配置。

常用配置方式：

1. **全局配置**：`~/.config/opencode/config.json` 或 `~/.config/opencode/config.toml`
2. **项目配置**：项目根目录下的 `.opencode` 目录
3. **环境变量**：如 `OPENCODE_SERVER_PASSWORD` 等

---

> 本手册基于 OpenCode v1.3.15 生成，命令和选项可能随版本更新而变化。使用 `opencode --help` 查看最新信息。
