import { Browser,sleep } from './browser-client.mjs';
import assert from 'node:assert/strict';
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base=process.env.PAPER_STACK_URL || 'http://127.0.0.1:3031/design-exploration/paper-stack/';
const shots='.taste-skill/paper-stack/final';mkdirSync(shots,{recursive:true});
const slugs=['personal-letter','signal-press','symbols-pixels','minimal-data','working-index','bare-html'];
const b=await Browser.launch();
const p=await b.newPage({width:1440,height:1000});
const results=[];
async function check(name,fn) {await fn();results.push(name);console.log('PASS',name);}
async function until(fn,message,timeout=6000) {
 const start=Date.now();
 while(Date.now()-start<timeout){if(await p.eval(fn))return;await sleep(40);}
 throw new Error('Timed out: '+message);
}
async function waitTheme(slug) {
 const start=Date.now();
 while(Date.now()-start<6000){if(await p.eval(s=>document.body.dataset.theme===s&&!!document.querySelector('.is-current')?.contentDocument?.querySelector('main'),slug))return;await sleep(40);}
 throw new Error('Timed out waiting for '+slug);
}
async function mouse(type,x,y){await p.send('Input.dispatchMouseEvent',{type,x,y,button:'left',buttons:type==='mouseReleased'?0:1,clickCount:type==='mouseMoved'?0:1});}
async function clickCorner(){await mouse('mousePressed',18,18);await mouse('mouseReleased',18,18);}
async function choose(index){
 for(let step=0;step<12;step++){
  if(await p.eval(s=>document.body.dataset.theme===s,slugs[index]))return;
  const exists=await p.eval(i=>!!document.querySelector(`[data-paper="${i}"]`),index);
  if(exists){await p.eval(i=>document.querySelector(`[data-paper="${i}"]`).click(),index);await waitTheme(slugs[index]);return;}
  const next=await p.eval(()=>document.querySelector('.is-under').src.split('/').at(-1).replace('.html',''));
  await p.eval(()=>document.querySelector('.is-current').contentWindow.scrollTo(0,0));await sleep(80);
  await p.eval(()=>document.querySelector('#peel-corner').click());await waitTheme(next);
 }
 throw new Error('Could not navigate to '+slugs[index]);
}
try {
 await p.goto(base+'?reset',{settleMs:0});
 await check('initial letter and curled corner within two seconds',async()=>{
  const start=Date.now();await until(()=>!!document.querySelector('#fold-paper').getAttribute('d'),'initial corner',2000);
  assert.ok(Date.now()-start<2000);assert.equal(await p.eval(()=>document.body.dataset.theme),'personal-letter');await sleep(1100);
 });
 await check('reversible drag below threshold springs back',async()=>{
  await mouse('mousePressed',18,18);await mouse('mouseMoved',250,210);await sleep(40);
  await p.screenshot({path:shots+'/partial-desktop.jpg'});
  await mouse('mouseMoved',40,40);await mouse('mouseReleased',40,40);await sleep(750);
  assert.equal(await p.eval(()=>document.body.dataset.theme),'personal-letter');
  assert.equal(await p.eval(()=>document.body.classList.contains('is-dragging')),false);
 });
 await check('releasing past threshold completes the live peel',async()=>{
  await mouse('mousePressed',18,18);await mouse('mouseMoved',1000,680);await p.screenshot({path:shots+'/committed-drag-desktop.jpg'});await mouse('mouseReleased',1000,680);await waitTheme('signal-press');
 });
 await check('single click auto-plays the next peel',async()=>{
  await sleep(1100);await clickCorner();await waitTheme('symbols-pixels');
 });
 await check('chosen view survives a reload',async()=>{
  await p.goto(base,{settleMs:400});await waitTheme('symbols-pixels');
  assert.equal(await p.eval(()=>document.querySelectorAll('.sheet.is-current').length),1);
 });
 for(const [index,slug] of slugs.entries()) {
  await choose(index);await sleep(950);
  for(const [width,height,label] of [[1440,1000,'desktop'],[768,1000,'tablet'],[390,844,'mobile']]){
   await p.setViewport({width,height});await sleep(100);
   await check(`${slug}: complete content and layout at ${width}px`,async()=>{
    const data=await p.eval(()=>{
     const frame=document.querySelector('.is-current'),doc=frame.contentDocument;
     const ids=[...doc.querySelectorAll('[id]')].map(node=>node.id);
     return {overflow:doc.documentElement.scrollWidth>frame.clientWidth+1,ids:ids.length===new Set(ids).size,
      cases:['crosscheck','recommender','opsdeck','go-home','llm-cover-letters'].map(id=>!!doc.getElementById(id)?.querySelector('.story-content')),
      gitrove:!!doc.querySelector('#gitrove-story .story-content,#gitrove .story-content'),
      brokenAnchors:[...doc.querySelectorAll('a[href^="#"]')].filter(a=>!doc.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash),
      brokenImages:[...doc.images].filter(image=>image.complete&&!image.naturalWidth).map(image=>image.src),
      currentCount:document.querySelectorAll('.is-current').length,
      hiddenSafe:[...document.querySelectorAll('iframe:not(.is-current)')].every(f=>f.inert&&f.getAttribute('aria-hidden')==='true')};
    });
    assert.equal(data.overflow,false);assert.equal(data.ids,true);assert.ok(data.cases.every(Boolean));assert.equal(data.gitrove,true);assert.deepEqual(data.brokenAnchors,[]);assert.deepEqual(data.brokenImages,[]);assert.equal(data.currentCount,1);assert.equal(data.hiddenSafe,true);
   });
   await p.eval(()=>document.activeElement?.blur());
   await p.screenshot({path:`${shots}/${slug}-${label}.jpg`});
  }
  await check(slug+': project links reveal same-theme case studies',async()=>{
   const opened=await p.eval(()=>{
    const doc=document.querySelector('.is-current').contentDocument;
    doc.querySelectorAll('details').forEach(d=>{d.open=false});
    const link=doc.querySelector('a[href="#crosscheck"]');link.click();
    return {open:doc.querySelector('#crosscheck details')?.open ?? true,href:link.href};
   });
   assert.equal(opened.open,true);assert.ok(opened.href.includes('/paper-stack/themes/'));
   await p.eval(()=>document.querySelector('.is-current').contentWindow.scrollTo(0,0));
  });
  if(index===1)await check('Signal press filters still work',async()=>{
   assert.equal(await p.eval(()=>{const d=document.querySelector('.is-current').contentDocument;d.querySelector('[data-filter="home"]').click();return [...d.querySelectorAll('.poster-project')].filter(p=>!p.hidden).length;}),2);
  });
  if(index===2)await check('Dot matrix original-image control still works',async()=>{
   assert.equal(await p.eval(()=>{const d=document.querySelector('.is-current').contentDocument;d.querySelector('[data-treatment="screen"]').click();return d.body.dataset.treatment;}),'screen');
  });
  if(index===3)await check('Project atlas data controls still work',async()=>{
   assert.equal(await p.eval(()=>{const d=document.querySelector('.is-current').contentDocument;d.querySelector('[data-tech="0"]').click();return d.querySelector('#atlas-count').textContent;}),'3 with Go');
  });
  if(index===4)await check('Working index search still works',async()=>{
   assert.equal(await p.eval(()=>{const d=document.querySelector('.is-current').contentDocument,s=d.querySelector('#project-search');s.value='verification';s.dispatchEvent(new Event('input'));return d.querySelector('#search-status').textContent;}),'1 project found');
  });
 }
 await check('final HTML uses native serif text and bright-blue links',async()=>{
  const style=await p.eval(()=>{const f=document.querySelector('.is-current'),w=f.contentWindow,d=f.contentDocument;return {font:w.getComputedStyle(d.body).fontFamily,link:w.getComputedStyle(d.querySelector('a')).color,reset:!!d.querySelector('[data-reset-stack]'),corner:document.querySelector('#peel-corner').hidden,curl:document.querySelector('#paper-curl').hasAttribute('hidden')};});
  assert.ok(/Times|serif/.test(style.font));assert.equal(style.link,'rgb(0, 0, 238)');assert.equal(style.reset,true);assert.equal(style.corner,true);assert.equal(style.curl,true);
 });
 await check('the single header reset returns to the letter without reloading and saves it',async()=>{
  const header=await p.eval(()=>{const d=document.querySelector('.is-current').contentDocument;return {buttons:d.querySelectorAll('header [data-reset-stack]').length,links:d.querySelectorAll('a[data-reset-stack]').length};});
  assert.equal(header.buttons,1);assert.equal(header.links,0);
  await p.eval(()=>{window.resetCheck=true;document.querySelector('.is-current').contentDocument.querySelector('button[data-reset-stack]').click();});
  await waitTheme('personal-letter');
  assert.equal(await p.eval(()=>window.resetCheck),true);
  assert.equal(await p.eval(()=>localStorage.getItem('harry-paper-stack-theme')),'personal-letter');
 });
 await p.setViewport({width:390,height:844});await sleep(900);
 await check('touch drag can complete a peel on a phone',async()=>{
  await p.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await p.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:14,y:14,id:1}]});
  await p.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:285,y:500,id:1}]});
  await sleep(80);await p.screenshot({path:shots+'/touch-drag-mobile.jpg'});
  await p.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await waitTheme('signal-press');
  await p.send('Emulation.setTouchEmulationEnabled',{enabled:false});
 });
 await check('switching themes preserves the current case study',async()=>{
  await choose(2);await choose(0);
  await p.eval(()=>{const d=document.querySelector('.is-current').contentDocument;d.querySelector('a[href="#crosscheck"]').click();});await sleep(100);
  await p.eval(()=>document.querySelector('[data-paper="1"]').click());await waitTheme('signal-press');
  const match=await p.eval(()=>{const d=document.querySelector('.is-current').contentDocument;return {open:d.querySelector('#crosscheck details').open,top:d.getElementById('crosscheck').getBoundingClientRect().top};});
  assert.equal(match.open,true);assert.ok(Math.abs(match.top)<100);
 });
 await check('reduced motion switches immediately and supports keyboard activation',async()=>{
  await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await choose(0);await p.eval(()=>document.querySelector('.is-current').contentWindow.scrollTo(0,0));await sleep(80);await p.eval(()=>document.querySelector('#peel-corner').focus());
  const nextTheme=await p.eval(()=>document.querySelector('.is-under').src.split('/').at(-1).replace('.html',''));
  await p.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
  await p.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await waitTheme(nextTheme);assert.equal(await p.eval(()=>document.body.classList.contains('is-turning')),false);
 });
 await check('storage-disabled browsers can still select and peel themes',async()=>{
  await p.send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(Storage.prototype,'getItem',{value(){throw new DOMException('Storage blocked','SecurityError')}});Object.defineProperty(Storage.prototype,'setItem',{value(){throw new DOMException('Storage blocked','SecurityError')}});"});
  await p.goto(base,{settleMs:200});await waitTheme('personal-letter');await clickCorner();await waitTheme('signal-press');
 });
 await check('no-JavaScript visitors can read the letter and open every theme',async()=>{
  await p.send('Emulation.setScriptExecutionDisabled',{value:true});await p.goto(base,{settleMs:200});
  const fallback=await p.eval(()=>({main:!!document.querySelector('#first-sheet').contentDocument.querySelector('main'),links:document.querySelectorAll('.no-script a').length}));
  assert.equal(fallback.main,true);assert.equal(fallback.links,6);
 });
 await check('standalone variants and committed site files match preservation fixtures',async()=>{
  const hashes=JSON.parse(readFileSync(new URL('./preserved.json',import.meta.url),'utf8'));
  for(const [file,hash] of Object.entries(hashes))assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,file);

 });
 assert.deepEqual(p.consoleErrors,[]);
 writeFileSync('design-exploration/paper-stack/research/browser-checks.txt',results.map(r=>'PASS '+r).join('\n')+'\nNo browser runtime exceptions.\n');
} finally {await p.close();await b.close();}
