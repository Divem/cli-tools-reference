# OpenClaw CLI 参考手册

> 版本：2026.3.13 | 安装路径：`/Users/dawinyuan/.npm-global/bin/openclaw`

## 目录

- [概述](#概述)
- [快速开始](#快速开始)
- [全局选项](#全局选项)
- [核心服务](#核心服务)
  - [gateway](#openclaw-gateway--网关服务)
  - [node](#openclaw-node--节点服务)
  - [agent](#openclaw-agent--代理交互)
- [会话与消息](#会话与消息)
  - [sessions](#openclaw-sessions--会话管理)
  - [message](#openclaw-message--消息管理)
- [渠道管理](#渠道管理)
  - [channels](#openclaw-channels--渠道管理)
  - [directory](#openclaw-directory--通讯录)
  - [pairing](#openclaw-pairing--配对管理)
  - [devices](#openclaw-devices--设备管理)
- [代理与模型](#代理与模型)
  - [agents](#openclaw-agents--代理管理)
  - [models](#openclaw-models--模型管理)
- [浏览器控制](#浏览器控制)
  - [browser](#openclaw-browser--浏览器控制)
- [技能与插件](#技能与插件)
  - [skills](#openclaw-skills--技能管理)
  - [plugins](#openclaw-plugins--插件管理)
  - [hooks](#openclaw-hooks--钩子管理)
- [记忆系统](#记忆系统)
  - [memory](#openclaw-memory--记忆管理)
- [定时任务](#定时任务)
  - [cron](#openclaw-cron--定时任务)
- [安全与审批](#安全与审批)
  - [security](#openclaw-security--安全审计)
  - [secrets](#openclaw-secrets--密钥管理)
  - [approvals](#openclaw-approvals--审批管理)
  - [sandbox](#openclaw-sandbox--沙箱管理)
- [节点与设备](#节点与设备)
  - [nodes](#openclaw-nodes--远程节点)
- [配置与运维](#配置与运维)
  - [config](#openclaw-config--配置管理)
  - [configure](#openclaw-configure--交互式配置向导)
  - [setup](#openclaw-setup--初始化)
  - [onboard](#openclaw-onboard--新手引导)
  - [doctor](#openclaw-doctor--健康检查)
  - [update](#openclaw-update--更新管理)
  - [backup](#openclaw-backup--备份管理)
- [协议与集成](#协议与集成)
  - [acp](#openclaw-acp--agent-control-protocol)
  - [webhooks](#openclaw-webhooks--webhook-集成)
  - [dns](#openclaw-dns--dns-辅助)
  - [system](#openclaw-system--系统事件)
- [其他命令](#其他命令)
  - [tui](#openclaw-tui--终端界面)
  - [dashboard](#openclaw-dashboard--控制面板)
  - [docs](#openclaw-docs--文档搜索)
  - [logs](#openclaw-logs--日志查看)
  - [health](#openclaw-health--健康状态)
  - [status](#openclaw-status--全局状态)
  - [qr](#openclaw-qr--二维码生成)
  - [completion](#openclaw-completion--shell-补全)
  - [reset](#openclaw-reset--重置)
  - [uninstall](#openclaw-uninstall--卸载)
- [文件路径说明](#文件路径说明)

---

## 概述

OpenClaw 是一个本地 AI 代理网关（AI Agent Gateway），提供 WebSocket 网关服务、多渠道消息集成（WhatsApp/Telegram/Discord/Slack/飞书等）、浏览器自动化、模型管理、技能扩展、定时任务等功能。它支持本地运行和 Tailscale 广域网暴露，是一个全能型的个人 AI 基础设施。

## 快速开始

```bash
# 交互式初始配置
openclaw setup

# 启动网关服务（前台运行）
openclaw gateway

# 启动网关服务（后台守护进程）
openclaw gateway install && openclaw gateway start

# 发送一条消息给代理
openclaw agent --message "你好"

# 查看全局状态
openclaw status

# 健康检查
openclaw doctor
```

## 全局选项

| 选项 | 说明 | 默认值 |
|---|---|---|
| `-h, --help` | 显示帮助信息 | - |
| `-V, --version` | 显示版本号 | - |
| `--dev` | 开发模式：隔离状态到 `~/.openclaw-dev`，网关端口 19001 | `false` |
| `--profile <name>` | 使用命名配置（隔离状态/配置到 `~/.openclaw-<name>`） | - |
| `--log-level <level>` | 全局日志级别（`silent`/`fatal`/`error`/`warn`/`info`/`debug`/`trace`） | - |
| `--no-color` | 禁用 ANSI 颜色 | `false` |

---

## 核心服务

### openclaw gateway — 网关服务

运行、检查和查询 WebSocket 网关。

**选项：**

| 选项 | 说明 | 默认值 |
|---|---|---|
| `--port <port>` | WebSocket 网关端口 | 配置值 |
| `--auth <mode>` | 认证模式（`none`/`token`/`password`/`trusted-proxy`） | 配置值 |
| `--token <token>` | 共享认证 token | `OPENCLAW_GATEWAY_TOKEN` 环境变量 |
| `--password <password>` | 密码认证模式的密码 | - |
| `--bind <mode>` | 绑定模式（`loopback`/`lan`/`tailnet`/`auto`/`custom`） | `loopback` |
| `--force` | 启动前杀死占用端口的进程 | `false` |
| `--verbose` | 详细日志输出 | `false` |
| `--compact` | 精简 WebSocket 日志（`--ws-log compact` 别名） | `false` |
| `--ws-log <style>` | WebSocket 日志风格（`auto`/`full`/`compact`） | `auto` |
| `--tailscale <mode>` | Tailscale 暴露模式（`off`/`serve`/`funnel`） | `off` |
| `--raw-stream` | 记录原始模型流事件到 JSONL | `false` |

**子命令：**

| 子命令 | 说明 |
|---|---|
| `run` | 前台运行网关 |
| `start` | 启动网关服务（launchd/systemd） |
| `stop` | 停止网关服务 |
| `restart` | 重启网关服务 |
| `install` | 安装网关服务 |
| `uninstall` | 卸载网关服务 |
| `status` | 显示网关服务状态 + 探测 |
| `health` | 获取网关健康状态 |
| `probe` | 显示网关可达性 + 发现 + 健康 + 状态摘要 |
| `discover` | 通过 Bonjour 发现网关 |
| `call` | 调用网关 RPC 方法 |
| `usage-cost` | 获取使用费用摘要 |

**示例：**

```bash
# 前台运行网关
openclaw gateway

# 指定端口并强制启动
openclaw gateway --port 18789 --force

# 开发模式（隔离状态，端口 19001）
openclaw --dev gateway

# 通过 Tailscale 暴露
openclaw gateway --tailscale serve

# 安装为系统服务
openclaw gateway install
openclaw gateway start

# 查看状态
openclaw gateway status
openclaw gateway probe
```

---

### openclaw node — 节点服务

运行和管理无头节点主机服务（Headless Node Host）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `run` | 前台运行节点主机 |
| `install` | 安装节点主机服务 |
| `start` | 启动节点主机服务 |
| `stop` | 停止节点主机服务 |
| `restart` | 重启节点主机服务 |
| `uninstall` | 卸载节点主机服务 |
| `status` | 显示节点主机状态 |

**示例：**

```bash
openclaw node run --host 127.0.0.1 --port 18789
openclaw node status
openclaw node install
```

---

### openclaw agent — 代理交互

通过网关运行一次代理交互。

**选项：**

| 选项 | 说明 | 默认值 |
|---|---|---|
| `-m, --message <text>` | 发送给代理的消息 | - |
| `-t, --to <number>` | 收件人号码（E.164 格式），用于派生会话密钥 | - |
| `--agent <id>` | 指定代理 ID（覆盖路由绑定） | - |
| `--session-id <id>` | 使用指定会话 ID | - |
| `--channel <channel>` | 投递渠道（`last`/`telegram`/`whatsapp`/`discord`/`slack`/`feishu` 等） | 主会话渠道 |
| `--deliver` | 将代理回复发送回选定渠道 | `false` |
| `--local` | 本地运行嵌入式代理（需 API 密钥） | `false` |
| `--thinking <level>` | 思考级别：`off`/`minimal`/`low`/`medium`/`high`/`xhigh` | - |
| `--timeout <seconds>` | 代理命令超时时间 | 600 |
| `--json` | JSON 格式输出 | `false` |
| `--verbose <on\|off>` | 持久化代理详细日志 | - |
| `--reply-channel <channel>` | 投递渠道覆盖 | - |
| `--reply-to <target>` | 投递目标覆盖 | - |
| `--reply-account <id>` | 投递账户 ID 覆盖 | - |

**示例：**

```bash
# 启动新会话
openclaw agent --to +15555550123 --message "状态更新"

# 使用指定代理
openclaw agent --agent ops --message "汇总日志"

# 投递回复到渠道
openclaw agent --to +15555550123 --message "回复内容" --deliver

# 发送到不同渠道
openclaw agent --agent ops --message "生成报告" --deliver --reply-channel slack --reply-to "#reports"

# 本地运行（无需网关）
openclaw agent --local --message "你好"
```

---

## 会话与消息

### openclaw sessions — 会话管理

列出存储的对话会话。

**选项：**

| 选项 | 说明 | 默认值 |
|---|---|---|
| `--agent <id>` | 指定代理 ID | 默认代理 |
| `--all-agents` | 聚合所有代理的会话 | `false` |
| `--active <minutes>` | 仅显示最近 N 分钟内更新的会话 | - |
| `--json` | JSON 格式输出 | `false` |
| `--store <path>` | 指定会话存储路径 | 配置值 |
| `--verbose` | 详细日志 | `false` |

**子命令：**

| 子命令 | 说明 |
|---|---|
| `cleanup` | 运行会话存储维护 |

**示例：**

```bash
openclaw sessions
openclaw sessions --agent work
openclaw sessions --active 120
openclaw sessions --json
```

---

### openclaw message — 消息管理

发送、读取和管理消息及渠道操作。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `send` | 发送消息 |
| `read` | 读取最近消息 |
| `edit` | 编辑消息 |
| `delete` | 删除消息 |
| `broadcast` | 广播消息到多个目标 |
| `react` | 添加/移除反应 |
| `reactions` | 列出消息反应 |
| `pin` / `unpin` | 置顶/取消置顶消息 |
| `pins` | 列出置顶消息 |
| `poll` | 发送投票（Discord） |
| `search` | 搜索消息（Discord） |
| `thread` | 线程操作 |
| `emoji` | Emoji 操作 |
| `sticker` | 贴纸操作 |
| `member` | 成员操作 |
| `role` | 角色操作 |
| `permissions` | 获取渠道权限 |
| `ban` / `kick` / `timeout` | 封禁/踢出/禁言成员 |
| `voice` | 语音操作 |
| `channel` | 渠道操作 |
| `event` | 事件操作 |

**示例：**

```bash
# 发送文本消息
openclaw message send --target +15555550123 --message "Hi"

# 发送带媒体的消息
openclaw message send --target +15555550123 --message "Hi" --media photo.jpg

# 创建 Discord 投票
openclaw message poll --channel discord --target channel:123 \
  --poll-question "吃什么？" --poll-option "披萨" --poll-option "寿司"

# 添加反应
openclaw message react --channel discord --target 123 --message-id 456 --emoji "✅"
```

---

## 渠道管理

### openclaw channels — 渠道管理

管理已连接的聊天渠道和账户。

**支持渠道：** `telegram`/`whatsapp`/`discord`/`irc`/`googlechat`/`slack`/`signal`/`imessage`/`line`/`feishu`/`nostr`/`msteams`/`mattermost`/`matrix`/`openclaw-weixin`/`zalo` 等

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出已配置的渠道和认证配置 |
| `status` | 显示网关渠道状态（`--deep` 深度检查） |
| `add` | 添加或更新渠道账户 |
| `remove` | 禁用或删除渠道账户 |
| `login` | 链接渠道账户（如 WhatsApp Web） |
| `logout` | 登出渠道会话 |
| `logs` | 显示最近的渠道日志 |
| `capabilities` | 显示提供商能力 |
| `resolve` | 解析渠道/用户名称为 ID |

**示例：**

```bash
openclaw channels list
openclaw channels status --probe
openclaw channels add --channel telegram --token <token>
openclaw channels login --channel whatsapp
```

---

### openclaw directory — 通讯录

查询联系人、群组 ID（自己、联系人、群组）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `self` | 显示当前账户身份 |
| `peers` | 联系人/用户目录 |
| `groups` | 群组目录 |

**示例：**

```bash
openclaw directory self --channel slack
openclaw directory peers list --channel slack --query "alice"
openclaw directory groups list --channel discord
```

---

### openclaw pairing — 配对管理

安全 DM 配对（审批入站请求）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出待处理配对请求 |
| `approve` | 批准配对码并允许发送者 |

---

### openclaw devices — 设备管理

设备配对和认证 Token 管理。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出待处理和已配对设备 |
| `approve` | 批准待处理设备配对请求 |
| `reject` | 拒绝待处理设备配对请求 |
| `remove` | 移除已配对设备条目 |
| `clear` | 清除已配对设备 |
| `rotate` | 轮换设备 Token |
| `revoke` | 撤销设备 Token |

---

## 代理与模型

### openclaw agents — 代理管理

管理隔离代理（工作区、认证、路由）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出已配置代理 |
| `add` | 添加新的隔离代理 |
| `delete` | 删除代理并清理工作区/状态 |
| `set-identity` | 更新代理身份（名称/主题/Emoji/头像） |
| `bind` | 添加路由绑定 |
| `unbind` | 移除路由绑定 |
| `bindings` | 列出路由绑定 |

**示例：**

```bash
openclaw agents list
openclaw agents add
openclaw agents bind --agent ops --channel telegram --target @mychat
```

---

### openclaw models — 模型管理

模型发现、扫描和配置。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出模型（默认已配置的） |
| `set` | 设置默认模型 |
| `set-image` | 设置图像模型 |
| `status` | 显示已配置模型状态（`--json`/`--plain`） |
| `scan` | 扫描 OpenRouter 免费模型 |
| `aliases` | 管理模型别名 |
| `auth` | 管理模型认证配置 |
| `fallbacks` | 管理模型回退列表 |
| `image-fallbacks` | 管理图像模型回退列表 |

**示例：**

```bash
openclaw models list
openclaw models set claude-sonnet-4-20250514
openclaw models status --json
```

---

## 浏览器控制

### openclaw browser — 浏览器控制

管理 OpenClaw 的专用浏览器（Chrome/Chromium），支持完整的浏览器自动化操作。

**全局选项：**

| 选项 | 说明 | 默认值 |
|---|---|---|
| `--browser-profile <name>` | 浏览器配置名称 | 配置值 |
| `--json` | JSON 格式输出 | `false` |
| `--timeout <ms>` | 超时时间（毫秒） | 30000 |
| `--url <url>` | 网关 WebSocket URL | 配置值 |
| `--token <token>` | 网关 Token | - |

**子命令：**

| 子命令 | 说明 |
|---|---|
| `start` | 启动浏览器（已运行则无操作） |
| `stop` | 停止浏览器 |
| `status` | 显示浏览器状态 |
| `navigate` | 导航到 URL |
| `open` | 在新标签页打开 URL |
| `close` | 关闭标签页 |
| `tabs` | 列出打开的标签页 |
| `tab` | 标签页快捷操作（基于索引） |
| `focus` | 聚焦标签页 |
| `snapshot` | 捕获页面快照（默认 AI 格式；`aria` 为无障碍树） |
| `screenshot` | 截取屏幕截图 |
| `click` | 通过快照 ref 点击元素 |
| `type` | 通过 ref 输入文本 |
| `fill` | 使用 JSON 字段描述填充表单 |
| `hover` | 悬停元素 |
| `drag` | 拖拽元素 |
| `press` | 按键 |
| `select` | 选择下拉选项 |
| `scrollintoview` | 滚动元素到可视区域 |
| `highlight` | 高亮元素 |
| `upload` | 为文件选择器准备文件上传 |
| `download` | 点击 ref 并保存下载 |
| `evaluate` | 在页面执行 JavaScript |
| `wait` | 等待（时间/选择器/URL/加载状态/JS 条件） |
| `pdf` | 保存页面为 PDF |
| `console` | 获取最近控制台消息 |
| `errors` | 获取最近页面错误 |
| `requests` | 获取最近网络请求 |
| `responsebody` | 等待网络响应并返回响应体 |
| `cookies` | 读写 Cookie |
| `storage` | 读写 localStorage/sessionStorage |
| `trace` | 录制 Playwright Trace |
| `dialog` | 处理模态对话框（alert/confirm/prompt） |
| `resize` | 调整视口大小 |
| `extension` | Chrome 扩展辅助 |
| `profiles` | 列出浏览器配置 |
| `create-profile` | 创建浏览器配置 |
| `delete-profile` | 删除浏览器配置 |
| `reset-profile` | 重置浏览器配置（移至废纸篓） |
| `set` | 浏览器环境设置 |

**示例：**

```bash
# 启动浏览器并打开页面
openclaw browser start
openclaw browser navigate "https://example.com"

# 截图
openclaw browser screenshot

# 获取页面快照
openclaw browser snapshot

# 点击元素（ref 来自 snapshot）
openclaw browser click --ref "button-1"

# 执行 JavaScript
openclaw browser evaluate "document.title"
```

---

## 技能与插件

### openclaw skills — 技能管理

列出和检查可用技能。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出所有可用技能 |
| `info` | 显示技能详细信息 |
| `check` | 检查哪些技能就绪、哪些缺少依赖 |

---

### openclaw plugins — 插件管理

管理 OpenClaw 插件和扩展。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出已发现的插件 |
| `info` | 显示插件详情 |
| `install` | 安装插件（路径/压缩包/npm 包名） |
| `uninstall` | 卸载插件 |
| `enable` | 在配置中启用插件 |
| `disable` | 在配置中禁用插件 |
| `update` | 更新已安装插件（npm 安装） |
| `doctor` | 报告插件加载问题 |

---

### openclaw hooks — 钩子管理

管理内部代理钩子（Hooks）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出所有钩子 |
| `info` | 显示钩子详细信息 |
| `check` | 检查钩子资格状态 |
| `install` | 安装钩子包（路径/压缩包/npm 包名） |
| `enable` | 启用钩子 |
| `disable` | 禁用钩子 |
| `update` | 更新已安装钩子（npm 安装） |

---

## 记忆系统

### openclaw memory — 记忆管理

搜索、检查和重新索引记忆文件。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `status` | 显示记忆搜索索引状态（`--deep` 探测嵌入提供商） |
| `index` | 重新索引记忆文件（`--force` 强制全量重建） |
| `search` | 搜索记忆文件（`--query`/`--max-results`） |

**示例：**

```bash
openclaw memory status
openclaw memory status --deep
openclaw memory index --force
openclaw memory search "会议记录"
openclaw memory search --query "部署" --max-results 20
```

---

## 定时任务

### openclaw cron — 定时任务

通过网关调度器管理定时任务。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出定时任务 |
| `add` | 添加定时任务 |
| `edit` | 编辑定时任务（补丁字段） |
| `rm` | 删除定时任务 |
| `enable` | 启用定时任务 |
| `disable` | 禁用定时任务 |
| `run` | 立即运行定时任务（调试） |
| `runs` | 显示定时任务运行历史（JSONL） |
| `status` | 显示调度器状态 |

---

## 安全与审批

### openclaw security — 安全审计

审计本地配置和状态中的常见安全问题。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `audit` | 审计配置 + 本地状态（`--deep`/`--fix`/`--json`） |

**示例：**

```bash
openclaw security audit
openclaw security audit --deep
openclaw security audit --fix
```

---

### openclaw secrets — 密钥管理

密钥运行时控制。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `audit` | 审计明文密钥、未解析引用和优先级漂移 |
| `configure` | 交互式密钥配置（提供商设置 + SecretRef 映射） |
| `apply` | 应用预先生成的密钥计划 |
| `reload` | 重新解析密钥引用并原子替换运行时快照 |

---

### openclaw approvals — 审批管理

管理执行审批（网关或节点主机）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `get` | 获取审批快照 |
| `set` | 用 JSON 文件替换审批配置 |
| `allowlist` | 编辑每代理白名单 |

---

### openclaw sandbox — 沙箱管理

管理沙箱容器（基于 Docker 的代理隔离）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `list` | 列出沙箱容器及其状态（`--browser` 仅浏览器容器） |
| `recreate` | 移除容器以强制用更新配置重建（`--all`/`--session`/`--agent`） |
| `explain` | 解释有效的沙箱/工具策略 |

**示例：**

```bash
openclaw sandbox list
openclaw sandbox recreate --all
openclaw sandbox explain
```

---

## 节点与设备

### openclaw nodes — 远程节点

管理网关拥有的节点（配对、状态、调用和媒体）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `status` | 列出已知节点及连接状态和能力 |
| `list` | 列出待处理和已配对节点 |
| `approve` | 批准配对请求 |
| `reject` | 拒绝配对请求 |
| `pending` | 列出待处理配对请求 |
| `describe` | 描述节点（能力 + 支持的命令） |
| `invoke` | 在已配对节点上调用命令 |
| `run` | 在节点上运行 Shell 命令（仅 Mac） |
| `camera` | 从节点捕获摄像头媒体 |
| `screen` | 从节点捕获屏幕录制 |
| `canvas` | 捕获或渲染节点的 Canvas 内容 |
| `location` | 获取节点位置 |
| `notify` | 在节点上发送本地通知（仅 Mac） |
| `push` | 发送 APNs 测试推送（iOS 节点） |
| `rename` | 重命名已配对节点 |

**示例：**

```bash
openclaw nodes status
openclaw nodes run --node <id> --raw "uname -a"
openclaw nodes camera snap --node <id>
```

---

## 配置与运维

### openclaw config — 配置管理

非交互式配置辅助（get/set/unset/file/validate）。无子命令运行时启动配置向导。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `get` | 通过点路径获取配置值 |
| `set` | 通过点路径设置配置值 |
| `unset` | 通过点路径移除配置值 |
| `file` | 打印活跃配置文件路径 |
| `validate` | 根据模式验证当前配置（不启动网关） |

**选项：**

| 选项 | 说明 |
|---|---|
| `--section <section>` | 配置向导分区（可重复，配合无子命令使用） |

**示例：**

```bash
openclaw config get gateway.port
openclaw config set models.default "claude-sonnet-4-20250514"
openclaw config file
openclaw config validate
```

---

### openclaw configure — 交互式配置向导

交互式配置向导，配置凭证、渠道、网关和代理默认值。

```bash
openclaw configure
```

---

### openclaw setup — 初始化

初始化本地配置和代理工作区。

```bash
openclaw setup
```

---

### openclaw onboard — 新手引导

交互式新手引导向导（网关、工作区、技能）。

```bash
openclaw onboard
```

---

### openclaw doctor — 健康检查

网关和渠道的健康检查 + 快速修复。

```bash
openclaw doctor
openclaw doctor --fix    # 应用修复
```

---

### openclaw update — 更新管理

更新 OpenClaw 和检查更新渠道状态。

**选项：**

| 选项 | 说明 | 默认值 |
|---|---|---|
| `--channel <stable\|beta\|dev>` | 持久化更新渠道（git + npm） | - |
| `--tag <dist-tag\|version>` | 覆盖 npm dist-tag 或版本 | - |
| `--dry-run` | 预览更新操作（不执行） | `false` |
| `--yes` | 跳过确认提示（非交互） | `false` |
| `--no-restart` | 跳过更新后重启网关 | `false` |
| `--json` | JSON 格式输出 | `false` |
| `--timeout <seconds>` | 每步超时时间 | 1200 |

**子命令：**

| 子命令 | 说明 |
|---|---|
| `status` | 显示更新渠道和版本状态 |
| `wizard` | 交互式更新向导 |

**示例：**

```bash
openclaw update status
openclaw update --channel beta --yes
openclaw update --dry-run
```

---

### openclaw backup — 备份管理

创建和验证 OpenClaw 状态的本地备份归档。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `create` | 创建配置、凭证、会话和工作区的备份归档 |
| `verify` | 验证备份归档及其嵌入清单 |

**示例：**

```bash
openclaw backup create
openclaw backup verify <archive-path>
```

---

## 协议与集成

### openclaw acp — Agent Control Protocol

运行基于网关的 ACP 桥接。

**选项：**

| 选项 | 说明 | 默认值 |
|---|---|---|
| `--session <key>` | 默认会话密钥（如 `agent:main:main`） | - |
| `--session-label <label>` | 默认会话标签 | - |
| `--url <url>` | 网关 WebSocket URL | 配置值 |
| `--token <token>` | 网关 Token | - |
| `--provenance <mode>` | 来源模式：`off`/`meta`/`meta+receipt` | - |
| `--reset-session` | 使用前重置会话密钥 | `false` |
| `--require-existing` | 会话不存在则失败 | `false` |
| `--no-prefix-cwd` | 不在提示前添加工作目录 | `false` |

**子命令：**

| 子命令 | 说明 |
|---|---|
| `client` | 运行交互式 ACP 客户端 |

---

### openclaw webhooks — Webhook 集成

Webhook 辅助和集成。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `gmail` | Gmail Pub/Sub 钩子 |

---

### openclaw dns — DNS 辅助

DNS 辅助工具，用于广域网发现（Tailscale + CoreDNS）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `setup` | 设置 CoreDNS 为单播 DNS-SD 提供服务（广域 Bonjour） |

---

### openclaw system — 系统事件

系统工具（事件、心跳、在线状态）。

**子命令：**

| 子命令 | 说明 |
|---|---|
| `event` | 入队系统事件并可选触发心跳 |
| `heartbeat` | 心跳控制 |
| `presence` | 列出系统在线状态条目 |

---

## 其他命令

### openclaw tui — 终端界面

打开连接到网关的终端用户界面。

```bash
openclaw tui
```

---

### openclaw dashboard — 控制面板

使用当前 Token 打开控制 UI。

```bash
openclaw dashboard
```

---

### openclaw docs — 文档搜索

搜索 OpenClaw 在线文档。

```bash
openclaw docs <query>
```

---

### openclaw logs — 日志查看

通过 RPC 实时追踪网关文件日志。

```bash
openclaw logs
```

---

### openclaw health — 健康状态

从运行中的网关获取健康信息。

```bash
openclaw health
```

---

### openclaw status — 全局状态

显示渠道健康和最近的会话接收者。

```bash
openclaw status
```

---

### openclaw qr — 二维码生成

生成 iOS 配对二维码/设置码。

```bash
openclaw qr
```

---

### openclaw completion — Shell 补全

生成 Shell 补全脚本。

```bash
openclaw completion
```

---

### openclaw reset — 重置

重置本地配置/状态（CLI 保持安装）。

```bash
openclaw reset
```

---

### openclaw uninstall — 卸载

卸载网关服务 + 本地数据（CLI 保持安装）。

```bash
openclaw uninstall
```

---

## 文件路径说明

| 路径 | 说明 |
|---|---|
| `~/.openclaw/` | 默认状态目录 |
| `~/.openclaw-dev/` | 开发模式状态目录（`--dev`） |
| `~/.openclaw-<name>/` | 命名配置状态目录（`--profile <name>`） |
| `~/.openclaw/extensions/` | 插件扩展目录 |

---

> 参考文档：https://docs.openclaw.ai/cli
