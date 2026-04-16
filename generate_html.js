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

// 共享的粘性标题 + 返回按钮 + 导航 CSS（桌面端常驻侧边栏 + 移动端抽屉）
function sharedDrawerCss() {
  return `
    /* 桌面端：菜单按钮和遮罩层隐藏 */
    .drawer-toggle { display: none; }
    .overlay { display: none; }
    /* 粘性标题 */
    .sticky-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--color-bg, #fff);
      padding: 12px 1.5rem;
      margin: 0 -4rem 1.5rem;
      border-bottom: 1px solid var(--color-border);
      display: none;
    }
    .sticky-header.visible { display: block; }
    .sticky-header h1 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sidebar-search {
      width: 100%;
      padding: 8px 12px;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: var(--color-bg, #fff);
      color: var(--color-text);
    }
    .sidebar-search:focus {
      outline: 2px solid var(--color-accent, #333);
      outline-offset: 1px;
    }
    .search-highlight {
      background: rgba(255, 193, 7, 0.35);
      border-radius: 2px;
      padding: 0 2px;
    }
    .search-highlight-current {
      background: rgba(255, 165, 0, 0.75);
      border-radius: 2px;
      padding: 0 2px;
    }
    .search-controls {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: -0.25rem 0 0.75rem;
      font-size: 0.75rem;
      color: var(--color-secondary, #666);
    }
    .search-controls button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      padding: 0;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background: var(--color-bg, #fff);
      color: var(--color-text);
      cursor: pointer;
      font-size: 0.75rem;
      line-height: 1;
    }
    .search-controls button:hover {
      border-color: var(--color-accent, #333);
    }
    .search-controls button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .search-controls span {
      min-width: 2.5em;
      text-align: center;
    }
    .sticky-header-inner { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .sticky-header h1 { flex: 1; }
    .sticky-header-search-btn { background: transparent; border: none; font-size: 1rem; cursor: pointer; padding: 4px; line-height: 1; }
    .sticky-header-search { display: flex; align-items: center; gap: 6px; flex: 1; }
    .sticky-search-input { flex: 1; padding: 6px 10px; font-size: 0.875rem; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-bg, #fff); color: var(--color-text); }
    .sticky-search-prev, .sticky-search-next, .sticky-search-close { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; padding: 0; font-size: 0.75rem; border: 1px solid var(--color-border); border-radius: 4px; background: var(--color-bg, #fff); color: var(--color-text); cursor: pointer; }
    @media (min-width: 769px) { .sticky-header-search-btn { display: none; } }
    @media (max-width: 768px) { .sidebar .sidebar-search, .sidebar .search-controls { display: none !important; } }`;
}

// 桌面端侧边栏：sticky 常驻
function sharedSidebarOverrides() {
  return `
    .sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
    }
    .sidebar-back {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      margin-bottom: 1rem;
      color: #666;
      text-decoration: none;
      font-size: 0.8125rem;
      font-weight: 500;
      border-radius: 8px;
      border: 1px solid var(--color-border);
      transition: all 0.2s;
    }
    .sidebar-back:hover {
      color: var(--color-accent, #333);
      border-color: var(--color-accent, #333);
    }
    .sidebar nav { display: flex; flex-direction: column; gap: 2px; }`;
}

