import { chromium } from '../work/node_modules/playwright-core/index.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.zip': 'application/zip' };
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const path = resolve(root, '.' + (pathname === '/' ? '/test/output/index.html' : pathname));
  if (!path.startsWith(root + '/')) { res.writeHead(403).end(); return; }
  try { const data = await readFile(path); res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'text/plain' }); res.end(data); }
  catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(8787, '127.0.0.1', r));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const errors = [];
let checks = 0;
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('http://127.0.0.1:8787/');
    await page.locator('.gwm-u-filters').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.gwm-u-card:visible').count(), 12); checks++;
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); checks++;
    for (const [filter, count] of [['slowa', 4], ['logiczne', 6], ['3d', 2], ['all', 12]]) {
      await page.locator(`[data-gwm-filter="${filter}"]`).click();
      assert.equal(await page.locator('.gwm-u-card:visible').count(), count); checks++;
      assert.equal(await page.locator('.gwm-u-filter[aria-pressed="true"]').count(), 1); checks++;
    }
    if (width === 390 || width === 1440) await page.screenshot({ path: `${root}/test/output/home-${width}.png`, fullPage: true });
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const plain = await noJs.newPage();
  await plain.goto('http://127.0.0.1:8787/');
  assert.equal(await plain.locator('.gwm-u-card:visible').count(), 12); checks++;
  assert.equal(await plain.locator('.gwm-u-filters:visible').count(), 0); checks++;
  await noJs.close();
  await page.goto('http://127.0.0.1:8787/');
  await page.locator('[data-gwm-filter="3d"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.gwm-u-card:visible').count(), 2); checks++;
  await page.evaluate(() => {
    document.body.innerHTML = '<section class="alibi-result" data-result hidden><h2>Wynik</h2></section>';
    window.gwmUpgrade = { from: 'alibi', next: [
      { id: 'sudoku', title: '<b>Sudoku</b>', url: location.origin + '/sudoku-online/' },
      { id: 'mahjong', title: 'Mahjong', url: location.origin + '/mahjong-online/' },
      { id: 'bad', title: 'External', url: 'https://example.com/' }
    ] };
  });
  await page.addScriptTag({ url: '/plugins/grywmig-ulepszenia/assets/site.js' });
  assert.equal(await page.locator('.gwm-u-result-next').count(), 0); checks++;
  await page.locator('[data-result]').evaluate(el => { el.hidden = false; });
  await page.locator('.gwm-u-result-next').waitFor();
  assert.equal(await page.locator('.gwm-u-result-next a').count(), 2); checks++;
  assert.equal(await page.locator('.gwm-u-result-next b').count(), 0); checks++;
  await page.locator('[data-result]').evaluate(el => { el.hidden = true; el.hidden = false; });
  await page.waitForTimeout(50);
  assert.equal(await page.locator('.gwm-u-result-next').count(), 1); checks++;
  assert.equal(await page.locator('[data-from-game="alibi"][data-to-game="sudoku"]').count(), 1); checks++;
  assert.deepEqual(errors, []); checks++;
  console.log(`${checks} browser checks passed; screenshots: test/output/home-{390,1440}.png`);
} finally { await browser.close(); await new Promise(r => server.close(r)); }
