# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

CLI 工具参考文档中心 + Playwright 脚本工作区。核心资产是 `docs/` 下的中文 CLI 参考手册（10+ 篇），附带 HTML 生成器和抖音抓取脚本（已归档到 `archive/`）。

## 常用命令

```bash
npm install                # 安装依赖（仅 playwright）
node generate_html.js      # 将 docs/*.md 转换为 html/*.html + 首页
```

无 build/test/lint 流程，无 CI 配置。

## 架构

- **`docs/`** — 核心资产：中文 CLI 参考手册（Markdown）
  - `cli-tools-inventory.md` 是工具索引页，增删文档时必须同步更新
- **`generate_html.js`** — Markdown → HTML 转换器（自定义解析，含中文锚点生成、赛博朋克主题样式）
- **`index.html`** — 项目落地页（Grid 动画背景，链接到所有参考手册）
- **`html/`** — 生成的 HTML 输出（已 gitignore）
- **`archive/`** — 归档的抖音抓取脚本和数据文件

## 文档约定

- 文件命名：`*-cli-reference.md` 后缀
- H1 格式：`# <工具名> CLI 参考手册`
- 所有文档使用中文编写
- 脚本使用 CommonJS（require），不是 ESM
