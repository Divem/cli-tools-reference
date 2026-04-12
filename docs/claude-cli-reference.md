# Claude Code CLI 参考手册

> 版本：2.1.89  
> 安装路径：`~/.nvm/versions/node/v22.22.1/bin/claude`

Claude Code 是 Anthropic 推出的 AI 编程助手命令行工具，默认启动交互式会话，也可通过 `-p` 参数进行非交互式输出。

---

## 目录

- [快速入门](#快速入门)
- [基础用法](#基础用法)
- [选项参数](#选项参数)
- [子命令详解](#子命令详解)
  - [auth — 认证管理](#auth--认证管理)
  - [mcp — MCP 服务器管理](#mcp--mcp-服务器管理)
  - [plugin — 插件管理](#plugin--插件管理)
  - [agents — 查看配置的 Agent](#agents--查看配置的-agent)
  - [install — 安装指定版本](#install--安装指定版本)
  - [doctor — 健康检查](#doctor--健康检查)
  - [setup-token — 设置长期令牌](#setup-token--设置长期令牌)
  - [auto-mode — 自动模式配置](#auto-mode--自动模式配置)
  - [update / upgrade — 更新](#update--upgrade--更新)
- [权限模式](#权限模式)
- [输出格式](#输出格式)
- [模型选择](#模型选择)
- [会话管理](#会话管理)
- [Git Worktree 集成](#git-worktree-集成)
- [配置与设置](#配置与设置)
- [常见用例](#常见用例)

---

## 快速入门

```bash
# 启动交互式会话
claude

# 非交互式执行（适合管道和脚本）
claude -p "解释这个项目的结构"

# 指定模型
claude --model sonnet -p "帮我写一个 Python 函数"

# 继续上次对话
claude -c
```

---

## 基础用法

```
claude [选项] [命令] [prompt]
```

- 直接运行 `claude` 启动交互式终端会话
- 附加 prompt 参数可直接提问
- 使用 `claude -p "prompt"` 进入非交互模式，输出结果后退出

---

## 选项参数

### 会话控制

| 参数 | 说明 |
|------|------|
| `-c`, `--continue` | 继续当前目录下最近的一次对话 |
| `-r`, `--resume [value]` | 通过会话 ID 恢复对话，或打开交互式选择器（可附加搜索词） |
| `--session-id <uuid>` | 为当前会话指定一个 UUID |
| `-n`, `--name <name>` | 设置会话显示名称（显示在 /resume 和终端标题中） |
| `--fork-session` | 恢复时创建新会话 ID（与 --resume 或 --continue 配合使用） |
| `--from-pr [value]` | 通过 PR 编号/URL 恢复关联会话，或打开交互式选择器 |
| `--no-session-persistence` | 禁用会话持久化（仅 -p 模式可用） |

### 非交互模式（-p）

| 参数 | 说明 |
|------|------|
| `-p`, `--print` | 打印响应后退出（适合管道/脚本） |
| `--output-format <format>` | 输出格式：`text`（默认）、`json`、`stream-json` |
| `--input-format <format>` | 输入格式：`text`（默认）、`stream-json` |
| `--max-budget-usd <amount>` | API 调用的最大花费限额（美元） |
| `--fallback-model <model>` | 默认模型过载时的回退模型 |
| `--json-schema <schema>` | 结构化输出的 JSON Schema 验证 |

### 模型与推理

| 参数 | 说明 |
|------|------|
| `--model <model>` | 指定模型（别名如 `sonnet`、`opus`，或全名如 `claude-sonnet-4-6`） |
| `--effort <level>` | 推理投入等级：`low`、`medium`、`high`、`max` |
| `--fallback-model <model>` | 模型过载时自动切换的回退模型 |

### 工具与权限

| 参数 | 说明 |
|------|------|
| `--allowedTools, --allowed-tools <tools...>` | 允许的工具列表（如 `Bash(git:*) Edit`） |
| `--disallowedTools, --disallowed-tools <tools...>` | 禁止的工具列表 |
| `--tools <tools...>` | 指定可用工具集：`""` 禁用全部、`"default"` 使用全部、或指定工具名 |
| `--permission-mode <mode>` | 权限模式（见[权限模式](#权限模式)章节） |
| `--dangerously-skip-permissions` | 跳过所有权限检查（仅限无网络沙箱） |
| `--allow-dangerously-skip-permissions` | 启用跳过权限选项但不默认开启 |

### Agent 与自定义 Agent

| 参数 | 说明 |
|------|------|
| `--agent <agent>` | 当前会话使用的 Agent（覆盖配置中的 `agent` 设置） |
| `--agents <json>` | JSON 格式定义自定义 Agent |

示例：

```bash
# 使用自定义 Agent
claude --agents '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}'
```

### 系统提示词

| 参数 | 说明 |
|------|------|
| `--system-prompt <prompt>` | 替换默认系统提示词 |
| `--append-system-prompt <prompt>` | 在默认系统提示词后追加内容 |

### MCP 服务器

| 参数 | 说明 |
|------|------|
| `--mcp-config <configs...>` | 从 JSON 文件或字符串加载 MCP 服务器（空格分隔） |
| `--strict-mcp-config` | 仅使用 --mcp-config 指定的 MCP 服务器，忽略其他配置 |

### 插件与目录

| 参数 | 说明 |
|------|------|
| `--add-dir <directories...>` | 添加允许工具访问的额外目录 |
| `--plugin-dir <path>` | 加载指定目录中的插件（可重复使用） |
| `--setting-sources <sources>` | 加载的配置来源：`user`、`project`、`local`（逗号分隔） |
| `--settings <file-or-json>` | 额外的设置 JSON 文件或 JSON 字符串 |

### Chrome 集成

| 参数 | 说明 |
|------|------|
| `--chrome` | 启用 Chrome 集成 |
| `--no-chrome` | 禁用 Chrome 集成 |

### 其他

| 参数 | 说明 |
|------|------|
| `--bare` | 极简模式：跳过 hooks、LSP、插件同步、自动记忆等 |
| `--brief` | 启用 SendUserMessage 工具用于 Agent 到用户的通信 |
| `--file <specs...>` | 启动时下载的文件资源（格式：`file_id:relative_path`） |
| `--ide` | 启动时自动连接 IDE（如果只有一个可用） |
| `--disable-slash-commands` | 禁用所有技能（Skills） |
| `--betas <betas...>` | API 请求中包含的 Beta 头（仅 API Key 用户） |
| `-v`, `--version` | 输出版本号 |
| `-h`, `--help` | 显示帮助 |
| `-d`, `--debug [filter]` | 启用调试模式，可按类别过滤（如 `api,hooks` 或 `!1p,!file`） |
| `--debug-file <path>` | 调试日志写入指定文件（隐式启用调试模式） |
| `--verbose` | 覆盖配置中的 verbose 设置 |
| `--include-hook-events` | 在输出流中包含所有 hook 生命周期事件 |
| `--include-partial-messages` | 包含部分消息块（仅 -p + stream-json） |
| `--replay-user-messages` | 回放 stdin 的用户消息到 stdout |

---

## 子命令详解

### auth — 认证管理

管理 Claude Code 的 Anthropic 账户认证。

#### auth login — 登录

```bash
# 使用 Claude 订阅登录（默认）
claude auth login

# 使用 Anthropic Console（API 计费）登录
claude auth login --console

# 使用 SSO 登录
claude auth login --sso

# 预填邮箱地址
claude auth login --email user@example.com
```

| 参数 | 说明 |
|------|------|
| `--claudeai` | 使用 Claude 订阅（默认） |
| `--console` | 使用 Anthropic Console（API 计费） |
| `--sso` | 强制 SSO 登录流程 |
| `--email <email>` | 预填邮箱地址 |

#### auth logout — 登出

```bash
claude auth logout
```

#### auth status — 查看认证状态

```bash
# JSON 格式输出（默认）
claude auth status

# 人类可读文本输出
claude auth status --text

# JSON 格式输出
claude auth status --json
```

---

### mcp — MCP 服务器管理

管理 Model Context Protocol (MCP) 服务器配置。

#### mcp add — 添加 MCP 服务器

```bash
# 添加 HTTP 服务器
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 添加带请求头的 HTTP 服务器
claude mcp add --transport http corridor https://app.corridor.dev/api/mcp --header "Authorization: Bearer ..."

# 添加带环境变量的 stdio 服务器
claude mcp add -e API_KEY=xxx my-server -- npx my-mcp-server

# 添加带子进程参数的 stdio 服务器
claude mcp add my-server -- my-command --some-flag arg1
```

| 参数 | 说明 |
|------|------|
| `-t`, `--transport <transport>` | 传输类型：`stdio`、`sse`、`http`（默认 `stdio`） |
| `-s`, `--scope <scope>` | 配置范围：`local`、`user`、`project`（默认 `local`） |
| `-e`, `--env <env...>` | 环境变量（如 `-e KEY=value`） |
| `-H`, `--header <header...>` | WebSocket 请求头 |
| `--client-id <clientId>` | OAuth 客户端 ID（HTTP/SSE 服务器） |
| `--client-secret` | 提示输入 OAuth 客户端密钥 |
| `--callback-port <port>` | OAuth 回调的固定端口 |

#### mcp add-json — 通过 JSON 添加 MCP 服务器

```bash
claude mcp add-json my-server '{"command":"npx","args":["my-mcp-server"]}'
```

| 参数 | 说明 |
|------|------|
| `-s`, `--scope <scope>` | 配置范围（默认 `local`） |
| `--client-secret` | 提示输入 OAuth 客户端密钥 |

#### mcp add-from-claude-desktop — 从 Claude Desktop 导入

```bash
claude mcp add-from-claude-desktop

# 指定配置范围
claude mcp add-from-claude-desktop -s user
```

仅支持 Mac 和 WSL。

#### mcp list — 列出 MCP 服务器

```bash
claude mcp list
```

#### mcp get — 查看 MCP 服务器详情

```bash
claude mcp get <name>
```

#### mcp remove — 移除 MCP 服务器

```bash
claude mcp remove my-server

# 指定范围移除
claude mcp remove -s project my-server
```

#### mcp reset-project-choices — 重置项目 MCP 选择

```bash
claude mcp reset-project-choices
```

重置当前项目中所有已批准和已拒绝的项目级 (.mcp.json) 服务器。

#### mcp serve — 启动 MCP 服务器

```bash
claude mcp serve
claude mcp serve --debug
claude mcp serve --verbose
```

---

### plugin — 插件管理

管理 Claude Code 插件和 marketplace。

#### plugin install — 安装插件

```bash
# 安装插件
claude plugin install <plugin>

# 从指定 marketplace 安装
claude plugin install plugin@marketplace

# 指定安装范围
claude plugin install -s project <plugin>
```

| 参数 | 说明 |
|------|------|
| `-s`, `--scope <scope>` | 安装范围：`user`、`project`、`local`（默认 `user`） |

#### plugin uninstall / remove — 卸载插件

```bash
claude plugin uninstall <plugin>
```

#### plugin enable — 启用插件

```bash
claude plugin enable <plugin>
```

#### plugin disable — 禁用插件

```bash
claude plugin disable [plugin]
```

#### plugin update — 更新插件

```bash
claude plugin update <plugin>
```

#### plugin list — 列出已安装插件

```bash
claude plugin list
```

#### plugin validate — 验证插件

```bash
claude plugin validate <path>
```

#### plugin marketplace — Marketplace 管理

```bash
# 列出所有 marketplace
claude plugin marketplace list

# 添加 marketplace
claude plugin marketplace add <source>

# 移除 marketplace
claude plugin marketplace remove <name>

# 更新 marketplace
claude plugin marketplace update [name]
```

---

### agents — 查看配置的 Agent

```bash
claude agents

# 指定配置来源
claude agents --setting-sources user,project
```

---

### install — 安装指定版本

```bash
# 安装稳定版
claude install stable

# 安装最新版
claude install latest

# 安装指定版本
claude install 2.1.0

# 强制安装
claude install --force stable
```

---

### doctor — 健康检查

```bash
claude doctor
```

检查 Claude Code 自动更新器的健康状态。

---

### setup-token — 设置长期令牌

```bash
claude setup-token
```

设置长期认证令牌（需要 Claude 订阅）。

---

### auto-mode — 自动模式配置

查看和管理自动模式分类器配置。

```bash
# 查看生效的自动模式配置
claude auto-mode config

# 查看默认规则
claude auto-mode defaults

# 获取 AI 对自定义规则的建议
claude auto-mode critique
```

---

### update / upgrade — 更新

```bash
claude update
```

检查更新并安装可用更新。

---

## 权限模式

通过 `--permission-mode` 参数设置：

| 模式 | 说明 |
|------|------|
| `default` | 默认模式，每次操作需确认 |
| `plan` | 计划模式，先制定计划再执行 |
| `auto` | 自动模式，根据规则自动决定是否需要确认 |
| `acceptEdits` | 自动接受编辑，但其他操作仍需确认 |
| `dontAsk` | 不询问，直接执行 |
| `bypassPermissions` | 绕过所有权限检查 |

---

## 输出格式

在 `-p`（print）模式下，通过 `--output-format` 控制：

| 格式 | 说明 |
|------|------|
| `text` | 纯文本输出（默认） |
| `json` | 单个 JSON 结果 |
| `stream-json` | 实时流式 JSON 输出 |

示例：

```bash
# JSON 输出
claude -p --output-format json "列出当前目录的文件"

# 流式 JSON（适合程序解析）
claude -p --output-format stream-json "解释这段代码"
```

---

## 模型选择

使用 `--model` 参数选择模型：

```bash
# 使用模型别名
claude --model sonnet
claude --model opus

# 使用完整模型名称
claude --model claude-sonnet-4-6

# 设置推理投入等级
claude --effort high -p "深入分析这段代码的性能"
```

可用别名会随版本更新变化，建议使用 `--model` 配合最新别名。

---

## 会话管理

Claude Code 支持会话持久化和恢复：

```bash
# 继续上次对话
claude -c

# 通过会话 ID 恢复
claude -r <session-id>

# 交互式选择会话恢复
claude -r

# 搜索特定会话
claude -r "搜索关键词"

# 恢复 PR 关联会话
claude --from-pr 123
claude --from-pr https://github.com/org/repo/pull/123

# 恢复时创建新分支（不覆盖原会话）
claude -c --fork-session

# 为会话命名
claude -n "bugfix-session"
```

---

## Git Worktree 集成

Claude Code 支持在 Git Worktree 中工作：

```bash
# 创建新 worktree 会话
claude -w

# 创建命名 worktree
claude -w feature-branch

# 使用 tmux（推荐）
claude -w --tmux

# 使用传统 tmux
claude -w --tmux=classic
```

---

## 配置与设置

### 配置范围

| 范围 | 说明 | 存储位置 |
|------|------|----------|
| `local` | 本地（仅当前项目） | `.claude/` |
| `user` | 用户级（所有项目） | `~/.claude/` |
| `project` | 项目级（团队共享） | 项目根目录配置 |

### 加载配置来源

```bash
# 仅加载用户级配置
claude --setting-sources user

# 加载用户和项目级
claude --setting-sources user,project

# 加载全部
claude --setting-sources user,project,local
```

### 额外设置文件

```bash
# 从 JSON 文件加载
claude --settings ./my-settings.json

# 从 JSON 字符串加载
claude --settings '{"allowedTools": ["Bash", "Edit"]}'
```

---

## 常见用例

### 脚本集成

```bash
# 获取 JSON 输出用于脚本处理
claude -p --output-format json "分析 package.json 中的依赖"

# 设置花费上限
claude -p --max-budget-usd 0.5 "重构这段代码"

# 使用管道
cat error.log | claude -p "分析这些错误日志"
```

### CI/CD 集成

```bash
# 非交互模式，跳过权限
claude -p --dangerously-skip-permissions "运行测试并修复失败的用例"

# 指定工具集
claude -p --tools "Bash,Read,Write" "只使用基础工具完成任务"
```

### 结构化输出

```bash
# 使用 JSON Schema 约束输出
claude -p --json-schema '{"type":"object","properties":{"files":{"type":"array"}}}' "列出需要修改的文件"
```

### 多 Agent 协作

```bash
# 定义并使用自定义 Agent
claude --agent reviewer -p "审查 src/ 目录下的所有代码变更"
```

### MCP 服务器工作流

```bash
# 添加多个 MCP 服务器
claude mcp add -s project -e API_KEY=$KEY github-mcp -- npx @anthropic/github-mcp
claude mcp add -s project -t http sentry https://mcp.sentry.dev/mcp

# 查看已配置的服务器
claude mcp list

# 启动 MCP 服务器模式
claude mcp serve
```

### 极简模式

```bash
# 极简模式（跳过 hooks、LSP、插件同步等，适合 CI）
claude --bare -p "完成任务"
```

### Chrome 集成

```bash
# 启用 Chrome 集成
claude --chrome

# 显式禁用
claude --no-chrome
```
