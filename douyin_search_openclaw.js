const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COOKIES = [
  { name: 'sessionid', value: 'e87cbc5577dba7960571ad6cec54b2c9', domain: '.douyin.com', path: '/' },
  { name: 'sessionid_ss', value: 'e87cbc5577dba7960571ad6cec54b2c9', domain: '.douyin.com', path: '/' },
  { name: 'passport_csrf_token', value: '0003909eadd8467b892761ae236db9b9', domain: '.douyin.com', path: '/' },
  { name: 'sid_guard', value: 'e87cbc5577dba7960571ad6cec54b2c9%7C1776003374%7C5183999%7CThu%2C+11-Jun-2026+14%3A16%3A13+GMT', domain: '.douyin.com', path: '/' },
  { name: 'uid_tt', value: 'b281d6f57eec9071265eca0a7b61e9ec', domain: '.douyin.com', path: '/' },
  { name: 'odin_tt', value: 'c09cbce1fa7ce9e0c98e8e28d6d4d98542e8834a88a9ece4c3667b125f82afda79b000224f6ef298bafad94e430d9c1eeba520f0d6e12546c434a5b52bd', domain: '.douyin.com', path: '/' },
  { name: 'ttwid', value: '1%7CD5yJowvVU3bRNSQXMJOu9QlRSIY77FeXOhFLDYcgq5A%7C1749613319%7C5760f4aa1bbd78491b02e8e65e44bd23ad0a85081743fbc088dfef7beb96b408', domain: '.douyin.com', path: '/' },
  { name: 'ttwid', value: '1%7CZ_pc2ssE8TUEwdPeTQXH6fbZCCtoey_J19Sbwnbw9Dc%7C1752308355%7Cd7a79647e02e9be8bd8e9ad1c2aaa506c8cf8e9b86a53bd5eb647a01a1e0e681', domain: '.douyin.com', path: '/' },
  { name: 'ttwid', value: '1%7C-PrqNWMpNJ1wjq_fM6Rx_gBr3DmuqQax2FO2Yhj_g_8%7C1776003193%7C46428c612a52dabdb84efee74ab3259d61e77748cd35f2eabedb3a5303dcae20', domain: '.douyin.com', path: '/' },
];

const KEYWORD = 'openclaw';
const TARGET = 50;
const OUTPUT = path.join(__dirname, 'douyin_openclaw_videos.json');

function save(data) {
  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), 'utf-8');
}

function extractCards() {
  const ul = document.querySelector('[data-e2e="scroll-list"]');
  if (!ul) return [];
  const lis = ul.querySelectorAll('li');
  const cards = [];
  lis.forEach(li => {
    const card = li.querySelector('.search-result-card');
    if (!card) return;
    const a = card.querySelector('a[href*="/video/"]');
    if (!a) return;

    const href = a.getAttribute('href') || '';
    const videoId = href.match(/video\/(\d+)/)?.[1] || '';

    const titleEl = card.querySelector('.VDYK8Xd7');
    const title = titleEl?.textContent?.trim() || '';

    const authorEl = card.querySelector('.dW_QmDH1');
    const authorRaw = authorEl?.textContent?.trim() || '';
    const authorMatch = authorRaw.match(/@(.+?)(\d+[天小时分钟周月年前]+)$/);
    const author = authorMatch ? authorMatch[1] : authorRaw.replace(/^@/, '').replace(/\d+[天小时分钟周月年前]+$/, '').trim();
    const time = authorMatch ? authorMatch[2] : authorRaw.replace(/^@.+?/, '').trim();

    const likesEl = card.querySelector('.z2lFLtJ0 .cIiU4Muu') || card.querySelector('.z2lFLtJ0');
    const likes = likesEl?.textContent?.trim() || '';

    const durationEl = card.querySelector('.ckopQfVu');
    const duration = durationEl?.textContent?.trim() || '';

    if (title && videoId) {
      cards.push({
        title: title.substring(0, 300),
        author,
        likes,
        duration,
        time,
        videoId,
        url: `https://www.douyin.com/video/${videoId}`,
      });
    }
  });
  return cards;
}

async function writeToFeishu(videos) {
  const rows = videos.map(v => [
    v.title,
    v.author,
    v.likes,
    v.duration,
    v.time,
    v.url,
  ]);
  const data = JSON.stringify(rows);
  const title = `抖音搜索 - ${KEYWORD} (${new Date().toLocaleDateString('zh-CN')})`;
  console.log('正在写入飞书表格...');
  try {
    const result = execSync(
      `lark-cli sheets +create --title "${title}" --headers '["视频标题","作者","点赞数","时长","发布时间","链接"]' --data '${data}'`,
      { encoding: 'utf-8', timeout: 30000 }
    );
    const res = JSON.parse(result);
    if (res.ok) {
      console.log(`\n飞书表格已创建: ${res.data.url}`);
    } else {
      console.error('写入飞书失败:', JSON.stringify(res));
    }
  } catch (err) {
    console.error('飞书写入异常:', err.message);
  }
}

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  });
  await ctx.addCookies(COOKIES);
  const page = await ctx.newPage();

  const searchUrl = `https://www.douyin.com/search/${encodeURIComponent(KEYWORD)}?type=video`;
  console.log(`打开抖音搜索: ${KEYWORD}`);
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);

  const allVideos = [];
  const seenIds = new Set();
  let noNewCount = 0;

  for (let scroll = 0; scroll < 30 && allVideos.length < TARGET; scroll++) {
    const cards = await page.evaluate(extractCards);
    let newCount = 0;
    for (const card of cards) {
      if (!seenIds.has(card.videoId)) {
        seenIds.add(card.videoId);
        allVideos.push(card);
        newCount++;
        console.log(`[${allVideos.length}/${TARGET}] ${card.title.substring(0, 50)}... (赞:${card.likes} @${card.author})`);
      }
    }

    if (newCount === 0) {
      noNewCount++;
      if (noNewCount >= 5) {
        console.log('连续多次无新数据，停止滚动');
        break;
      }
    } else {
      noNewCount = 0;
    }

    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(2000 + Math.floor(Math.random() * 1500));
  }

  save(allVideos);
  console.log(`\n共提取 ${allVideos.length} 个视频，已保存到 ${OUTPUT}`);

  if (allVideos.length > 0) {
    await writeToFeishu(allVideos);
  }

  await browser.close().catch(() => {});
})().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
