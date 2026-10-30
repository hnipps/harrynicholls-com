import {Browser,sleep} from './browser-client.mjs';
import assert from 'node:assert/strict';
import {exposedPaperTargets} from './paper-targets.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.PAPER_STACK_URL || 'http://127.0.0.1:3031/design-exploration/paper-stack/';
const out='.taste-skill/stable-sheaf/final';mkdirSync(out,{recursive:true});
const b=await Browser.launch(),p=await b.newPage({width:1440,height:1000,reducedMotion:true});
const results=[];
async function check(name,fn){await fn();results.push('PASS '+name);console.log('PASS',name);}
async function theme(name){for(let n=0;n<200;n++){if(await p.eval(s=>document.body.dataset.theme===s&&!document.body.classList.contains('is-turning'),name))return;await sleep(25);}throw Error('Theme not ready: '+name);}
async function layers(){return p.eval(()=>[...document.querySelectorAll('[data-paper]')].sort((a,b)=>Number(a.style.getPropertyValue('--layer'))-Number(b.style.getPropertyValue('--layer'))).map(button=>Number(button.dataset.paper)));}
async function move(x,y){await p.send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});}
try{
 await p.goto(base+'?reset',{settleMs:100});
 for(const name of ['signal-press','symbols-pixels','minimal-data','working-index','bare-html']){await p.eval(()=>document.querySelector('#peel-corner').click());await theme(name);}
 await check('bare HTML retains native fonts and links in a centered reading column',async()=>{
  const data=await p.eval(()=>{const f=document.querySelector('.is-current'),d=f.contentDocument,w=f.contentWindow,r=d.body.getBoundingClientRect();return{font:w.getComputedStyle(d.body).fontFamily,color:w.getComputedStyle(d.querySelector('a')).color,width:r.width,left:r.left,right:r.right,lineHeight:parseFloat(w.getComputedStyle(d.body).lineHeight),fontSize:parseFloat(w.getComputedStyle(d.body).fontSize)};});
  assert.ok(/Times|serif/.test(data.font));assert.equal(data.color,'rgb(0, 0, 238)');assert.ok(data.width<=800);assert.ok(Math.abs(data.left-(1440-data.right))<=1);assert.ok(data.lineHeight/data.fontSize>=1.45);
 });
 await check('bare screenshots have manageable sizes and keep their aspect ratios',async()=>{
  const data=await p.eval(async()=>{const d=document.querySelector('.is-current').contentDocument;const images=[...d.images].slice(0,4);await Promise.all(images.map(image=>{image.loading='eager';return image.decode();}));return images.map(image=>{const r=image.getBoundingClientRect();return{width:r.width,height:r.height,ratio:r.width/r.height,natural:image.naturalWidth/image.naturalHeight};});});
  for(const image of data){assert.ok(image.width<=641&&image.height<=401);assert.ok(Math.abs(image.ratio-image.natural)<.01);}
 });
 for(const [width,height,label]of[[1440,1000,'desktop'],[768,1000,'tablet'],[390,844,'mobile']]){
  await p.setViewport({width,height});await sleep(80);await p.eval(()=>document.querySelector('.is-current').contentWindow.scrollTo(0,0));
  await check(`bare HTML has no overflow at ${width}px`,async()=>{assert.equal(await p.eval(()=>{const f=document.querySelector('.is-current');return f.contentDocument.documentElement.scrollWidth>f.clientWidth;}),false);});
  await p.screenshot({path:`${out}/bare-${label}.jpg`});
 }
 await p.setViewport({width:1440,height:1000});await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await check('paper shadows use no composited drop-shadow filter',async()=>{
  assert.equal(await p.eval(()=>[...document.querySelectorAll('[data-paper]')].every(button=>getComputedStyle(button).filter==='none')),true);
  assert.equal(await p.eval(()=>[...document.querySelectorAll('[data-paper]')].every(button=>getComputedStyle(button.querySelector('.paper-face')).boxShadow!=='none')),true);
 });
 // Every sheet retains its original slot and depth; only the printed face slides outward.
 for(const [width,height,label]of[[1440,1000,'desktop'],[768,1000,'tablet'],[390,844,'mobile']]){
  await p.setViewport({width,height});await move(width-20,height-20);await sleep(400);
  await p.screenshot({path:out+`/fan-${label}.jpg`});
  await check(`all five papers remain reachable throughout hover at ${width}px`,async()=>{
   for(const index of [4,3,2,1,0]){
    const targets=await p.eval(exposedPaperTargets,{thumb:true});assert.equal(targets.length,5,'five exposed 44px targets');
    const point=targets.find(t=>Number(t.index)===index);assert.ok(point);
    const before=await p.eval(()=>[...document.querySelectorAll('[data-paper]')].map(el=>({index:el.dataset.paper,transform:getComputedStyle(el).transform,slot:el.style.getPropertyValue('--slot'),layer:el.style.getPropertyValue('--layer')})));
    await move(point.x,point.y);
    for(const delay of [80,240,650]){
     await sleep(delay);
     const hit=await p.eval(({x,y})=>document.elementFromPoint(x,y)?.closest('[data-paper]')?.dataset.paper,point);
     assert.equal(hit,String(index),'original pointer still owns the hovered paper');
     assert.deepEqual(await layers(),[0,1,2,3,4],'hover never reorders');
     assert.equal((await p.eval(exposedPaperTargets,{thumb:true})).length,5,'every other paper stays reachable');
    }
    const after=await p.eval(()=>[...document.querySelectorAll('[data-paper]')].map(el=>({index:el.dataset.paper,transform:getComputedStyle(el).transform,slot:el.style.getPropertyValue('--slot'),layer:el.style.getPropertyValue('--layer')})));
    assert.deepEqual(after,before,'button geometry and depth remain anchored');
    const face=await p.eval(i=>new DOMMatrix(getComputedStyle(document.querySelector(`[data-paper="${i}"] .paper-face`)).transform).e,index);
    assert.ok(face < -27,'hovered face pulls left');
   }
   assert.deepEqual(await p.eval(()=>JSON.parse(localStorage.getItem('harry-paper-stack-theme-papers'))),['personal-letter','signal-press','symbols-pixels','minimal-data','working-index']);
  });
  await p.screenshot({path:out+`/hover-${label}.jpg`});
  await move(width/2,100);await sleep(400);
  assert.equal(await p.eval(()=>document.querySelector('#paper-sheaf').classList.contains('is-expanded')),false);
 }
 await p.setViewport({width:1440,height:1000});
 await p.goto(base+'?reset',{settleMs:1500});
 await check('keyboard focus highlights the fold without a rectangular border',async()=>{
  await p.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await p.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  const data=await p.eval(()=>{const corner=document.querySelector('#peel-corner');return{focus:document.activeElement.id,pseudo:getComputedStyle(corner,'::after').content,outline:getComputedStyle(corner).outlineStyle,width:getComputedStyle(document.querySelector('#fold-edge')).strokeWidth};});
  assert.equal(data.focus,'peel-corner');assert.ok(data.pseudo==='none'||data.pseudo==='normal');assert.equal(data.outline,'none');assert.equal(parseFloat(data.width),2.5);
  await p.screenshot({path:out+'/keyboard-fold.jpg'});
 });
 await check('pointer use removes the keyboard emphasis without removing accessibility',async()=>{
  await p.eval(()=>document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})));assert.equal(await p.eval(()=>parseFloat(getComputedStyle(document.querySelector('#fold-edge')).strokeWidth)),1.25);
 });
 assert.deepEqual(p.consoleErrors,[]);writeFileSync('design-exploration/paper-stack/research/polish-browser-checks.txt',results.join('\n')+'\nNo browser runtime exceptions.\n');
}finally{await p.close();await b.close();}