// 移动端响应式：抽屉菜单 + 菜单按钮 + 遮罩层
function sharedMobileCss() {
  return `
    @media (max-width: 768px) {
      .container { flex-direction: column; }
      /* 移动端：侧边栏变为抽屉 */
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 280px;
        height: 100vh;
        z-index: 1000;
        padding: 1.5rem;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: none;
      }
      .sidebar.open {
        transform: translateX(0);
        box-shadow: 4px 0 24px rgba(0,0,0,0.1);
      }
      /* 移动端：显示菜单按钮 */
      .drawer-toggle {
        display: flex;
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 1100;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: 1px solid var(--color-border);
        background: var(--color-bg, #fff);
        cursor: pointer;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        transition: all 0.2s;
      }
      .drawer-toggle:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .drawer-toggle svg { transition: transform 0.3s ease; }
      .drawer-toggle.active svg { transform: rotate(180deg); }
      /* 移动端：显示遮罩层 */
      .overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.2);
        z-index: 999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
      }
      .overlay.active {
        opacity: 1;
        pointer-events: auto;
      }
      /* 移动端粘性标题：左侧留出菜单按钮空间 */
      .sticky-header { position: fixed; top: 0; left: 0; right: 0; margin: 0; padding: 12px 1rem 12px 64px; display: block; background: var(--color-bg, #fff); border-bottom: 1px solid var(--color-border); }
      .main { padding: 5rem 1.5rem 2rem; }
      h1 { font-size: 1.75rem; }
      h2 { font-size: 1.375rem; }
      pre { padding: 1rem; font-size: 0.8125rem; }
      table { font-size: 0.8125rem; display: block; overflow-x: auto; }
      th, td { padding: 0.5rem; min-width: 60px; }
      .sticky-search-input { font-size: 16px; }
    }
    @media (max-width: 480px) {
      .main { padding: 4.5rem 1rem 1.5rem; }
      h1 { font-size: 1.5rem; }
      h2 { font-size: 1.25rem; }
      pre { padding: 0.75rem; font-size: 0.75rem; border-radius: 6px; }
      code { font-size: 0.8125rem; }
      table { font-size: 0.75rem; }
      .sticky-search-prev, .sticky-search-next, .sticky-search-close { width: 28px; height: 28px; }
    }`;
}

