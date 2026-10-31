import {Browser,sleep} from './browser-client.mjs';
import {exposedPaperTargets} from './paper-targets.mjs';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.PAPER_STACK_URL || 'http://127.0.0.1:3031/design-exploration/paper-stack/';
const out='.taste-skill/flexible-paper/final';mkdirSync(out,{recursive:true});
const browser=await Browser.launch();
const results=[];
try {
 for(const [width,height,label] of [[1440,1000,'desktop'],[390,844,'mobile']]) {
  const page=await browser.newPage({width,height});
  try {
   await page.goto(base+'?reset',{settleMs:150});
   await page.eval(()=>{
    localStorage.setItem('harry-paper-stack-theme','bare-html');
    localStorage.setItem('harry-paper-stack-theme-papers',JSON.stringify(['personal-letter','signal-press','symbols-pixels','minimal-data','working-index']));
   });
   await page.goto(base,{settleMs:300});
   const mouse=async(type,x,y)=>page.send('Input.dispatchMouseEvent',{type,x,y,button:type==='mouseMoved'?'none':'left',clickCount:1});
   await mouse('mouseMoved',width-20,height-20);await sleep(400);
   const target=(await page.eval(exposedPaperTargets,{thumb:true})).find(p=>p.index==='0');assert.ok(target);
   await mouse('mouseMoved',target.x,target.y);await sleep(300);
   await page.screenshot({path:`${out}/hover-${label}.jpg`});
   const source=await page.eval(async()=>{
    const {paperPose}=await import('./paper-return.js');
    const button=document.querySelector('[data-paper="0"]');
    const face=button.querySelector('.paper-face');
    const pose=paperPose(button),rect=face.getBoundingClientRect();
    return {pose,left:rect.left};
   });
   assert.ok(Math.abs(source.pose.x-source.left)<.1,'flight starts at the actual pulled-out edge');
   await mouse('mousePressed',target.x,target.y);await mouse('mouseReleased',target.x,target.y);
   for(let attempt=0;attempt<200;attempt++){
    if(await page.eval(()=>!!document.querySelector('.paper-flex')))break;
    await sleep(10);
   }
   assert.equal(await page.eval(()=>!!document.querySelector('.paper-flex')),true,'deforming renderer is active, not rigid fallback');
   await page.eval(()=>{document.querySelector('.paper-flex').paperClock.time=.04;});
   for(const [progress,name] of [[.04,'lift'],[.3,'turn-back'],[.5,'turn-front'],[.72,'landing'],[.94,'settle']]){
    await page.eval(t=>{const canvas=document.querySelector('.paper-flex');canvas.paperClock.time=t;canvas.paperClock.draw(t);},progress);await sleep(35);
    await page.screenshot({path:`${out}/${name}-${label}.jpg`});
   }
   assert.ok(Number(await page.eval(()=>document.querySelector('.paper-flex').dataset.bend))>.01);
   await page.eval(()=>{document.querySelector('.paper-flex').paperClock.time=1;});await sleep(1100);
   assert.equal(await page.eval(()=>document.body.dataset.theme),'personal-letter');
   assert.equal(await page.eval(()=>document.querySelectorAll('.paper-flex,.paper-return-back,.paper-return-shadow,.paper-return-front-light').length),0);
   const rest=await page.eval(()=>document.querySelector('#fold-paper').getAttribute('d'));
   assert.ok(rest.length>20);
   await page.screenshot({path:`${out}/landed-${label}.jpg`});
   if(label==='desktop') {
    await mouse('mouseMoved',20,20);await sleep(300);
    const hovered=await page.eval(()=>document.querySelector('#fold-paper').getAttribute('d'));assert.notEqual(hovered,rest);
    await page.screenshot({path:`${out}/corner-hover-${label}.jpg`});
    await mouse('mouseMoved',300,100);await sleep(500);
    assert.equal(await page.eval(()=>document.querySelector('#fold-paper').getAttribute('d')),rest);
   }
   assert.deepEqual(page.consoleErrors,[]);
   results.push(`PASS ${label}: continuous source pose, connected deforming mesh, five flight poses, cleanup, live page and resting corner`);
  } finally {await page.close();}
 }
 writeFileSync('design-exploration/paper-stack/research/flex-browser-checks.txt',results.join('\n')+'\n');
 results.forEach(result=>console.log(result));
} finally {await browser.close();}
