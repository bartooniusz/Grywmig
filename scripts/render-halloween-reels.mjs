import { chromium } from '../work/node_modules/playwright-core/index.mjs';
import { createServer } from 'node:http';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, extname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=resolve(import.meta.dirname,'..'), out=join(root,'dist/kampania-halloween');
await mkdir(out,{recursive:true});await mkdir(join(root,'work/reel-raw'),{recursive:true});
// Original, quiet bell music; no third-party soundtrack or voice.
execFileSync('python3',['-c',`import math,wave,struct,sys
rate=44100; notes=[261.63,311.13,392.0,466.16,392.0,311.13,349.23,261.63]
with wave.open(sys.argv[1],'w') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate)
 for i in range(18*rate):
  t=i/rate; n=int(t/0.75); age=t-n*0.75; f=notes[n%len(notes)]
  env=min(1,age/0.025)*math.exp(-3.0*age); fade=min(1,t/0.6,(18-t)/0.8)
  sound=(math.sin(2*math.pi*f*t)+0.22*math.sin(2*math.pi*2*f*t))*env*0.075+math.sin(2*math.pi*65.406*t)*0.008
  w.writeframesraw(struct.pack('<h',int(max(-1,min(1,sound*fade))*32767)))
`,join(root,'work/halloween-music.wav')]);
const server=createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const path=url.pathname==='/reel'?join(root,'campaign/halloween/reel.html'):resolve(root,'dist','.'+url.pathname);
 if(!path.startsWith(root+'/'))return res.writeHead(403).end();
 try{const bytes=await readFile(path);res.writeHead(200,{'Content-Type':({'.html':'text/html','.mjs':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[extname(path)]||'application/octet-stream'}).end(bytes);}catch{res.writeHead(404).end();}
});await new Promise(r=>server.listen(8791,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const hooks=[
 ['01-jeden-klamie','Jeden z nich kłamie.<br><strong>Odkryjesz który?</strong>'],
 ['02-zatrzymaj-film','Zatrzymaj film.<br><strong>Rozwiąż zagadkę.</strong>'],
 ['03-bez-podpowiedzi','Znajdziesz sprawcę<br><strong>bez podpowiedzi?</strong>'],
];
try{for(const [name,hook]of hooks){
 console.log('Recording '+name+'...');
 const context=await browser.newContext({viewport:{width:540,height:960},deviceScaleFactor:1,recordVideo:{dir:join(root,'work/reel-raw'),size:{width:540,height:960}}});
 const started=performance.now(),page=await context.newPage();const video=page.video();
 await page.goto('http://127.0.0.1:8791/reel');await page.locator('#hook').evaluate((el,html)=>{el.innerHTML='<div>'+html+'</div>';},hook);
 const frame=page.frameLocator('#game');await frame.locator('#start').waitFor();
 const lead=(performance.now()-started)/1000;
 await page.waitForTimeout(1800);await frame.locator('#start').click();
 await frame.locator('body').evaluate(el=>{const style=document.createElement('style');style.textContent='.game-header,.case-top,.case-heading,.story,.more-games,.game-footer{display:none!important}.game-shell{padding:14px}.rule{font-size:13px;line-height:1.5;margin-top:0}.witness-identity{width:100%}.witness{grid-template-columns:90px 1fr}.witness blockquote{font-size:19px;min-height:108px}.witness strong{font-size:15px}.witness small{font-size:10px}.deduction-heading h2{font-size:23px}';document.head.append(style);window.scrollTo(0,0);});
 await page.waitForTimeout(4700);await page.locator('#callout').evaluate(el=>{el.textContent='Sprawca i kłamca mogą być tą samą osobą.';});
 await page.waitForTimeout(4500);await page.locator('#callout').evaluate(el=>{el.textContent='Masz odpowiedź? Sprawdź ją w grze.';});
 await page.screenshot({path:join(out,name+'.png')});
 await page.waitForTimeout(3000);await page.locator('#outro').evaluate(el=>el.classList.add('show'));
 await page.waitForTimeout(4100);await context.close();
 const raw=await video.path();
 execFileSync('ffmpeg',['-y','-hide_banner','-loglevel','error','-ss',String(lead),'-i',raw,'-i',join(root,'work/halloween-music.wav'),'-t','18','-vf','scale=1080:1920:flags=lanczos','-r','30','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart',join(out,name+'.mp4')]);
 console.log('Rendered '+name+'.mp4');
}}finally{await browser.close();await new Promise(r=>server.close(r));}