// 共享的 HTML（抽屉按钮 + 遮罩层 + 返回按钮 + JS）
function sharedDrawerHtml() {
  return `
  <button class="drawer-toggle" id="drawerToggle" onclick="toggleDrawer()" title="打开目录">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
  <div class="overlay" id="overlay" onclick="toggleDrawer()"></div>
  <script>
    function toggleDrawer() {
      var s = document.querySelector('.sidebar');
      var o = document.getElementById('overlay');
      var t = document.getElementById('drawerToggle');
      s.classList.toggle('open');
      o.classList.toggle('active');
      t.classList.toggle('active');
    }
    // 点击侧边栏链接后自动关闭抽屉
    document.querySelectorAll('.sidebar nav a').forEach(function(a) {
      a.addEventListener('click', function() {
        if (document.querySelector('.sidebar').classList.contains('open')) toggleDrawer();
      });
    });
    // 粘性标题
    (function() {
      var h1el = document.querySelector('.main > h1');
      if (!h1el) return;
      var title = h1el.textContent;
      var header = document.createElement('div');
      header.className = 'sticky-header';
      header.innerHTML = '<div class="sticky-header-inner"><h1>' + title + '</h1><button class="sticky-header-search-btn" title="搜索">&#128269;</button><div class="sticky-header-search" style="display:none;"><input type="search" class="sticky-search-input" id="stickySearchInput" placeholder="搜索页面内容..." autocomplete="off"><button class="sticky-search-prev" id="stickySearchPrev">&#60;</button><span class="sticky-search-count" id="stickySearchCount">0/0</span><button class="sticky-search-next" id="stickySearchNext">&#62;</button><button class="sticky-search-close" id="stickySearchClose">&#10005;</button></div></div>';
      h1el.parentNode.insertBefore(header, h1el.nextSibling);
      window.addEventListener('scroll', function() {
        if (window.innerWidth <= 768) return;
        var rect = h1el.getBoundingClientRect();
        header.classList.toggle('visible', rect.bottom < 0);
      }, { passive: true });
    })();
    // 页面内搜索
    (function() {
      var main = document.querySelector('.main');
      var currentIndex = 0;
      var highlights = [];
      var desktopInput = document.getElementById('pageSearch');
      var desktopControls = document.getElementById('searchControls');
      var desktopCount = document.getElementById('searchCount');
      var desktopPrev = document.getElementById('searchPrev');
      var desktopNext = document.getElementById('searchNext');
      var stickyInput = document.getElementById('stickySearchInput');
      var stickyControls = document.querySelector('.sticky-header-search');
      var stickyCount = document.getElementById('stickySearchCount');
      var stickyPrev = document.getElementById('stickySearchPrev');
      var stickyNext = document.getElementById('stickySearchNext');
      var stickyClose = document.getElementById('stickySearchClose');
      var stickyBtn = document.querySelector('.sticky-header-search-btn');
      var stickyTitle = document.querySelector('.sticky-header h1');
      function isMobile() { return window.innerWidth <= 768; }
      function getInput() { return isMobile() ? stickyInput : desktopInput; }
      function getControls() { return isMobile() ? stickyControls : desktopControls; }
      function getCount() { return isMobile() ? stickyCount : desktopCount; }
      function getPrev() { return isMobile() ? stickyPrev : desktopPrev; }
      function getNext() { return isMobile() ? stickyNext : desktopNext; }
      if (stickyBtn && stickyControls && stickyTitle && stickyInput) {
        stickyBtn.addEventListener('click', function() {
          stickyTitle.style.display = 'none';
          stickyBtn.style.display = 'none';
          stickyControls.style.display = 'flex';
          stickyInput.focus();
        });
        if (stickyClose) {
          stickyClose.addEventListener('click', function() {
            clearHighlights();
            stickyControls.style.display = 'none';
            stickyTitle.style.display = 'block';
            stickyBtn.style.display = 'inline-block';
            stickyInput.value = '';
            if (desktopInput) desktopInput.value = '';
          });
        }
      }
      function clearHighlights() {
        document.querySelectorAll('.search-highlight, .search-highlight-current').forEach(function(el) {
          var parent = el.parentNode;
          parent.replaceChild(document.createTextNode(el.textContent), el);
          parent.normalize();
        });
        highlights = [];
        currentIndex = 0;
        var controls = getControls();
        if (controls) controls.style.display = 'none';
      }
      function updateUI() {
        var controls = getControls();
        var countEl = getCount();
        var prevBtn = getPrev();
        var nextBtn = getNext();
        if (!highlights.length) {
          if (controls) controls.style.display = 'none';
          return;
        }
        if (countEl) countEl.textContent = (currentIndex + 1) + '/' + highlights.length;
        if (controls) controls.style.display = 'flex';
        if (prevBtn) prevBtn.disabled = currentIndex <= 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= highlights.length - 1;
        highlights.forEach(function(el, i) {
          el.className = i === currentIndex ? 'search-highlight-current' : 'search-highlight';
        });
        if (isMobile()) {
          var el = highlights[currentIndex];
          var headerHeight = document.querySelector('.sticky-header') ? document.querySelector('.sticky-header').offsetHeight : 56;
          var top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
          window.scrollTo({ top: top, behavior: 'smooth' });
        } else {
          highlights[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      function goTo(delta) {
        if (!highlights.length) return;
        currentIndex = Math.max(0, Math.min(highlights.length - 1, currentIndex + delta));
        updateUI();
      }
      function performSearch(srcInput) {
        clearHighlights();
        var query = srcInput.value.trim();
        if (!query) return;
        var regex = new RegExp('(' + query.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&') + ')', 'gi');
        var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, null, false);
        var nodes = [];
        var node;
        while (node = walker.nextNode()) {
          if (node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE' && regex.test(node.textContent)) {
            nodes.push(node);
          }
        }
        var controls = getControls();
        var countEl = getCount();
        var prevBtn = getPrev();
        var nextBtn = getNext();
        if (!nodes.length) {
          if (controls) controls.style.display = 'flex';
          if (countEl) countEl.textContent = '0/0';
          if (prevBtn) prevBtn.disabled = true;
          if (nextBtn) nextBtn.disabled = true;
          return;
        }
        nodes.forEach(function(n) {
          var span = document.createElement('span');
          span.innerHTML = n.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
          var frag = document.createDocumentFragment();
          while (span.firstChild) frag.appendChild(span.firstChild);
          n.parentNode.replaceChild(frag, n);
        });
        highlights = Array.prototype.slice.call(document.querySelectorAll('.search-highlight'));
        currentIndex = 0;
        updateUI();
      }
      function bindInput(input) {
        if (!input) return;
        input.addEventListener('input', function() {
          performSearch(input);
          var other = input.id === 'pageSearch' ? stickyInput : desktopInput;
          if (other && other.value !== input.value) other.value = input.value;
        });
      }
      bindInput(desktopInput);
      bindInput(stickyInput);
      function bindNav(btn, delta) { if (btn) btn.addEventListener('click', function() { goTo(delta); }); }
      bindNav(desktopPrev, -1); bindNav(desktopNext, 1);
      bindNav(stickyPrev, -1); bindNav(stickyNext, 1);
      function onKey(e) { if (e.key === 'Enter') { e.preventDefault(); if (e.shiftKey) goTo(-1); else goTo(1); } }
      if (desktopInput) desktopInput.addEventListener('keydown', onKey);
      if (stickyInput) stickyInput.addEventListener('keydown', onKey);
    })();
  </script>`;
}

