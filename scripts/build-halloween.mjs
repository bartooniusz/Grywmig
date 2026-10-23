import { mkdir, cp, readdir, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
const root=resolve(import.meta.dirname,'..');
await mkdir(join(root,'dist/halloweenowe-alibi'),{recursive:true});
await cp(join(root,'plugins/grywmig-halloween-alibi/game'),join(root,'dist/halloweenowe-alibi'),{recursive:true});
const files=[];async function walk(dir){for(const i of await readdir(dir,{withFileTypes:true})){const p=join(dir,i.name);if(i.isDirectory())await walk(p);else files.push(p);}}
await walk(join(root,'plugins/grywmig-halloween-alibi'));
const entries=[];for(const p of files.sort())entries.push({path:p.slice(join(root,'plugins').length+1),data:(await readFile(p)).toString('base64')});
execFileSync('python3',['-c',`import json,sys,zipfile,base64
with zipfile.ZipFile(sys.argv[1],'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for e in json.load(sys.stdin):
  i=zipfile.ZipInfo(e['path'],(2026,10,23,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,base64.b64decode(e['data']))
`,join(root,'dist/grywmig-halloween-alibi-1.0.0.zip')],{input:JSON.stringify(entries)});
console.log('Built Halloween game and installable WordPress ZIP.');
