import { chromium } from '../../work/node_modules/playwright-core/index.mjs';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve(import.meta.dirname, '../../plugins/grywmig-halloween-alibi');
const server = createServer(async (req,res) => {
 if (new URL(req.url,'http://localhost').pathname === '/embed') { res.writeHead(200,{'Content-Type':'text/html'}).end('<!doctype html><html><body><div data-gwm-halloween-embed><iframe src="/game/index.html" style="width:100%;height:1100px;border:0"></iframe></div><script>window.gaEvents=[];window.gtag=(...args)=>gaEvents.push(args);</script><script src="/embed.js"></script></body></html>'); return; }
 const path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
 if(!path.startsWith(root+'/')) return res.writeHead(403).end();
 try {const bytes=await readFile(path);res.writeHead(200,{'Content-Type':({'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[extname(path)]||'application/octet-stream'}).end(bytes);} catch {res.writeHead(404).end();}
});
await new Promise(r=>server.listen(8790,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
let checks=0;const errors=[];
try {
 const context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],viewport:{width:390,height:844}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.events=[];window.addEventListener('gwm:game_event',e=>window.events.push(e.detail.action));});
 await page.goto('http://127.0.0.1:8790/game/index.html');await page.locator('#start').click();
 assert.equal(await page.locator('.witness').count(),3);checks++;
 await page.locator('#culprit-choices [data-person="ada"]').click();await page.locator('#liar-choices [data-person="ada"]').click();await page.locator('#check').click();
 assert.equal(await page.locator('#result').isVisible(),false);assert(await page.locator('#status').textContent().then(x=>x.includes('nie pasują')));checks+=2;
 await page.locator('#hint').click();assert.equal(await page.locator('#hint-count').textContent(),'1/3');checks++;
 await page.reload();assert.equal(await page.locator('#culprit-choices [data-person="ada"]').getAttribute('aria-pressed'),'true');checks++;
 await page.locator('#culprit-choices [data-person="leon"]').click();await page.locator('#liar-choices [data-person="leon"]').click();await page.locator('#check').click();
 assert.equal(await page.locator('#result-title').textContent(),'Sprawa rozwiązana.');checks++;
 assert.equal(await page.evaluate(()=>events.filter(e=>e==='game_complete').length),1);checks++;
 await page.locator('#share').click();assert((await page.evaluate(()=>navigator.clipboard.readText())).includes('Sprawa 1/3'));checks++;
 assert(!(await page.evaluate(()=>navigator.clipboard.readText())).includes('Leon'));checks++;
 await page.locator('#next').click();await page.locator('#culprit-choices [data-person="mila"]').click();await page.locator('#liar-choices [data-person="ada"]').click();await page.locator('#check').click();assert.equal(await page.locator('#result-title').textContent(),'Sprawa rozwiązana.');checks++;
 await page.locator('#next').click();assert.equal(await page.locator('.witness').count(),4);checks++;
 await page.locator('#reveal').click();await page.locator('#cancel-reveal').click();assert.equal(await page.locator('#result').isVisible(),false);checks++;
 await page.locator('#reveal').click();await page.locator('#confirm-reveal').click();assert.equal(await page.locator('#result-kicker').textContent(),'Rozwiązanie odsłonięte');checks++;
 assert.equal(await page.evaluate(()=>events.filter(e=>e==='game_complete').length),2);checks++;
 assert.equal(await page.locator('#share').isVisible(),false);checks++;
 await page.locator('#restart').click();await page.locator('#culprit-choices [data-person="olek"]').click();await page.locator('#liar-choices [data-person="leon"]').click();await page.locator('#check').click();assert.equal(await page.evaluate(()=>events.filter(e=>e==='game_complete').length),3);checks++;
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;}
 await mkdir(resolve(import.meta.dirname,'../output'),{recursive:true});
 await page.setViewportSize({width:1100,height:1000});await page.locator('#restart').click();await page.screenshot({path:resolve(import.meta.dirname,'../output/halloween-play.png'),fullPage:true});
 await page.locator('#back').click();await page.screenshot({path:resolve(import.meta.dirname,'../output/halloween-cover.png'),fullPage:true});
 const embedded=await browser.newContext({viewport:{width:390,height:844}});const host=await embedded.newPage();await host.goto('http://127.0.0.1:8790/embed');
 await host.waitForFunction(()=>{const f=document.querySelector('iframe'),shell=f.contentDocument?.querySelector('.game-shell');return shell&&Math.abs(parseFloat(f.style.height)-Math.ceil(shell.getBoundingClientRect().height)-8)<2;});
 const coverHeight=await host.locator('iframe').evaluate(f=>parseFloat(f.style.height));checks++;
 const frame=host.frameLocator('iframe');await frame.locator('#start').click();
 await host.waitForFunction(h=>parseFloat(document.querySelector('iframe').style.height)>h,coverHeight);checks++;
 await frame.locator('#back').click();await host.waitForFunction(h=>Math.abs(parseFloat(document.querySelector('iframe').style.height)-h)<2,coverHeight);checks++;
 await host.evaluate(()=>dispatchEvent(new MessageEvent('message',{origin:location.origin,source:window,data:{type:'grywmig:halloween:event',action:'game_complete'}})));
 assert.equal(await host.evaluate(()=>gaEvents.filter(a=>a[1]==='game_complete').length),0);checks++;
 await frame.locator('#start').click();await frame.locator('#culprit-choices [data-person="leon"]').click();await frame.locator('#liar-choices [data-person="leon"]').click();await frame.locator('#check').click();
 await host.waitForFunction(()=>gaEvents.some(a=>a[1]==='game_complete'));
 assert.equal(await host.evaluate(()=>gaEvents.filter(a=>a[1]==='game_complete').length),1);checks++;
 assert.equal(await host.evaluate(()=>gaEvents.find(a=>a[1]==='game_complete')[2].game_id),'halloween_alibi');checks++;
 await embedded.close();
 assert.deepEqual(errors,[]);checks++;console.log(`${checks} Halloween browser checks passed`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
