# Claude Skills 设计风格参考手册

> 适用于 Claude Code / Claude Desktop 的设计类技能，覆盖品牌风格、主题工厂、前端设计、图表、视觉艺术等。

---

## 目录

- [概述](#概述)
- [Brand Design MD — 62 个品牌风格](#brand-design-md--62-个品牌风格)
  - [科技 / AI 产品（32 个）](#科技--ai-产品32-个)
  - [开发者工具 / 基础设施（16 个）](#开发者工具--基础设施16-个)
  - [金融 / 加密（5 个）](#金融--加密5-个)
  - [消费品 / 汽车（11 个）](#消费品--汽车11-个)
  - [使用方式](#使用方式)
- [Theme Factory — 10 个预设主题](#theme-factory--10-个预设主题)
- [Frontend Design — 自由美学设计](#frontend-design--自由美学设计)
- [Anthropic Diagram — 编辑级图表](#anthropic-diagram--编辑级图表)
- [Canvas Design — 视觉艺术设计](#canvas-design--视觉艺术设计)
- [其他设计类技能](#其他设计类技能)

---

## 概述

Claude Skills 中与设计相关的技能分为几大类：

| 技能 | 用途 | 来源 |
|------|------|------|
| **brand-design-md** | 从 getdesign.md 获取 62 个顶级品牌设计规范，生成匹配品牌风格的 UI 代码 | `brand-design-md` |
| **theme-factory** | 10 个预设主题（配色 + 字体），可应用到幻灯片、文档、HTML 等 | `theme-factory` |
| **frontend-design** | 自由美学方向，生成独特的生产级前端界面 | `frontend-design` |
| **anthropic-diagram** | 生成 Anthropic 博客风格的 .drawio 图表/流程图 | `anthropic-diagram` |
| **canvas-design** | 创建海报、视觉艺术（.png/.pdf） | `canvas-design` |
| **design-shotgun** | 一次生成多个设计变体，对比选择 | `design-shotgun` |
| **design-consultation** | 从零创建完整设计系统 | `design-consultation` |
| **design-html** | 将设计稿转化为生产级 HTML/CSS | `design-html` |
| **brand-guidelines** | 应用 Anthropic 官方品牌色和排版 | `brand-guidelines` |

---

## Brand Design MD — 62 个品牌风格

从 [getdesign.md](https://getdesign.md) 自动获取品牌设计规范（颜色、字体、间距、圆角、阴影），严格按规范数值生成 UI 代码。

**触发方式：** 提到"XX风格"、"做成XX的感觉"、"参考XX设计"。

### 科技 / AI 产品（32 个）

| 品牌 | Slug | 风格关键词 |
|------|------|-----------|
| 苹果 / Apple | `apple` | 极致留白 + SF Pro + 电影质感 |
| Claude / Anthropic | `claude` | 赭石强调色 + 编辑排版 + 温暖智识感 |
| Cursor / AI 编辑器 | `cursor` | 深色 + 渐变强调 + AI 原生 |
| ElevenLabs / 语音 AI | `elevenlabs` | — |
| Figma / 设计工具 | `figma` | 多彩活泼 + 专业 + 协作感 |
| Framer / 建站工具 | `framer` | — |
| Lovable | `lovable` | — |
| Meta / Facebook | `meta` | — |
| MiniMax | `minimax` | — |
| Mintlify / 文档平台 | `mintlify` | — |
| Mistral / Mistral AI | `mistral.ai` | — |
| Notion / 笔记工具 | `notion` | 暖色极简 + 衬线标题 + 柔和表面 |
| Ollama | `ollama` | — |
| OpenCode | `opencode.ai` | — |
| PostHog | `posthog` | — |
| Raycast | `raycast` | 深色铬面 + 渐变强调 + 效率感 |
| Replicate | `replicate` | — |
| Resend | `resend` | — |
| Runway / RunwayML | `runwayml` | — |
| Sanity / CMS | `sanity` | — |
| Sentry | `sentry` | — |
| Supabase | `supabase` | 深色翠绿 + 代码优先 + 开发者感 |
| Superhuman / 邮件 | `superhuman` | — |
| Together AI | `together.ai` | — |
| Vercel | `vercel` | 黑白精准 + Geist 字体 + 极简 |
| VoltAgent | `voltagent` | — |
| Warp / 终端 | `warp` | — |
| Webflow | `webflow` | — |
| X.AI / Grok | `x.ai` | — |
| Zapier | `zapier` | — |

### 开发者工具 / 基础设施（16 个）

| 品牌 | Slug | 风格关键词 |
|------|------|-----------|
| Airtable | `airtable` | — |
| Cal.com / Cal | `cal` | — |
| Clay | `clay` | — |
| ClickHouse | `clickhouse` | — |
| Cohere | `cohere` | — |
| Composio | `composio` | — |
| Expo | `expo` | — |
| HashiCorp | `hashicorp` | — |
| IBM | `ibm` | — |
| Intercom | `intercom` | — |
| Linear / 项目管理 | `linear.app` | 超级极简 + 精准 + 紫色强调 |
| Miro / 在线白板 | `miro` | — |
| MongoDB | `mongodb` | — |
| NVIDIA / 英伟达 | `nvidia` | — |
| Pinterest | `pinterest` | — |
| Stripe / 支付 | `stripe` | 紫色渐变 + 300 字重优雅 + 精致细节 |

### 金融 / 加密（5 个）

| 品牌 | Slug | 风格关键词 |
|------|------|-----------|
| Binance / 币安 | `binance` | — |
| Coinbase | `coinbase` | — |
| Kraken | `kraken` | — |
| Revolut | `revolut` | — |
| Wise | `wise` | — |

### 消费品 / 汽车（11 个）

| 品牌 | Slug | 风格关键词 |
|------|------|-----------|
| Airbnb / 爱彼迎 | `airbnb` | 珊瑚暖色 + 摄影驱动 + 圆润 UI |
| BMW / 宝马 | `bmw` | 深色溢价面 + 精准德式美学 |
| Ferrari / 法拉利 | `ferrari` | 黑底电影感 + Ferrari 红 + 奢华排版 |
| Lamborghini / 兰博基尼 | `lamborghini` | — |
| Nike / 耐克 | `nike` | 单色 + 大写字体 + 全出血摄影 |
| Renault / 雷诺 | `renault` | — |
| Shopify | `shopify` | 深色电影感 + 荧光绿 + 超细字重 |
| SpaceX | `spacex` | — |
| Spotify | `spotify` | 深色底 + 荧光绿 + 音乐封面驱动 |
| Tesla / 特斯拉 | `tesla` | 激进减法 + 全屏摄影 + 近零 UI |
| Uber | `uber` | — |

### 使用方式

```bash
# 在 Claude Code 中直接说：
"用 Notion 风格设计这个页面"
"做成 Stripe 的极简风"
"苹果风格 + Linear 混搭"
"做成特斯拉的感觉"
```

**特色功能：**

- **中英文品牌名均支持**（如"苹果"→ apple，"特斯拉"→ tesla）
- **多品牌混搭**（如"BMW + Linear 混搭"）— 以主品牌为基础，从副品牌提取指定维度融合
- **严格按规范数值执行**，不四舍五入、不自由发挥
- 默认输出完整单文件 HTML（含内联 CSS），也可输出 React/Vue
- 获取命令：`npx getdesign@latest add <slug>`（在 `/tmp/design-md-tmp/` 中执行）

---

## Theme Factory — 10 个预设主题

内置 10 套预设主题（配色 + 字体），可应用到幻灯片、文档、报告、HTML 落地页等任意产物。

| # | 主题名称 | 风格描述 |
|---|----------|----------|
| 1 | **Ocean Depths** | 专业、平静的海洋主题 |
| 2 | **Sunset Boulevard** | 温暖、充满活力的日落色彩 |
| 3 | **Forest Canopy** | 自然、踏实的大地色调 |
| 4 | **Modern Minimalist** | 干净、现代的灰阶风格 |
| 5 | **Golden Hour** | 丰富、温暖的秋日色调 |
| 6 | **Arctic Frost** | 清凉、清脆的冬季灵感 |
| 7 | **Desert Rose** | 柔和、优雅的沙尘色调 |
| 8 | **Tech Innovation** | 大胆、现代的科技美学 |
| 9 | **Botanical Garden** | 清新、有机的花园色彩 |
| 10 | **Midnight Galaxy** | 戏剧性、宇宙感的深邃色调 |

**使用方式：** 首次使用会展示主题预览 PDF，选择后应用到产出物。如果 10 个预设都不合适，可根据描述即时生成新主题。

---

## Frontend Design — 自由美学设计

不依赖品牌模板，由 AI 自由选择美学方向，生成独特的生产级前端界面。

**设计方向示例：**
- 极简主义 / 极繁主义
- 复古未来 / 有机自然
- 奢华精致 / 粗野主义
- Art Deco / 软色调
- 工业/实用主义 / 编辑杂志风

**核心原则：**
- 字体选择大胆独特，避免 Inter/Roboto 等泛用字体
- 颜色有主次，使用 CSS 变量保持一致性
- 运动效果聚焦高影响力时刻（页面载入时的交错展现）
- 空间构图追求非对称、重叠、对角线流动
- 背景追求深度（渐变网格、噪点纹理、几何图案）

**避免：**
- 泛用 AI 美学（Inter 字体 + 紫色渐变 + 白底）
- 千篇一律的设计模式
- 不同项目收敛到相同的视觉风格

---

## Anthropic Diagram — 编辑级图表

生成 Anthropic 技术博客视觉风格的 .drawio 文件。

**支持类型：**
- 流程图（Flowchart）
- 架构图（Architecture Diagram）
- 对比图（Comparison Chart）
- 泳道图（Swimlane）
- 以及任何将文字/过程描述可视化的场景

**视觉特征：**
- 平静、编辑级、出版品质感
- 适合技术文档和博客文章

**触发方式：** "画个流程图"、"创建架构图"、"帮我画"

---

## Canvas Design — 视觉艺术设计

创建静态视觉设计，输出 .png 和 .pdf 格式。

**适用场景：**
- 海报（Poster）
- 视觉艺术（Art）
- 设计稿（Design）
- 其他静态视觉作品

**原则：** 创建原创设计，避免复制现有艺术家的作品。

---

## 其他设计类技能

| 技能 | 功能 |
|------|------|
| **design-shotgun** | 一次生成多个 AI 设计变体，打开对比板收集反馈并迭代 |
| **design-consultation** | 研究产品 + 竞品分析 → 提出完整设计系统（美学、字体、色彩、布局、间距、运动），生成 DESIGN.md |
| **design-html** | 将已审批的 mockup/plan 转化为生产级 Pretext-native HTML/CSS，30KB 零依赖 |
| **design-review** | 设计 QA：找视觉不一致、间距问题、层级问题、AI 模式和慢交互，迭代修复 |
| **brand-guidelines** | 应用 Anthropic 官方品牌色（赭石色系）和排版规范 |
| **plan-design-review** | 设计方案评审：逐维度打分 0-10，解释如何达到 10 分 |

---

## 快速选择指南

| 需求 | 推荐技能 |
|------|----------|
| "做成 Apple 风格" | `brand-design-md` |
| "用某个品牌的感觉" | `brand-design-md` |
| "给幻灯片/文档换个配色" | `theme-factory` |
| "做个漂亮的网页" | `frontend-design` |
| "画个流程图/架构图" | `anthropic-diagram` |
| "做个海报" | `canvas-design` |
| "看看几个方案哪个好" | `design-shotgun` |
| "从零建设计系统" | `design-consultation` |
| "把设计稿写成代码" | `design-html` |
| "检查这个设计好不好看" | `design-review` |
