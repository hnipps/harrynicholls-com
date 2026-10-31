import {Browser,sleep,scrollCurrentFrame} from './browser-client.mjs';
import {exposedPaperTargets} from './paper-targets.mjs';
import assert from 'node:assert/strict';
const base=process.env.PAPER_STACK_URL || 'http://127.0.0.1:3031/design-exploration/paper-stack/';
const slugs=['personal-letter','signal-press','symbols-pixels','minimal-data','working-index','bare-html'];
const b=await Browser.launch(),p=await b.newPage({width:1440,height:1000});
const top=()=>scrollCurrentFrame(p);
async function scrolled(){await sleep(160);assert.ok(await p.eval(()=>document.querySelector('.is-current').contentWindow.scrollY>70),'actual iframe receives the scroll');}
async function wheel(x,y){await p.send('Input.dispatchMouseEvent',{type:'mouseWheel',x,y,deltaX:0,deltaY:240});await scrolled();}
try{
 for(const [width,height]of[[1440,1000],[390,844]]){
  await p.setViewport({width,height});await p.goto(base+'?reset',{settleMs:1200});
  for(const slug of slugs.slice(1)){
   await top();await p.eval(()=>document.querySelector('#peel-corner').click());
   for(let n=0;n<150;n++){if(await p.eval(s=>document.body.dataset.theme===s&&!document.body.classList.contains('is-turning'),slug))break;await sleep(20);}
   assert.equal(await p.eval(()=>document.body.dataset.theme),slug);
   await p.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:width-20,y:height-20});await sleep(350);
   await wheel(width-170,height-340); // Former transparent hover bridge.
   await top();
   await p.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:width-20,y:height-20});await p.eval(()=>document.querySelector('#paper-sheaf').classList.add('is-expanded'));await sleep(350);
   const paper=(await p.eval(exposedPaperTargets))[0];assert.ok(paper);
   await wheel(paper.x,paper.y); // Actual paper button in the outer document.
  }
  console.log(`PASS ${width}px: scrolling works over the page and stack after every normal-motion peel`);
 }
 await top();await p.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
 await p.eval(()=>document.querySelector('#paper-sheaf').classList.add('is-expanded'));await sleep(350);
 const target=(await p.eval(exposedPaperTargets,{thumb:true}))[0];assert.ok(target);
 await p.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:target.x,y:target.y,id:1}]});
 await p.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:target.x,y:target.y-120,id:1}]});
 await p.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await scrolled();
 assert.equal(await p.eval(()=>document.body.dataset.theme),'bare-html');
 console.log('PASS touch pan over a paper scrolls the page without selecting that paper');
 for(const slug of slugs){
  const result=await p.eval(async slug=>{const prefix=new URL(document.querySelector('script[type="module"]').src).pathname.replace(/[^/]+$/,'');const text=await(await fetch(prefix+'themes/'+slug+'.html')).text();return{atlas:text.includes('Explore the map'),exploration:/Design exploration|Back to directions|href="[^\"]*design-exploration/.test(text)};},slug);
  assert.equal(result.atlas,false);assert.equal(result.exploration,false);
 }
 assert.deepEqual(p.consoleErrors,[]);console.log('PASS no Atlas shortcut or exploration links in any visitor-facing view');
}finally{await p.close();await b.close();}
