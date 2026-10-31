import assert from 'node:assert/strict';
import { Browser, sleep } from '/Users/harry.nicholls/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { writeFileSync } from 'node:fs';
const browser = await Browser.launch();
const report = [];
async function press(page,selector) {
  await page.send('Page.bringToFront');
  await page.eval(s=>document.querySelector(s).focus(),selector);
  await page.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
  await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await sleep(80);
}
try {
 for (const width of [1440,768,390,320]) {
  const page=await browser.newPage({width,height:900,reducedMotion:true});
  await page.goto('http://127.0.0.1:3031/design-exploration/minimal-data.html',{settleMs:100,timeoutMs:5000});
  assert.equal(await page.eval(()=>document.querySelectorAll('h1').length),1);
  assert.equal(await page.eval(()=>document.querySelectorAll('.atlas-table tbody tr').length),6);
  for (const [tech,count] of [['0',3],['1',3],['2',1],['3',2],['4',3]]) {
   await press(page,`[data-tech="${tech}"]`);
   assert.equal(await page.eval(()=>document.querySelectorAll('.atlas-table tr.is-matched').length),count);
   assert.equal(await page.eval(t=>document.querySelector(`[data-tech="${t}"]`).getAttribute('aria-pressed'),tech),'true');
   assert.equal(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width} overflow on ${tech}`);
  }
  await press(page,'[data-tech="all"]');
  assert.equal(await page.eval(()=>document.querySelector('#atlas-count').textContent),'6 projects');
  await press(page,'.story summary');
  assert.equal(await page.eval(()=>document.querySelector('.story details').open),false);
  await press(page,'.story summary');
  assert.equal(await page.eval(()=>document.querySelector('.story details').open),true);
  assert.equal(page.consoleErrors.length,0);
  report.push(`${width}px: all five exact technology counts, pressed states, keyboard disclosures and overflow pass`);
  if ([1440,390].includes(width)) {
   await page.goto('http://127.0.0.1:3031/design-exploration/minimal-data.html',{settleMs:100,timeoutMs:5000});
   await page.screenshot({path:`design-exploration/screenshots/minimal-data-${width===1440?'desktop':'mobile'}.jpg`});
  }
  await page.send('Emulation.setScriptExecutionDisabled',{value:true});
  await page.goto('http://127.0.0.1:3031/design-exploration/minimal-data.html',{settleMs:100,timeoutMs:5000});
  assert.equal(await page.eval(()=>document.querySelectorAll('.uses-tech').length),12,'static matrix retains all true facts');
  assert.equal(await page.eval(()=>document.querySelector('.story details').open),true);
  await page.close();
 }
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:3031/design-exploration/minimal-data.html',{settleMs:100,timeoutMs:5000});
 const urls=await page.eval(()=>[...new Set([...document.querySelectorAll('a[href],img[src],script[src],link[rel=stylesheet]')].map(x=>x.href||x.src).filter(u=>u.startsWith(location.origin)))]);
 for(const url of urls)assert.equal((await fetch(url)).status,200,url);
 report.push(`${urls.length} local link/asset destinations return HTTP200; no-JavaScript view retains12listed incidences and full native case study`);
 writeFileSync('design-exploration/research/minimal-data/verification.txt',report.join('\n')+'\n');
 console.log(report.join('\n'));
} finally {await browser.close();}
