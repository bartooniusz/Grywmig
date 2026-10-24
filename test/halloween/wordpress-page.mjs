import {chromium} from '../../work/node_modules/playwright-core/index.mjs';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const content=await readFile(new URL('../../dist/halloweenowe-alibi/wordpress-page.html.txt',import.meta.url),'utf8');
const server=createServer((req,res)=>res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0"><script>window.events=[];window.gtag=(...args)=>events.push(args);</script>'+content+'</body></html>'));
await new Promise(r=>server.listen(8796,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
try{const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8796/');const game=page.frameLocator('iframe');await game.locator('#start').click();
for(const [i,culprit,liar] of [[0,'leon','leon'],[1,'mila','ada'],[2,'olek','leon']]){await game.locator(`#culprit-choices [data-person="${culprit}"]`).click();await game.locator(`#liar-choices [data-person="${liar}"]`).click();await game.locator('#check').click();assert.equal(await game.locator('#result-title').textContent(),'Sprawa rozwiązana.');assert.equal(await page.evaluate(()=>events.filter(e=>e[1]==='game_complete').length),i+1);if(i<2)await game.locator('#next').click();}
await game.locator('#back').click();
for(const width of [390,1440]){await page.setViewportSize({width,height:900});await page.waitForTimeout(100);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const sizes=await page.locator('iframe').evaluate(f=>({frame:parseFloat(f.style.height),shell:f.contentDocument.querySelector('.game-shell').getBoundingClientRect().height}));assert(Math.abs(sizes.frame-Math.ceil(sizes.shell)-8)<2);}
assert.equal(await game.locator('.cover-art img').evaluate(img=>img.naturalWidth>0),true);assert.deepEqual(errors,[]);console.log('Self-contained WordPress page: 3 case wins, parent analytics, responsive iframe sizing and embedded image OK.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