// 返回按钮 HTML
function sidebarBackLink() {
  return `<a href="./index.html" class="sidebar-back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        返回文档列表
      </a>`;
}

// 搜索框 HTML
function sidebarSearchHtml() {
  return `<input type="search" class="sidebar-search" id="pageSearch" placeholder="搜索页面内容..." autocomplete="off">
      <div class="search-controls" id="searchControls" style="display:none;">
        <button id="searchPrev" title="上一个 (Shift+Enter)">&#8593;</button>
        <span id="searchCount">0/0</span>
        <button id="searchNext" title="下一个 (Enter)">&#8595;</button>
      </div>`;
}

// favicon
const favicon = '<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect rx=%2212%22 width=%22100%22 height=%22100%22 fill=%22%231a1a2e%22/><text x=%2250%22 y=%2268%22 font-size=%2255%22 font-family=%22monospace%22 font-weight=%22bold%22 text-anchor=%22middle%22 fill=%22%2300d4aa%22>&gt;_</text></svg>">';

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
  ${favicon}
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
      padding: 1.5rem;
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
      padding: 0.4rem 0.75rem;
      color: #666;
      text-decoration: none;
      font-size: 0.875rem;
      border-radius: 6px;
      transition: all 0.15s;
    }
    .sidebar a:hover {
      color: var(--color-accent);
      background: rgba(0,0,0,0.03);
    }
    .main {
      flex: 1;
      padding: 3.75rem 4rem 3rem;
      max-width: 900px;
    }
    h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--color-text); letter-spacing: -0.02em; }
    h2 { font-size: 1.75rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1rem; color: var(--color-text); padding-bottom: 0.5rem; border-bottom: 2px solid var(--color-accent); }
    h3 { font-size: 1.25rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; color: var(--color-text); }
    p { margin-bottom: 1rem; }
    code { font-family: 'SF Mono', Monaco, monospace; background: var(--color-code-bg); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: var(--color-accent); }
    pre { background: var(--color-code-bg); padding: 1.25rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; border-left: 4px solid var(--color-accent); }
    pre code { background: none; padding: 0; color: var(--color-text); font-size: 0.875rem; line-height: 1.7; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-border); }
    th { font-weight: 600; background: var(--color-accent-light); color: var(--color-accent); }
    blockquote { border-left: 4px solid var(--color-accent); padding-left: 1rem; margin: 1.5rem 0; color: #666; font-style: italic; }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    ${sharedDrawerCss()}
    .drawer-toggle { background: #fff; }
    ${sharedSidebarOverrides()}
    ${sharedMobileCss()}
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      ${sidebarBackLink()}
      <h2>目录</h2>
      ${sidebarSearchHtml()}
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
  ${sharedDrawerHtml()}
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
  ${favicon}
  <style>
    :root {
      --color-bg: #ffffff;
      --color-text: #000000;
      --color-accent: #ff4b25;
      --color-border: rgba(0,0,0,0.1);
      --color-code-bg: #f5f5f5;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--color-bg); color: var(--color-text); line-height: 1.5; font-size: 16px; }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar { width: 260px; padding: 1.5rem; overflow-y: auto; background: #fff; border-right: 1px solid var(--color-border); }
    .sidebar h2 { font-size: 0.75rem; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
    .sidebar a { display: block; padding: 0.5rem 1rem; color: #666; text-decoration: none; font-size: 0.875rem; border-radius: 50px; margin-bottom: 0.25rem; transition: all 0.15s; }
    .sidebar a:hover { background: #000; color: #fff; }
    .main { flex: 1; padding: 3.75rem 4rem 3rem; max-width: 900px; }
    h1 { font-size: 3rem; font-weight: 700; margin-bottom: 1.5rem; letter-spacing: -0.03em; }
    h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; }
    h3 { font-size: 1.125rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    p { margin-bottom: 1rem; }
    code { font-family: 'SF Mono', Monaco, monospace; background: var(--color-code-bg); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.875em; }
    pre { background: #000; color: #fff; padding: 1.5rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; }
    pre code { background: none; color: #fff; font-size: 0.875rem; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-border); }
    th { font-weight: 600; background: #f9f9f9; }
    blockquote { border-left: 3px solid #000; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: #000; text-decoration: underline; text-underline-offset: 3px; }
    a:hover { color: var(--color-accent); }
    ${sharedDrawerCss()}
    .drawer-toggle { background: #fff; }
    ${sharedSidebarOverrides()}
    .sidebar-back { color: #666; }
    .sidebar-back:hover { color: var(--color-accent); border-color: var(--color-accent); }
    ${sharedMobileCss()}
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      ${sidebarBackLink()}
      <h2>Contents</h2>
      ${sidebarSearchHtml()}
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
  ${sharedDrawerHtml()}
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
  ${favicon}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
    :root {
      --color-bg: #000000;
      --color-text: #f0f0fa;
      --color-accent: #fff;
      --color-border: rgba(240,240,250,0.2);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Rajdhani', sans-serif; background: var(--color-bg); color: var(--color-text); line-height: 1.4; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar { width: 300px; padding: 1.5rem; overflow-y: auto; background: linear-gradient(180deg, rgba(20,20,30,0.9) 0%, rgba(0,0,0,1) 100%); border-right: 1px solid var(--color-border); }
    .sidebar h2 { font-size: 0.875rem; font-weight: 600; color: var(--color-text); letter-spacing: 0.1em; margin-bottom: 1.5rem; opacity: 0.7; }
    .sidebar a { display: block; padding: 0.75rem 0; color: rgba(240,240,250,0.6); text-decoration: none; font-size: 0.8rem; letter-spacing: 0.08em; transition: color 0.3s; border-bottom: 1px solid rgba(240,240,250,0.1); }
    .sidebar a:hover { color: var(--color-text); }
    .main { flex: 1; padding: 3.75rem 4rem 3rem; max-width: 1000px; background: radial-gradient(ellipse at top, rgba(30,30,50,0.5) 0%, transparent 50%); }
    h1 { font-size: 3rem; font-weight: 700; margin-bottom: 2rem; letter-spacing: 0.08em; text-transform: uppercase; }
    h2 { font-size: 1.5rem; font-weight: 600; margin-top: 3rem; margin-bottom: 1rem; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(240,240,250,0.9); }
    h3 { font-size: 1.125rem; font-weight: 500; margin-top: 2rem; margin-bottom: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(240,240,250,0.8); }
    p { margin-bottom: 1.25rem; text-transform: none; letter-spacing: normal; line-height: 1.6; color: rgba(240,240,250,0.8); }
    code { font-family: 'SF Mono', monospace; background: rgba(240,240,250,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.85em; text-transform: none; letter-spacing: normal; color: var(--color-text); }
    pre { background: rgba(240,240,250,0.05); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; }
    pre code { background: none; font-size: 0.85rem; line-height: 1.7; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem; text-transform: none; letter-spacing: normal; }
    th, td { padding: 0.875rem; text-align: left; border-bottom: 1px solid var(--color-border); }
    th { font-weight: 600; color: var(--color-text); text-transform: uppercase; letter-spacing: 0.05em; }
    td { color: rgba(240,240,250,0.7); }
    blockquote { border-left: 2px solid var(--color-text); padding-left: 1.5rem; margin: 1.5rem 0; font-style: italic; text-transform: none; letter-spacing: normal; color: rgba(240,240,250,0.6); }
    ul { margin: 1rem 0; padding-left: 1.5rem; text-transform: none; letter-spacing: normal; }
    li { margin: 0.5rem 0; color: rgba(240,240,250,0.8); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2.5rem 0; }
    a { color: var(--color-text); text-decoration: none; border-bottom: 1px solid rgba(240,240,250,0.3); }
    a:hover { border-bottom-color: var(--color-text); }
    ${sharedDrawerCss()}
    .drawer-toggle { background: rgba(20,20,30,0.9); border-color: var(--color-border); }
    .drawer-toggle:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
    .drawer-toggle svg { stroke: var(--color-text); }
    .sticky-header { background: #000; }
    .sticky-header h1 { color: var(--color-text); }
    ${sharedSidebarOverrides()}
    .sidebar-back { color: rgba(240,240,250,0.6); border-color: var(--color-border); }
    .sidebar-back:hover { color: var(--color-text); border-color: var(--color-text); }
    .sidebar-back svg { stroke: rgba(240,240,250,0.6); }
    ${sharedMobileCss()}
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      ${sidebarBackLink()}
      <h2>Navigation</h2>
      ${sidebarSearchHtml()}
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
  ${sharedDrawerHtml()}
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
  ${favicon}
  <style>
    :root {
      --color-bg: #ffffff;
      --color-text: #171717;
      --color-gray: #666;
      --color-border: rgba(0,0,0,0.08);
      --color-code-bg: #fafafa;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: var(--color-bg); color: var(--color-text); line-height: 1.6; font-size: 16px; }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar { width: 280px; padding: 1.5rem; overflow-y: auto; border-right: 1px solid var(--color-border); background: #fff; }
    .sidebar h2 { font-size: 0.75rem; font-weight: 600; color: var(--color-gray); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
    .sidebar a { display: block; padding: 0.5rem 0; color: var(--color-gray); text-decoration: none; font-size: 0.875rem; transition: color 0.15s; }
    .sidebar a:hover { color: var(--color-text); }
    .main { flex: 1; padding: 3.75rem 4rem 3rem; max-width: 900px; }
    h1 { font-size: 3rem; font-weight: 600; margin-bottom: 1.5rem; letter-spacing: -0.03em; }
    h2 { font-size: 1.75rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.02em; }
    h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code { font-family: 'SF Mono', Monaco, monospace; background: var(--color-code-bg); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.875em; color: var(--color-text); }
    pre { background: var(--color-code-bg); padding: 1.25rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04); }
    pre code { background: none; padding: 0; font-size: 0.875rem; line-height: 1.7; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; box-shadow: 0 0 0 1px rgba(0,0,0,0.08); border-radius: 8px; overflow: hidden; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.08); }
    th { font-weight: 600; background: #fafafa; }
    blockquote { border-left: 3px solid var(--color-text); padding-left: 1rem; margin: 1.5rem 0; color: var(--color-gray); }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-text); text-decoration: underline; text-underline-offset: 2px; }
    a:hover { text-decoration-thickness: 2px; }
    ${sharedDrawerCss()}
    .drawer-toggle { background: #fff; }
    ${sharedSidebarOverrides()}
    ${sharedMobileCss()}
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      ${sidebarBackLink()}
      <h2>Documentation</h2>
      ${sidebarSearchHtml()}
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
  ${sharedDrawerHtml()}
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
  ${favicon}
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; background: var(--color-bg); color: var(--color-text); line-height: 1.6; font-size: 16px; }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar { width: 300px; padding: 1.5rem; overflow-y: auto; background: #0d1117; border-right: 1px solid var(--color-border); }
    .sidebar h2 { font-size: 0.75rem; font-weight: 600; color: var(--color-gray); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
    .sidebar a { display: block; padding: 0.5rem 0; color: var(--color-gray); text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
    .sidebar a:hover { color: var(--color-accent); }
    .main { flex: 1; padding: 3.75rem 4rem 3rem; max-width: 900px; }
    h1 { font-size: 2.5rem; font-weight: 600; margin-bottom: 1.5rem; background: linear-gradient(90deg, #58a6ff, #a371f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1rem; color: var(--color-text); border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; }
    h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--color-text); }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code { font-family: 'SF Mono', Monaco, monospace; background: var(--color-code-bg); padding: 0.2rem 0.4rem; border-radius: 6px; font-size: 0.875em; color: var(--color-accent); }
    pre { background: var(--color-code-bg); padding: 1.25rem; border-radius: 12px; overflow-x: auto; margin: 1.5rem 0; border: 1px solid var(--color-border); }
    pre code { background: none; padding: 0; color: var(--color-text); font-size: 0.875rem; line-height: 1.7; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-border); }
    th { font-weight: 600; color: var(--color-text); }
    blockquote { border-left: 4px solid var(--color-accent); padding-left: 1rem; margin: 1.5rem 0; color: var(--color-gray); }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; color: var(--color-gray); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    ${sharedDrawerCss()}
    .drawer-toggle { background: #161b22; border-color: var(--color-border); }
    .drawer-toggle:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .drawer-toggle svg { stroke: var(--color-text); }
    .sticky-header { background: var(--color-bg); }
    .sticky-header h1 { color: var(--color-text); background: none; -webkit-text-fill-color: unset; }
    ${sharedSidebarOverrides()}
    .sidebar-back { color: var(--color-gray); border-color: var(--color-border); }
    .sidebar-back:hover { color: var(--color-accent); border-color: var(--color-accent); }
    ${sharedMobileCss()}
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      ${sidebarBackLink()}
      <h2>Table of Contents</h2>
      ${sidebarSearchHtml()}
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
  ${sharedDrawerHtml()}
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
  ${favicon}
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif; background: var(--color-bg); color: var(--color-text); line-height: 1.5; font-size: 16px; }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar { width: 280px; padding: 1.5rem; overflow-y: auto; background: #fff; border-right: 1px solid var(--color-border); }
    .sidebar h2 { font-size: 0.75rem; font-weight: 600; color: var(--color-gray); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
    .sidebar a { display: block; padding: 0.5rem 0; color: var(--color-gray); text-decoration: none; font-size: 0.875rem; transition: color 0.15s; }
    .sidebar a:hover { color: var(--color-text); }
    .main { flex: 1; padding: 3.75rem 4rem 3rem; max-width: 900px; }
    h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--color-text); }
    h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1rem; color: var(--color-text); }
    h3 { font-size: 1.125rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--color-text); }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code { font-family: 'SF Mono', Monaco, monospace; background: var(--color-code-bg); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.875em; color: #eb5757; }
    pre { background: var(--color-code-bg); padding: 1.25rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; border: 1px solid var(--color-border); }
    pre code { background: none; padding: 0; color: var(--color-text); font-size: 0.875rem; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); }
    th { font-weight: 600; background: var(--color-code-bg); }
    blockquote { border-left: 4px solid var(--color-accent); padding-left: 1rem; margin: 1.5rem 0; color: var(--color-gray); font-style: italic; }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; color: var(--color-gray); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    ${sharedDrawerCss()}
    .drawer-toggle { background: #fff; }
    ${sharedSidebarOverrides()}
    ${sharedMobileCss()}
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      ${sidebarBackLink()}
      <h2>Contents</h2>
      ${sidebarSearchHtml()}
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
  ${sharedDrawerHtml()}
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
  ${favicon}
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--color-bg); color: var(--color-text); line-height: 1.5; font-size: 16px; }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar { width: 280px; padding: 1.5rem; overflow-y: auto; background: #fff; border-right: 1px solid var(--color-border); }
    .sidebar h2 { font-size: 0.75rem; font-weight: 500; color: var(--color-gray); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
    .sidebar a { display: block; padding: 0.5rem 0; color: var(--color-gray); text-decoration: none; font-size: 0.875rem; font-weight: 400; transition: color 0.2s; }
    .sidebar a:hover { color: var(--color-accent); }
    .main { flex: 1; padding: 3.75rem 4rem 3rem; max-width: 900px; }
    h1 { font-size: 2.5rem; font-weight: 300; margin-bottom: 1.5rem; color: var(--color-text); letter-spacing: -0.02em; }
    h2 { font-size: 1.5rem; font-weight: 400; margin-top: 2.5rem; margin-bottom: 1rem; color: var(--color-text); letter-spacing: -0.01em; }
    h3 { font-size: 1.125rem; font-weight: 500; margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--color-text); }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code { font-family: 'SF Mono', Monaco, monospace; background: var(--color-code-bg); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.875em; color: var(--color-text); }
    pre { background: var(--color-code-bg); padding: 1.25rem; border-radius: 6px; overflow-x: auto; margin: 1.5rem 0; box-shadow: rgba(50,50,93,0.1) 0px 15px 35px, rgba(0,0,0,0.07) 0px 5px 15px; }
    pre code { background: none; padding: 0; font-size: 0.875rem; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); }
    th { font-weight: 500; color: var(--color-text); }
    blockquote { border-left: 4px solid var(--color-accent); padding-left: 1rem; margin: 1.5rem 0; color: var(--color-gray); font-style: italic; }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; color: var(--color-gray); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    ${sharedDrawerCss()}
    .drawer-toggle { background: #fff; }
    ${sharedSidebarOverrides()}
    ${sharedMobileCss()}
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      ${sidebarBackLink()}
      <h2>Documentation</h2>
      ${sidebarSearchHtml()}
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
  ${sharedDrawerHtml()}
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
  ${favicon}
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--color-bg); color: var(--color-text); line-height: 1.6; font-size: 16px; }
    .container { display: flex; max-width: 1400px; margin: 0 auto; }
    .sidebar { width: 260px; padding: 1.5rem; overflow-y: auto; background: #fff; border-right: 1px solid var(--color-border); }
    .sidebar h2 { font-size: 0.75rem; font-weight: 600; color: var(--color-gray); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
    .sidebar a { display: block; padding: 0.5rem 0.75rem; color: var(--color-gray); text-decoration: none; font-size: 0.875rem; border-radius: 6px; transition: all 0.15s; }
    .sidebar a:hover { background: rgba(94,106,210,0.1); color: var(--color-accent); }
    .main { flex: 1; padding: 3.75rem 4rem 3rem; max-width: 900px; }
    h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
    h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.01em; }
    h3 { font-size: 1.125rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    p { margin-bottom: 1rem; color: var(--color-gray); }
    code { font-family: 'SF Mono', Monaco, monospace; background: var(--color-code-bg); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.875em; color: var(--color-accent); }
    pre { background: var(--color-code-bg); padding: 1.25rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; border: 1px solid var(--color-border); }
    pre code { background: none; padding: 0; color: var(--color-text); font-size: 0.875rem; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); }
    th { font-weight: 600; background: var(--color-code-bg); }
    blockquote { border-left: 3px solid var(--color-accent); padding-left: 1rem; margin: 1.5rem 0; color: var(--color-gray); }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; color: var(--color-gray); }
    hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
    a { color: var(--color-accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    ${sharedDrawerCss()}
    .drawer-toggle { background: #fff; }
    ${sharedSidebarOverrides()}
    ${sharedMobileCss()}
  </style>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      ${sidebarBackLink()}
      <h2>Navigation</h2>
      ${sidebarSearchHtml()}
      <nav>${tocHtml}</nav>
    </aside>
    <main class="main">${content}</main>
  </div>
  ${sharedDrawerHtml()}
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
  'playwright-cli-reference.md': { template: stripeTemplate, style: 'Stripe' },
  'lark-cli-reference.md': { template: claudeTemplate, style: 'Claude' },
  'pencil-cli-reference.md': { template: vercelTemplate, style: 'Vercel' },
  'openclaw-cli-reference.md': { template: linearTemplate, style: 'Linear' },
  'openclaw-vs-hermes-comparison.md': { template: notionTemplate, style: 'Notion' },
  'hermes-cli-reference.md': { template: cursorTemplate, style: 'Cursor' },
  'granularity.md': { template: stripeTemplate, style: 'Stripe' },
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
