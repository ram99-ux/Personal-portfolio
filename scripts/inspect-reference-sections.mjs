import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const dir = 'artifacts/reference-motion-sections';
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('https://heynesh.com/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);
if (process.argv.includes('--timing')) {
  const probes = [];
  for (const y of [1000,1100,1200,1250,1300,1350,1400,1450,1500,1550,1600,1650,1700,1750,1800,1850,1900,1950,2000,2050,2100,2150,2200,2250,2300,2350,2400,2450,2500]) {
    await page.evaluate(y => scrollTo(0,y),y);
    await page.waitForTimeout(40);
    probes.push(await page.evaluate(() => ({y:scrollY,cards:[...document.querySelectorAll('.about-card')].slice(0,3).map(el=>({y:el.getBoundingClientRect().y,o:getComputedStyle(el).opacity,t:getComputedStyle(el).transform})),heading:[...document.querySelectorAll('.about-section h2 .line')].map(el=>getComputedStyle(el).transform)})));
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => scrollTo(0,0));
  await page.waitForTimeout(2000);
  const runs=[];
  for (const target of [{y:1700,selector:'.about-card,.ac-1 .digit-track,.ac-1 .line,.ac-1 .about-card-img,.ac-1 .about-card-button'}, {y:10800,selector:'.cta_heading .line,.cta_section p .line,.cta-span-heading'}, {y:12600,selector:'.footer-logo svg,.footer-logo svg [class],.footer-logo svg path'}]) {
    await page.evaluate(y => scrollTo(0,y),target.y);
    runs.push({target,...await page.evaluate(async selector=>{
      const start=performance.now(), frames=[];
      while(performance.now()-start<2000) {
        frames.push({ms:Math.round(performance.now()-start),nodes:[...document.querySelectorAll(selector)].slice(0,30).map(el=>({c:el.getAttribute('class'),tag:el.tagName,o:getComputedStyle(el).opacity,t:getComputedStyle(el).transform,fill:getComputedStyle(el).fill,y:el.getBoundingClientRect().y}))});
        await new Promise(resolve=>setTimeout(resolve,100));
      }
      return {frames};
    },target.selector)});
  }
  writeFileSync(`${dir}/timings.json`,JSON.stringify({probes,runs},null,2));
  console.log(JSON.stringify({saved:`${dir}/timings.json`}));
  await browser.close();
  process.exit(0);
}
async function state() {
  return page.evaluate(() => ({
    y: scrollY,
    height: document.documentElement.scrollHeight,
    nodes: [...document.querySelectorAll('body [class]')]
      .filter(el => !el.closest('svg') && !el.closest('script') && !el.closest('header'))
      .map((el, index) => {
        const box = el.getBoundingClientRect();
        const css = getComputedStyle(el);
        return { index, tag: el.tagName, id: el.id, class: el.className, parent: el.parentElement?.className,
          rect: [box.x,box.y,box.width,box.height].map(v => Math.round(v*100)/100),
          opacity:css.opacity, transform:css.transform, filter:css.filter, clip:css.clipPath,
          color:css.color, background:css.backgroundColor, position:css.position,
          display:css.display, visibility:css.visibility };
      }).filter(el => el.rect[2]>0 && el.rect[3]>0)
  }));
}
writeFileSync(`${dir}/initial.json`, JSON.stringify(await state(), null, 2));
const marks = [1700,2000,2250,2500,2800,3100,3450,3800,4150,4500,7900,8150,8400,8650,8900,9150,9400,9650,9900,10200,10500,10800,11000,11200,11400,11600,11800,12100,12600,13000,13400,13800];
for (const y of marks) {
  await page.evaluate(y => scrollTo(0,y), y);
  await page.waitForTimeout(650);
  writeFileSync(`${dir}/scroll-${y}.json`, JSON.stringify(await state(), null, 2));
  if ([2000,2800,3800,8400,8900,9400,10200,11000,11400,11800,12600,13400].includes(y)) {
    await page.screenshot({path:`${dir}/scroll-${y}.png`});
  }
}
for (const y of [11400,9400,8900,2800,2000]) {
  await page.evaluate(y => scrollTo(0,y), y);
  await page.waitForTimeout(650);
  writeFileSync(`${dir}/reverse-${y}.json`, JSON.stringify(await state(), null, 2));
}
console.log(JSON.stringify({saved:dir,marks:marks.length}));
await browser.close();
