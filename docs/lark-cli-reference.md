# Lark CLI 参考手册

> 本机版本：**lark-cli v1.0.0** | 安装路径：`~/.nvm/versions/node/v22.22.1/lib/node_modules/@larksuite/cli`

Lark CLI 是飞书/Lark 官方命令行工具，支持通过终端直接调用飞书开放平台 API，覆盖消息、日历、邮件、文档、云盘、多维表格、通讯录等核心模块，适合快速集成飞书能力到自动化工作流中。

---

## 目录

- [概述](#概述)
- [安装与初始化](#安装与初始化)
- [全局标志](#全局标志)
- [认证管理 (auth)](#认证管理-auth)
- [配置管理 (config)](#配置管理-config)
- [通用 API 调用 (api)](#通用-api-调用-api)
- [Schema 查询 (schema)](#schema-查询-schema)
- [健康检查 (doctor)](#健康检查-doctor)
- [消息与群聊 (im)](#消息与群聊-im)
- [日历 (calendar)](#日历-calendar)
- [邮件 (mail)](#邮件-mail)
- [云文档 (docs)](#云文档-docs)
- [云盘 (drive)](#云盘-drive)
- [多维表格 (base)](#多维表格-base)
- [电子表格 (sheets)](#电子表格-sheets)
- [任务 (task)](#任务-task)
- [通讯录 (contact)](#通讯录-contact)
- [视频会议 (vc)](#视频会议-vc)
- [妙记 (minutes)](#妙记-minutes)
- [知识库 (wiki)](#知识库-wiki)
- [事件订阅 (event)](#事件订阅-event)
- [输出格式](#输出格式)
- [分页控制](#分页控制)
- [身份类型](#身份类型)
- [AI Agent 技能集成](#ai-agent-技能集成)

---

## 概述

`lark-cli` 是飞书/Lark 的官方命令行工具，用于在终端中操作飞书的各项能力：消息、日历、邮件、云文档、云盘、多维表格、电子表格、任务、通讯录、视频会议等。

**基本语法：**

```bash
lark-cli <command> [subcommand] [method] [flags]
lark-cli api <method> <path> [--params <json>] [--data <json>]
lark-cli schema <service.resource.method> [--format pretty]
```

**命令快捷方式（`+` 前缀）：** 许多子命令提供 `+xxx` 形式的高级快捷命令，封装了多步 API 调用，使用更简便。例如 `lark-cli calendar +agenda` 比 `lark-cli calendar events list` 更易用。

---

## 安装与初始化

### 安装

```bash
npm install -g @larksuite/cli
```

### 初始化配置

```bash
# 交互式初始化（引导创建应用或输入已有 App ID/Secret）
lark-cli config init

# 非交互式初始化
lark-cli config init --app-id <APP_ID> --brand feishu

# 从标准输入读取 App Secret（安全方式，避免出现在进程列表中）
echo "your-app-secret" | lark-cli config init --app-id <APP_ID> --app-secret-stdin

# 直接创建新应用
lark-cli config init --new
```

### 登录授权

```bash
# 交互式登录（设备码流程，在浏览器中完成授权）
lark-cli auth login

# 只请求推荐权限（自动审批）
lark-cli auth login --recommend

# 指定授权域
lark-cli auth login --domain calendar,task,im

# 非阻塞模式（获取验证 URL 后立即返回）
lark-cli auth login --no-wait

# 用设备码完成授权（配合 --no-wait 使用）
lark-cli auth login --device-code <CODE>
```

**可用的域（domain）：** `base`, `calendar`, `contact`, `docs`, `drive`, `event`, `im`, `mail`, `minutes`, `sheets`, `task`, `vc`, `wiki`, `all`

---

## 全局标志

| 标志 | 说明 |
|------|------|
| `--as <type>` | 身份类型：`user`、`bot`、`auto`（默认 `auto`） |
| `--format <fmt>` | 输出格式：`json`（默认）、`ndjson`、`table`、`csv`、`pretty` |
| `--params <json>` | URL/查询参数 JSON |
| `--data <json>` | 请求体 JSON（POST/PATCH/PUT/DELETE） |
| `-o, --output <path>` | 二进制响应的输出文件路径 |
| `--dry-run` | 只打印请求，不实际执行 |
| `--page-all` | 自动翻页获取所有数据 |
| `--page-size <N>` | 每页数量（0 = 使用 API 默认值） |
| `--page-limit <N>` | `--page-all` 时的最大页数（默认 10，0 = 无限） |
| `--page-delay <MS>` | 翻页间隔毫秒数（默认 200，仅 `--page-all`） |
| `-h, --help` | 显示帮助 |
| `-v, --version` | 显示版本 |

---

## 认证管理 (auth)

| 命令 | 说明 |
|------|------|
| `lark-cli auth login` | 设备码流程登录 |
| `lark-cli auth status` | 查看当前认证状态 |
| `lark-cli auth status --verify` | 在线验证 Token 有效性 |
| `lark-cli auth list` | 列出所有已登录用户 |
| `lark-cli auth logout` | 登出（清除 Token） |
| `lark-cli auth scopes` | 查询应用已启用的权限范围 |
| `lark-cli auth check` | 检查当前 Token 是否有指定权限 |

---

## 配置管理 (config)

| 命令 | 说明 |
|------|------|
| `lark-cli config init` | 初始化配置（App ID / App Secret / 品牌） |
| `lark-cli config show` | 显示当前配置 |
| `lark-cli config remove` | 移除应用配置（清除所有 Token 和配置） |
| `lark-cli config default-as` | 查看或设置默认身份类型 |

---

## 通用 API 调用 (api)

直接调用任意飞书 Open API，适合没有快捷命令的场景。

```bash
# GET 请求
lark-cli api GET /open-apis/calendar/v4/calendars

# 带查询参数
lark-cli api GET /open-apis/calendar/v4/calendars --params '{"page_size":20}'

# POST 请求
lark-cli api POST /open-apis/im/v1/messages --data '{"msg_type":"text","content":"{\"text\":\"hello\"}"}'

# 指定身份
lark-cli api GET /open-apis/bot/v3/info --as bot

# 自动翻页
lark-cli api GET /open-apis/contact/v3/users --page-all --page-size 50
```

---

## Schema 查询 (schema)

查看 API 方法的参数、类型和权限范围。

```bash
# 查看某个 API 的 schema
lark-cli schema calendar.events.list --format pretty

# 查看通用格式
lark-cli schema im.messages.create
```

---

## 健康检查 (doctor)

检查 CLI 的配置、认证和网络连通性。

```bash
# 完整检查
lark-cli doctor

# 仅检查本地状态（跳过网络检查）
lark-cli doctor --offline
```

---

## 消息与群聊 (im)

### 发送消息

```bash
# 发送纯文本到群聊
lark-cli im +messages-send --chat-id oc_xxx --text "Hello World"

# 发送 Markdown
lark-cli im +messages-send --chat-id oc_xxx --markdown "**加粗** 和 [链接](https://example.com)"

# 发送图片
lark-cli im +messages-send --chat-id oc_xxx --image /path/to/image.png

# 发送文件
lark-cli im +messages-send --chat-id oc_xxx --file /path/to/file.pdf

# 发送视频
lark-cli im +messages-send --chat-id oc_xxx --video /path/to/video.mp4 --video-cover /path/to/cover.jpg

# 发送音频
lark-cli im +messages-send --chat-id oc_xxx --audio /path/to/audio.mp3

# 发送给个人（私聊）
lark-cli im +messages-send --user-id ou_xxx --text "私聊消息"

# 带幂等键（防重复发送）
lark-cli im +messages-send --chat-id oc_xxx --text "重要通知" --idempotency-key "unique-key-123"
```

### 回复消息

```bash
# 回复消息（支持话题回复）
lark-cli im +messages-reply --message-id om_xxx --text "回复内容"

# 回复 Markdown
lark-cli im +messages-reply --message-id om_xxx --markdown "**回复**内容"
```

### 消息查询

```bash
# 搜索消息
lark-cli im +messages-search --query "关键词"

# 批量获取消息
lark-cli im +messages-mget --ids "om_xxx,om_yyy,om_zzz"

# 列出群聊消息
lark-cli im +chat-messages-list --chat-id oc_xxx

# 列出私聊消息
lark-cli im +chat-messages-list --user-id ou_xxx

# 列出话题中的消息
lark-cli im +threads-messages-list --message-id omt_xxx
```

### 下载消息中的资源

```bash
# 下载消息中的图片/文件
lark-cli im +messages-resources-download --message-id om_xxx --file-key file_xxx
```

### 群聊管理

```bash
# 创建群聊
lark-cli im +chat-create --name "项目组" --type private --users "ou_aaa,ou_bbb"

# 创建公开群
lark-cli im +chat-create --name "全员群" --type public

# 创建群并设置机器人为管理员
lark-cli im +chat-create --name "测试群" --set-bot-manager

# 邀请机器人
lark-cli im +chat-create --name "机器人群" --bots "cli_xxx"

# 搜索群聊
lark-cli im +chat-search --query "项目"

# 更新群信息
lark-cli im +chat-update --chat-id oc_xxx --name "新群名"
```

### 底层 CRUD 命令

```bash
lark-cli im chats list                     # 列出群聊
lark-cli im chats get --chat-id oc_xxx     # 获取群聊详情
lark-cli im messages list                  # 列出消息
lark-cli im images get --image-key img_xxx # 获取图片
lark-cli im pins list --chat-id oc_xxx     # 列出置顶消息
lark-cli im reactions list                 # 列出表情回复
```

---

## 日历 (calendar)

### 快捷命令

```bash
# 查看今日日程
lark-cli calendar +agenda

# 查看指定日期范围
lark-cli calendar +agenda --start 2026-04-12T00:00+08:00 --end 2026-04-13T00:00+08:00

# 指定日历
lark-cli calendar +agenda --calendar-id cal_xxx

# 创建日历事件
lark-cli calendar +create \
  --summary "周会" \
  --start "2026-04-12T10:00+08:00" \
  --end "2026-04-12T11:00+08:00" \
  --description "每周例会" \
  --attendee-ids "ou_aaa,ou_bbb"

# 创建重复事件（RFC 5545 规则）
lark-cli calendar +create \
  --summary "每日站会" \
  --start "2026-04-12T09:00+08:00" \
  --end "2026-04-12T09:15+08:00" \
  --rrule "FREQ=DAILY"

# 查询空闲/忙碌
lark-cli calendar +freebusy --start 2026-04-12T00:00+08:00 --end 2026-04-12T23:59+08:00

# 智能推荐会议时间
lark-cli calendar +suggestion --attendee-ids "ou_aaa,ou_bbb" --duration 60
```

### 底层 CRUD 命令

```bash
lark-cli calendar calendars list                 # 列出日历
lark-cli calendar calendars get --calendar-id x  # 获取日历
lark-cli calendar events list                    # 列出事件
lark-cli calendar events get --event-id x        # 获取事件
lark-cli calendar event.attendees list           # 列出参会者
```

---

## 邮件 (mail)

### 发送邮件

```bash
# 撰写新邮件（默认保存为草稿）
lark-cli mail +send \
  --to "alice@example.com" \
  --subject "会议纪要" \
  --body "<h1>纪要</h1><p>内容...</p>"

# 立即发送（需确认）
lark-cli mail +send \
  --to "alice@example.com" \
  --subject "紧急通知" \
  --body "请尽快处理" \
  --confirm-send

# 抄送与密送
lark-cli mail +send \
  --to "alice@example.com" \
  --cc "bob@example.com" \
  --bcc "carol@example.com" \
  --subject "通知" \
  --body "内容"

# 添加附件
lark-cli mail +send \
  --to "alice@example.com" \
  --subject "报告" \
  --body "请查收附件" \
  --attach "/path/to/report.pdf,/path/to/data.xlsx"

# 内嵌图片（HTML 邮件）
lark-cli mail +send \
  --to "alice@example.com" \
  --subject "图文邮件" \
  --body '<img src="cid:abc123" /><p>正文</p>' \
  --inline '[{"cid":"abc123","file_path":"/path/to/image.png"}]'

# 纯文本模式
lark-cli mail +send \
  --to "alice@example.com" \
  --subject "通知" \
  --body "纯文本内容" \
  --plain-text
```

### 回复与转发

```bash
# 回复邮件（保存为草稿）
lark-cli mail +reply --message-id msg_xxx --body "回复内容"

# 回复并立即发送
lark-cli mail +reply --message-id msg_xxx --body "回复内容" --confirm-send

# 回复全部
lark-cli mail +reply-all --message-id msg_xxx --body "回复全部内容"

# 转发
lark-cli mail +forward --message-id msg_xxx --to "bob@example.com"
```

### 查看与管理

```bash
# 收件箱一览
lark-cli mail +triage

# 全文搜索
lark-cli mail +triage --query "预算报告"

# 按条件过滤
lark-cli mail +triage --filter '{"folder":"INBOX","from":["alice@example.com"]}'
lark-cli mail +triage --filter '{"folder":"INBOX"}' --max 50

# 查看过滤器字段参考
lark-cli mail +triage --print-filter-schema

# 查看单封邮件
lark-cli mail +message --message-id msg_xxx

# 批量查看邮件
lark-cli mail +messages --ids "msg_aaa,msg_bbb"

# 查看邮件线程
lark-cli mail +thread --thread-id thread_xxx

# 监听新邮件（WebSocket）
lark-cli mail +watch
```

### 底层 CRUD 命令

```bash
lark-cli mail user_mailbox.drafts list                # 列出草稿
lark-cli mail user_mailbox.folders list               # 列出文件夹
lark-cli mail user_mailbox.labels list                # 列出标签
lark-cli mail user_mailbox.messages list              # 列出消息
lark-cli mail user_mailbox.threads list               # 列出线程
lark-cli mail user_mailbox.mail_contacts list         # 列出联系人
```

---

## 云文档 (docs)

### 快捷命令

```bash
# 获取文档内容
lark-cli docs +fetch --doc https://feishu.cn/docx/xxx
lark-cli docs +fetch --doc doxcnxxx

# 获取文档内容（pretty 格式）
lark-cli docs +fetch --doc doxcnxxx --format pretty

# 创建文档
lark-cli docs +create --title "新文档" --markdown "# 标题\n正文内容"

# 创建文档并放入指定文件夹
lark-cli docs +create --title "新文档" --folder-token fldcnxxx

# 创建文档并放入知识库
lark-cli docs +create --title "知识库文档" --wiki-space xxx --wiki-node xxx

# 更新文档
lark-cli docs +update --doc doxcnxxx --markdown "新内容"

# 搜索文档
lark-cli docs +search --query "关键词"

# 插入图片到文档
lark-cli docs +media-insert --doc doxcnxxx --file /path/to/image.png

# 下载文档中的媒体文件
lark-cli docs +media-download --file-id file_xxx --output ./download
```

---

## 云盘 (drive)

### 上传与下载

```bash
# 上传文件到云盘根目录
lark-cli drive +upload --file /path/to/file.pdf

# 上传到指定文件夹
lark-cli drive +upload --file /path/to/file.pdf --folder-token fldcnxxx

# 上传并重命名
lark-cli drive +upload --file /path/to/file.pdf --name "新文件名.pdf"

# 下载文件
lark-cli drive +download --file-token filcnxxx --output ./download

# 下载并覆盖已有文件
lark-cli drive +download --file-token filcnxxx --output ./download --overwrite
```

### 评论与权限

```bash
# 添加评论
lark-cli drive +add-comment --file-token filcnxxx --content "评论内容"

# 底层 CRUD
lark-cli drive files list                     # 列出文件
lark-cli drive files get --file-token xxx     # 获取文件信息
lark-cli drive metas list                     # 列出元数据
lark-cli drive permission.members list        # 列出权限成员
lark-cli drive file.comments list             # 列出评论
```

---

## 多维表格 (base)

### 表格管理

```bash
# 列出表格
lark-cli base +table-list --base-token bscnxxx

# 获取表格详情
lark-cli base +table-get --base-token bscnxxx --table-id tblxxx

# 创建表格
lark-cli base +table-create --base-token bscnxxx --name "新表格"

# 删除表格
lark-cli base +table-delete --base-token bscnxxx --table-id tblxxx

# 重命名表格
lark-cli base +table-update --base-token bscnxxx --table-id tblxxx --name "新名称"
```

### 记录操作

```bash
# 列出记录
lark-cli base +record-list --base-token bscnxxx --table-id tblxxx

# 分页
lark-cli base +record-list --base-token bscnxxx --table-id tblxxx --limit 50 --offset 0

# 按视图筛选
lark-cli base +record-list --base-token bscnxxx --table-id tblxxx --view-id viwxxx

# 获取单条记录
lark-cli base +record-get --base-token bscnxxx --table-id tblxxx --record-id recxxx

# 创建或更新记录
lark-cli base +record-upsert --base-token bscnxxx --table-id tblxxx --data '{...}'

# 删除记录
lark-cli base +record-delete --base-token bscnxxx --table-id tblxxx --record-id recxxx

# 上传附件到记录字段
lark-cli base +record-upload-attachment --base-token bscnxxx --table-id tblxxx --record-id recxxx --file /path/to/file

# 记录变更历史
lark-cli base +record-history-list --base-token bscnxxx --table-id tblxxx --record-id recxxx
```

### 字段操作

```bash
lark-cli base +field-list --base-token bscnxxx --table-id tblxxx
lark-cli base +field-get --base-token bscnxxx --table-id tblxxx --field-id fldxxx
lark-cli base +field-create --base-token bscnxxx --table-id tblxxx --data '{...}'
lark-cli base +field-update --base-token bscnxxx --table-id tblxxx --field-id fldxxx --data '{...}'
lark-cli base +field-delete --base-token bscnxxx --table-id tblxxx --field-id fldxxx
lark-cli base +field-search-options --base-token bscnxxx --table-id tblxxx --field-id fldxxx
```

### 视图操作

```bash
lark-cli base +view-list --base-token bscnxxx --table-id tblxxx
lark-cli base +view-get --base-token bscnxxx --table-id tblxxx --view-id viwxxx
lark-cli base +view-create --base-token bscnxxx --table-id tblxxx
lark-cli base +view-delete --base-token bscnxxx --table-id tblxxx --view-id viwxxx
lark-cli base +view-rename --base-token bscnxxx --table-id tblxxx --view-id viwxxx --name "新名称"
lark-cli base +view-get-filter --base-token bscnxxx --table-id tblxxx --view-id viwxxx
lark-cli base +view-set-filter --base-token bscnxxx --table-id tblxxx --view-id viwxxx --data '{...}'
lark-cli base +view-get-sort --base-token bscnxxx --table-id tblxxx --view-id viwxxx
lark-cli base +view-set-sort --base-token bscnxxx --table-id tblxxx --view-id viwxxx --data '{...}'
lark-cli base +view-get-group --base-token bscnxxx --table-id tblxxx --view-id viwxxx
lark-cli base +view-set-group --base-token bscnxxx --table-id tblxxx --view-id viwxxx --data '{...}'
```

### 仪表盘

```bash
lark-cli base +dashboard-list --base-token bscnxxx
lark-cli base +dashboard-create --base-token bscnxxx
lark-cli base +dashboard-get --base-token bscnxxx --dashboard-id dshxxx
lark-cli base +dashboard-update --base-token bscnxxx --dashboard-id dshxxx
lark-cli base +dashboard-delete --base-token bscnxxx --dashboard-id dshxxx
lark-cli base +dashboard-block-list --base-token bscnxxx --dashboard-id dshxxx
lark-cli base +dashboard-block-create --base-token bscnxxx --dashboard-id dshxxx
```

### 表单

```bash
lark-cli base +form-list --base-token bscnxxx --table-id tblxxx
lark-cli base +form-get --base-token bscnxxx --table-id tblxxx --form-id fmxxxx
lark-cli base +form-create --base-token bscnxxx --table-id tblxxx
lark-cli base +form-update --base-token bscnxxx --table-id tblxxx --form-id fmxxxx
lark-cli base +form-delete --base-token bscnxxx --table-id tblxxx --form-id fmxxxx
lark-cli base +form-questions-list --base-token bscnxxx --table-id tblxxx --form-id fmxxxx
lark-cli base +form-questions-create --base-token bscnxxx --table-id tblxxx --form-id fmxxxx
lark-cli base +form-questions-update --base-token bscnxxx --table-id tblxxx --form-id fmxxxx
lark-cli base +form-questions-delete --base-token bscnxxx --table-id tblxxx --form-id fmxxxx
```

### 自动化工作流

```bash
lark-cli base +workflow-list --base-token bscnxxx
lark-cli base +workflow-get --base-token bscnxxx --workflow-id wfxxx
lark-cli base +workflow-create --base-token bscnxxx
lark-cli base +workflow-update --base-token bscnxxx --workflow-id wfxxx
lark-cli base +workflow-enable --base-token bscnxxx --workflow-id wfxxx
lark-cli base +workflow-disable --base-token bscnxxx --workflow-id wfxxx
```

### 权限与角色

```bash
lark-cli base +role-list --base-token bscnxxx
lark-cli base +role-get --base-token bscnxxx --role-id rolxxx
lark-cli base +role-create --base-token bscnxxx
lark-cli base +role-update --base-token bscnxxx --role-id rolxxx
lark-cli base +role-delete --base-token bscnxxx --role-id rolxxx
lark-cli base +advperm-enable --base-token bscnxxx
lark-cli base +advperm-disable --base-token bscnxxx
```

---

## 电子表格 (sheets)

### 快捷命令

```bash
# 查看表格信息
lark-cli sheets +info --spreadsheet-token shtcnxxx
lark-cli sheets +info --url https://feishu.cn/sheets/shtcnxxx

# 读取数据
lark-cli sheets +read --spreadsheet-token shtcnxxx --range A1:D10
lark-cli sheets +read --url https://feishu.cn/sheets/shtcnxxx --range "Sheet1!A1:D10"
lark-cli sheets +read --spreadsheet-token shtcnxxx --sheet-id sheetId --range C2

# 读取时显示公式
lark-cli sheets +read --spreadsheet-token shtcnxxx --range A1:D10 --value-render-option Formula

# 写入数据（覆盖模式）
lark-cli sheets +write --spreadsheet-token shtcnxxx --range A1:B2 --values '[["姓名","年龄"],["张三","25"]]'
lark-cli sheets +write --url https://feishu.cn/sheets/shtcnxxx --range A1:B2 --values '[["姓名","年龄"],["张三","25"]]'

# 追加行
lark-cli sheets +append --spreadsheet-token shtcnxxx --range A1 --values '[["李四","30"]]'

# 查找单元格
lark-cli sheets +find --spreadsheet-token shtcnxxx --range A1:D100 --keyword "关键词"

# 创建电子表格
lark-cli sheets +create --title "新表格"

# 导出
lark-cli sheets +export --spreadsheet-token shtcnxxx
```

### 底层 CRUD 命令

```bash
lark-cli sheets spreadsheets list                          # 列出电子表格
lark-cli sheets spreadsheet.sheets list                    # 列出工作表
lark-cli sheets spreadsheet.sheet.filters list             # 列出筛选条件
```

---

## 任务 (task)

### 快捷命令

```bash
# 创建任务
lark-cli task +create --summary "完成报告" --due 2026-04-15

# 创建任务（相对日期）
lark-cli task +create --summary "跟进客户" --due "+3d"

# 创建任务（完整参数）
lark-cli task +create \
  --summary "项目上线" \
  --description "完成最终测试并上线" \
  --due "2026-04-20T18:00+08:00" \
  --assignee ou_xxx \
  --tasklist-id tasklist_xxx

# 查看我的任务
lark-cli task +get-my-tasks

# 完成任务
lark-cli task +complete --task-id task_xxx

# 重新打开任务
lark-cli task +reopen --task-id task_xxx

# 更新任务
lark-cli task +update --task-id task_xxx --summary "新标题"

# 添加评论
lark-cli task +comment --task-id task_xxx --content "评论内容"

# 分配/移除成员
lark-cli task +assign --task-id task_xxx --assignee ou_xxx

# 管理关注者
lark-cli task +followers --task-id task_xxx

# 设置提醒
lark-cli task +reminder --task-id task_xxx

# 创建任务列表
lark-cli task +tasklist-create --name "项目任务"

# 添加任务到列表
lark-cli task +tasklist-task-add --tasklist-id xxx --task-id task_xxx

# 管理列表成员
lark-cli task +tasklist-members --tasklist-id xxx
```

### 底层 CRUD 命令

```bash
lark-cli task tasks list           # 列出任务
lark-cli task tasks get --id xxx   # 获取任务
lark-cli task subtasks list        # 列出子任务
lark-cli task tasklists list       # 列出任务列表
lark-cli task members list         # 列出成员
```

---

## 通讯录 (contact)

```bash
# 获取当前用户信息
lark-cli contact +get-user

# 获取指定用户信息
lark-cli contact +get-user --user-id ou_xxx

# 搜索用户
lark-cli contact +search-user --query "张三"
lark-cli contact +search-user --query "John"
```

---

## 视频会议 (vc)

```bash
# 搜索会议记录
lark-cli vc +search --start 2026-04-12T00:00+08:00 --end 2026-04-12T23:59+08:00

# 按组织者筛选
lark-cli vc +search --organizer-ids "ou_xxx"

# 按参与者筛选
lark-cli vc +search --participant-ids "ou_aaa,ou_bbb"

# 按关键词搜索
lark-cli vc +search --query "项目评审" --start 2026-04-01 --end 2026-04-12

# 查询会议纪要
lark-cli vc +notes --meeting-id meeting_xxx

# 底层 CRUD
lark-cli vc meeting list   # 列出会议
lark-cli vc meeting get    # 获取会议详情
```

---

## 妙记 (minutes)

```bash
# 列出妙记
lark-cli minutes minutes list

# 获取妙记详情
lark-cli minutes minutes get --minutes-id mins_xxx
```

---

## 知识库 (wiki)

```bash
# 列出知识库空间
lark-cli wiki spaces list

# 获取空间详情
lark-cli wiki spaces get --space-id xxx
```

---

## 事件订阅 (event)

通过 WebSocket 实时订阅飞书事件。

```bash
# 订阅所有事件（NDJSON 输出到 stdout）
lark-cli event +subscribe

# 订阅特定类型事件
lark-cli event +subscribe --event-types "im.message.receive_v1"

# 用正则过滤事件
lark-cli event +subscribe --filter "^im\.message"

# 紧凑输出
lark-cli event +subscribe --compact

# Pretty JSON 输出
lark-cli event +subscribe --json

# 保存到文件
lark-cli event +subscribe --output-dir ./events

# 按路由分发到不同目录
lark-cli event +subscribe \
  --route '^im\.message=dir:./im/' \
  --route '^contact\.=dir:./contacts/'

# 静默模式（抑制状态消息）
lark-cli event +subscribe --quiet
```

---

## 输出格式

大多数命令支持 `--format` 标志控制输出：

| 格式 | 说明 |
|------|------|
| `json` | 标准 JSON（默认） |
| `ndjson` | 换行分隔的 JSON（流式输出） |
| `table` | 表格形式 |
| `csv` | CSV 格式 |
| `pretty` | 格式化的人类可读输出 |

```bash
lark-cli calendar +agenda --format pretty
lark-cli im +chat-search --query "项目" --format table
lark-cli sheets +read --spreadsheet-token xxx --range A1:D10 --format csv
```

---

## 分页控制

处理大量数据时使用分页标志：

```bash
# 自动翻页获取所有数据
lark-cli base +record-list --base-token xxx --table-id xxx --page-all

# 控制每页数量
lark-cli api GET /open-apis/contact/v3/users --page-all --page-size 50

# 限制最大页数
lark-cli api GET /open-apis/contact/v3/users --page-all --page-limit 5

# 翻页间隔（避免频率限制）
lark-cli api GET /open-apis/contact/v3/users --page-all --page-delay 500
```

| 标志 | 说明 |
|------|------|
| `--page-all` | 自动翻页获取所有数据 |
| `--page-size <N>` | 每页数量 |
| `--page-limit <N>` | 最大页数（默认 10，0 = 无限） |
| `--page-delay <MS>` | 翻页间隔毫秒（默认 200） |

---

## 身份类型

使用 `--as` 标志控制请求身份：

| 身份 | 说明 |
|------|------|
| `auto` | 自动选择（默认） |
| `user` | 以用户身份请求（需要用户授权） |
| `bot` | 以机器人身份请求 |

```bash
lark-cli im +messages-send --as bot --chat-id oc_xxx --text "机器人消息"
lark-cli sheets +read --as user --spreadsheet-token xxx --range A1:D10
```

---

## AI Agent 技能集成

lark-cli 可与 AI Agent（如 Claude Code）集成，安装领域技能包以获得更智能的 API 使用指导。

```bash
# 安装所有技能
npx skills add larksuite/cli --all -y

# 安装特定领域
npx skills add larksuite/cli -s lark-calendar -y
npx skills add larksuite/cli -s lark-im -y
```

---

## 常见问题排查

### 检查 CLI 状态

```bash
lark-cli doctor            # 完整检查
lark-cli doctor --offline  # 仅本地状态
lark-cli auth status       # 认证状态
lark-cli auth status --verify  # 在线验证
lark-cli config show       # 查看配置
```

### 常见错误

| 问题 | 解决方案 |
|------|----------|
| 未认证 | 运行 `lark-cli auth login` |
| 权限不足 | 运行 `lark-cli auth scopes` 检查已启用权限，重新登录时加 `--domain` 指定域 |
| Token 过期 | 运行 `lark-cli auth login` 重新授权 |
| 配置缺失 | 运行 `lark-cli config init` 初始化 |
| 网络问题 | 运行 `lark-cli doctor` 检查连通性 |

---

## 相关链接

- **GitHub:** https://github.com/larksuite/cli
- **Issues:** https://github.com/larksuite/cli/issues
- **飞书开放平台文档:** https://open.feishu.cn/document/
- **Lark 开放平台文档:** https://open.larksuite.com/document/
