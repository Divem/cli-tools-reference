# Hermes CLI 参考手册

> 版本：v0.9.0 (2026.4.13) | 安装路径：`~/.hermes/hermes-agent/`

Hermes Agent 是一个具备工具调用能力的 AI 助手，支持多推理提供商、多消息平台集成（Telegram/Discord/WhatsApp）、技能系统、插件体系、定时任务和 MCP 协议。

---

## 目录

- [快速开始](#快速开始)
- [全局选项](#全局选项)
- [核心命令](#核心命令)
  - [hermes chat — 交互式对话](#hermes-chat--交互式对话)
  - [hermes model — 模型选择](#hermes-model--模型选择)
  - [hermes setup — 配置向导](#hermes-setup--配置向导)
  - [hermes status — 状态查看](#hermes-status--状态查看)
  - [hermes config — 配置管理](#hermes-config--配置管理)
- [认证命令](#认证命令)
  - [hermes login — 登录](#hermes-login--登录)
  - [hermes logout — 登出](#hermes-logout--登出)
  - [hermes auth — 凭证池管理](#hermes-auth--凭证池管理)
- [消息平台命令](#消息平台命令)
  - [hermes gateway — 消息网关](#hermes-gateway--消息网关)
  - [hermes whatsapp — WhatsApp 集成](#hermes-whatsapp--whatsapp-集成)
  - [hermes webhook — Webhook 管理](#hermes-webhook--webhook-管理)
  - [hermes pairing — 配对授权](#hermes-pairing--配对授权)
- [技能与插件](#技能与插件)
  - [hermes skills — 技能管理](#hermes-skills--技能管理)
  - [hermes plugins — 插件管理](#hermes-plugins--插件管理)
  - [hermes tools — 工具配置](#hermes-tools--工具配置)
  - [hermes mcp — MCP 协议](#hermes-mcp--mcp-协议)
- [会话与数据](#会话与数据)
  - [hermes sessions — 会话管理](#hermes-sessions--会话管理)
  - [hermes memory — 记忆管理](#hermes-memory--记忆管理)
  - [hermes insights — 使用洞察](#hermes-insights--使用洞察)
  - [hermes logs — 日志查看](#hermes-logs--日志查看)
- [任务调度](#任务调度)
  - [hermes cron — 定时任务](#hermes-cron--定时任务)
- [系统命令](#系统命令)
  - [hermes doctor — 诊断](#hermes-doctor--诊断)
  - [hermes dump — 状态导出](#hermes-dump--状态导出)
  - [hermes debug — 调试](#hermes-debug--调试)
  - [hermes backup / import — 备份与恢复](#hermes-backup--import--备份与恢复)
  - [hermes version — 版本信息](#hermes-version--版本信息)
  - [hermes update — 更新](#hermes-update--更新)
  - [hermes uninstall — 卸载](#hermes-uninstall--卸载)
- [高级功能](#高级功能)
  - [hermes profile — 多实例管理](#hermes-profile--多实例管理)
  - [hermes acp — 编辑器集成](#hermes-acp--编辑器集成)
  - [hermes dashboard — Web 面板](#hermes-dashboard--web-面板)
  - [hermes completion — Shell 补全](#hermes-completion--shell-补全)
  - [hermes claw — OpenClaw 迁移](#hermes-claw--openclaw-迁移)
- [支持的平台与提供商](#支持的平台与提供商)

---

## 快速开始

```bash
# 首次配置
hermes setup

# 启动交互式对话
hermes

# 单次查询模式
hermes chat -q "解释 Python 的 GIL"

# 恢复最近会话
hermes -c

# 查看系统状态
hermes status
```

---

## 全局选项

| 选项 | 缩写 | 说明 |
|------|------|------|
| `--version` | `-V` | 显示版本号 |
| `--resume SESSION` | `-r` | 按会话 ID 恢复之前的会话 |
| `--continue [NAME]` | `-c` | 按名称恢复会话，省略名称则恢复最近会话 |
| `--worktree` | `-w` | 在隔离的 git worktree 中运行（并行 agent） |
| `--skills SKILLS` | `-s` | 预加载技能，逗号分隔 |
| `--yolo` | | 跳过所有危险命令确认提示 |
| `--pass-session-id` | | 在系统提示中包含会话 ID |

---

## 核心命令

### hermes chat — 交互式对话

启动与 AI 助手的交互式对话会话。

```bash
hermes                          # 交互式对话
hermes chat -q "Hello"          # 单次查询模式（非交互）
hermes chat --image photo.png -q "描述这张图片"  # 附带图片
hermes chat -m anthropic/claude-sonnet-4  # 指定模型
hermes chat --provider anthropic  # 指定推理提供商
hermes chat -s github-auth,hermes-agent-dev  # 预加载技能
hermes -c "my project"          # 按名称恢复会话
hermes --resume abc123          # 按ID恢复会话
hermes -w                       # 隔离 worktree 模式
hermes --checkpoints            # 启用文件系统检查点（可用 /rollback 恢复）
```

**选项：**

| 选项 | 缩写 | 说明 |
|------|------|------|
| `--query QUERY` | `-q` | 单次查询（非交互模式） |
| `--image IMAGE` | | 附加本地图片路径（配合 -q 使用） |
| `--model MODEL` | `-m` | 使用的模型（如 `anthropic/claude-sonnet-4`） |
| `--toolsets TOOLSETS` | `-t` | 启用的工具集，逗号分隔 |
| `--skills SKILLS` | `-s` | 预加载技能 |
| `--provider PROVIDER` | | 推理提供商（见下表） |
| `--verbose` | `-v` | 详细输出 |
| `--quiet` | `-Q` | 静默模式，仅输出最终回复 |
| `--resume SESSION_ID` | `-r` | 恢复会话 |
| `--continue [NAME]` | `-c` | 按名称恢复会话 |
| `--worktree` | `-w` | 隔离 git worktree |
| `--checkpoints` | | 启用文件检查点 |
| `--max-turns N` | | 最大工具调用迭代次数（默认 90） |
| `--yolo` | | 跳过危险确认 |
| `--pass-session-id` | | 传递会话 ID |
| `--source SOURCE` | | 会话来源标签（默认 `cli`） |

---

### hermes model — 模型选择

交互式选择推理提供商和默认模型。

```bash
hermes model                    # 交互式选择模型
hermes model --no-browser       # 不自动打开浏览器
hermes model --inference-url https://api.example.com  # 自定义推理 API
```

**选项：**

| 选项 | 说明 |
|------|------|
| `--portal-url URL` | Nous 登录门户 URL |
| `--inference-url URL` | 推理 API URL |
| `--client-id ID` | OAuth 客户端 ID（默认 `hermes-cli`） |
| `--scope SCOPE` | OAuth 范围 |
| `--no-browser` | 不自动打开浏览器 |
| `--timeout SECS` | HTTP 请求超时（默认 15 秒） |
| `--ca-bundle PATH` | CA 证书路径 |
| `--insecure` | 禁用 TLS 验证（仅测试） |

---

### hermes setup — 配置向导

交互式配置 Hermes Agent。

```bash
hermes setup                    # 完整配置向导
hermes setup model              # 仅配置模型
hermes setup tts                # 仅配置 TTS
hermes setup terminal           # 仅配置终端
hermes setup gateway            # 仅配置网关
hermes setup tools              # 仅配置工具
hermes setup agent              # 仅配置 agent
hermes setup --reset            # 重置为默认配置
hermes setup --non-interactive  # 非交互模式（使用默认值/环境变量）
```

**可配置模块：** `model` `tts` `terminal` `gateway` `tools` `agent`

---

### hermes status — 状态查看

查看 Hermes Agent 各组件状态。

```bash
hermes status                   # 基本状态
hermes status --all             # 详细状态（敏感信息已脱敏，可分享）
hermes status --deep            # 深度检查（较慢）
```

---

### hermes config — 配置管理

查看和编辑 Hermes Agent 配置。

```bash
hermes config show              # 显示当前配置
hermes config edit              # 在 $EDITOR 中编辑配置文件
hermes config set model gpt-4  # 设置配置项
hermes config path              # 显示配置文件路径
hermes config env-path          # 显示 .env 文件路径
hermes config check             # 检查缺失/过期的配置
hermes config migrate           # 更新配置以适配新版本
```

**子命令：** `show` `edit` `set` `path` `env-path` `check` `migrate`

---

## 认证命令

### hermes login — 登录

通过 OAuth 设备授权流程进行认证。

```bash
hermes login                    # 登录默认提供商（Nous）
hermes login --provider openai-codex  # 指定提供商
hermes login --no-browser       # 不自动打开浏览器
```

**选项：**

| 选项 | 说明 |
|------|------|
| `--provider {nous,openai-codex}` | 认证提供商 |
| `--portal-url URL` | 门户 URL |
| `--inference-url URL` | 推理 API URL |
| `--client-id ID` | OAuth 客户端 ID |
| `--scope SCOPE` | OAuth 范围 |
| `--no-browser` | 不打开浏览器 |
| `--timeout SECS` | HTTP 超时 |
| `--ca-bundle PATH` | CA 证书路径 |
| `--insecure` | 禁用 TLS 验证 |

---

### hermes logout — 登出

清除存储的认证信息。

```bash
hermes logout                   # 登出当前提供商
hermes logout --provider nous   # 指定提供商登出
```

---

### hermes auth — 凭证池管理

管理多个推理提供商的凭证池，实现密钥轮转和负载均衡。

```bash
hermes auth add <provider>      # 添加凭证
hermes auth list                # 列出所有凭证
hermes auth remove <provider> <token>  # 移除凭证（按索引/ID/标签）
hermes auth reset <provider>    # 清除提供商的耗尽状态
```

**子命令：** `add` `list` `remove` `reset`

---

## 消息平台命令

### hermes gateway — 消息网关

管理消息平台网关（Telegram、Discord、WhatsApp）。

```bash
hermes gateway run              # 前台运行（WSL/Docker/Termux 推荐）
hermes gateway start            # 启动后台服务（systemd/launchd）
hermes gateway stop             # 停止后台服务
hermes gateway restart          # 重启后台服务
hermes gateway status           # 查看网关状态
hermes gateway install          # 安装为后台服务
hermes gateway uninstall        # 卸载后台服务
hermes gateway setup            # 配置消息平台
```

**`gateway run` 选项：**

| 选项 | 说明 |
|------|------|
| `--verbose` `-v` | 增加 stderr 日志级别（`-v`=INFO, `-vv`=DEBUG） |
| `--quiet` `-q` | 抑制所有 stderr 日志 |
| `--replace` | 替换已有网关实例 |

---

### hermes whatsapp — WhatsApp 集成

通过 QR 码配置 WhatsApp 集成。

```bash
hermes whatsapp                 # 显示 QR 码进行配对
```

---

### hermes webhook — Webhook 管理

创建、管理动态 Webhook 订阅，用于事件驱动的 agent 激活。

```bash
hermes webhook subscribe <name>  # 创建订阅
hermes webhook list              # 列出所有订阅
hermes webhook remove <name>     # 移除订阅
hermes webhook test <name>       # 发送测试 POST 请求
```

**`webhook subscribe` 选项：**

| 选项 | 说明 |
|------|------|
| `--prompt PROMPT` | 提示词模板，支持 `{dot.notation}` 引用 payload |
| `--events EVENTS` | 接受的事件类型，逗号分隔 |
| `--description DESC` | 订阅说明 |
| `--skills SKILLS` | 加载的技能，逗号分隔 |
| `--deliver TARGET` | 投递目标：log/telegram/discord/slack 等 |
| `--deliver-chat-id ID` | 跨平台投递的聊天 ID |
| `--secret SECRET` | HMAC 密钥（自动生成） |

---

### hermes pairing — 配对授权

通过配对码审批用户 DM 访问权限。

```bash
hermes pairing list             # 查看待审批和已授权用户
hermes pairing approve          # 审批配对码
hermes pairing revoke           # 撤销用户访问权限
hermes pairing clear-pending    # 清除所有待审批码
```

---

## 技能与插件

### hermes skills — 技能管理

从 skills.sh、GitHub、ClawHub 等注册中心搜索、安装和管理技能。

```bash
hermes skills browse            # 浏览所有可用技能（分页）
hermes skills search <query>    # 搜索技能
hermes skills install <skill>   # 安装技能
hermes skills inspect <skill>   # 预览技能（不安装）
hermes skills list              # 列出已安装技能
hermes skills check             # 检查已安装技能的更新
hermes skills update            # 更新已安装的 hub 技能
hermes skills audit             # 重新扫描已安装的 hub 技能
hermes skills uninstall <skill> # 卸载技能
hermes skills publish           # 发布技能到注册中心
hermes skills snapshot          # 导出/导入技能配置
hermes skills tap               # 管理技能源
hermes skills config            # 交互式启用/禁用单个技能
```

**`skills search` 选项：**

| 选项 | 说明 |
|------|------|
| `--source SOURCE` | 搜索源：`all`/`official`/`skills-sh`/`well-known`/`github`/`clawhub`/`lobehub` |
| `--limit N` | 最大结果数 |

---

### hermes plugins — 插件管理

从 Git 仓库安装、更新和管理插件。

```bash
hermes plugins install <repo>   # 安装插件（Git URL 或 owner/repo）
hermes plugins update <plugin>  # 拉取最新代码
hermes plugins remove <plugin>  # 移除插件
hermes plugins list             # 列出已安装插件
hermes plugins enable <plugin>  # 启用插件
hermes plugins disable <plugin> # 禁用插件（不移除）
```

**`plugins install` 选项：**

| 选项 | 说明 |
|------|------|
| `--force` `-f` | 移除已有插件并重新安装 |

---

### hermes tools — 工具配置

配置各平台启用的工具集。

```bash
hermes tools                    # 交互式工具配置 UI
hermes tools list               # 显示所有工具及状态
hermes tools enable <tool>      # 启用工具集或 MCP 工具
hermes tools disable <tool>     # 禁用工具集或 MCP 工具
hermes tools --summary          # 打印各平台已启用工具摘要
```

**工具命名约定：**
- 内置工具集：`web`、`memory` 等纯名称
- MCP 工具：`server:tool` 格式（如 `github:create_issue`）

---

### hermes mcp — MCP 协议

管理 MCP 服务器连接，或将 Hermes 作为 MCP 服务器运行。

```bash
hermes mcp serve                # 作为 MCP 服务器运行（暴露会话给其他 agent）
hermes mcp add <name>           # 添加 MCP 服务器
hermes mcp remove <name>        # 移除 MCP 服务器
hermes mcp list                 # 列出已配置的 MCP 服务器
hermes mcp test <name>          # 测试 MCP 服务器连接
hermes mcp configure            # 切换工具选择
```

**`mcp add` 选项：**

| 选项 | 说明 |
|------|------|
| `--url URL` | HTTP/SSE 端点 URL |
| `--command CMD` | Stdio 命令（如 `npx`） |
| `--args ARGS` | Stdio 命令参数 |
| `--auth {oauth,header}` | 认证方式 |
| `--preset NAME` | 已知 MCP 预设名 |
| `--env KEY=VALUE` | Stdio 服务器环境变量 |

**示例：**

```bash
# 添加 HTTP MCP 服务器
hermes mcp add github --url https://mcp.github.com/sse

# 添加 Stdio MCP 服务器
hermes mcp add filesystem --command npx --args -y @modelcontextprotocol/server-filesystem /tmp

# 作为 MCP 服务器运行
hermes mcp serve
```

---

## 会话与数据

### hermes sessions — 会话管理

管理 SQLite 会话存储。

```bash
hermes sessions list            # 列出最近会话
hermes sessions browse          # 交互式会话选择器
hermes sessions rename <ID> <TITLE>  # 重命名会话
hermes sessions export          # 导出为 JSONL 文件
hermes sessions delete <ID>     # 删除会话
hermes sessions prune           # 删除旧会话
hermes sessions stats           # 显示会话统计
```

**`sessions list` 选项：**

| 选项 | 说明 |
|------|------|
| `--source SOURCE` | 按平台过滤（cli/telegram/discord 等） |
| `--limit N` | 最大显示数量 |

---

### hermes memory — 记忆管理

设置和管理外部记忆提供商插件。内置记忆（MEMORY.md/USER.md）始终可用。

```bash
hermes memory setup             # 交互式选择和配置提供商
hermes memory status            # 显示当前记忆提供商配置
hermes memory off               # 禁用外部提供商（仅保留内置记忆）
```

**可用提供商：** `honcho` `openviking` `mem0` `hindsight` `holographic` `retaindb` `byterover`

---

### hermes insights — 使用洞察

分析会话历史，展示 token 用量、费用、工具使用模式和活动趋势。

```bash
hermes insights                 # 分析最近 30 天
hermes insights --days 7        # 分析最近 7 天
hermes insights --source cli    # 按平台过滤
```

**选项：**

| 选项 | 说明 |
|------|------|
| `--days N` | 分析天数（默认 30） |
| `--source SOURCE` | 按平台过滤 |

---

### hermes logs — 日志查看

查看、追踪和过滤日志文件。

```bash
hermes logs                     # 显示 agent.log 最后 50 行
hermes logs -f                  # 实时追踪日志
hermes logs errors              # 查看 errors.log
hermes logs gateway             # 查看 gateway.log
hermes logs list                # 列出所有日志文件及大小
hermes logs -n 100              # 显示最后 100 行
hermes logs --level WARNING     # 仅显示 WARNING 及以上
hermes logs --session abc123    # 按会话 ID 过滤
hermes logs --component tools   # 按组件过滤
hermes logs --since 1h          # 最近 1 小时的日志
hermes logs --since 30m -f      # 从 30 分钟前开始实时追踪
```

**选项：**

| 选项 | 说明 |
|------|------|
| `-n LINES` | 显示行数（默认 50） |
| `-f` `--follow` | 实时追踪 |
| `--level LEVEL` | 最低日志级别（DEBUG/INFO/WARNING/ERROR） |
| `--session ID` | 按会话 ID 过滤 |
| `--since TIME` | 时间范围（如 `1h`、`30m`、`2d`） |
| `--component NAME` | 按组件过滤：gateway/agent/tools/cli/cron |

**日志文件：** `agent`（默认）、`errors`、`gateway`

---

## 任务调度

### hermes cron — 定时任务

管理计划任务。

```bash
hermes cron list                # 列出所有定时任务
hermes cron create <schedule> [prompt]  # 创建定时任务
hermes cron edit                # 编辑已有任务
hermes cron pause               # 暂停任务
hermes cron resume              # 恢复任务
hermes cron run                 # 在下一次调度时运行任务
hermes cron remove              # 移除任务
hermes cron status              # 检查调度器状态
hermes cron tick                # 执行到期的任务并退出
```

**`cron create` 选项：**

| 选项 | 说明 |
|------|------|
| `--name NAME` | 任务名称 |
| `--deliver TARGET` | 投递目标：origin/local/telegram/discord/signal/platform:chat_id |
| `--repeat N` | 重复次数 |
| `--skill SKILLS` | 附加技能（可重复使用） |
| `--script PATH` | Python 脚本路径，stdout 注入到 prompt |

**调度格式：**
- 简写：`30m`（每 30 分钟）、`every 2h`（每 2 小时）
- Cron：`0 9 * * *`（每天早上 9 点）

**示例：**

```bash
# 每 30 分钟执行摘要
hermes cron create 30m "总结最近的 git commits" --name "commit-summary"

# 每天早上 9 点运行
hermes cron create "0 9 * * *" "检查服务器状态" --deliver telegram

# 附加技能
hermes cron create 1h "检查 PR 状态" --skill github-auth
```

---

## 系统命令

### hermes doctor — 诊断

检查 Hermes Agent 配置和依赖项。

```bash
hermes doctor                   # 诊断问题
hermes doctor --fix             # 自动修复发现的问题
```

---

### hermes dump — 状态导出

输出紧凑的纯文本设置摘要，可粘贴到 Discord/GitHub 用于技术支持。

```bash
hermes dump                     # 导出设置摘要
hermes dump --show-keys         # 显示 API 密钥前后 4 位（脱敏）
```

---

### hermes debug — 调试

上传调试报告（系统信息 + 最近日志）到粘贴服务并获取分享链接。

```bash
hermes debug share              # 上传调试报告并打印 URL
hermes debug share --lines 500  # 包含更多日志行
hermes debug share --expire 30  # 保留 30 天
hermes debug share --local      # 本地输出（不上传）
```

---

### hermes backup / import — 备份与恢复

备份和恢复 Hermes 完整配置。

```bash
# 备份
hermes backup                   # 完整备份到 ~/hermes-backup-<timestamp>.zip
hermes backup -o /path/to/backup.zip  # 指定输出路径
hermes backup --quick           # 快照模式：仅关键状态文件
hermes backup --quick --label "daily"  # 快照 + 标签

# 恢复
hermes import backup.zip        # 从备份恢复
hermes import --force backup.zip  # 强制覆盖
```

**`backup` 选项：**

| 选项 | 缩写 | 说明 |
|------|------|------|
| `--output PATH` | `-o` | 输出路径 |
| `--quick` | `-q` | 仅关键状态文件（config、state.db、.env、auth、cron） |
| `--label LABEL` | `-l` | 快照标签（配合 --quick） |

---

### hermes version — 版本信息

```bash
hermes version                  # 显示详细版本信息
hermes --version                # 显示简短版本号
```

---

### hermes update — 更新

从 Git 拉取最新代码并重新安装依赖。

```bash
hermes update                   # 更新到最新版本
hermes update --gateway         # 网关模式：使用文件 IPC 替代 stdin
```

---

### hermes uninstall — 卸载

从系统移除 Hermes Agent。

```bash
hermes uninstall                # 卸载（保留配置和数据）
hermes uninstall --full         # 完全卸载（包括配置和数据）
hermes uninstall --yes          # 跳过确认提示
```

---

## 高级功能

### hermes profile — 多实例管理

管理多个隔离的 Hermes 实例配置。

```bash
hermes profile list             # 列出所有配置
hermes profile create <name>    # 创建新配置
hermes profile use <name>       # 切换默认配置
hermes profile show <name>      # 显示配置详情
hermes profile delete <name>    # 删除配置
hermes profile rename <old> <new>  # 重命名
hermes profile alias            # 管理包装脚本
hermes profile export <name>    # 导出配置到归档
hermes profile import           # 从归档导入配置
```

**`profile create` 选项：**

| 选项 | 说明 |
|------|------|
| `--clone` | 从当前配置复制 config.yaml/.env/SOUL.md |
| `--clone-all` | 完整复制当前配置（所有状态） |
| `--clone-from SOURCE` | 从指定配置克隆 |
| `--no-alias` | 跳过包装脚本创建 |

---

### hermes acp — 编辑器集成

以 ACP（Agent Client Protocol）模式启动 Hermes，用于编辑器集成。

```bash
hermes acp                      # 启动 ACP 服务器
```

支持编辑器：VS Code、Zed、JetBrains

---

### hermes dashboard — Web 面板

启动 Web UI 面板管理配置、API 密钥和会话。

```bash
hermes dashboard                # 启动面板（默认 http://127.0.0.1:9119）
hermes dashboard --port 8080    # 指定端口
hermes dashboard --host 0.0.0.0  # 指定主机
hermes dashboard --no-open      # 不自动打开浏览器
hermes dashboard --insecure     # 允许非本地绑定（⚠️ 危险：暴露 API 密钥到网络）
```

**选项：**

| 选项 | 说明 |
|------|------|
| `--port PORT` | 端口（默认 9119） |
| `--host HOST` | 主机（默认 127.0.0.1） |
| `--no-open` | 不自动打开浏览器 |
| `--insecure` | 允许非本地绑定（危险） |

---

### hermes completion — Shell 补全

生成 Shell 自动补全脚本。

```bash
hermes completion bash          # Bash 补全
hermes completion zsh           # Zsh 补全
hermes completion fish          # Fish 补全
```

**Zsh 安装示例：**

```bash
hermes completion zsh > ~/.zsh/completion/_hermes
```

---

### hermes claw — OpenClaw 迁移

从 OpenClaw 迁移到 Hermes Agent。

```bash
hermes claw migrate             # 执行迁移
hermes claw cleanup             # 归档 OpenClaw 残余目录
```

---

## 支持的平台与提供商

### 推理提供商

| 提供商 | `--provider` 值 |
|--------|-----------------|
| 自动选择 | `auto`（默认） |
| Nous | `nous` |
| OpenRouter | `openrouter` |
| Anthropic | `anthropic` |
| Gemini | `gemini` |
| OpenAI Codex | `openai-codex` |
| GitHub Copilot | `copilot` |
| GitHub Copilot ACP | `copilot-acp` |
| HuggingFace | `huggingface` |
| 字节跳动（豆包） | `zai` |
| Kimi Coding | `kimi-coding` |
| Kimi Coding CN | `kimi-coding-cn` |
| MiniMax | `minimax` |
| MiniMax CN | `minimax-cn` |
| Kilocode | `kilocode` |
| 小米 | `xiaomi` |
| Arcee | `arcee` |

### 消息平台

- Telegram
- Discord
- WhatsApp
- Signal

---

## 常用工作流

### 首次安装

```bash
hermes setup            # 配置模型和工具
hermes login            # 认证
hermes doctor           # 验证安装
```

### 技能安装

```bash
hermes skills search "github"       # 搜索技能
hermes skills install github-auth   # 安装技能
hermes skills config                # 启用/禁用技能
```

### 多平台部署

```bash
hermes gateway setup                # 配置消息平台
hermes gateway install              # 安装为后台服务
hermes gateway start                # 启动服务
hermes pairing list                 # 管理用户授权
```

### 调试排障

```bash
hermes status --deep                # 深度状态检查
hermes doctor --fix                 # 诊断并修复
hermes dump --show-keys             # 导出配置摘要
hermes debug share                  # 上传调试报告
hermes logs --level ERROR --since 1h  # 查看近期错误
```
