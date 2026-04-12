# AGENTS.md

## 项目概述

CLI 工具参考文档中心 + Playwright 脚本工作区，非标准软件工程项目。核心资产是 `docs/` 下的中文 CLI 参考手册。

## docs/ 约定

- 文件命名统一使用 `-cli-reference.md` 后缀（不用 manual/guide）
- H1 统一格式：`# <工具名> CLI 参考手册`
- `cli-tools-inventory.md` 是工具索引页，修改文档文件名时必须同步更新其中的链接
- 所有文档使用中文编写

## 目录结构

```
docs/                    # 核心资产：CLI 参考手册（9 篇）
douyin_scraper.js        # Playwright 抖音视频抓取（有头模式，需 cookie）
douyin_comment_scraper.js # Playwright 抖音评论抓取（有头模式，需 cookie）
```

## 运行脚本

```bash
npm install              # 安装依赖（仅 playwright）
node douyin_scraper.js
node douyin_comment_scraper.js
```

- 脚本使用 CommonJS（require），不是 ESM
- 无 build/test/lint 脚本，无 CI 配置
- 抖音脚本依赖硬编码 cookie，cookie 过期需手动更新
