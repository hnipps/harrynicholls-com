import {Browser,sleep,scrollCurrentFrame} from './browser-client.mjs';
import assert from 'node:assert/strict';
import {exposedPaperTargets} from './paper-targets.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.PAPER_STACK_URL || 'http://127.0.0.1:3031/design-exploration/paper-stack/';
const out='.taste-skill/sheaf/final';mkdirSync(out,{recursive:true});
const b=await Browser.launch(),p=await b.newPage({width:1440,height:1000});
const results=[];
async function check(name,fn){await fn();results.push('PASS '+name);console.log('PASS',name);}
async function theme(name){for(let n=0;n<180;n++){if(await p.eval(s=>document.body.dataset.theme===s&&!document.body.classList.contains('is-turning'),name))return;await sleep(25);}throw Error('Theme did not settle: '+name);}
const scroll=y=>scrollCurrentFrame(p,y);
async function peel(name){await scroll(0);await p.eval(()=>document.querySelector('#peel-corner').click());await theme(name);}
async function mouse(type,x,y){await p.send('Input.dispatchMouseEvent',{type,x,y,button:type==='mouseMoved'?'none':'left',clickCount:1});}
async function cards(){return p.eval(()=>[...document.querySelectorAll('[data-paper]')].map(button=>Number(button.dataset.paper)));}
async function tap(x,y){await p.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});await p.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
async function key(key,code=key){await p.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:key==='Enter'?13:0,...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});await p.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:key==='Enter'?13:0});}
try{
 await p.goto(base+'?reset',{settleMs:1500});
 await check('first visit has no sheaf, papers or visible Change view label',async()=>{
  assert.deepEqual(await cards(),[]);assert.equal(await p.eval(()=>document.querySelector('#paper-sheaf').hidden),true);
  assert.equal(await p.eval(()=>document.querySelector('#view-toggle')),null);
  await p.screenshot({path:out+'/first-visit-desktop.jpg'});
 });
 await check('the corner precedes the page in keyboard reading order',async()=>{
  assert.equal(await p.eval(()=>Boolean(document.querySelector('#peel-corner').compareDocumentPosition(document.querySelector('#stack')) & Node.DOCUMENT_POSITION_FOLLOWING)),true);
 });
 await check('corner follows the document top and disappears on scroll',async()=>{
  await scroll(20);assert.equal(await p.eval(()=>Math.round(document.querySelector('#peel-corner').getBoundingClientRect().top)),-20);
  await scroll(400);assert.equal(await p.eval(()=>document.querySelector('#peel-corner').hidden),true);assert.equal(await p.eval(()=>document.querySelector('#paper-curl').hasAttribute('hidden')),true);
  assert.equal(await p.eval(()=>document.elementFromPoint(2,2)===document.querySelector('.is-current')),true);
  await p.screenshot({path:out+'/scrolled-first-visit.jpg'});await scroll(0);assert.equal(await p.eval(()=>document.querySelector('#peel-corner').hidden),false);
 });
 await check('letter reverse has its muted plus print, reflected with the fold',async()=>{
  assert.ok(await p.eval(()=>document.querySelector('#reverse-pattern').innerHTML.includes('M10 7v6')));
  assert.ok(await p.eval(()=>document.querySelector('#reverse-pattern').getAttribute('patternTransform').startsWith('matrix(')));
  assert.equal(await p.eval(()=>Number(document.querySelector('#fold-print').getAttribute('opacity'))),.22);
 });
 await check('a discard leaves briefly before arriving as one unlabelled paper',async()=>{
  await peel('signal-press');assert.deepEqual(await cards(),[0]);
  const data=await p.eval(()=>{const button=document.querySelector('[data-paper="0"]');return {name:button.getAttribute('aria-label'),text:button.textContent,animation:button.getAnimations().length};});
  assert.ok(data.name.includes('A personal letter'));assert.equal(data.text,'');assert.ok(data.animation>0);
  await sleep(1100);await p.screenshot({path:out+'/one-paper-desktop.jpg'});
 });
 await check('discarded paper stays in reach while the curl scrolls away',async()=>{
  const before=await p.eval(()=>document.querySelector('[data-paper="0"]').getBoundingClientRect().top);
  await scroll(450);assert.equal(await p.eval(()=>document.querySelector('#peel-corner').hidden),true);
  const after=await p.eval(()=>document.querySelector('[data-paper="0"]').getBoundingClientRect().top);assert.equal(Math.round(before),Math.round(after));await scroll(0);
 });
 await check('mouse hover spreads the paper without changing the view',async()=>{
  await mouse('mouseMoved',1420,980);await sleep(500);
  assert.equal(await p.eval(()=>document.querySelector('#paper-sheaf').classList.contains('is-expanded')),true);
  assert.equal(await p.eval(()=>document.body.dataset.theme),'signal-press');
  const rect=(await p.eval(exposedPaperTargets)).find(target=>target.index==='0');
  assert.ok(rect);await mouse('mouseMoved',rect.x,rect.y);await sleep(250);
  assert.equal(await p.eval(()=>document.querySelector('#paper-sheaf').classList.contains('is-expanded')),true);
  await p.screenshot({path:out+'/hover-one-paper.jpg'});
  const click=(await p.eval(exposedPaperTargets)).find(target=>target.index==='0');
  await p.eval(()=>[...document.querySelectorAll('iframe')].find(f=>f.src.includes('/personal-letter.html')).contentWindow.paperReturnSentinel='kept');
  await mouse('mousePressed',click.x,click.y);await mouse('mouseReleased',click.x,click.y);
 });
 await check('the selected paper flies back into the page and swaps the history',async()=>{
  await sleep(100);assert.equal(await p.eval(()=>document.querySelectorAll('.sheet.is-returning').length),1);assert.equal(await p.eval(()=>document.querySelector('.is-current').style.clipPath),'');
  const faces=await p.eval(()=>{const frame=document.querySelector('.sheet.is-returning');return {mesh:!!document.querySelector('.paper-flex'),parent:frame.parentElement.id,hidden:frame.classList.contains('is-flexing')};});
  assert.equal(faces.mesh,true);assert.equal(faces.parent,'stack');assert.equal(faces.hidden,true);
  await p.screenshot({path:out+'/paper-return-mid-flight.jpg'});await theme('personal-letter');assert.deepEqual(await cards(),[]);
  assert.equal(await p.eval(()=>document.querySelector('.is-current').contentWindow.paperReturnSentinel),'kept');
  assert.equal(await p.eval(()=>document.querySelector('.paper-return-back')),null);
  assert.equal(await p.eval(()=>localStorage.getItem('harry-paper-stack-theme')),'personal-letter');
 });
 await check('revisiting sheets creates no duplicate papers',async()=>{
  await peel('signal-press');assert.deepEqual(await cards(),[0]);
  for(const name of ['symbols-pixels','minimal-data','working-index','bare-html'])await peel(name);
  assert.deepEqual(await cards(),[0,1,2,3,4]);
  assert.equal(await p.eval(()=>new Set([...document.querySelectorAll('[data-paper]')].map(b=>b.style.getPropertyValue('--sheet-print'))).size),5);
  await sleep(1100);
 });
 for(const [width,height,label]of[[1440,1000,'desktop'],[768,1000,'tablet'],[390,844,'mobile']]){
  await p.setViewport({width,height});await p.eval(()=>{document.activeElement?.blur();document.querySelector('#paper-sheaf').classList.remove('is-expanded');});await sleep(450);
  await p.screenshot({path:`${out}/five-papers-${label}.jpg`});
  await p.eval(()=>document.querySelector('[data-paper="0"]').focus());await sleep(450);
  await check(`nested corners expose five named, unlabelled papers at ${width}px`,async()=>{
   const data=await p.eval(()=>[...document.querySelectorAll('[data-paper]')].map(button=>({text:button.textContent,name:button.getAttribute('aria-label')})));
   assert.equal(data.length,5);for(const d of data){assert.equal(d.text,'');assert.ok(d.name.startsWith('Bring back'));}
   const targets=await p.eval(exposedPaperTargets,{thumb:width<=600});assert.equal(targets.length,5);
  });
  await p.screenshot({path:`${out}/five-papers-spread-${label}.jpg`});
 }
 await check('arrow keys move through the papers and Escape closes the fan',async()=>{
  await p.eval(()=>document.querySelector('[data-paper="0"]').focus());await key('ArrowRight');assert.equal(await p.eval(()=>document.activeElement.dataset.paper),'1');
  await key('End');assert.equal(await p.eval(()=>document.activeElement.dataset.paper),'4');await key('Escape');assert.equal(await p.eval(()=>document.querySelector('#paper-sheaf').classList.contains('is-expanded')),false);
 });
 await check('first touch spreads the sheaf and each paper has an exposed thumb target',async()=>{
  await p.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await tap(370,824);await sleep(450);
  assert.equal(await p.eval(()=>document.body.dataset.theme),'bare-html');assert.equal(await p.eval(()=>document.querySelector('#paper-sheaf').classList.contains('is-expanded')),true);
  const targets=await p.eval(exposedPaperTargets,{thumb:true});assert.equal(targets.length,5);
  const selected=targets.find(t=>t.index==='0');await tap(selected.x,selected.y);await theme('personal-letter');
  assert.deepEqual(await cards(),[1,2,3,4]);await p.send('Emulation.setTouchEmulationEnabled',{enabled:false});
 });
 await check('theme and ordered paper history survive a reload',async()=>{
  await p.goto(base,{settleMs:500});await theme('personal-letter');assert.deepEqual(await cards(),[1,2,3,4]);
 });
 await check('keyboard selection works without motion and reset empties the sheaf',async()=>{
  await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await p.eval(()=>document.querySelector('[data-paper="1"]').focus());await key('Enter');await theme('signal-press');await peel('personal-letter');await peel('bare-html');
  assert.equal(await p.eval(()=>document.querySelector('.is-current').getAnimations().length),0);
  await p.eval(()=>document.querySelector('.is-current').contentDocument.querySelector('[data-reset-stack]').click());await theme('personal-letter');
  assert.deepEqual(await cards(),[]);assert.equal(await p.eval(()=>document.querySelector('#paper-sheaf').hidden),true);
  assert.equal(await p.eval(()=>localStorage.getItem('harry-paper-stack-theme-papers')),'[]');
 });
 assert.deepEqual(p.consoleErrors,[]);
 writeFileSync('design-exploration/paper-stack/research/sheaf-browser-checks.txt',results.join('\n')+'\nNo browser runtime exceptions.\n');
}finally{await p.close();await b.close();}
