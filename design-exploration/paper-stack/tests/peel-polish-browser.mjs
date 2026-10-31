import {Browser,sleep} from './browser-client.mjs';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const base=process.env.PAPER_STACK_URL || 'http://127.0.0.1:3031/design-exploration/paper-stack/';
const out='.taste-skill/peel-polish/final';mkdirSync(out,{recursive:true});
const b=await Browser.launch(),p=await b.newPage({width:1440,height:1000,reducedMotion:true});
async function seed(deck,papers){
 await p.eval(({deck,papers})=>{localStorage.setItem('harry-paper-stack-theme',deck[0]);localStorage.setItem('harry-paper-stack-theme-deck',JSON.stringify(deck));localStorage.setItem('harry-paper-stack-theme-papers',JSON.stringify(papers));},{deck,papers});
 await p.goto(base,{settleMs:1000});
}
try{
 await p.goto(base+'?reset',{settleMs:100});
 for(const [width,height,label]of[[1440,1000,'desktop'],[390,844,'mobile']]){
  await p.setViewport({width,height});
  await seed(['signal-press','bare-html'],['personal-letter','symbols-pixels','minimal-data','working-index']);
  const colors=await p.eval(()=>({top:getComputedStyle(document.querySelector('.is-current')).backgroundColor,under:getComputedStyle(document.querySelector('.is-under')).backgroundColor}));
  assert.equal(colors.top,'rgb(221, 242, 82)');assert.equal(colors.under,'rgb(255, 255, 255)');
  await p.screenshot({path:`${out}/white-under-yellow-${label}.jpg`});
  console.log(`PASS ${label}: HTML is white underneath Signal press before peeling`);
 }
 await p.setViewport({width:1440,height:1000});
 await seed(['signal-press','working-index','bare-html'],['personal-letter','symbols-pixels','minimal-data']);
 await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await p.eval(()=>{
  window.originalPaper=document.querySelector('[data-paper="0"]');window.paperMotion=[];window.motionEvents=[];
  originalPaper.addEventListener('transitionrun',e=>motionEvents.push(e.propertyName));
  const observer=new MutationObserver(()=>{
   if(document.body.dataset.theme!=='working-index')return;
   observer.disconnect();const start=performance.now();
   function sample(){paperMotion.push(getComputedStyle(originalPaper).transform);if(performance.now()-start<450)requestAnimationFrame(sample);}
   sample();
  });observer.observe(document.body,{attributes:true,attributeFilter:['data-theme']});
  document.querySelector('#peel-corner').click();
 });
 await sleep(1200);
 assert.equal(await p.eval(()=>document.querySelector('[data-paper="0"]')===originalPaper),true);
 const midway=await p.eval(()=>({animations:originalPaper.getAnimations().map(a=>a.transitionProperty),under:getComputedStyle(document.querySelector('.is-under')).backgroundColor}));
 assert.ok(midway.animations.includes('transform'));assert.equal(midway.under,'rgb(255, 255, 255)');
 await p.screenshot({path:out+'/stack-shifting.jpg'});await sleep(500);
 const motion=await p.eval(()=>({frames:paperMotion,events:motionEvents}));
 assert.ok(motion.events.includes('transform'));assert.ok(new Set(motion.frames).size>5);
 console.log('PASS retained stack papers move through intermediate positions during a transform transition');
 await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await p.eval(()=>document.querySelector('#peel-corner').click());await sleep(150);
 assert.equal(await p.eval(()=>document.body.dataset.theme),'bare-html');
 assert.equal(await p.eval(()=>document.querySelector('[data-paper="0"]').getAnimations().length),0);
 assert.deepEqual(p.consoleErrors,[]);console.log('PASS reduced motion remains immediate; no browser exceptions');
}finally{await p.close();await b.close();}
