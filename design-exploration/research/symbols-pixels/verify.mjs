import assert from 'node:assert/strict';
import { Browser,sleep } from '/Users/harry.nicholls/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { writeFileSync } from 'node:fs';
const browser=await Browser.launch();const lines=[];
try {
 for(const width of [1440,768,390]) {
  const page=await browser.newPage({width,height:width===390?844:1000,reducedMotion:true});
  await page.goto('http://127.0.0.1:3031/design-exploration/symbols-pixels.html',{settleMs:200,timeoutMs:5000});
  assert.equal(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.eval(()=>document.querySelectorAll('.matrix-view img').forEach(image=>{image.loading='eager';}));await sleep(200);
  assert.equal(await page.eval(()=>document.querySelectorAll('.matrix-view.is-ready').length),4);
  await page.send('Page.bringToFront');
  await page.eval(()=>document.querySelector('[data-treatment=screen]').focus());
  await page.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
  await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await sleep(80);
  assert.equal(await page.eval(()=>document.body.dataset.treatment),'screen');
  assert.equal(await page.eval(()=>document.querySelector('button[data-treatment=screen]').getAttribute('aria-pressed')),'true');
  await page.eval(()=>document.querySelector('[data-treatment=dots]').click());
  assert.equal(await page.eval(()=>document.body.dataset.treatment),'dots');
  assert.equal(await page.eval(()=>document.querySelector('.story details').open),true);
  assert.equal(page.consoleErrors.length,0,JSON.stringify(page.consoleErrors));
  await page.eval(()=>scrollTo(0,0));await sleep(100);
  if(width!==768)await page.screenshot({path:`design-exploration/screenshots/symbols-pixels-${width===390?'mobile':'desktop'}.jpg`});
  lines.push(`${width}px: no overflow, four derived halftone previews, keyboard toggle and pressed state, original case study present, no runtime exceptions`);
  await page.close();
 }
 const page=await browser.newPage({width:390,height:844});await page.send('Emulation.setScriptExecutionDisabled',{value:true});
 await page.goto('http://127.0.0.1:3031/design-exploration/symbols-pixels.html',{settleMs:100,timeoutMs:5000});
 assert.equal(await page.eval(()=>getComputedStyle(document.querySelector('.halftone')).display),'none');
 assert.equal(await page.eval(()=>document.querySelector('.matrix-view img').naturalWidth>0),true);
 lines.push('Without JavaScript, original images and all reading/links remain available.');
 writeFileSync('design-exploration/research/symbols-pixels/verification.txt',lines.join('\n')+'\n');console.log(lines.join('\n'));
}finally{await browser.close();}
