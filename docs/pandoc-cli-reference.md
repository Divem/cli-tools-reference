# Pandoc CLI 参考手册

> 本机版本：**pandoc 3.9.0.2** | 安装路径：`/opt/homebrew/bin/pandoc`
> 特性：Lua 脚本引擎 + Pandoc Server | 运行环境：macOS ARM64

Pandoc 是通用文档格式转换工具，被称为"文档界的瑞士军刀"。支持 Markdown、HTML、Word、PDF、EPUB、LaTeX、reveal.js 等 60+ 种格式互转，内置引用管理、代码高亮、数学公式渲染、Lua 过滤器等高级功能。

## 目录

- [安装信息](#安装信息)
- [基础语法](#基础语法)
- [输入格式](#输入格式)
- [输出格式](#输出格式)
- [输入输出选项](#输入输出选项)
- [通用转换选项](#通用转换选项)
- [模板与变量](#模板与变量)
- [目录与章节编号](#目录与章节编号)
- [内容提取与资源管理](#内容提取与资源管理)
- [代码高亮](#代码高亮)
- [PDF 生成](#pdf-生成)
- [HTML 输出](#html-输出)
- [EPUB 输出](#epub-输出)
- [Markdown 输出](#markdown-输出)
- [幻灯片输出](#幻灯片输出)
- [LaTeX 输出](#latex-输出)
- [引用与参考文献](#引用与参考文献)
- [数学公式渲染](#数学公式渲染)
- [过滤器系统](#过滤器系统)
- [扩展控制](#扩展控制)
- [EPUB 专用选项](#epub-专用选项)
- [调试与诊断](#调试与诊断)
- [支持的语言高亮](#支持的语言高亮)
- [高亮主题](#高亮主题)
- [常用命令示例](#常用命令示例)

---

## 安装信息

### 版本信息

```
pandoc 3.9.0.2
Features: +server +lua
Scripting engine: Lua 5.4
User data directory: ~/.local/share/pandoc
```

### 安装方式

```bash
brew install pandoc
```

### 更新

```bash
brew upgrade pandoc
```

---

## 基础语法

```bash
pandoc [OPTIONS] [FILES]
```

### 最简用法

```bash
# 从标准输入读取
echo '# Hello' | pandoc

# 转换文件
pandoc input.md -o output.html

# 多文件合并
pandoc ch1.md ch2.md ch3.md -o book.html
```

### 常用选项速查

| 短选项 | 长选项 | 说明 |
|--------|--------|------|
| `-f` | `--from` | 输入格式 |
| `-t` | `--to` | 输出格式 |
| `-o` | `--output` | 输出文件 |
| `-s` | `--standalone` | 生成完整文档（含头部） |
| `-M` | `--metadata` | 设置元数据 |
| `-V` | `--variable` | 设置模板变量 |
| `-N` | `--number-sections` | 章节编号 |
| `-C` | `--citeproc` | 启用引用处理 |
| `-h` | `--help` | 显示帮助 |
| `-v` | `--version` | 显示版本 |

---

## 输入格式

使用 `-f` 或 `--from` 指定，默认自动检测。

| 格式 | 标识 | 说明 |
|------|------|------|
| **Markdown** | `markdown` | Pandoc 扩展 Markdown（默认） |
| **GitHub Flavored** | `gfm` | GitHub 风格 Markdown |
| **CommonMark** | `commonmark` | 严格 CommonMark 规范 |
| **reStructuredText** | `rst` | reStructuredText |
| **HTML** | `html` | HTML 文档 |
| **LaTeX** | `latex` | LaTeX 文档 |
| **Word** | `docx` | Word 文档 |
| **EPUB** | `epub` | EPUB 电子书 |
| **ODT** | `odt` | OpenDocument 文本 |
| **Org Mode** | `org` | Emacs Org Mode |
| **Textile** | `textile` | Textile 标记语言 |
| **AsciiDoc** | `asciidoc` | AsciiDoc 文档 |
| **DocBook** | `docbook` | DocBook XML |
| **MediaWiki** | `mediawiki` | MediaWiki 标记 |
| **Jira** | `jira` | Jira Wiki 标记 |
| **DokuWiki** | `dokuwiki` | DokuWiki 标记 |
| **Jupyter** | `ipynb` | Jupyter Notebook |
| **CSV** | `csv` | 逗号分隔值 |
| **TSV** | `tsv` | 制表符分隔值 |
| **JSON** | `json` | Pandoc JSON AST |
| **BibTeX** | `bibtex` | 参考文献数据库 |
| **OPML** | `opml` | 大纲处理标记语言 |
| **Typst** | `typst` | Typst 文档 |

### 附加扩展语法

使用 `+` 添加扩展，`-` 移除扩展：

```bash
# 使用 GFM 并启用数学公式
pandoc -f gfm+tex_math_dollars input.md -o output.html

# 严格 Markdown（移除所有扩展）
pandoc -f markdown_strict input.md -o output.html
```

---

## 输出格式

使用 `-t` 或 `--to` 指定。

### 文档类

| 格式 | 标识 | 说明 |
|------|------|------|
| **HTML** | `html` / `html5` | HTML5 文档 |
| **HTML4** | `html4` | HTML4 兼容 |
| **Word** | `docx` | Word (.docx) |
| **PDF** | `pdf` | PDF（需 LaTeX 引擎） |
| **LaTeX** | `latex` | LaTeX 源码 |
| **EPUB** | `epub` / `epub3` | EPUB 电子书 |
| **EPUB2** | `epub2` | EPUB 2.0 |
| **ODT** | `odt` | OpenDocument |
| **RTF** | `rtf` | 富文本格式 |
| **Plain** | `plain` | 纯文本 |
| **Man** | `man` | Unix man 手册页 |
| **Typst** | `typst` | Typst 文档 |
| **ConTeXt** | `context` | ConTeXt 文档 |

### 标记语言类

| 格式 | 标识 | 说明 |
|------|------|------|
| **Markdown** | `markdown` / `gfm` / `commonmark` | 各种 Markdown 风格 |
| **reStructuredText** | `rst` | reStructuredText |
| **AsciiDoc** | `asciidoc` | AsciiDoc |
| **MediaWiki** | `mediawiki` | MediaWiki |
| **Jira** | `jira` | Jira Wiki |
| **DokuWiki** | `dokuwiki` | DokuWiki |
| **Textile** | `textile` | Textile |
| **Org Mode** | `org` | Org Mode |
| **JATS** | `jats` | Journal Article Tag Suite |
| **TEI** | `tei` | Text Encoding Initiative |
| **DocBook** | `docbook` / `docbook5` | DocBook XML |
| **XWiki** | `xwiki` | XWiki 标记 |
| **ZimWiki** | `zimwiki` | Zim Wiki |

### 演示文稿类

| 格式 | 标识 | 说明 |
|------|------|------|
| **reveal.js** | `revealjs` | reveal.js 幻灯片 |
| **Beamer** | `beamer` | LaTeX Beamer 幻灯片 |
| **Slidy** | `slidy` | Slidy HTML 幻灯片 |
| **S5** | `s5` | S5 幻灯片 |
| **DZSlides** | `dzslides` | DZSlides 幻灯片 |
| **Slideous** | `slideous` | Slideous 幻灯片 |

### 数据类

| 格式 | 标识 | 说明 |
|------|------|------|
| **JSON** | `json` | Pandoc JSON AST |
| **CSV** | `csv` | 逗号分隔值（表格） |
| **TSV** | `tsv` | 制表符分隔值 |
| **PPTX** | `pptx` | PowerPoint |
| **XLSX** | `xlsx` | Excel 电子书 |

### 查看所有格式

```bash
pandoc --list-input-formats
pandoc --list-output-formats
```

---

## 输入输出选项

### 基本选项

```bash
-f FORMAT, --from=FORMAT          # 输入格式
-t FORMAT, --to=FORMAT            # 输出格式
-o FILE, --output=FILE            # 输出文件（不指定则输出到 stdout）
--data-dir=DIRECTORY              # 自定义数据目录（模板等）
--file-scope                      # 每个文件单独解析（不合并）
--sandbox                         # 沙箱模式（安全限制）
```

### 元数据

```bash
-M KEY[:VALUE], --metadata=KEY[:VALUE]     # 设置元数据
--metadata-file=FILE                        # 从文件读取元数据
-d FILE, --defaults=FILE                    # 从 YAML 文件读取默认选项
```

### 元数据优先级

`--metadata-file` > YAML front matter > `--metadata`

### Defaults 文件示例 (defaults.yaml)

```yaml
from: markdown
to: html5
standalone: true
toc: true
toc-depth: 3
metadata:
  title: "文档标题"
  author: "作者名"
  date: "2025-01-01"
variables:
  css: style.css
```

使用：

```bash
pandoc -d defaults.yaml input.md -o output.html
```

---

## 通用转换选项

### 独立文档

```bash
-s, --standalone              # 生成完整文档（含 DOCTYPE、head 等）
--template=FILE               # 指定自定义模板
--embed-resources             # 嵌入所有资源（图片、CSS 等为 base64）
--self-contained              # 同 --embed-resources（旧名）
```

### 文本处理

```bash
--wrap=auto|none|preserve     # 自动换行 / 不换行 / 保持原文换行
--ascii                       # 只使用 ASCII 字符
--columns=NUMBER              # 文本列宽（默认 72）
--tab-stop=NUMBER             # Tab 宽度（默认 4）
-p, --preserve-tabs           # 保留 Tab 字符
--eol=crlf|lf|native          # 行尾符格式
```

### 文件嵌入

```bash
-H FILE, --include-in-header=FILE       # 在文档 head 中包含文件
-B FILE, --include-before-body=FILE     # 在 body 开始处包含文件
-A FILE, --include-after-body=FILE      # 在 body 结尾处包含文件
```

---

## 模板与变量

### 变量设置

```bash
-V KEY[:VALUE], --variable=KEY[:VALUE]       # 设置模板变量
--variable-json=KEY:JSON                     # 设置 JSON 格式变量
```

### 常用变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `title` | 文档标题 | `-V title="My Doc"` |
| `author` | 作者 | `-V author="达尔文"` |
| `date` | 日期 | `-V date="2025-01-01"` |
| `lang` | 语言 | `-V lang=zh-CN` |
| `mainfont` | 主字体 (LaTeX) | `-V mainfont="Noto Sans"` |
| `monofont` | 等宽字体 (LaTeX) | `-V monofont="Noto Sans Mono"` |
| `fontsize` | 字号 (LaTeX) | `-V fontsize=12pt` |
| `geometry` | 页面边距 (LaTeX) | `-V geometry:margin=1in` |
| `documentclass` | 文档类 (LaTeX) | `-V documentclass=article` |
| `colorlinks` | 彩色链接 (LaTeX) | `-V colorlinks=true` |
| `toc-title` | 目录标题 | `-V toc-title="目录"` |
| `header-includes` | 额外头部内容 | `-V header-includes='<script ...>'` |
| `include-before` | body 前内容 | `-V include-before='<div>'` |
| `include-after` | body 后内容 | `-V include-after='</div>'` |

### 查看默认模板

```bash
pandoc -D html              # 查看 HTML 模板
pandoc -D latex             # 查看 LaTeX 模板
pandoc -D beamer            # 查看 Beamer 模板
pandoc -D epub3             # 查看 EPUB3 模板
```

---

## 目录与章节编号

```bash
--toc, --table-of-contents              # 生成目录
--toc-depth=NUMBER                      # 目录深度（默认 3）
--toc-title=STRING                      # 目录标题
-N, --number-sections                   # 章节自动编号
--number-offset=NUMBERS                 # 编号偏移（如 1,1,1）
--top-level-division=section|chapter|part  # 顶层分割方式
--shift-heading-level-by=NUMBER         # 标题级别偏移
--base-header-level=NUMBER              # 基础标题级别
--section-divs                          # 用 <div> 包裹章节
```

### 示例

```bash
# 生成带目录的 HTML，深度 2 级
pandoc input.md -o output.html --toc --toc-depth=2 -s

# 章节编号，标题整体降低一级
pandoc input.md -o output.html -N --shift-heading-level-by=-1 -s
```

---

## 内容提取与资源管理

```bash
--extract-media=PATH           # 提取嵌入媒体到指定目录
--resource-path=SEARCHPATH     # 资源搜索路径
--link-images[=true|false]     # 将远程图片链接转为内嵌
--default-image-extension=ext  # 默认图片扩展名
```

### 提取 Word 文档中的图片

```bash
pandoc input.docx --extract-media=./media -o output.md
```

---

## 代码高亮

```bash
--syntax-highlighting=STYLE     # 高亮样式（默认 default）
--highlight-style=STYLE|FILE    # 高亮主题（同上）
--syntax-definition=FILE        # 自定义语法定义 (.xml)
--no-highlight                  # 禁用代码高亮
--listings                      # 使用 LaTeX listings 包
```

### 使用 Lua 过滤器控制

```bash
--indented-code-classes=STRING  # 缩进代码块的类名
```

---

## PDF 生成

### 引擎选择

```bash
--pdf-engine=PROGRAM              # PDF 引擎
--pdf-engine-opt=STRING           # 传递给引擎的额外选项
--reference-doc=FILE              # 参考文档（继承样式）
```

### 可用引擎

| 引擎 | 安装 | 特点 |
|------|------|------|
| `pdflatex` | `brew install basictex` | 最常用 |
| `xelatex` | `brew install basictex` | 支持系统字体 |
| `lualatex` | `brew install basictex` | Lua 脚本支持 |
| `wkhtmltopdf` | `brew install wkhtmltopdf` | HTML 转 PDF |
| `weasyprint` | `pip install weasyprint` | CSS 打印支持 |
| `prince` | 商业软件 | 高质量排版 |
| `context` | `brew install context` | ConTeXt 引擎 |

### 基础示例

```bash
# Markdown 转 PDF（使用 xelatex，支持中文）
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V CJKmainfont="PingFang SC"

# 使用参考文档样式
pandoc input.md -o output.pdf \
  --reference-doc=template.docx
```

### PDF 常用变量

```bash
-V geometry:margin=1in            # 页边距
-V fontsize=11pt                  # 字号
-V documentclass=report           # 文档类
-V linestretch=1.5                # 行距
-V mainfont="SimSun"              # 主字体
-V CJKmainfont="PingFang SC"      # 中文主字体
-V monofont="Source Code Pro"     # 等宽字体
-V colorlinks=true                # 彩色链接
-V linkcolor=blue                 # 链接颜色
-V urlcolor=blue                  # URL 颜色
-V toccolor=black                 # 目录链接颜色
-V geometry:a4paper               # 纸张大小
```

---

## HTML 输出

```bash
-c URL, --css=URL                 # 引入 CSS 样式表（可多次使用）
-T STRING, --title-prefix=STRING  # HTML <title> 前缀
--html-q-tags                     # 使用 <q> 标签
--email-obfuscation=none|javascript|references  # 邮箱混淆
--id-prefix=STRING                # ID 前缀
```

### 示例

```bash
# 生成带样式和目录的独立 HTML
pandoc input.md -o output.html \
  -s --toc \
  -c style.css \
  -V lang=zh-CN \
  --metadata title="文档标题"

# 自包含 HTML（所有资源内嵌）
pandoc input.md -o output.html \
  -s --embed-resources --toc
```

---

## EPUB 输出

```bash
--epub-chapter-level=NUMBER       # 章节级别（默认 1）
--epub-cover-image=FILE           # 封面图片
--epub-title-page                 # 生成标题页
--epub-metadata=FILE              # EPUB 元数据 XML
--epub-embed-font=FILE            # 嵌入字体（可多次使用）
--epub-subdirectory=DIRNAME       # EPUB 内子目录名
```

### 示例

```bash
pandoc ch1.md ch2.md ch3.md -o book.epub \
  --toc \
  --epub-cover-image=cover.jpg \
  --epub-title-page \
  -V lang=zh-CN \
  -M title="书籍标题" \
  -M author="作者名"
```

---

## Markdown 输出

```bash
--markdown-headings=setext|atx           # 标题风格
--reference-links[=true|false]           # 使用引用式链接
--reference-location=block|section|document  # 引用链接位置
--list-tables[=true|false]               # 表格使用列表格式
```

### 示例

```bash
# Word 转 GFM Markdown
pandoc input.docx -t gfm -o output.md

# HTML 转 CommonMark
pandoc input.html -t commonmark -o output.md
```

---

## 幻灯片输出

```bash
-i, --incremental                   # 逐步显示（incremental）
--slide-level=NUMBER                # 幻灯片分割级别（默认 1）
```

### reveal.js 示例

```bash
pandoc presentation.md -o slides.html \
  -t revealjs \
  -V theme=moon \
  -V transition=zoom \
  --slide-level=2 \
  -i
```

### Beamer 示例

```bash
pandoc presentation.md -o slides.pdf \
  -t beamer \
  --pdf-engine=xelatex \
  -V CJKmainfont="PingFang SC" \
  -V theme=metropolis \
  -i
```

---

## LaTeX 输出

### 常用变量

```bash
-V documentclass=article|report|book|memoir  # 文档类
-V classoption=onecolumn|twocolumn           # 文档类选项
-V geometry:margin=1in                       # 页边距
-V fontsize=11pt|12pt                        # 字号
-V linestretch=1.5                           # 行距
-V mainfont="字体名"                         # 主字体
-V monofont="字体名"                         # 等宽字体
-V colorlinks=true                           # 彩色链接
-V linkcolor=blue                            # 链接颜色
```

### 示例

```bash
pandoc input.md -o output.tex \
  -V documentclass=article \
  -V geometry:margin=2.5cm \
  -V CJKmainfont="PingFang SC" \
  -N --toc
```

---

## 引用与参考文献

```bash
-C, --citeproc                            # 启用引用处理
--bibliography=FILE                       # 参考文献文件 (.bib)
--csl=FILE                                # 引用样式 (.csl)
--citation-abbreviations=FILE             # 引用缩写
--natbib                                  # 使用 natbib 兼容模式
--biblatex                                # 使用 biblatex 兼容模式
```

### 示例

```bash
pandoc paper.md -o output.pdf \
  --citeproc \
  --bibliography=refs.bib \
  --csl=apa.csl \
  --pdf-engine=xelatex
```

### 在 Markdown 中引用

```markdown
详见 @Smith2020 的研究，@Jones2021 也得出了类似结论。

## 参考文献
```

---

## 数学公式渲染

```bash
--mathml                   # 输出 MathML
--webtex[=URL]             # 使用 WebTeX 图片（默认 https://latex.codecogs.com/svg.latex?）
--mathjax[=URL]            # 使用 MathJax
--katex[=URL]              # 使用 KaTeX
--gladtex                  # 使用 GladTeX
```

### 示例

```bash
# HTML + KaTeX 数学公式
pandoc input.md -o output.html -s --katex

# HTML + MathJax
pandoc input.md -o output.html -s --mathjax
```

---

## 过滤器系统

### Pandoc 过滤器

```bash
-F PROGRAM, --filter=PROGRAM           # JSON 过滤器（管道方式）
-L SCRIPTPATH, --lua-filter=SCRIPTPATH # Lua 过滤器
```

### 过滤器类型

| 类型 | 说明 | 优势 |
|------|------|------|
| Lua 过滤器 | `.lua` 脚本 | 无需外部依赖，性能好 |
| JSON 过滤器 | 任何可执行程序 | 语言无关 |
| Pandoc Server | HTTP API | 3.9 新特性，长驻进程 |

### Lua 过滤器示例

```lua
-- capitalize-headings.lua：将所有标题大写
function Header(el)
  el.content = pandoc.Str(string.upper(pandoc.utils.stringify(el.content)))
  return el
end
```

```bash
pandoc input.md --lua-filter=capitalize-headings.lua -o output.html
```

### 常用 Lua 过滤器操作

```lua
-- 替换文本
function Str(el)
  if el.text == "foo" then
    return pandoc.Str("bar")
  end
end

-- 添加属性
function Image(el)
  el.attributes["loading"] = "lazy"
  return el
end

-- 处理代码块
function CodeBlock(el)
  el.classes:insert("language-" .. el.classes[1])
  return el
end

-- 处理链接
function Link(el)
  el.target = string.gsub(el.target, "^http:", "https:")
  return el
end
```

---

## 扩展控制

### Markdown 扩展

使用 `+EXTENSION` 启用，`-EXTENSION` 禁用。

### 常用扩展

| 扩展 | 默认 | 说明 |
|------|------|------|
| `pipe_tables` | + | 管道表格 |
| `table_attributes` | + | 表格属性 |
| `fenced_code_blocks` | + | 围栏代码块 |
| `fenced_code_attributes` | + | 代码块属性 |
| `fenced_divs` | + | 围栏 Div |
| `backtick_code_blocks` | + | 反引号代码块 |
| `footnotes` | + | 脚注 |
| `inline_notes` | + | 行内脚注 |
| `citations` | + | 引用语法 |
| `definition_lists` | + | 定义列表 |
| `example_lists` | + | 示例列表 |
| `fancy_lists` | + | 有序列表类型 |
| `task_lists` | + | 任务列表 |
| `smart` | + | 智能标点 |
| `tex_math_dollars` | + | `$...$` 数学公式 |
| `raw_html` | + | 原始 HTML |
| `raw_tex` | + | 原始 LaTeX |
| `yaml_metadata_block` | + | YAML 元数据块 |
| `auto_identifiers` | + | 自动生成标题 ID |
| `implicit_figures` | + | 独立图片自动视为 figure |
| `strikeout` | + | 删除线 `~~text~~` |
| `superscript` | + | 上标 `^sup^` |
| `subscript` | + | 下标 `~sub~` |
| `hard_line_breaks` | - | 硬换行 |
| `emoji` | - | Emoji 短代码 |
| `wikilinks` | - | Wiki 链接 `[[link]]` |

### 查看格式扩展

```bash
pandoc --list-extensions=markdown       # Markdown 扩展
pandoc --list-extensions=gfm            # GFM 扩展
pandoc --list-extensions=commonmark     # CommonMark 扩展
```

### 使用示例

```bash
# 严格 CommonMark + 任务列表
pandoc -f commonmark+task_lists input.md -o output.html

# 标准 Markdown 移除智能标点
pandoc -f markdown-smart input.md -o output.html
```

---

## EPUB 专用选项

```bash
--epub-chapter-level=NUMBER       # 定义章节级别（默认 1）
--epub-cover-image=FILE           # 封面图片路径
--epub-title-page[=true|false]    # 生成标题页（默认 true）
--epub-metadata=FILE              # 元数据文件路径 (XML)
--epub-embed-font=FILE            # 嵌入字体（可多次指定）
--epub-subdirectory=DIRNAME       # 内容子目录（默认 EPUB）
--split-level=NUMBER              # 文件分割级别
```

---

## 调试与诊断

```bash
--trace[=true|false]              # 显示详细执行追踪
--dump-args[=true|false]          # 输出解析后的参数
--ignore-args[=true|false]        # 忽略其他参数
--verbose                         # 详细输出
--quiet                           # 静默模式
--fail-if-warnings[=true|false]   # 有警告时退出码为非零
--log=FILE                        # 写入日志文件
```

### 信息查询

```bash
pandoc --list-input-formats               # 列出输入格式
pandoc --list-output-formats              # 列出输出格式
pandoc --list-extensions[=FORMAT]         # 列出格式扩展
pandoc --list-highlight-languages         # 列出支持的高亮语言
pandoc --list-highlight-styles            # 列出高亮主题
pandoc -D FORMAT                          # 打印默认模板
pandoc --print-default-data-file=FILE     # 打印默认数据文件
pandoc --print-highlight-style=STYLE      # 打印高亮样式定义
```

---

## 支持的语言高亮

共支持 **163** 种语言，以下为常用语言：

### 通用语言

`bash`, `c`, `cpp`, `cs`, `go`, `java`, `javascript`, `json`, `kotlin`, `lua`, `perl`, `php`, `python`, `ruby`, `rust`, `sql`, `swift`, `typescript`, `xml`, `yaml`

### Web 前端

`html`, `css`, `scss`, `less`, `jsx`, `tsx`, `vue`, `svelte`, `graphql`

### 数据与配置

`dockerfile`, `toml`, `ini`, `makefile`, `cmake`, `diff`, `regex`, `protobuf`, `avro`

### 函数式与学术

`haskell`, `scala`, `clojure`, `elixir`, `erlang`, `ocaml`, `fsharp`, `r`, `julia`, `matlab`, `latex`, `tex`

### 查看完整列表

```bash
pandoc --list-highlight-languages | tr ',' '\n' | sed 's/^ //'
```

---

## 高亮主题

| 主题 | 风格 |
|------|------|
| `pygments` | 经典 Pygments 风格 |
| `tango` | 柔和彩色 |
| `espresso` | 暗色 Espresso |
| `zenburn` | 暗色 Zenburn |
| `kate` | Kate 编辑器风格 |
| `monochrome` | 无彩色 |
| `breezedark` | KDE Breeze 暗色 |
| `haddock` | Haddock 风格 |

### 使用示例

```bash
pandoc input.md -o output.html --highlight-style=zenburn -s
```

### 查看主题定义

```bash
pandoc --print-highlight-style=tango
```

---

## 常用命令示例

### 格式转换

```bash
# Markdown → HTML（独立文档，带目录）
pandoc input.md -o output.html -s --toc --toc-depth=3 -V lang=zh-CN

# Markdown → PDF（中文支持）
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V CJKmainfont="PingFang SC" \
  -V geometry:margin=2.5cm \
  -N --toc

# Markdown → Word
pandoc input.md -o output.docx -s

# Word → Markdown
pandoc input.docx -t gfm -o output.md

# HTML → Markdown
pandoc input.html -t gfm --wrap=none -o output.md

# Markdown → EPUB
pandoc ch1.md ch2.md ch3.md -o book.epub \
  -s --toc --epub-cover-image=cover.jpg \
  -M title="书名" -M author="作者"

# Markdown → 纯文本（去除格式）
pandoc input.md -t plain -o output.txt --wrap=none

# Jupyter Notebook → Markdown
pandoc notebook.ipynb -t markdown -o output.md

# Markdown →reveal.js 幻灯片
pandoc slides.md -o presentation.html \
  -t revealjs -V theme=moon --slide-level=2

# CSV → Markdown 表格
pandoc data.csv -t markdown -o table.md
```

### 高级用法

```bash
# 使用参考文档样式（继承 Word 模板样式）
pandoc input.md -o output.docx --reference-doc=template.docx

# 自定义模板
pandoc input.md -o output.html --template=mytemplate.html -s

# 多个 Lua 过滤器
pandoc input.md --lua-filter=f1.lua --lua-filter=f2.lua -o output.html

# 使用 defaults 文件
pandoc -d defaults.yaml input.md -o output.html

# 合并多个 Markdown 文件为一个 PDF
pandoc part1.md part2.md part3.md \
  -o combined.pdf \
  --pdf-engine=xelatex \
  -V CJKmainfont="PingFang SC" \
  -s -N --toc

# 生成带数学公式的 HTML（KaTeX）
pandoc math.md -o output.html -s --katex

# 网页转 Markdown（从 URL）
curl -sL https://example.com | pandoc -f html -t gfm -o page.md

# 批量转换
for f in *.md; do pandoc "$f" -o "${f%.md}.html" -s --toc; done
```

### 参考文献处理

```bash
pandoc paper.md -o output.pdf \
  --citeproc \
  --bibliography=references.bib \
  --csl=apa-7th.csl \
  --pdf-engine=xelatex
```
