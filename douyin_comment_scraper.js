const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COOKIES = [
  { name: 'sessionid', value: 'e87cbc5577dba7960571ad6cec54b2c9', domain: '.douyin.com', path: '/' },
  { name: 'sessionid_ss', value: 'e87cbc5577dba7960571ad6cec54b2c9', domain: '.douyin.com', path: '/' },
  { name: 'passport_csrf_token', value: '0003909eadd8467b892761ae236db9b9', domain: '.douyin.com', path: '/' },
  { name: 'sid_guard', value: 'e87cbc5577dba7960571ad6cec54b2c9%7C1776003374%7C5183999%7CThu%2C+11-Jun-2026+14%3A16%3A13+GMT', domain: '.douyin.com', path: '/' },
  { name: 'uid_tt', value: 'b281d6f57eec9071265eca0a7b61e9ec', domain: '.douyin.com', path: '/' },
  { name: 'odin_tt', value: 'c09cbce1fa7ce9e0c98e8e28d6d4d98542d8409e8834a88a9ece4c3667b125f82afda79b000224f6ef298bafad94e430d9c1eeba520f0d6e12546c434a5b52bd', domain: '.douyin.com', path: '/' },
  { name: 'ttwid', value: '1%7CD5yJowvVU3bRNSQXMJOu9QlRSIY77FeXOhFLDYcgq5A%7C1749613319%7C5760f4aa1bbd78491b02e8e65e44bd23ad0a85081743fbc088dfef7beb96b408', domain: '.douyin.com', path: '/' },
  { name: 'ttwid', value: '1%7CZ_pc2ssE8TUEwdPeTQXH6fbZCCtoey_J19Sbwnbw9Dc%7C1752308355%7Cd7a79647e02e9be8bd8e9ad1c2aaa506c8cf8e9b86a53bd5eb647a01a1e0e681', domain: '.douyin.com', path: '/' },
  { name: 'ttwid', value: '1%7C-PrqNWMpNJ1wjq_fM6Rx_gBr3DmuqQax2FO2Yhj_g_8%7C1776003193%7C46428c612a52dabdb84efee74ab3259d61e77748cd35f2eabedb3a5303dcae20', domain: '.douyin.com', path: '/' },
];

const VIDEO_ID = '7627475706620844915';
const TARGET = 100;
const OUTPUT = path.join(__dirname, 'douyin_comments.json');

  const VIDEO_URL = `https://www.douyin.com/video/${VIDEO_ID}`;

function save(data) {
  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), 'utf-8');
}

async function writeToFeishu(comments) {
  const rows = comments.map(c => [c.nickname, c.content, c.likes, c.time]);
  const data = JSON.stringify(rows);
  const title = `抖音评论 - ${VIDEO_ID} (${VIDEO_URL})`;
  console.log('Writing to Feishu spreadsheet...');
  const result = execSync(
    `lark-cli sheets +create --title "${title}" --headers '["昵称","评论内容","点赞数","时间"]' --data '${data}'`,
    { encoding: 'utf-8', timeout: 30000 }
  );
  const res = JSON.parse(result);
  if (res.ok) {
    console.log(`Feishu spreadsheet created: ${res.data.url}`);
  } else {
    console.error('Failed to write to Feishu:', JSON.stringify(res));
  }
}

async function dismissPopups(page) {
  await page.evaluate(() => {
    // Remove guide mask
    const mask = document.querySelector('[data-e2e="recommend-guide-mask"]');
    if (mask) mask.remove();
    // Remove login dialog
    const loginDialog = document.querySelector('#trust-logout-dialog');
    if (loginDialog) loginDialog.remove();
    // Remove verify dialog
    const verify = document.querySelector('#uc-second-verify');
    if (verify) verify.remove();
    // Remove any remaining overlays that block interaction
    document.querySelectorAll('[class*="second-verify"], [class*="trust-login"], [class*="guide-mask"]').forEach(el => el.remove());
  });
}

async function extractComments(page) {
  return page.evaluate(() => {
    const items = document.querySelectorAll('[data-e2e="comment-item"]');
    const results = [];
    items.forEach((item) => {
      const nickname = (item.querySelector('.BT7MlqJC a')?.textContent || '').trim();
      const content = (item.querySelector('.C7LroK_h')?.textContent || '').trim();
      const timeLoc = (item.querySelector('.fJhvAqos span')?.textContent || '').trim();
      const likes = (item.querySelector('.vXZJEXVc p')?.textContent || '0').trim();
      if (content) {
        results.push({ nickname, content: content.substring(0, 500), likes, time: timeLoc });
      }
    });
    return results;
  });
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

  const url = `https://www.douyin.com/jingxuan?modal_id=${VIDEO_ID}`;
  console.log('Opening:', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);

  // Remove all blocking overlays
  await dismissPopups(page);
  await page.waitForTimeout(500);

  // Click comment icon using force to bypass any remaining overlays
  console.log('Clicking comment icon (force)...');
  await page.$eval('[data-e2e="feed-comment-icon"]', el => el.click());
  await page.waitForTimeout(3000);

  // Check for comment panel
  const hasComments = await page.evaluate(() => {
    const list = document.querySelector('[data-e2e="comment-list"]');
    const items = document.querySelectorAll('[data-e2e="comment-list-item"]');
    return { hasList: !!list, itemCount: items.length };
  });
  console.log('Comment panel status:', JSON.stringify(hasComments));

  // Wait for comments to load
  console.log('Waiting for comment items to load...');
  try {
    await page.waitForSelector('[data-e2e="comment-item"]', { timeout: 10000 });
    console.log('Comment items found!');
  } catch (_) {
    console.log('Comment items did not appear in 10s. Checking DOM...');
    const debugInfo = await page.evaluate(() => {
      const items = [];
      const all = document.querySelectorAll('[data-e2e]');
      for (const el of all) {
        const e2e = el.getAttribute('data-e2e') || '';
        if (e2e.includes('comment') || e2e.includes('Comment')) {
          items.push({
            e2e,
            tag: el.tagName,
            children: el.children.length,
            html: el.innerHTML?.substring(0, 200),
          });
        }
      }
      return items;
    });
    console.log(JSON.stringify(debugInfo, null, 2));
  }

  // If comments are loading, scroll through them
  const comments = [];
  let lastCount = 0;
  let staleRounds = 0;

  while (comments.length < TARGET && staleRounds < 5) {
    const newComments = await extractComments(page);
    for (const c of newComments) {
      if (!comments.find(x => x.content === c.content && x.nickname === c.nickname)) {
        comments.push(c);
      }
    }

    console.log(`[${comments.length}/${TARGET}] comments collected`);

    if (comments.length === lastCount) {
      staleRounds++;
    } else {
      staleRounds = 0;
    }
    lastCount = comments.length;

    if (comments.length < TARGET) {
      // Scroll the comment list down
      await page.evaluate(() => {
        const commentList = document.querySelector('[data-e2e="comment-list"]');
        if (commentList) {
          commentList.scrollTop += 800;
        }
      });
      await page.waitForTimeout(1500);
    }

    if (comments.length % 10 === 0 && comments.length > 0) {
      save(comments);
    }
  }

  save(comments);
  console.log(`\nDone! ${comments.length} comments saved to ${OUTPUT}`);
  await writeToFeishu(comments);
  await browser.close().catch(() => {});
})().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
