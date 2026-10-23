import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
const root = resolve(import.meta.dirname, '..');
await mkdir(join(root, 'dist'), { recursive: true });
const files = [];
async function walk(dir) { for (const item of await readdir(dir, { withFileTypes: true })) { const path = join(dir, item.name); if (item.isDirectory()) await walk(path); else files.push(path); } }
await walk(join(root, 'plugins/grywmig-ulepszenia'));
const entries = [];
for (const path of files.sort()) entries.push({ path: path.slice(join(root, 'plugins').length + 1), data: (await readFile(path)).toString('base64') });
// Deterministic ZIP: one plugin directory, no dev dependencies, fixed metadata.
execFileSync('python3', ['-c', `import sys,json,zipfile,base64
entries=json.load(sys.stdin)
with zipfile.ZipFile(sys.argv[1], 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as out:
 for item in entries:
  info=zipfile.ZipInfo(item['path'], (2026,10,23,0,0,0))
  info.compress_type=zipfile.ZIP_DEFLATED
  info.external_attr=0o100644 << 16
  out.writestr(info, base64.b64decode(item['data']))
`, join(root, 'dist/grywmig-ulepszenia-1.0.0.zip')], { input: JSON.stringify(entries) });
console.log(`Built dist/grywmig-ulepszenia-1.0.0.zip (${entries.length} files)`);
