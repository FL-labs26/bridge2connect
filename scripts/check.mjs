import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function walk(dir) { const result = []; for (const entry of await readdir(dir, { withFileTypes: true })) { const name = path.join(dir, entry.name); if (entry.isDirectory()) result.push(...await walk(name)); else if (/\.m?js$/.test(name)) result.push(name); } return result; }
let failed = 0;
for (const folder of ['src', 'scripts', 'tests']) {
  for (const file of await walk(path.join(root, folder))) { const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' }); if (result.status !== 0) { failed++; console.error(result.stderr); } }
}
console.log(failed ? `${failed} syntax errors` : 'All source scripts passed the Node.js syntax check.');
process.exitCode = failed ? 1 : 0;
