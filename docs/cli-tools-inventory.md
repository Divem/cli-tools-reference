# 本机 CLI 工具清单

> 统计时间：2026-04-12 | 系统：macOS ARM64 (Apple Silicon)

## 目录

- [Homebrew Formula](#homebrew-formula)
- [Homebrew Cask](#homebrew-cask)
- [npm 全局包](#npm-全局包)
- [Python 全局包（CLI 相关）](#python-全局包cli-相关)
- [Go 工具](#go-工具)
- [系统内置工具](#系统内置工具)
- [其他工具](#其他工具)
- [参考手册索引](#参考手册索引)

---

## Homebrew Formula

| 工具 | 说明 |
|------|------|
| `ffmpeg` | 音视频转码处理 |
| `gh` | GitHub 官方 CLI |
| `opencode` | OpenCode 终端 AI 编程工具 |
| `pandoc` | 通用文档格式转换 |
| `ripgrep` (rg) | 高速文本搜索 |
| `osx-cpu-temp` | CPU 温度监控 |
| `obsidian-cli` | Obsidian CLI |

---

## Homebrew Cask

| 工具 | 说明 |
|------|------|
| `android-platform-tools` | adb/fastboot 调试工具 |
| `entire` | 系统监控工具 |
| `stats` | 系统状态监控面板 |

---

## npm 全局包

| 包名 | 命令 | 说明 |
|------|------|------|
| `@anthropic-ai/claude-code` | `claude` | Anthropic Claude Code AI 编程助手 |
| `@larksuite/cli` | `lark` | 飞书/Lark 开放平台 CLI |
| `@pencil.dev/cli` | `pencil` | AI 驱动设计文件操作工具 |
| `@playwright/cli` | `playwright` | 微软 E2E 测试框架 CLI |
| `corepack` | `corepack` | Node.js 包管理器工具 |
| `openclaw` | `openclaw` | AI 代理网关（多渠道/浏览器/模型管理） |
| `hermes` | `hermes` | AI 助手（工具调用/多平台/技能/MCP，`~/.hermes/hermes-agent/`） |
| `npm` | `npm` | Node.js 包管理器 |

---

## Python 全局包（CLI 相关）

| 包名 | 说明 |
|------|------|
| `uv` | 高性能 Python 包管理器 |
| `browser-use` | 浏览器自动化 AI Agent |
| `ollama` | 本地 LLM 运行时 CLI |
| `mcp` | Model Context Protocol SDK |
| `openai` | OpenAI Python 客户端 |
| `anthropic` | Anthropic Python 客户端 |
| `dashscope` | 阿里云灵积 AI 客户端 |
| `google-genai` | Google Gemini AI 客户端 |
| `groq` | Groq AI 客户端 |
| `supabase` | Supabase 后端 Python SDK |
| `reportlab` | PDF 生成库 |
| `python-docx` | Word 文档操作库 |
| `pypdf` | PDF 读写处理库 |
| `beautifulsoup4` | HTML/XML 解析库 |
| `Flask` | 轻量 Web 框架 |
| `Jinja2` | 模板引擎 |
| `httpx` | 异步 HTTP 客户端 |
| `PyYAML` | YAML 解析库 |
| `Pillow` | 图像处理库 |

---

## Go 工具

| 工具 | 说明 |
|------|------|
| `dlv` | Go 调试器 (Delve) |
| `gopls` | Go 语言服务器 |
| `staticcheck` | Go 静态分析工具 |

---

## 系统内置工具

| 工具 | 说明 |
|------|------|
| `git` | 版本控制 |
| `curl` | HTTP 请求工具 |
| `vim` | 终端文本编辑器 |
| `zsh` | Z Shell |
| `bash` | Bash Shell |
| `jq` | JSON 处理工具 |
| `make` | 构建自动化工具 |
| `python3` | Python 3.14 |
| `node` | Node.js v22.22.1 |
| `npm` | Node.js 包管理器 |

---

## 其他工具

| 工具 | 来源 | 说明 |
|------|------|------|
| `bun` | Bun 安装器 | JavaScript 运行时 |
| `docker` | Docker Desktop | 容器管理 |
| `kubectl` | Docker Desktop 内置 | Kubernetes 集群管理 |
| `code` | Trae 编辑器 | Trae 编辑器 CLI |
| `adb` | Android Platform Tools | Android 调试桥 |

---

## 参考手册索引

已编写详细 CLI 参考手册的工具：

| 工具 | 文档 | 说明 |
|------|------|------|
| Claude Code | [claude-cli-reference.md](./claude-cli-reference.md) | Anthropic AI 编程助手 |
| FFmpeg | [ffmpeg-cli-reference.md](./ffmpeg-cli-reference.md) | 音视频处理 |
| GitHub CLI | [github-cli-reference.md](./github-cli-reference.md) | GitHub 官方 CLI |
| Lark CLI | [lark-cli-reference.md](./lark-cli-reference.md) | 飞书开放平台 CLI |
| OpenCode | [opencode-cli-reference.md](./opencode-cli-reference.md) | 终端 AI 编程工具 |
| Pencil | [pencil-cli-reference.md](./pencil-cli-reference.md) | AI 设计文件操作 |
| Playwright | [playwright-cli-reference.md](./playwright-cli-reference.md) | E2E 测试框架 |
| Pandoc | [pandoc-cli-reference.md](./pandoc-cli-reference.md) | 文档格式转换 |
| OpenClaw | [openclaw-cli-reference.md](./openclaw-cli-reference.md) | AI 代理网关（多渠道/浏览器/模型管理） |
| Hermes | [hermes-cli-reference.md](./hermes-cli-reference.md) | AI 助手（工具调用/多平台/技能/MCP） |
| Claude Skills 设计风格 | [design-skills-reference.md](./design-skills-reference.md) | 62 个品牌风格 + 10 个主题 + 设计技能总览 |
| OpenClaw vs Hermes 对比 | [openclaw-vs-hermes-comparison.md](./openclaw-vs-hermes-comparison.md) | AI 助手工具对比分析报告 |
