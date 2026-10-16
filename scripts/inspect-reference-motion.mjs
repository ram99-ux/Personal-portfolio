import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const dir = 'artifacts/reference-motion';
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const cdp = await page.context().newCDPSession(page);
async function capture(path) {
  try { const { data } = await cdp.send('Page.captureScreenshot', {format:'png'}); writeFileSync(path, Buffer.from(data, 'base64')); } catch {}
}
const started = Date.now();
await page.goto('https://heynesh.com/', { waitUntil: 'commit' });
const committed = Date.now();
const frames = [];
for (const mark of [0, 150, 350, 650, 1000, 1500, 2100, 2800, 3800, 5000]) {
  const remaining = committed + mark - Date.now();
  if (remaining > 0) await page.waitForTimeout(remaining);
  await capture(`${dir}/load-${mark}.png`);
  frames.push({ mark, elapsed: Date.now() - started, dom: await page.evaluate(() => [...document.querySelectorAll('[class]')].filter(el => /loader|preload|hero|logo|navigation/.test(el.className?.toString()) && !el.closest('svg')).map(el => {const r=el.getBoundingClientRect();const c=getComputedStyle(el);return {tag:el.tagName,class:el.className,rect:[r.x,r.y,r.width,r.height].map(Math.round),opacity:c.opacity,transform:c.transform,filter:c.filter,position:c.position,display:c.display,clip:c.clipPath};}).filter(el=>el.rect[2]>0&&el.rect[3]>0).slice(0,75)) });
}
const geometry = await page.evaluate(() => [...document.querySelectorAll('section,[class*=hero],[class*=logo]')].map(el=>({tag:el.tagName,id:el.id,class:el.className,top:Math.round(el.getBoundingClientRect().top+scrollY),height:Math.round(el.getBoundingClientRect().height)})).filter(x=>x.height>0));
writeFileSync(`${dir}/initial.json`,JSON.stringify({frames,geometry},null,2));
console.log(JSON.stringify({loadSeconds:(Date.now()-started)/1000,geometry},null,2));
for(const y of [100,250,450,650,850,1050,1300,1600,1950]) {
  await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(900);
  await page.screenshot({path:`${dir}/scroll-${y}.png`});
  const state=await page.evaluate(()=>[...document.querySelectorAll('[class]')].filter(el=>/hero|logo|navigation/.test(el.className?.toString())&&!el.closest('svg')).map(el=>{const r=el.getBoundingClientRect();const c=getComputedStyle(el);return {class:el.className,rect:[r.x,r.y,r.width,r.height].map(Math.round),opacity:c.opacity,transform:c.transform,filter:c.filter,position:c.position};}).filter(el=>el.rect[2]>0&&el.rect[3]>0).slice(0,75));
  writeFileSync(`${dir}/scroll-${y}.json`,JSON.stringify(state,null,2));
}
await browser.close();
