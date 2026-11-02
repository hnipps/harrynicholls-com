// A scroll gesture is latched to whatever it first touches, momentum included.
// One that starts while a sheet is turning must still scroll the sheet you land on.
import {Browser,sleep,scrollCurrentFrame} from './browser-client.mjs';
import assert from 'node:assert/strict';
const base=process.env.PAPER_STACK_URL||'http://127.0.0.1:3031/design-exploration/paper-stack/';
const b=await Browser.launch();
const failures=[];
async function scenario(name,{width,height,source,start,at},expectTheme) {
 const p=await b.newPage({width,height});
 try{
  if(source==='touch')await p.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await p.goto(base+'?reset',{settleMs:1800});
  await start(p);
  for(let n=0;n<150&&!await p.eval(()=>document.body.classList.contains('is-turning'));n++)await sleep(20);
  await sleep(60);
  assert.ok(await p.eval(()=>document.body.classList.contains('is-turning')),`${name}: gesture begins mid-turn`);
  const [x,y]=at(width,height);
  await p.send('Input.synthesizeScrollGesture',{x,y,yDistance:-1400,speed:500,gestureSourceType:source});
  const result=await p.eval(()=>({theme:document.body.dataset.theme,turning:document.body.classList.contains('is-turning'),scrollY:Math.round(document.querySelector('.is-current').contentWindow.scrollY)}));
  assert.equal(result.turning,false,`${name}: turn finished during the gesture`);
  assert.equal(result.theme,expectTheme,`${name}: landed on ${expectTheme}`);
  if(result.scrollY<1200)throw new Error(`${name}: landed page scrolled ${result.scrollY}px of 1400px`);
  assert.deepEqual(p.consoleErrors,[],`${name}: console errors ${JSON.stringify(p.consoleErrors)}`);
  console.log(`PASS ${name}: landed page scrolled ${result.scrollY}px`);
 }catch(error){failures.push(error.message);console.log(`FAIL ${error.message}`);}
 finally{await p.close();}
}
const peel=p=>p.eval(()=>document.querySelector('#peel-corner').click());
async function retrieve(p){
 await peel(p);
 for(let n=0;n<150&&await p.eval(()=>document.body.classList.contains('is-turning'));n++)await sleep(20);
 await sleep(900);await scrollCurrentFrame(p);
 await p.eval(()=>document.querySelector('[data-paper="0"]').click());
}
const middle=(w,h)=>[Math.round(w/2),Math.round(h*.7)];
try{
 await scenario('trackpad mid-peel',{width:1440,height:1000,source:'mouse',start:peel,at:middle},'signal-press');
 await scenario('trackpad over the corner mid-peel',{width:1440,height:1000,source:'mouse',start:peel,at:()=>[30,30]},'signal-press');
 await scenario('touch mid-peel',{width:390,height:844,source:'touch',start:peel,at:middle},'signal-press');
 await scenario('trackpad mid-return',{width:1440,height:1000,source:'mouse',start:retrieve,at:middle},'personal-letter');
 await scenario('touch mid-return',{width:390,height:844,source:'touch',start:retrieve,at:middle},'personal-letter');
}finally{await b.close();}
if(failures.length){console.log(`${failures.length} scroll gesture(s) lost during a turn`);process.exit(1);}
