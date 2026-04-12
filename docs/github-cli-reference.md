# GitHub CLI (`gh`) 命令行参考手册

> 本机版本：**gh 2.88.1** | 安装路径：`/opt/homebrew/bin/gh`
> 来源: https://cli.github.com/manual

GitHub CLI（`gh`）是 GitHub 官方命令行工具，无需离开终端即可管理仓库、Issue、PR、Actions、Release 等，支持脚本自动化与 CI/CD 集成。

## 目录

- [安装与配置](#安装与配置)
- [核心命令](#核心命令)
- [GitHub Actions 命令](#github-actions-命令)
- [附加命令](#附加命令)

---

## 安装与配置

### 安装

参考 [安装说明](https://github.com/cli/cli#installation)。

### 配置

```bash
# 登录认证
gh auth login

# 设置偏好编辑器
gh config set editor <editor>

# 设置别名
gh alias set <alias> <expansion>

# GitHub Enterprise
gh auth login --hostname <hostname>
export GH_HOST=<hostname>
export GH_ENTERPRISE_TOKEN=<access-token>
```

---

## 核心命令

### `gh auth` — 认证管理

| 子命令 | 说明 |
|--------|------|
| `gh auth login` | 登录 GitHub 账号 |
| `gh auth logout` | 登出 GitHub 账号 |
| `gh auth refresh` | 刷新存储的认证凭据 |
| `gh auth setup-git` | 配置 git 使用 GitHub CLI |
| `gh auth status` | 显示当前认证状态 |
| `gh auth switch` | 切换活跃的 GitHub 账号 |
| `gh auth token` | 打印认证 token |

#### `gh auth login [flags]`

```
-c, --clipboard             复制 OAuth 设备码到剪贴板
-p, --git-protocol string   Git 操作协议: {ssh|https}
-h, --hostname string       GitHub 实例主机名
    --insecure-storage      明文保存认证凭据
-s, --scopes strings        请求额外的认证 scopes
    --skip-ssh-key          跳过 SSH 密钥生成/上传提示
-w, --web                   在浏览器中打开认证
    --with-token            从标准输入读取 token
```

#### `gh auth status [flags]`

```
-a, --active            仅显示活跃账号
-h, --hostname string   仅检查指定主机
-t, --show-token        显示认证 token
```

#### `gh auth token [flags]`

```
-h, --hostname string   GitHub 实例主机名
-u, --user string       指定账号
```

---

### `gh browse` — 在浏览器中打开

```
gh browse [<number> | <path> | <commit-sha>] [flags]
```

```
-a, --actions                  打开仓库 Actions
    --blame                    打开文件 blame 视图
-b, --branch string            选择其他分支
-c, --commit string[="last"]   选择指定 commit
-n, --no-browser               仅打印 URL
-p, --projects                 打开仓库项目
-r, --releases                 打开仓库 Releases
-s, --settings                 打开仓库设置
-w, --wiki                     打开仓库 Wiki
```

---

### `gh codespace` — Codespace 管理

别名: `gh cs`

| 子命令 | 说明 |
|--------|------|
| `gh codespace code` | 在 VS Code 中打开 codespace |
| `gh codespace cp` | 在本地和远程之间复制文件 |
| `gh codespace create` | 创建 codespace |
| `gh codespace delete` | 删除 codespace |
| `gh codespace edit` | 编辑 codespace |
| `gh codespace jupyter` | 在 JupyterLab 中打开 |
| `gh codespace list` | 列出 codespaces |
| `gh codespace logs` | 查看 codespace 日志 |
| `gh codespace ports` | 列出端口 |
| `gh codespace ports forward` | 转发端口 |
| `gh codespace ports visibility` | 修改端口可见性 |
| `gh codespace rebuild` | 重建 codespace |
| `gh codespace ssh` | SSH 进入 codespace |
| `gh codespace stop` | 停止 codespace |
| `gh codespace view` | 查看 codespace 详情 |

---

### `gh gist` — Gist 管理

| 子命令 | 说明 |
|--------|------|
| `gh gist clone` | 克隆 gist |
| `gh gist create` | 创建 gist (别名: `gh gist new`) |
| `gh gist delete` | 删除 gist |
| `gh gist edit` | 编辑 gist |
| `gh gist list` | 列出 gists |
| `gh gist rename` | 重命名 gist 文件 |
| `gh gist view` | 查看 gist |

#### `gh gist create [<filename>... | -] [flags]`

```
-d, --desc string       Gist 描述
-f, --filename string   从标准输入读取时使用的文件名
-p, --public            公开 gist (默认 "secret")
-w, --web               在浏览器中打开创建的 gist
```

---

### `gh issue` — Issue 管理

| 子命令 | 说明 |
|--------|------|
| `gh issue close` | 关闭 issue |
| `gh issue comment` | 添加评论 |
| `gh issue create` | 创建 issue (别名: `gh issue new`) |
| `gh issue delete` | 删除 issue |
| `gh issue develop` | 管理关联分支 |
| `gh issue edit` | 编辑 issue |
| `gh issue list` | 列出 issues |
| `gh issue lock` | 锁定 issue |
| `gh issue pin` | 置顶 issue |
| `gh issue reopen` | 重新打开 issue |
| `gh issue status` | 显示相关 issues 状态 |
| `gh issue transfer` | 转移 issue 到其他仓库 |
| `gh issue unlock` | 解锁 issue |
| `gh issue unpin` | 取消置顶 |
| `gh issue view` | 查看 issue |

#### `gh issue create [flags]`

```
-a, --assignee login   指派人员 (使用 "@me" 指派自己)
-b, --body string      提供正文内容
-F, --body-file file   从文件读取正文
-e, --editor           在编辑器中编写
-l, --label name       添加标签
-m, --milestone name   添加到里程碑
-p, --project title    添加到项目
-T, --template name    使用模板
-t, --title string     提供标题
-w, --web              在浏览器中创建
```

#### `gh issue list [flags]`

```
-a, --assignee string   按指派人筛选
-A, --author string     按作者筛选
-l, --label strings     按标签筛选
-L, --limit int         最大数量 (默认 30)
-m, --milestone string  按里程碑筛选
-S, --search query      搜索查询
-s, --state string      按状态: {open|closed|all} (默认 "open")
-w, --web               在浏览器中列出
```

---

### `gh org` — 组织管理

| 子命令 | 说明 |
|--------|------|
| `gh org list` | 列出已认证用户的组织 |

---

### `gh pr` — Pull Request 管理

| 子命令 | 说明 |
|--------|------|
| `gh pr checkout` | 检出 PR (别名: `gh pr co`) |
| `gh pr checks` | 显示 CI 状态 |
| `gh pr close` | 关闭 PR |
| `gh pr comment` | 添加评论 |
| `gh pr create` | 创建 PR (别名: `gh pr new`) |
| `gh pr diff` | 查看 PR 变更 |
| `gh pr edit` | 编辑 PR |
| `gh pr list` | 列出 PRs |
| `gh pr lock` | 锁定 PR |
| `gh pr merge` | 合并 PR |
| `gh pr ready` | 标记为可审查 |
| `gh pr reopen` | 重新打开 PR |
| `gh pr revert` | 回退 PR |
| `gh pr review` | 添加审查 |
| `gh pr status` | 显示相关 PRs 状态 |
| `gh pr unlock` | 解锁 PR |
| `gh pr update-branch` | 更新 PR 分支 |
| `gh pr view` | 查看 PR |

#### `gh pr create [flags]`

```
-a, --assignee login       指派人员
-B, --base branch          目标分支
-b, --body string          PR 正文
-F, --body-file file       从文件读取正文
-d, --draft                标记为草稿
    --dry-run              打印详情而不创建
-e, --editor               在编辑器中编写
-f, --fill                 使用 commit 信息填充
-H, --head branch          源分支 (默认当前分支)
-l, --label name           添加标签
-m, --milestone name       添加到里程碑
-p, --project title        添加到项目
-r, --reviewer handle      请求审查
-t, --title string         PR 标题
-w, --web                  在浏览器中创建
```

#### `gh pr merge [<number>] [flags]`

```
    --admin               使用管理员权限合并
    --auto                满足要求后自动合并
-d, --delete-branch       合并后删除分支
-m, --merge               使用 merge commit
-r, --rebase              使用 rebase
-s, --squash              使用 squash 合并
```

#### `gh pr list [flags]`

```
-a, --assignee string   按指派人筛选
-A, --author string     按作者筛选
-B, --base string       按 base 分支筛选
-H, --head string       按 head 分支筛选
-l, --label strings     按标签筛选
-L, --limit int         最大数量 (默认 30)
-S, --search query      搜索查询
-s, --state string      按状态: {open|closed|merged|all} (默认 "open")
-w, --web               在浏览器中列出
```

---

### `gh project` — GitHub Projects 管理

| 子命令 | 说明 |
|--------|------|
| `gh project close` | 关闭项目 |
| `gh project copy` | 复制项目 |
| `gh project create` | 创建项目 |
| `gh project delete` | 删除项目 |
| `gh project edit` | 编辑项目 |
| `gh project field-create` | 创建字段 |
| `gh project field-delete` | 删除字段 |
| `gh project field-list` | 列出字段 |
| `gh project item-add` | 添加 PR/Issue 到项目 |
| `gh project item-archive` | 归档项目项 |
| `gh project item-create` | 创建草稿 Issue |
| `gh project item-delete` | 删除项目项 |
| `gh project item-edit` | 编辑项目项 |
| `gh project item-list` | 列出项目项 |
| `gh project link` | 链接项目到仓库/团队 |
| `gh project list` | 列出项目 |
| `gh project mark-template` | 标记为模板 |
| `gh project unlink` | 取消链接 |
| `gh project view` | 查看项目 |

---

### `gh release` — Release 管理

| 子命令 | 说明 |
|--------|------|
| `gh release create` | 创建 release (别名: `gh release new`) |
| `gh release delete` | 删除 release |
| `gh release delete-asset` | 删除 release 资源 |
| `gh release download` | 下载 release 资源 |
| `gh release edit` | 编辑 release |
| `gh release list` | 列出 releases |
| `gh release upload` | 上传资源到 release |
| `gh release verify` | 验证 release 签名 |
| `gh release verify-asset` | 验证 release 资源 |
| `gh release view` | 查看 release |

#### `gh release create [<tag>] [flags]`

```
-d, --draft                        保存为草稿
    --generate-notes               自动生成标题和说明
-n, --notes string                 Release 说明
-F, --notes-file file              从文件读取说明
-p, --prerelease                   标记为预发布
    --target branch                目标分支或 commit SHA
-t, --title string                 Release 标题
    --verify-tag                   验证 tag 是否已存在于远程
```

---

### `gh repo` — 仓库管理

| 子命令 | 说明 |
|--------|------|
| `gh repo archive` | 归档仓库 |
| `gh repo clone` | 克隆仓库 |
| `gh repo create` | 创建仓库 (别名: `gh repo new`) |
| `gh repo delete` | 删除仓库 |
| `gh repo edit` | 编辑仓库设置 |
| `gh repo fork` | Fork 仓库 |
| `gh repo list` | 列出仓库 |
| `gh repo rename` | 重命名仓库 |
| `gh repo set-default` | 设置默认仓库 |
| `gh repo sync` | 同步仓库 |
| `gh repo unarchive` | 取消归档 |
| `gh repo view` | 查看仓库 |
| `gh repo autolink create` | 创建自动链接 |
| `gh repo autolink delete` | 删除自动链接 |
| `gh repo autolink list` | 列出自动链接 |
| `gh repo autolink view` | 查看自动链接 |
| `gh repo deploy-key add` | 添加部署密钥 |
| `gh repo deploy-key delete` | 删除部署密钥 |
| `gh repo deploy-key list` | 列出部署密钥 |
| `gh repo gitignore list` | 列出 gitignore 模板 |
| `gh repo gitignore view` | 查看 gitignore 模板 |
| `gh repo license list` | 列出许可证 |
| `gh repo license view` | 查看许可证 |

#### `gh repo create [<name>] [flags]`

```
    --add-readme             添加 README
-c, --clone                  克隆到当前目录
-d, --description string     仓库描述
-g, --gitignore string       指定 gitignore 模板
-l, --license string         指定开源许可证
    --private                创建私有仓库
    --public                 创建公开仓库
-p, --template repository    基于模板创建
```

---

## GitHub Actions 命令

### `gh cache` — Actions 缓存管理

| 子命令 | 说明 |
|--------|------|
| `gh cache delete` | 删除缓存 |
| `gh cache list` | 列出缓存 |

---

### `gh run` — Workflow 运行管理

| 子命令 | 说明 |
|--------|------|
| `gh run cancel` | 取消运行 |
| `gh run delete` | 删除运行 |
| `gh run download` | 下载产物 |
| `gh run list` | 列出运行 |
| `gh run rerun` | 重新运行 |
| `gh run view` | 查看运行 |
| `gh run watch` | 监控运行进度 |

#### `gh run list [flags]`

```
-b, --branch string     按分支筛选
-c, --commit SHA        按 commit SHA 筛选
-e, --event event       按触发事件筛选
-L, --limit int         最大数量 (默认 20)
-s, --status string     按状态筛选
-w, --workflow string   按 workflow 筛选
```

#### `gh run view [<run-id>] [flags]`

```
-j, --job string    查看特定 job
    --log           查看完整日志
    --log-failed    查看失败步骤日志
-v, --verbose       显示 job 步骤
-w, --web           在浏览器中打开
```

---

### `gh workflow` — Workflow 管理

| 子命令 | 说明 |
|--------|------|
| `gh workflow disable` | 禁用 workflow |
| `gh workflow enable` | 启用 workflow |
| `gh workflow list` | 列出 workflows |
| `gh workflow run` | 触发 workflow |
| `gh workflow view` | 查看 workflow |

#### `gh workflow run [<workflow-id> | <workflow-name>] [flags]`

```
-F, --field key=value       添加参数 (支持 @ 语法)
-f, --raw-field key=value   添加字符串参数
-r, --ref string            指定分支或标签
```

---

## 附加命令

### `gh agent-task` — Agent 任务管理 (预览)

别名: `gh agent-tasks`, `gh agent`, `gh agents`

| 子命令 | 说明 |
|--------|------|
| `gh agent-task create` | 创建 agent 任务 |
| `gh agent-task list` | 列出 agent 任务 |
| `gh agent-task view` | 查看 agent 任务 |

---

### `gh alias` — 命令别名

| 子命令 | 说明 |
|--------|------|
| `gh alias delete` | 删除别名 |
| `gh alias import` | 从 YAML 文件导入别名 |
| `gh alias list` | 列出别名 |
| `gh alias set` | 创建别名 |

#### `gh alias set <alias> <expansion> [flags]`

```
    --clobber   覆盖已有同名别名
-s, --shell     声明为 shell 别名
```

---

### `gh api <endpoint> [flags]` — GitHub API 请求

```
    --cache duration        缓存响应, 如 "3600s", "60m", "1h"
-F, --field key=value       添加类型化参数
-H, --header key:value      添加 HTTP 请求头
    --hostname string       GitHub 主机名 (默认 "github.com")
-i, --include               包含 HTTP 响应状态和头
    --input file            请求体文件
-q, --jq string             使用 jq 语法查询
-X, --method string         HTTP 方法 (默认 "GET")
    --paginate              获取所有分页结果
-p, --preview strings       启用 API 预览
-f, --raw-field key=value   添加字符串参数
    --silent                不打印响应体
    --slurp                 配合 --paginate 返回所有页面的数组
-t, --template string       使用 Go 模板格式化
    --verbose               包含完整的 HTTP 请求和响应
```

---

### `gh attestation` — 制品证明管理

别名: `gh at`

| 子命令 | 说明 |
|--------|------|
| `gh attestation download` | 下载制品证明 |
| `gh attestation trusted-root` | 输出可信根 |
| `gh attestation verify` | 验证制品完整性 |

---

### `gh completion -s <shell>` — Shell 补全脚本

```
-s, --shell string   Shell 类型: {bash|zsh|fish|powershell}
```

---

### `gh config` — 配置管理

| 子命令 | 说明 |
|--------|------|
| `gh config clear-cache` | 清除 CLI 缓存 |
| `gh config get <key>` | 获取配置值 |
| `gh config list` | 列出配置 |
| `gh config set <key> <value>` | 设置配置值 |

---

### `gh copilot` — GitHub Copilot CLI (预览)

```
--remove   删除已下载的 Copilot CLI
```

---

### `gh extension` — 扩展管理

别名: `gh extensions`, `gh ext`

| 子命令 | 说明 |
|--------|------|
| `gh extension browse` | 浏览扩展 UI |
| `gh extension create` | 创建扩展 |
| `gh extension exec` | 执行已安装的扩展 |
| `gh extension install` | 安装扩展 |
| `gh extension list` | 列出已安装的扩展 |
| `gh extension remove` | 移除扩展 |
| `gh extension search` | 搜索扩展 |
| `gh extension upgrade` | 升级扩展 |

---

### `gh gpg-key` — GPG 密钥管理

| 子命令 | 说明 |
|--------|------|
| `gh gpg-key add` | 添加 GPG 密钥 |
| `gh gpg-key delete` | 删除 GPG 密钥 |
| `gh gpg-key list` | 列出 GPG 密钥 |

---

### `gh label` — 标签管理

| 子命令 | 说明 |
|--------|------|
| `gh label clone` | 从其他仓库克隆标签 |
| `gh label create` | 创建标签 |
| `gh label delete` | 删除标签 |
| `gh label edit` | 编辑标签 |
| `gh label list` | 列出标签 |

---

### `gh licenses` — 查看第三方许可证信息

---

### `gh ruleset` — 仓库规则集

别名: `gh rs`

| 子命令 | 说明 |
|--------|------|
| `gh ruleset check` | 查看适用于分支的规则 |
| `gh ruleset list` | 列出规则集 |
| `gh ruleset view` | 查看规则集详情 |

---

### `gh search` — 搜索

| 子命令 | 说明 |
|--------|------|
| `gh search code` | 搜索代码 |
| `gh search commits` | 搜索 commits |
| `gh search issues` | 搜索 issues |
| `gh search prs` | 搜索 PRs |
| `gh search repos` | 搜索仓库 |

#### `gh search repos [<query>] [flags]`

```
    --language string     按语言筛选
    --license strings     按许可证筛选
-L, --limit int           最大数量 (默认 30)
    --sort string         排序: {forks|help-wanted-issues|stars|updated}
    --stars number        按星标数筛选
    --topic strings       按 topic 筛选
-w, --web                 在浏览器中搜索
```

---

### `gh secret` — Secret 管理

| 子命令 | 说明 |
|--------|------|
| `gh secret delete` | 删除 secret |
| `gh secret list` | 列出 secrets |
| `gh secret set` | 创建或更新 secret |

#### `gh secret set <secret-name> [flags]`

```
-a, --app string           应用类型: {actions|codespaces|dependabot}
-b, --body string          Secret 值 (不指定则从标准输入读取)
-e, --env environment      环境级 secret
-o, --org organization     组织级 secret
-v, --visibility string    可见性: {all|private|selected} (默认 "private")
```

---

### `gh ssh-key` — SSH 密钥管理

| 子命令 | 说明 |
|--------|------|
| `gh ssh-key add` | 添加 SSH 密钥 |
| `gh ssh-key delete` | 删除 SSH 密钥 |
| `gh ssh-key list` | 列出 SSH 密钥 |

---

### `gh status` — 状态概览

```
gh status [flags]
```

```
-e, --exclude strings   排除的仓库列表 (owner/name 格式)
-o, --org string        在组织范围内报告状态
```

---

### `gh variable` — Actions 变量管理

| 子命令 | 说明 |
|--------|------|
| `gh variable delete` | 删除变量 |
| `gh variable get` | 获取变量 |
| `gh variable list` | 列出变量 |
| `gh variable set` | 创建或更新变量 |

#### `gh variable set <variable-name> [flags]`

```
-b, --body string          变量值
-e, --env environment      环境级变量
-o, --org organization     组织级变量
-v, --visibility string    可见性: {all|private|selected} (默认 "private")
```

---

## 环境变量

| 变量 | 说明 |
|------|------|
| `GITHUB_TOKEN` | 认证 token (替代 `gh auth login`) |
| `GH_HOST` | 默认 GitHub 主机名 |
| `GH_ENTERPRISE_TOKEN` | GitHub Enterprise token |
| `GH_REPO` | 默认仓库 (格式: `owner/repo`) |

## 退出码

| 退出码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1 | 一般错误 |
| 2 | shell 用法错误 (参数不正确) |

## 通用 JSON 输出选项

以下选项在多个命令中通用:

```
-q, --jq expression     使用 jq 表达式过滤 JSON 输出
    --json fields       指定字段输出 JSON
-t, --template string   使用 Go 模板格式化 JSON
```

---

> 完整文档: https://cli.github.com/manual
