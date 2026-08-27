// Full-page screenshot harness: real viewport, captureBeyondViewport.
// Usage: node bakeoff/shoot.mjs <file.html> <out.png> <width> <height>
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [file, out, w = '1440', h = '900'] = process.argv.slice(2);
const width = Number(w), height = Number(h);
const port = 9500 + Math.floor(Number(process.env.SHOOT_SLOT || 0));

const chrome = spawn('google-chrome', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
  `--remote-debugging-port=${port}`, `--window-size=${width},${height}`,
  '--user-data-dir=/tmp/shoot-' + port, 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/list`);
      const tabs = await r.json();
      const t = tabs.find((t) => t.type === 'page');
      if (t?.webSocketDebuggerUrl) return t.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error('chrome did not come up');
}

const ws = new WebSocket(await wsUrl());
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, (m) => (m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width, height, deviceScaleFactor: 1, mobile: width < 600,
});
await send('Page.navigate', { url: 'file://' + resolve(file) });
await sleep(2500); // let fonts, animations and lazy work settle

const { data } = await send('Page.captureScreenshot', {
  format: 'png', captureBeyondViewport: true, fromSurface: true,
});
writeFileSync(out, Buffer.from(data, 'base64'));
console.log(out, Buffer.from(data, 'base64').length, 'bytes');
ws.close();
chrome.kill();
process.exit(0);
