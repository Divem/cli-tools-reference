# Playwright CLI 参考手册

> 当前安装版本：**1.59.1**

## 目录

- [概述](#概述)
- [全局选项](#全局选项)
- [命令列表](#命令列表)
  - [open - 打开浏览器页面](#open---打开浏览器页面)
  - [codegen - 录制并生成代码](#codegen---录制并生成代码)
  - [install - 安装浏览器](#install---安装浏览器)
  - [uninstall - 卸载浏览器](#uninstall---卸载浏览器)
  - [install-deps - 安装系统依赖](#install-deps---安装系统依赖)
  - [screenshot - 页面截图](#screenshot---页面截图)
  - [pdf - 保存页面为 PDF](#pdf---保存页面为-pdf)
  - [show-trace - 查看测试追踪](#show-trace---查看测试追踪)
  - [test - 运行测试](#test---运行测试)
  - [show-report - 查看 HTML 报告](#show-report---查看-html-报告)
  - [merge-reports - 合并分片报告](#merge-reports---合并分片报告)
  - [clear-cache - 清除缓存](#clear-cache---清除缓存)
  - [init-agents - 初始化仓库 Agent](#init-agents---初始化仓库-agent)
  - [浏览器快捷命令](#浏览器快捷命令)
- [通用浏览器选项](#通用浏览器选项)

---

## 概述

Playwright CLI 是 Playwright 测试框架自带的命令行工具，提供浏览器管理、测试执行、页面操作、代码录制等功能。

```bash
npx playwright [options] [command]
```

## 全局选项

| 选项 | 说明 |
|------|------|
| `-V, --version` | 输出版本号 |
| `-h, --help` | 显示帮助信息 |

---

## 命令列表

### open - 打开浏览器页面

在指定浏览器中打开页面。

```bash
npx playwright open [options] [url]
```

**示例：**

```bash
npx playwright open
npx playwright open -b webkit https://example.com
```

| 选项 | 说明 |
|------|------|
| `-b, --browser <browserType>` | 浏览器类型：`cr`, `chromium`, `ff`, `firefox`, `wk`, `webkit`（默认：`chromium`） |

另见 [通用浏览器选项](#通用浏览器选项)。

---

### codegen - 录制并生成代码

打开页面并录制用户操作，自动生成测试代码。

```bash
npx playwright codegen [options] [url]
```

**示例：**

```bash
npx playwright codegen
npx playwright codegen --target=python
npx playwright codegen -b webkit https://example.com
npx playwright codegen -o test.spec.ts https://example.com
```

| 选项 | 说明 |
|------|------|
| `-o, --output <file name>` | 将生成的脚本保存到文件 |
| `--target <language>` | 生成代码的语言，支持：`javascript`, `playwright-test`, `python`, `python-async`, `python-pytest`, `csharp`, `csharp-mstest`, `csharp-nunit`, `java`, `java-junit`（默认：`playwright-test`） |
| `--test-id-attribute <attributeName>` | 使用指定属性生成 data test ID 选择器 |

另见 [通用浏览器选项](#通用浏览器选项)。

---

### install - 安装浏览器

安装当前版本 Playwright 所需的浏览器。

```bash
npx playwright install [options] [browser...]
```

**示例：**

```bash
npx playwright install                    # 安装默认浏览器
npx playwright install chrome firefox     # 安装指定浏览器
npx playwright install --with-deps        # 同时安装系统依赖
npx playwright install --dry-run          # 仅打印信息，不执行安装
npx playwright install --list             # 列出所有 Playwright 安装的浏览器
```

| 选项 | 说明 |
|------|------|
| `--with-deps` | 同时安装浏览器所需的系统依赖 |
| `--dry-run` | 仅打印安装信息，不实际执行 |
| `--list` | 列出所有 Playwright 安装中的浏览器 |
| `--force` | 强制重新安装已安装的浏览器 |
| `--only-shell` | 安装 Chromium 时仅安装 headless shell |
| `--no-shell` | 不安装 Chromium headless shell |

**支持的浏览器：** `chromium`, `firefox`, `webkit`, `chromium-headless-shell`

---

### uninstall - 卸载浏览器

移除当前 Playwright 安装所使用的浏览器（chromium、firefox、webkit、ffmpeg）。不包括品牌渠道（如 Chrome、Edge）。

```bash
npx playwright uninstall [options]
```

| 选项 | 说明 |
|------|------|
| `--all` | 移除系统中所有 Playwright 安装使用的浏览器 |

---

### install-deps - 安装系统依赖

安装运行浏览器所需的系统依赖（需要 sudo 权限）。

```bash
npx playwright install-deps [options] [browser...]
```

**示例：**

```bash
npx playwright install-deps                    # 安装默认浏览器的依赖
npx playwright install-deps chrome firefox     # 安装指定浏览器的依赖
npx playwright install-deps --dry-run          # 仅打印命令，不执行
```

| 选项 | 说明 |
|------|------|
| `--dry-run` | 仅打印安装命令，不实际执行 |

---

### screenshot - 页面截图

捕获页面截图并保存到文件。

```bash
npx playwright screenshot [options] <url> <filename>
```

**示例：**

```bash
npx playwright screenshot https://example.com example.png
npx playwright screenshot -b webkit --full-page https://example.com full.png
npx playwright screenshot --wait-for-selector ".loaded" https://example.com shot.png
```

| 选项 | 说明 |
|------|------|
| `--wait-for-selector <selector>` | 等待指定选择器出现后再截图 |
| `--wait-for-timeout <timeout>` | 等待指定毫秒数后再截图 |
| `--full-page` | 截取整个可滚动区域（完整页面截图） |

另见 [通用浏览器选项](#通用浏览器选项)。

---

### pdf - 保存页面为 PDF

将页面保存为 PDF 文件（仅 Chromium 支持）。

```bash
npx playwright pdf [options] <url> <filename>
```

**示例：**

```bash
npx playwright pdf https://example.com example.pdf
npx playwright pdf --paper-format A4 https://example.com a4.pdf
```

| 选项 | 说明 |
|------|------|
| `--paper-format <format>` | 纸张格式：`Letter`, `Legal`, `Tabloid`, `Ledger`, `A0`, `A1`, `A2`, `A3`, `A4`, `A5`, `A6` |
| `--wait-for-selector <selector>` | 等待指定选择器出现后再保存 |
| `--wait-for-timeout <timeout>` | 等待指定毫秒数后再保存 |

另见 [通用浏览器选项](#通用浏览器选项)。

---

### show-trace - 查看测试追踪

打开 Trace Viewer 查看测试追踪文件。

```bash
npx playwright show-trace [options] [trace]
```

**示例：**

```bash
npx playwright show-trace
npx playwright show-trace trace.zip
npx playwright show-trace --host 0.0.0.0 --port 8080 trace.zip
```

| 选项 | 说明 |
|------|------|
| `-b, --browser <browserType>` | 浏览器类型（默认：`chromium`） |
| `-h, --host <host>` | 指定服务主机；设置后会在浏览器标签页中打开 |
| `-p, --port <port>` | 指定服务端口，`0` 表示任意空闲端口 |
| `--stdin` | 通过 stdin 接收追踪 URL 来更新查看器 |

---

### test - 运行测试

使用 Playwright Test 运行测试。

```bash
npx playwright test [options] [test-filter...]
```

`[test-filter...]` 参数作为正则表达式匹配测试文件的绝对路径。

**示例：**

```bash
npx playwright test                              # 运行所有测试
npx playwright test my.spec.ts                   # 运行指定文件
npx playwright test some.spec.ts:42              # 运行指定行号
npx playwright test --headed                     # 有头模式运行
npx playwright test --project=webkit             # 指定项目
npx playwright test --ui                         # 交互式 UI 模式
npx playwright test --debug                      # 调试模式
npx playwright test -g "登录"                     # 按正则过滤测试
npx playwright test --shard 1/3                  # 分片执行第 1 片（共 3 片）
npx playwright test --last-failed                # 仅重新运行上次失败的测试
```

| 选项 | 说明 |
|------|------|
| `--browser <browser>` | 测试使用的浏览器：`all`, `chromium`, `firefox`, `webkit`（默认：`chromium`） |
| `-c, --config <file>` | 指定配置文件路径 |
| `--debug [mode]` | 启用 Playwright Inspector 调试（等价于 `PWDEBUG=1` + `--timeout=0 --max-failures=1 --headed --workers=1`）。模式：`inspector`, `cli` |
| `--fail-on-flaky-tests` | 如有不稳定测试则失败（默认：`false`） |
| `--forbid-only` | 如果调用了 `test.only` 则失败（默认：`false`） |
| `--fully-parallel` | 完全并行运行所有测试（默认：`false`） |
| `-g, --grep <grep>` | 仅运行匹配此正则的测试（默认：`".*"`） |
| `--grep-invert <grep>` | 仅运行不匹配此正则的测试 |
| `--global-timeout <timeout>` | 整个测试套件的最大运行时间（毫秒，默认：无限制） |
| `--headed` | 以有头模式运行浏览器（默认：headless） |
| `--ignore-snapshots` | 忽略截图和快照断言 |
| `-j, --workers <workers>` | 并发 worker 数量或 CPU 核心百分比，`1` 为单 worker（默认：50%） |
| `--last-failed` | 仅重新运行上次失败的测试 |
| `--list` | 收集并列出所有测试，但不运行 |
| `--max-failures <N>` | 在 N 次失败后停止 |
| `--no-deps` | 不运行项目依赖 |
| `--only-changed [ref]` | 仅运行 `HEAD` 与 `ref` 之间有变更的测试文件（默认：所有未提交的变更，仅支持 Git） |
| `--output <dir>` | 输出产物目录（默认：`test-results`） |
| `--pass-with-no-tests` | 即使没有找到测试也视为成功 |
| `--project <project-name...>` | 仅运行指定项目的测试，支持 `*` 通配符 |
| `--quiet` | 抑制标准输出 |
| `--repeat-each <N>` | 每个测试运行 N 次（默认：`1`） |
| `--reporter <reporter>` | 报告器，逗号分隔：`list`, `line`, `dot`, `json`, `junit`, `null`, `github`, `html`, `blob`（默认：`list`） |
| `--retries <retries>` | 不稳定测试的最大重试次数（默认：不重试） |
| `--shard <shard>` | 分片执行，格式 `current/all`，从 1 开始，例如 `3/5` |
| `--test-list <file>` | 包含要运行的测试列表的文件路径 |
| `--test-list-invert <file>` | 包含要跳过的测试列表的文件路径 |
| `--timeout <timeout>` | 测试超时阈值（毫秒），`0` 为无限制（默认：`30000`） |
| `--trace <mode>` | 强制追踪模式：`on`, `off`, `on-first-retry`, `on-all-retries`, `retain-on-failure`, `retain-on-first-failure`, `retain-on-failure-and-retries` |
| `--tsconfig <path>` | 指定适用于所有导入文件的 tsconfig 路径 |
| `-u, --update-snapshots [mode]` | 更新快照。模式：`all`, `changed`, `missing`, `none`（默认预设：`changed`） |
| `--ui` | 以交互式 UI 模式运行测试 |
| `--ui-host <host>` | UI 服务主机 |
| `--ui-port <port>` | UI 服务端口 |
| `--update-source-method <method>` | 源码更新方式：`overwrite`, `3way`, `patch`（默认：`patch`） |
| `-x` | 首次失败后停止（同 `--max-failures=1`） |

---

### show-report - 查看 HTML 报告

在浏览器中查看 HTML 测试报告。

```bash
npx playwright show-report [options] [report]
```

**示例：**

```bash
npx playwright show-report
npx playwright show-report playwright-report
npx playwright show-report --port 9000
```

| 选项 | 说明 |
|------|------|
| `--host <host>` | 服务主机（默认：`localhost`） |
| `--port <port>` | 服务端口（默认：`9323`） |

---

### merge-reports - 合并分片报告

将多个分片测试的 blob 报告合并为单个报告（用于分布式测试）。

```bash
npx playwright merge-reports [options] [dir]
```

**示例：**

```bash
npx playwright merge-reports playwright-report
npx playwright merge-reports --reporter=html ./blob-reports
```

| 选项 | 说明 |
|------|------|
| `-c, --config <file>` | 配置文件，用于指定输出报告的额外配置 |
| `--reporter <reporter>` | 报告器，逗号分隔：`list`, `line`, `dot`, `json`, `junit`, `null`, `github`, `html`, `blob`（默认：`list`） |

---

### clear-cache - 清除缓存

清除构建和测试缓存。

```bash
npx playwright clear-cache [options]
```

| 选项 | 说明 |
|------|------|
| `-c, --config <file>` | 配置文件或测试目录 |

---

### init-agents - 初始化仓库 Agent

初始化仓库的 AI Agent 配置。

```bash
npx playwright init-agents [options]
```

| 选项 | 说明 |
|------|------|
| `--loop <loop>` | Agent 循环提供者：`claude`, `copilot`, `opencode`, `vscode`, `vscode-legacy` |
| `-c, --config <file>` | 用于查找种子测试项目的配置文件 |
| `--project <project>` | 用于种子测试的项目 |
| `--prompts` | 是否在 Agent 初始化中包含提示 |

---

### 浏览器快捷命令

| 快捷命令 | 等价于 | 说明 |
|----------|--------|------|
| `npx playwright cr [url]` | `npx playwright open -b chromium [url]` | 用 Chromium 打开 |
| `npx playwright ff [url]` | `npx playwright open -b firefox [url]` | 用 Firefox 打开 |
| `npx playwright wk [url]` | `npx playwright open -b webkit [url]` | 用 WebKit 打开 |

这些快捷命令支持与 `open` 命令相同的 [通用浏览器选项](#通用浏览器选项)。

---

## 通用浏览器选项

以下选项适用于 `open`、`codegen`、`screenshot`、`pdf` 以及浏览器快捷命令（`cr`、`ff`、`wk`）：

| 选项 | 说明 |
|------|------|
| `-b, --browser <browserType>` | 浏览器类型：`cr`, `chromium`, `ff`, `firefox`, `wk`, `webkit`（默认：`chromium`） |
| `--block-service-workers` | 阻止 Service Workers |
| `--channel <channel>` | Chromium 发行渠道，如 `chrome`, `chrome-beta`, `msedge-dev` 等 |
| `--color-scheme <scheme>` | 模拟配色方案：`light` 或 `dark` |
| `--device <deviceName>` | 模拟设备，如 `iPhone 11` |
| `--geolocation <coordinates>` | 指定地理位置坐标，如 `37.819722,-122.478611` |
| `--ignore-https-errors` | 忽略 HTTPS 错误 |
| `--load-storage <filename>` | 加载之前用 `--save-storage` 保存的上下文存储状态 |
| `--lang <language>` | 指定语言/区域设置，如 `en-GB`, `zh-CN` |
| `--proxy-server <proxy>` | 指定代理服务器，如 `http://myproxy:3128` 或 `socks5://myproxy:8080` |
| `--proxy-bypass <bypass>` | 逗号分隔的代理绕过域名，如 `.com,chromium.org,.domain.com` |
| `--save-har <filename>` | 在结束时保存包含所有网络活动的 HAR 文件 |
| `--save-har-glob <glob>` | 通过 glob 模式匹配 URL 来过滤 HAR 条目 |
| `--save-storage <filename>` | 在结束时保存上下文存储状态 |
| `--timezone <time zone>` | 模拟时区，如 `Europe/Rome`, `Asia/Shanghai` |
| `--timeout <timeout>` | Playwright 操作超时（毫秒），默认无超时 |
| `--user-agent <ua string>` | 指定 User-Agent 字符串 |
| `--user-data-dir <directory>` | 使用指定的用户数据目录（而非新上下文） |
| `--viewport-size <size>` | 指定浏览器视口大小（像素），如 `1280,720` |
