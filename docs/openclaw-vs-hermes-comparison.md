# OpenClaw vs Hermes 对比报告

> 基于本地安装的 OpenClaw 2026.3.13 与 Hermes Agent v0.9.0，结合官方文档与 GitHub 仓库编写

---

## 目录

- [基本信息](#基本信息)
- [定位与设计哲学](#定位与设计哲学)
- [技术架构](#技术架构)
- [功能对比总表](#功能对比总表)
- [核心功能深度对比](#核心功能深度对比)
  - [消息平台集成](#消息平台集成)
  - [推理模型支持](#推理模型支持)
  - [技能系统](#技能系统)
  - [浏览器控制](#浏览器控制)
  - [记忆与上下文](#记忆与上下文)
  - [定时任务](#定时任务)
  - [安全机制](#安全机制)
  - [多 Agent 隔离](#多-agent-隔离)
- [CLI 命令对比](#cli-命令对比)
- [生态与扩展](#生态与扩展)
- [运维能力](#运维能力)
- [迁移路径](#迁移路径)
- [适用场景推荐](#适用场景推荐)
- [总结](#总结)

---

## 基本信息

| 维度 | OpenClaw | Hermes |
|------|----------|--------|
| **版本** | 2026.3.13 (commit 61d171a) | v0.9.0 (2026.4.13) |
| **作者** | anpicasso（独立开发者） | Nous Research（研究团队） |
| **语言** | TypeScript / Node.js | Python |
| **许可证** | 专有（npm 包） | MIT（开源） |
| **安装方式** | `npm install -g openclaw` | `curl ... \| bash`（安装脚本） |
| **仓库** | npm registry（闭源） | [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) |
| **配置格式** | `openclaw.json`（JSON） | `config.yaml`（YAML） + `.env` |
| **数据目录** | `~/.openclaw/` | `~/.hermes/` |
| **Python 版本** | 不依赖 | Python 3.14.0 |
| **OpenAI SDK** | 内置 | 2.11.0 |
| **文档站点** | docs.openclaw.ai | hermes-agent.nousresearch.com |

---

## 定位与设计哲学

### OpenClaw — "AI 代理网关"

OpenClaw 定位为**全能型本地 AI 基础设施**，核心是 WebSocket 网关服务，围绕网关构建了消息平台集成、浏览器自动化、多 Agent 管理、设备控制、DNS 发现等功能。设计理念是**网关中心化**——所有功能通过网关 RPC 协调，CLI 是网关的客户端。

- 强调**系统级集成**：浏览器控制、设备配对、DNS 发现、沙箱隔离、安全审计
- 追求**功能广度**：50+ 顶级命令，涵盖从消息发送到设备摄像头截图的所有场景
- 面向**高级用户和自动化爱好者**

### Hermes — "自我进化的 AI 助手"

Hermes 定位为**具备学习能力的 AI 助手**，核心是闭环学习系统——从经验中创建技能、使用中改进技能、跨会话积累记忆、构建用户模型。设计理念是**Agent 中心化**——CLI 直接运行 Agent，网关是可选的消息扩展。

- 强调**学习与进化**：自动创建技能、技能自改进、用户建模（Honcho 集成）
- 追求**易用性**：一条命令启动对话、内置 40+ 工具、多终端后端支持
- 面向**开发者日常使用**，同时支持生产部署（$5 VPS 到 GPU 集群）

---

## 技术架构

```
OpenClaw 架构：
┌─────────────────────────────────────────────┐
│                  CLI (Node.js)               │
├─────────────────────────────────────────────┤
│           WebSocket Gateway (核心)            │
│  ┌─────────┬──────────┬──────────┬────────┐ │
│  │Telegram │ Discord  │ WhatsApp │ 飞书   │ │
│  │ Slack   │ Signal   │ iMessage │ Teams  │ │
│  └─────────┴──────────┴──────────┴────────┘ │
│  ┌─────────┬──────────┬──────────┬────────┐ │
│  │Browser  │ Agents   │ Cron     │ Sandbox│ │
│  │ MCP     │ Nodes    │ Memory   │ Hooks  │ │
│  └─────────┴──────────┴──────────┴────────┘ │
├─────────────────────────────────────────────┤
│            Node Host (可选远程节点)            │
└─────────────────────────────────────────────┘

Hermes 架构：
┌─────────────────────────────────────────────┐
│                CLI (Python)                  │
│  ┌──────────────────────────────────────────┐│
│  │         Agent Core (直接运行)             ││
│  │  ┌──────┬───────┬──────┬──────────────┐ ││
│  │  │Tools │Skills │Memory│User Modeling │ ││
│  │  └──────┴───────┴──────┴──────────────┘ ││
│  └──────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────┐│
│  │     Messaging Gateway (可选)             ││
│  │  Telegram │ Discord │ WhatsApp │ Signal  ││
│  └──────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│         MCP Server / ACP Bridge             │
└─────────────────────────────────────────────┘
```

**关键架构差异：**

| 维度 | OpenClaw | Hermes |
|------|----------|--------|
| 运行模式 | 网关必须运行 | CLI 直接运行，网关可选 |
| 核心协议 | WebSocket RPC | 直接 Agent 调用 |
| 通信方式 | CLI → 网关 → Agent | CLI → Agent（直连） |
| 部署粒度 | 单网关多 Agent | 单 Agent 实例，Profile 隔离 |
| 终端后端 | 1 种（本地） | 6 种（本地/Docker/SSH/Daytona/Singularity/Modal） |

---

## 功能对比总表

| 功能 | OpenClaw | Hermes | 说明 |
|------|:--------:|:------:|------|
| **交互式对话** | ✅ TUI | ✅ 内置 | OpenClaw 需连接网关 |
| **单次查询模式** | ✅ agent --message | ✅ chat -q | |
| **Telegram** | ✅ | ✅ | |
| **Discord** | ✅ | ✅ | |
| **WhatsApp** | ✅ | ✅ | |
| **Slack** | ✅ | ✅ | |
| **Signal** | ✅ | ✅ | |
| **飞书/Lark** | ✅ 插件 | ❌ | OpenClaw 独有 |
| **iMessage** | ✅ 插件 | ❌ | OpenClaw 独有 |
| **Google Chat** | ✅ | ❌ | OpenClaw 独有 |
| **MS Teams** | ✅ | ❌ | OpenClaw 独有 |
| **Mattermost** | ✅ 插件 | ❌ | OpenClaw 独有 |
| **微信** | ✅ 插件 | ❌ | OpenClaw 独有 |
| **Kimi** | ✅ 插件 | ❌ | OpenClaw 独有 |
| **浏览器自动化** | ✅ 完整（40+ 子命令） | ❌ | OpenClaw 核心优势 |
| **多 Agent 管理** | ✅ agents add/bind | ✅ profile create | OpenClaw 路由绑定更灵活 |
| **技能系统** | ✅ ClawHub | ✅ Skills Hub + 自创建 | Hermes 支持技能自创建/自改进 |
| **插件系统** | ✅ Git/npm/市场 | ✅ Git URL | OpenClaw 插件生态更丰富 |
| **MCP 协议** | ✅ serve/list/set | ✅ serve/add/list | 功能相当 |
| **ACP 协议** | ✅ bridge + client | ✅ 服务器模式 | 功能相当 |
| **定时任务** | ✅ cron add/edit | ✅ cron create | 功能相当 |
| **记忆系统** | ✅ MEMORY.md + 向量搜索 | ✅ MEMORY.md + 外部提供商 | Hermes 支持多种外部记忆提供商 |
| **用户建模** | ❌ | ✅ Honcho 集成 | Hermes 独有 |
| **安全审计** | ✅ security audit | ❌ | OpenClaw 独有 |
| **沙箱隔离** | ✅ Docker 容器 | ❌ | OpenClaw 独有 |
| **执行审批** | ✅ approvals 系统 | ✅ --yolo 跳过 | OpenClaw 更精细 |
| **设备配对** | ✅ devices + QR | ✅ pairing | OpenClaw 更完善 |
| **远程节点** | ✅ node host | ❌ | OpenClaw 独有 |
| **DNS 发现** | ✅ CoreDNS + Tailscale | ❌ | OpenClaw 独有 |
| **Webhook** | ✅ Gmail 等 | ✅ 通用订阅 | OpenClaw 有 Gmail 专用集成 |
| **使用洞察** | ❌ | ✅ insights 命令 | Hermes 独有 |
| **会话搜索** | ❌ 有限 | ✅ FTS5 全文搜索 | Hermes 独有 |
| **模型扫描** | ✅ models scan | ✅ model 选择 | OpenClaw 有自动扫描和探测 |
| **用量追踪** | ✅ provider usage | ❌ | OpenClaw 独有 |
| **TTS** | ✅ 内置 | ✅ 内置 | |
| **语音转录** | ✅ infer audio | ❌ | OpenClaw 独有 |
| **图片生成** | ✅ infer image | ❌ | OpenClaw 独有 |
| **视频生成** | ✅ infer video | ❌ | OpenClaw 独有 |
| **Web 搜索** | ✅ infer web | ❌ | OpenClaw 独有 |
| **Wiki/知识库** | ✅ wiki 命令 | ❌ | OpenClaw 独有 |
| **并行子 Agent** | ❌ | ✅ delegate 机制 | Hermes 独有 |
| **Git Worktree** | ❌ | ✅ --worktree | Hermes 独有 |
| **文件检查点** | ❌ | ✅ --checkpoints | Hermes 独有 |
| **Dashboard** | ✅ Control UI | ✅ Web UI | |
| **Shell 补全** | ✅ | ✅ | |
| **备份恢复** | ✅ backup create/verify | ✅ backup/import | 功能相当 |
| **配置验证** | ✅ config validate | ✅ config check | |
| **RL 训练** | ❌ | ✅ Atropos 环境 | Hermes 独有（研究用途） |

---

## 核心功能深度对比

### 消息平台集成

**OpenClaw** 支持目前最广泛的消息平台：

| 平台 | OpenClaw | Hermes |
|------|:--------:|:------:|
| Telegram | ✅ 多账号 | ✅ |
| Discord | ✅ 多账号 | ✅ |
| WhatsApp | ✅ Web 登录 | ✅ QR 码 |
| Slack | ✅ | ✅ |
| Signal | ✅ | ✅ |
| 飞书/Lark | ✅ 插件（文档/聊天/知识库/云盘/多维表格） | ❌ |
| iMessage | ✅ BlueBubbles 插件 | ❌ |
| Google Chat | ✅ | ❌ |
| MS Teams | ✅ | ❌ |
| Mattermost | ✅ 插件 | ❌ |
| 微信 | ✅ 插件 | ❌ |
| Email | ❌ | ✅ |

OpenClaw 的 `channels` 命令支持多账号管理（`--account` 参数）、频道能力查询、联系人/群组目录查询，消息管理也更完善（发送/广播/投票/表情/置顶/搜索/线程等）。

Hermes 的消息集成相对简洁，但覆盖主流平台，跨平台对话连续性是亮点。

### 推理模型支持

**两者都支持大量推理提供商，侧重点略有不同。**

**OpenClaw** 通过 `models` 和 `infer` 命令提供深度模型管理：
- `models scan`：自动扫描可用模型并配置
- `models status --probe`：实时探测模型可用性和认证状态
- `models fallbacks`：配置模型回退链
- `models auth`：多认证方式管理（OAuth/API Key/Token）
- `infer`：统一推理入口（文本/图片/音频/TTS/视频/Web搜索/嵌入）

**Hermes** 的模型管理更简洁：
- `hermes model`：交互式选择
- `hermes auth`：凭证池管理（密钥轮转）
- 17 个内置提供商（含中国厂商：zai/字节、kimi、minimax、小米）

| 提供商 | OpenClaw | Hermes |
|--------|:--------:|:------:|
| Nous Portal | ✅ | ✅ |
| OpenRouter | ✅ | ✅ |
| Anthropic/Claude | ✅ | ✅ |
| OpenAI | ✅ | ✅ |
| Gemini | ✅ | ✅ |
| GitHub Copilot | ✅ | ✅ |
| HuggingFace | ✅ | ✅ |
| z.ai/GLM | ✅ | ✅ |
| Kimi/Moonshot | ✅ | ✅ |
| MiniMax | ✅ | ✅ |
| 小米 | ✅ | ✅ |
| DeepSeek | ✅ | ❌ |
| 火山引擎 | ✅ | ❌ |
| 通义千问 | ✅ | ❌ |
| Kilocode | ❌ | ✅ |
| Arcee | ❌ | ✅ |
| 本地模型(Ollama) | ✅ | ❌ |

### 技能系统

**OpenClaw** 的技能系统围绕 ClawHub 注册中心构建：
- 70+ 技能（含 31 个就绪），覆盖 Apple 生态、开发工具、生活自动化
- 技能按需激活（按描述触发）
- 插件可注册工具和钩子（如飞书插件注册了 6 个工具）
- 技能来源：bundled / extra / hub

**Hermes** 的技能系统强调**自我进化**：
- 从经验中**自动创建**技能（完成复杂任务后提示保存）
- 技能在使用中**自我改进**
- 支持 agentskills.io 开放标准
- 多注册中心搜索：skills.sh、GitHub、ClawHub、LobeHub
- FTS5 会话搜索 + LLM 摘要实现跨会话知识召回
- 内置 40+ 技能，含 AI Agent 协作（Claude Code/Codex/OpenCode）、创意工具、GitHub 集成等

**核心差异：** OpenClaw 的技能更像是**预置能力模块**，Hermes 的技能更像是**可进化的程序记忆**。

### 浏览器控制

这是 **OpenClaw 的核心差异化能力**。40+ 个浏览器子命令，相当于内置了一个完整的 Playwright CLI：

```
openclaw browser:
  start/stop/status → 浏览器生命周期
  open/close/focus/tabs → 标签页管理
  navigate/screenshot/snapshot/pdf → 页面操作
  click/type/press/hover/drag/select → 交互模拟
  fill/upload/dialog/download → 表单与文件
  wait/evaluate/console/errors → 调试工具
  cookies/storage/extension → 浏览器环境
  profiles/create-profile/delete-profile → 配置管理
```

**Hermes 没有内置浏览器控制能力**，需要通过 MCP 服务器扩展。

### 记忆与上下文

**OpenClaw：**
- `MEMORY.md` + `memory/*.md` 文件式记忆
- 向量搜索（`memory search`）
- `USER.md` 用户偏好
- `SOUL.md` 人格设定
- 记忆晋升（`memory promote`）：短期回忆 → 长期记忆

**Hermes：**
- `MEMORY.md` + `USER.md` 内置记忆（始终可用）
- 7 种外部记忆提供商：honcho、openviking、mem0、hindsight、holographic、retaindb、byterover
- **Honcho 用户建模**：通过辩证式分析构建深度用户画像
- **自动记忆提醒**：定期 nudge 促进知识持久化
- FTS5 会话全文搜索 + LLM 摘要

### 定时任务

两者功能基本相当：

| 能力 | OpenClaw | Hermes |
|------|:--------:|:------:|
| 创建任务 | `cron add` | `cron create` |
| Cron 表达式 | ✅ | ✅ |
| 自然语言间隔 | ✅ `--every 2h` | ✅ `30m` / `every 2h` |
| 跨平台投递 | ✅ | ✅ |
| 暂停/恢复 | ✅ enable/disable | ✅ pause/resume |
| 运行历史 | ✅ `cron runs` | ❌ |
| 附带技能 | ❌ | ✅ `--skill` |
| 脚本注入 | ❌ | ✅ `--script` |

### 安全机制

**OpenClaw** 安全体系更完善：
- `security audit`：本地安全审计（含深度探测 `--deep`）
- `secrets`：SecretRef 密钥管理、密钥轮换、审计
- `sandbox`：Docker 容器隔离
- `approvals`：执行审批白名单（per-agent）
- 设备配对审批流程

**Hermes** 安全机制较简洁：
- `--yolo` 跳过危险确认（默认需确认）
- `--checkpoints` 文件检查点 + `/rollback` 恢复
- DM 配对码授权
- 凭证池轮转

### 多 Agent 隔离

**OpenClaw：**
- `agents add/delete`：创建独立 Agent
- `agents bind/unbind`：路由绑定（将特定渠道/账号路由到特定 Agent）
- `agents set-identity`：设置 Agent 身份（名称/主题/表情/头像）
- 每个 Agent 有独立的 workspace 和 state
- 主 Agent `main` 不可删除

**Hermes：**
- `profile create/use`：创建隔离实例
- `--clone / --clone-all`：从现有 Profile 克隆
- Profile 导出/导入
- `--worktree`：Git worktree 隔离并行工作

---

## CLI 命令对比

| 命令分类 | OpenClaw 命令数 | Hermes 命令数 | 说明 |
|----------|:--------------:|:------------:|------|
| 核心（对话/模型/配置） | 6 | 6 | 相当 |
| 认证 | 3 | 3 | 相当 |
| 消息平台 | 8 | 5 | OpenClaw 多 3 个 |
| 技能/插件 | 4 | 4 | 相当 |
| 会话/记忆 | 3 | 4 | Hermes 多 insights |
| 定时任务 | 1 | 1 | 相当 |
| 浏览器 | 1（40+ 子命令） | 0 | OpenClaw 独有 |
| 安全 | 3 | 0 | OpenClaw 独有 |
| 节点/设备 | 3 | 0 | OpenClaw 独有 |
| 系统/运维 | 8 | 8 | 相当 |
| 高级（ACP/MCP/Dashboard 等） | 5 | 5 | 相当 |
| **总计** | **~45 个顶级命令** | **~30 个顶级命令** | |

---

## 生态与扩展

| 维度 | OpenClaw | Hermes |
|------|----------|--------|
| **开源程度** | 闭源（npm 包） | 完全开源（MIT） |
| **社区** | Discord + 私有 | Discord + GitHub Discussions |
| **插件市场** | 内置 marketplace | Git 仓库安装 |
| **技能注册中心** | ClawHub | skills.sh + GitHub + ClawHub + LobeHub |
| **飞书集成** | 官方插件（6 个工具） | 无 |
| **Apple 生态** | 多个技能（Notes/Reminders/Find My/iMessage） | 多个技能（Notes/Reminders/Find My/iMessage） |
| **RL/AI 研究** | 无 | Atropos RL + 轨迹生成 |
| **多终端后端** | 本地 | 本地/Docker/SSH/Daytona/Singularity/Modal |
| **贡献者** | 1 人（主要） | Nous Research 团队 |

---

## 运维能力

| 运维任务 | OpenClaw | Hermes |
|----------|:--------:|:------:|
| 健康检查 | `doctor` + `health` + `status --deep` | `doctor` + `status` |
| 日志查看 | `logs`（RPC 方式） | `logs`（文件方式） |
| 配置验证 | `config validate` + `config schema` | `config check` |
| 安全审计 | `security audit --deep --fix` | 无 |
| 状态导出 | `status --all`（可分享） | `dump --show-keys` |
| 调试报告 | 无 | `debug share`（上传获取 URL） |
| 备份恢复 | `backup create/verify` | `backup/import` |
| 模型可用性探测 | `models status --probe` | 无 |
| 网关管理 | 完整（install/start/stop/restart） | 完整 |
| 配置热重载 | `secrets reload` | 无 |
| 更新渠道 | stable/beta/dev | git pull |
| 多环境隔离 | `--dev` / `--profile` | `profile` 命令 |

---

## 迁移路径

Hermes 内置了从 OpenClaw 的迁移工具：

```bash
hermes claw migrate              # 交互式迁移
hermes claw migrate --dry-run    # 预览迁移内容
hermes claw migrate --preset user-data  # 仅用户数据
hermes claw migrate --overwrite  # 覆盖已有冲突
```

可迁移内容：
- SOUL.md（人格文件）
- 记忆（MEMORY.md + USER.md）
- 技能（→ ~/.hermes/skills/openclaw-imports/）
- 命令白名单
- 消息平台配置
- API 密钥（Telegram/OpenRouter/OpenAI/Anthropic/ElevenLabs）
- TTS 资源
- 工作区指令（AGENTS.md）

**反向迁移（Hermes → OpenClaw）无官方支持。**

---

## 适用场景推荐

### 选择 OpenClaw 如果你需要：

1. **浏览器自动化** — 需要完整的浏览器控制（截图/表单/下载/PDF）
2. **飞书/Lark 深度集成** — 文档/知识库/云盘/多维表格/聊天
3. **多平台覆盖** — 微信/iMessage/Google Chat/MS Teams/Mattermost
4. **安全要求高** — 沙箱隔离、安全审计、执行审批、密钥管理
5. **远程节点管理** — 通过 iOS/macOS 设备控制（摄像头/屏幕/位置）
6. **推理能力扩展** — 内置图片生成、视频生成、语音转录、Web 搜索
7. **网络部署** — Tailscale + DNS 发现 + 局域网暴露

### 选择 Hermes 如果你需要：

1. **开源透明** — 完全开源（MIT），可审计、可贡献
2. **自我学习** — 自动创建/改进技能、用户建模、跨会话记忆
3. **轻量起步** — 一条命令对话，不需要启动网关
4. **灵活部署** — 6 种终端后端（含 serverless Modal/Daytona）
5. **研究用途** — RL 训练环境、轨迹生成、模型微调
6. **编程辅助** — Git worktree 隔离、文件检查点、子 Agent 并行
7. **使用分析** — token 用量、费用追踪、活动趋势

### 可以共存使用：

两者可以同时安装在同一台机器上，Hermes 还能直接迁移 OpenClaw 的数据。推荐策略：
- **日常对话/编程** → Hermes（轻量、学习型）
- **自动化/多平台** → OpenClaw（功能全、平台多）

---

## 总结

| 维度 | OpenClaw 胜出 | Hermes 胜出 |
|------|:------------:|:-----------:|
| 功能广度 | ✅ 50+ 命令 | |
| 消息平台 | ✅ 12+ 平台 | |
| 浏览器控制 | ✅ 40+ 子命令 | |
| 安全体系 | ✅ 完整 | |
| 设备/IoT | ✅ 节点/摄像头 | |
| 开源 | | ✅ MIT |
| 学习能力 | | ✅ 自创建技能 |
| 轻量启动 | | ✅ 无需网关 |
| 部署灵活 | | ✅ 6 种后端 |
| 研究就绪 | | ✅ RL 环境 |
| 编程辅助 | | ✅ worktree/checkpoint |
| 中国生态 | ✅ 飞书/微信/火山/千问 | ✅ zai/kimi/minimax/小米 |

**一句话总结：** OpenClaw 是瑞士军刀——功能最全、平台最广、自动化最深；Hermes 是会学习的伙伴——越用越懂你、越用越强大，且完全开源。
