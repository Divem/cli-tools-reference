# CLI 工具参考手册

CLI 工具参考文档中心 + Playwright 脚本工作区。

## 项目概述

本项目收集整理了多个常用 CLI 工具的参考手册，同时包含 Playwright 抖音视频/评论抓取脚本。

## 目录结构

```
docs/                    # CLI 参考手册
├── cli-tools-inventory.md    # 工具索引
├── claude-cli-reference.md   # Claude CLI 参考
├── design-skills-reference.md # Design Skills 参考
├── ffmpeg-cli-reference.md   # FFmpeg CLI 参考
├── github-cli-reference.md   # GitHub CLI 参考
├── lark-cli-reference.md     # Lark CLI 参考
├── opencode-cli-reference.md # Opencode CLI 参考
├── pandoc-cli-reference.md   # Pandoc CLI 参考
├── pencil-cli-reference.md   # Pencil CLI 参考
└── playwright-cli-reference.md # Playwright CLI 参考

douyin_scraper.js        # 抖音视频抓取脚本
douyin_comment_scraper.js # 抖音评论抓取脚本
generate_html.js         # HTML 生成脚本
```

## 安装依赖

```bash
npm install
```

## 使用脚本

```bash
# 抖音视频抓取
node douyin_scraper.js

# 抖音评论抓取
node douyin_comment_scraper.js

# 生成 HTML 文档
node generate_html.js
```

## 注意事项

- 抖音脚本使用有头模式，需要手动登录并提供 cookie
- cookie 过期需要手动更新 `douyin_cookies.json`

## 许可证

MIT
