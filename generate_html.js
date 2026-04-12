const fs = require('fs');
const path = require('path');

// 简单的 markdown 转换器
function markdownToHtml(markdown) {
  let html = markdown;
  
  // 先生成目录映射（标题到ID）
  const headingMap = new Map();
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // 支持中文的 ID 生成：保留中文字符、字母、数字、连字符
    const id = text.toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/gi, '')  // 只保留中文、字母、数字、空格、连字符
      .replace(/\s+/g, '-');  // 空格替换为连字符
    headingMap.set(text, id);
  }
  
  // 替换标题（中文内容特殊处理）
  html = html.replace(/^### (.*$)/gim, (match, text) => {
    let id = headingMap.get(text);
    if (!id) {
      id = text.toLowerCase()
        .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '-');
    }
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.*$)/gim, (match, text) => {
    let id = headingMap.get(text);
    if (!id) {
      id = text.toLowerCase()
        .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '-');
    }
    return `<h2 id="${id}">${text}</h2>`;
  });
  html = html.replace(/^# (.*$)/gim, (match, text) => {
    return `<h1>${text}</h1>`;
  });
  
  // 粗体和斜体
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // 代码块
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // 表格
  html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
    const headers = header.split('|').map(h => h.trim()).filter(h => h);
    const bodyRows = rows.trim().split('\n').map(row => {
      const cells = row.split('|').map(c => c.trim()).filter(c => c);
      return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    }).join('');
    return `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  });
  
  // 列表
  html = html.replace(/^\s*- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // 引用
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // 水平线
  html = html.replace(/^---$/gim, '<hr>');
  
  // 段落
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/^(.+)$/gim, '<p>$1</p>');
  
  // 清理多余的p标签
  html = html.replace(/<p>(<[hluo]|\s*<)/g, '$1');
  html = html.replace(/(<\/[hluo]>|<hr>)<\/p>/g, '$1');
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
}

// 生成目录
function generateToc(markdown) {
  const toc = [];
  const lines = markdown.split('\n');
  lines.forEach(line => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      // 使用与 markdownToHtml 相同的 ID 生成逻辑，支持中文
      const id = text.toLowerCase()
        .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '-');
      toc.push({ level, text, id });
    }
  });
  return toc;
}

// Claude 风格模板
function claudeTemplate(content, toc, title) {
  const tocHtml = toc.map(item => {
    const indent = item.level === 2 ? '' : 'style="padding-left: 1rem;"';
    return `<a href="#${item.id}" ${indent}>${item.text}</a>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Claude Style</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-bg: #faf9f7;
      --color-text: #1a1a1a;
      --color-accent: #d97757;
      --color-accent-light: #f5e9e4;
      --color-border: rgba(0,0,0,0.08);
      --color-code-bg: #f5f5f0;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
      font-size: 16px;
    }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar {
      width: 280px;
      padding: 2rem 1.5rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      border-right: 1px solid var(--color-border);
      background: #fff;
    }
    .sidebar h2 {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    .sidebar a {
      display: block;
      padding: 0.5rem 0;
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
      border-left: 2px solid transparent;
      padding-left: 0.75rem;
      margin-left: -0.75rem;
      transition: all 0.2s;
    }
    .sidebar a:hover {
      color: var(--color-accent);
      border-left-color: var(--color-accent);
    }
    .main {
      flex: 1;
      padding: 3rem 4rem;
      max-width: 900px;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: var(--color-text);
      letter-spacing: -0.02em;
    }
    h2 {
      font-size: 1.75rem;
      font-weight: 600;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: var(--color-text);
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--color-accent);
    }
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      color: var(--color-text);
    }
    p { margin-bottom: 1rem; }
    code {
      font-family: 'SF Mono', Monaco, monospace;
      background: var(--color-code-bg);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
      color: var(--color-accent);
    }
    pre {
      background: var(--color-code-bg);
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
      border-left: 4px solid var(--color-accent);
    }
    pre code {
      background: none;
      padding: 0;
      color: var(--color-text);
      font-size: 0.875rem;
      line-height: 1.7;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.9rem;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    th {
      font-weight: 600;
      background: var(--color-accent-light);
      color: var(--color-accent);
    }
    blockquote {
      border-left: 4px solid var(--color-accent);
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: #666;
      font-style: italic;
    }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>目录</h2>
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
</body>
</html>`;
}

// Figma 风格
function figmaTemplate(content, toc, title) {
  const tocHtml = toc.map(item => {
    const indent = item.level === 2 ? '' : 'style="padding-left: 1rem;"';
    return `<a href="#${item.id}" ${indent}>${item.text}</a>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Figma Style</title>
  <style>
    :root {
      --color-bg: #ffffff;
      --color-text: #000000;
      --color-accent: #ff4b25;
      --color-border: rgba(0,0,0,0.1);
      --color-code-bg: #f5f5f5;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.5;
      font-size: 16px;
    }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar {
      width: 260px;
      padding: 2rem 1.5rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      background: #fff;
      border-right: 1px solid var(--color-border);
    }
    .sidebar h2 {
      font-size: 0.75rem;
      font-weight: 700;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }
    .sidebar a {
      display: block;
      padding: 0.5rem 1rem;
      color: #666;
      text-decoration: none;
      font-size: 0.875rem;
      border-radius: 50px;
      margin-bottom: 0.25rem;
      transition: all 0.15s;
    }
    .sidebar a:hover {
      background: #000;
      color: #fff;
    }
    .main {
      flex: 1;
      padding: 3rem 4rem;
      max-width: 900px;
    }
    h1 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      letter-spacing: -0.03em;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
    }
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    p { margin-bottom: 1rem; }
    code {
      font-family: 'SF Mono', Monaco, monospace;
      background: var(--color-code-bg);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.875em;
    }
    pre {
      background: #000;
      color: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    pre code {
      background: none;
      color: #fff;
      font-size: 0.875rem;
      line-height: 1.6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.875rem;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    th { font-weight: 600; background: #f9f9f9; }
    blockquote {
      border-left: 3px solid #000;
      padding-left: 1rem;
      margin: 1.5rem 0;
      font-style: italic;
    }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: #000; text-decoration: underline; text-underline-offset: 3px; }
    a:hover { color: var(--color-accent); }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>Contents</h2>
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
</body>
</html>`;
}

// SpaceX 风格
function spacexTemplate(content, toc, title) {
  const tocHtml = toc.map(item => {
    const indent = item.level === 2 ? '' : 'style="padding-left: 1rem;"';
    return `<a href="#${item.id}" ${indent}>${item.text}</a>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - SpaceX Style</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
    :root {
      --color-bg: #000000;
      --color-text: #f0f0fa;
      --color-accent: #fff;
      --color-border: rgba(240,240,250,0.2);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Rajdhani', sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.4;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar {
      width: 300px;
      padding: 2rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      background: linear-gradient(180deg, rgba(20,20,30,0.9) 0%, rgba(0,0,0,1) 100%);
      border-right: 1px solid var(--color-border);
    }
    .sidebar h2 {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
      letter-spacing: 0.1em;
      margin-bottom: 1.5rem;
      opacity: 0.7;
    }
    .sidebar a {
      display: block;
      padding: 0.75rem 0;
      color: rgba(240,240,250,0.6);
      text-decoration: none;
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      transition: color 0.3s;
      border-bottom: 1px solid rgba(240,240,250,0.1);
    }
    .sidebar a:hover { color: var(--color-text); }
    .main {
      flex: 1;
      padding: 4rem;
      max-width: 1000px;
      background: radial-gradient(ellipse at top, rgba(30,30,50,0.5) 0%, transparent 50%);
    }
    h1 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 2rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 3rem;
      margin-bottom: 1rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: rgba(240,240,250,0.9);
    }
    h3 {
      font-size: 1.125rem;
      font-weight: 500;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: rgba(240,240,250,0.8);
    }
    p {
      margin-bottom: 1.25rem;
      text-transform: none;
      letter-spacing: normal;
      line-height: 1.6;
      color: rgba(240,240,250,0.8);
    }
    code {
      font-family: 'SF Mono', monospace;
      background: rgba(240,240,250,0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85em;
      text-transform: none;
      letter-spacing: normal;
      color: var(--color-text);
    }
    pre {
      background: rgba(240,240,250,0.05);
      border: 1px solid var(--color-border);
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    pre code {
      background: none;
      font-size: 0.85rem;
      line-height: 1.7;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.875rem;
      text-transform: none;
      letter-spacing: normal;
    }
    th, td {
      padding: 0.875rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    th {
      font-weight: 600;
      color: var(--color-text);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    td { color: rgba(240,240,250,0.7); }
    blockquote {
      border-left: 2px solid var(--color-text);
      padding-left: 1.5rem;
      margin: 1.5rem 0;
      font-style: italic;
      text-transform: none;
      letter-spacing: normal;
      color: rgba(240,240,250,0.6);
    }
    ul { margin: 1rem 0; padding-left: 1.5rem; text-transform: none; letter-spacing: normal; }
    li { margin: 0.5rem 0; color: rgba(240,240,250,0.8); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2.5rem 0; }
    a { color: var(--color-text); text-decoration: none; border-bottom: 1px solid rgba(240,240,250,0.3); }
    a:hover { border-bottom-color: var(--color-text); }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>Navigation</h2>
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
</body>
</html>`;
}

// Vercel 风格
function vercelTemplate(content, toc, title) {
  const tocHtml = toc.map(item => {
    const indent = item.level === 2 ? '' : 'style="padding-left: 1rem;"';
    return `<a href="#${item.id}" ${indent}>${item.text}</a>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Vercel Style</title>
  <style>
    :root {
      --color-bg: #ffffff;
      --color-text: #171717;
      --color-gray: #666;
      --color-border: rgba(0,0,0,0.08);
      --color-code-bg: #fafafa;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
      font-size: 16px;
    }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar {
      width: 280px;
      padding: 2rem 1.5rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      border-right: 1px solid var(--color-border);
      background: #fff;
    }
    .sidebar h2 {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-gray);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    .sidebar a {
      display: block;
      padding: 0.5rem 0;
      color: var(--color-gray);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.15s;
    }
    .sidebar a:hover { color: var(--color-text); }
    .main {
      flex: 1;
      padding: 3rem 4rem;
      max-width: 900px;
    }
    h1 {
      font-size: 3rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      letter-spacing: -0.03em;
    }
    h2 {
      font-size: 1.75rem;
      font-weight: 600;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code {
      font-family: 'SF Mono', Monaco, monospace;
      background: var(--color-code-bg);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.875em;
      color: var(--color-text);
    }
    pre {
      background: var(--color-code-bg);
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
    }
    pre code {
      background: none;
      padding: 0;
      font-size: 0.875rem;
      line-height: 1.7;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.9rem;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    th { font-weight: 600; background: #fafafa; }
    blockquote {
      border-left: 3px solid var(--color-text);
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: var(--color-gray);
    }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-text); text-decoration: underline; text-underline-offset: 2px; }
    a:hover { text-decoration-thickness: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>Documentation</h2>
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
</body>
</html>`;
}

// Cursor 风格
function cursorTemplate(content, toc, title) {
  const tocHtml = toc.map(item => {
    const indent = item.level === 2 ? '' : 'style="padding-left: 1rem;"';
    return `<a href="#${item.id}" ${indent}>${item.text}</a>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Cursor Style</title>
  <style>
    :root {
      --color-bg: #0d1117;
      --color-text: #e6edf3;
      --color-gray: #8b949e;
      --color-accent: #58a6ff;
      --color-border: rgba(139,148,158,0.2);
      --color-code-bg: #161b22;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
      font-size: 16px;
    }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar {
      width: 300px;
      padding: 2rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      background: #0d1117;
      border-right: 1px solid var(--color-border);
    }
    .sidebar h2 {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-gray);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }
    .sidebar a {
      display: block;
      padding: 0.5rem 0;
      color: var(--color-gray);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s;
    }
    .sidebar a:hover { color: var(--color-accent); }
    .main {
      flex: 1;
      padding: 3rem 4rem;
      max-width: 900px;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      background: linear-gradient(90deg, #58a6ff, #a371f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: var(--color-text);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.5rem;
    }
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: var(--color-text);
    }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code {
      font-family: 'SF Mono', Monaco, monospace;
      background: var(--color-code-bg);
      padding: 0.2rem 0.4rem;
      border-radius: 6px;
      font-size: 0.875em;
      color: var(--color-accent);
    }
    pre {
      background: var(--color-code-bg);
      padding: 1.25rem;
      border-radius: 12px;
      overflow-x: auto;
      margin: 1.5rem 0;
      border: 1px solid var(--color-border);
    }
    pre code {
      background: none;
      padding: 0;
      color: var(--color-text);
      font-size: 0.875rem;
      line-height: 1.7;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.875rem;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    th { font-weight: 600; color: var(--color-text); }
    blockquote {
      border-left: 4px solid var(--color-accent);
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: var(--color-gray);
    }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; color: var(--color-gray); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>Table of Contents</h2>
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
</body>
</html>`;
}

// Notion 风格
function notionTemplate(content, toc, title) {
  const tocHtml = toc.map(item => {
    const indent = item.level === 2 ? '' : 'style="padding-left: 1rem;"';
    return `<a href="#${item.id}" ${indent}>${item.text}</a>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Notion Style</title>
  <style>
    :root {
      --color-bg: #ffffff;
      --color-text: rgba(0,0,0,0.95);
      --color-gray: #615d59;
      --color-accent: #0075de;
      --color-border: rgba(0,0,0,0.1);
      --color-code-bg: #f6f5f4;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.5;
      font-size: 16px;
    }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar {
      width: 280px;
      padding: 2rem 1.5rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      background: #fff;
      border-right: 1px solid var(--color-border);
    }
    .sidebar h2 {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-gray);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    .sidebar a {
      display: block;
      padding: 0.5rem 0;
      color: var(--color-gray);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.15s;
    }
    .sidebar a:hover { color: var(--color-text); }
    .main {
      flex: 1;
      padding: 3rem 4rem;
      max-width: 900px;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: var(--color-text);
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: var(--color-text);
    }
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: var(--color-text);
    }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code {
      font-family: 'SF Mono', Monaco, monospace;
      background: var(--color-code-bg);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.875em;
      color: #eb5757;
    }
    pre {
      background: var(--color-code-bg);
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
      border: 1px solid var(--color-border);
    }
    pre code {
      background: none;
      padding: 0;
      color: var(--color-text);
      font-size: 0.875rem;
      line-height: 1.6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.9rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    th { font-weight: 600; background: var(--color-code-bg); }
    blockquote {
      border-left: 4px solid var(--color-accent);
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: var(--color-gray);
      font-style: italic;
    }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; color: var(--color-gray); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>Contents</h2>
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
</body>
</html>`;
}

// Stripe 风格
function stripeTemplate(content, toc, title) {
  const tocHtml = toc.map(item => {
    const indent = item.level === 2 ? '' : 'style="padding-left: 1rem;"';
    return `<a href="#${item.id}" ${indent}>${item.text}</a>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Stripe Style</title>
  <style>
    :root {
      --color-bg: #ffffff;
      --color-text: #061b31;
      --color-gray: #64748d;
      --color-accent: #533afd;
      --color-border: #e5edf5;
      --color-code-bg: #f6f9fc;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.5;
      font-size: 16px;
    }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar {
      width: 280px;
      padding: 2rem 1.5rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      background: #fff;
      border-right: 1px solid var(--color-border);
    }
    .sidebar h2 {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-gray);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }
    .sidebar a {
      display: block;
      padding: 0.5rem 0;
      color: var(--color-gray);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 400;
      transition: color 0.2s;
    }
    .sidebar a:hover { color: var(--color-accent); }
    .main {
      flex: 1;
      padding: 3rem 4rem;
      max-width: 900px;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 1.5rem;
      color: var(--color-text);
      letter-spacing: -0.02em;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 400;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: var(--color-text);
      letter-spacing: -0.01em;
    }
    h3 {
      font-size: 1.125rem;
      font-weight: 500;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: var(--color-text);
    }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code {
      font-family: 'SF Mono', Monaco, monospace;
      background: var(--color-code-bg);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.875em;
      color: var(--color-text);
    }
    pre {
      background: var(--color-code-bg);
      padding: 1.25rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1.5rem 0;
      box-shadow: rgba(50,50,93,0.1) 0px 15px 35px, rgba(0,0,0,0.07) 0px 5px 15px;
    }
    pre code {
      background: none;
      padding: 0;
      font-size: 0.875rem;
      line-height: 1.6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.9rem;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    th { font-weight: 500; color: var(--color-text); }
    blockquote {
      border-left: 4px solid var(--color-accent);
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: var(--color-gray);
      font-style: italic;
    }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; color: var(--color-gray); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>Documentation</h2>
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
</body>
</html>`;
}

// Linear 风格
function linearTemplate(content, toc, title) {
  const tocHtml = toc.map(item => {
    const indent = item.level === 2 ? '' : 'style="padding-left: 1rem;"';
    return `<a href="#${item.id}" ${indent}>${item.text}</a>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Linear Style</title>
  <style>
    :root {
      --color-bg: #ffffff;
      --color-text: #1a1a1a;
      --color-gray: #6b7280;
      --color-accent: #5e6ad2;
      --color-border: rgba(0,0,0,0.06);
      --color-code-bg: #f8f9fa;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
      font-size: 16px;
    }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar {
      width: 260px;
      padding: 2rem 1.5rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      background: #fff;
      border-right: 1px solid var(--color-border);
    }
    .sidebar h2 {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-gray);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    .sidebar a {
      display: block;
      padding: 0.5rem 0.75rem;
      color: var(--color-gray);
      text-decoration: none;
      font-size: 0.875rem;
      border-radius: 6px;
      transition: all 0.15s;
    }
    .sidebar a:hover {
      background: rgba(94,106,210,0.1);
      color: var(--color-accent);
    }
    .main {
      flex: 1;
      padding: 3rem 4rem;
      max-width: 900px;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      letter-spacing: -0.02em;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      letter-spacing: -0.01em;
    }
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code {
      font-family: 'SF Mono', Monaco, monospace;
      background: var(--color-code-bg);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.875em;
      color: var(--color-accent);
    }
    pre {
      background: var(--color-code-bg);
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
      border: 1px solid var(--color-border);
    }
    pre code {
      background: none;
      padding: 0;
      color: var(--color-text);
      font-size: 0.875rem;
      line-height: 1.6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.9rem;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    th { font-weight: 600; background: var(--color-code-bg); }
    blockquote {
      border-left: 3px solid var(--color-accent);
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: var(--color-gray);
    }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; color: var(--color-gray); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <h2>Navigation</h2>
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
</body>
</html>`;
}

// 主程序
const docsDir = '/Users/dawinyuan/Documents/coder/cli-hub/docs';
const htmlDir = '/Users/dawinyuan/Documents/coder/cli-hub/html';

// 文档到品牌风格的映射
const docStyles = {
  'claude-cli-reference.md': { template: claudeTemplate, style: 'Claude' },
  'cli-tools-inventory.md': { template: linearTemplate, style: 'Linear' },
  'design-skills-reference.md': { template: figmaTemplate, style: 'Figma' },
  'ffmpeg-cli-reference.md': { template: spacexTemplate, style: 'SpaceX' },
  'github-cli-reference.md': { template: vercelTemplate, style: 'Vercel' },
  'opencode-cli-reference.md': { template: cursorTemplate, style: 'Cursor' },
  'pandoc-cli-reference.md': { template: notionTemplate, style: 'Notion' },
  'playwright-cli-reference.md': { template: stripeTemplate, style: 'Stripe' }
};

// 确保html目录存在
if (!fs.existsSync(htmlDir)) {
  fs.mkdirSync(htmlDir, { recursive: true });
}

// 处理每个文档
Object.entries(docStyles).forEach(([filename, config]) => {
  const mdPath = path.join(docsDir, filename);
  if (!fs.existsSync(mdPath)) {
    console.log(`跳过: ${filename} (不存在)`);
    return;
  }
  
  const markdown = fs.readFileSync(mdPath, 'utf-8');
  const content = markdownToHtml(markdown);
  const toc = generateToc(markdown);
  const title = markdown.match(/^# (.+)$/m)?.[1] || filename;
  
  const html = config.template(content, toc, title);
  
  const htmlFilename = filename.replace('.md', '.html');
  const htmlPath = path.join(htmlDir, htmlFilename);
  fs.writeFileSync(htmlPath, html);
  
  console.log(`✓ 生成: ${htmlFilename} (${config.style} 风格)`);
});

console.log('\n全部生成完成！');
