// node tools/shot.mjs out.png [query] [waitMs] — the built game (dist/) in headless Chromium, a screenshot after it
// settles, and any page errors. Software GPU (SwiftShader): slow, for checking it draws, not for timing.
import http from 'http'; import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'dist');
const [out = 'shot.png', query = '', wait = '6000'] = process.argv.slice(2);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.wasm': 'application/wasm', '.json': 'application/json' };
const server = http.createServer((q, s) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if(fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if(!f.startsWith(ROOT) || !fs.existsSync(f)){ s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s); });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const req = createRequire(import.meta.url); let pw; try { pw = req('playwright'); } catch(e){ pw = await import('/opt/npm-tools/node_modules/playwright/index.mjs'); }
const browser = await pw.chromium.launch({ args: ['--enable-unsafe-webgpu', '--enable-features=Vulkan', '--use-vulkan=swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 960, height: 540 } }), errs = [];
page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if(m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
await page.goto(`http://127.0.0.1:${server.address().port}/index.html${query}`);
await page.waitForFunction(() => window.__vulpea && window.__vulpea.ready, null, { timeout: 120000 }).catch(() => errs.push('never ready'));
await page.waitForTimeout(+wait);
await page.screenshot({ path: out }); console.log(await page.evaluate(() => (document.getElementById('hud') || {}).textContent));
console.log(errs.length ? 'ERRORS: ' + errs.slice(0, 6).join(' | ') : '(no page errors)');
await browser.close(); server.close();
