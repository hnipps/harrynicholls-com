import {Browser,sleep} from './browser-client.mjs';
import assert from 'node:assert/strict';
const base=process.env.PAPER_STACK_URL || 'http://127.0.0.1:3031/design-exploration/paper-stack/';
const all=['personal-letter','signal-press','symbols-pixels','minimal-data','working-index','bare-html'];
const b=await Browser.launch(),p=await b.newPage({width:1440,height:1000,reducedMotion:true});
async function settled(name){for(let n=0;n<160;n++){if(await p.eval(s=>document.body.dataset.theme===s&&!document.body.classList.contains('is-turning'),name))return;await sleep(20);}throw Error('Not settled: '+name);}
async function verify(){
 const state=await p.eval(()=>({active:document.body.dataset.theme,deck:JSON.parse(localStorage.getItem('harry-paper-stack-theme-deck')),papers:[...document.querySelectorAll('[data-paper]')].map(p=>Number(p.dataset.paper)),under:document.querySelector('.is-under')?.src.split('/').at(-1).replace('.html',''),corner:!document.querySelector('#peel-corner').hidden}));
 assert.deepEqual([...state.deck,...state.papers.map(i=>all[i])].sort(),[...all].sort());
 assert.equal(state.deck[0],state.active);assert.equal(state.deck.at(-1),'bare-html');assert.equal(state.papers.includes(5),false);
 assert.equal(state.under,state.deck[1]);assert.equal(state.corner,state.active!=='bare-html');
 return state;
}
async function peel(name){await p.eval(()=>document.querySelector('#peel-corner').click());await settled(name);await verify();}
async function retrieve(index){await p.eval(i=>document.querySelector(`[data-paper="${i}"]`).click(),index);await settled(all[index]);await verify();}
try{
 await p.goto(base+'?reset',{settleMs:250});await verify();
 await peel('signal-press');await peel('symbols-pixels');await retrieve(0);
 assert.deepEqual((await verify()).deck,['personal-letter','symbols-pixels','minimal-data','working-index','bare-html']);
 await peel('symbols-pixels');await retrieve(1);await retrieve(0);
 assert.deepEqual((await verify()).deck,['personal-letter','signal-press','symbols-pixels','minimal-data','working-index','bare-html']);
 assert.deepEqual((await verify()).papers,[]);
 await p.goto(base,{settleMs:250});await verify();
 for(const name of all.slice(1))await peel(name);
 await retrieve(3);assert.deepEqual((await verify()).deck,['minimal-data','bare-html']);
 await peel('bare-html');await retrieve(1);await retrieve(0);
 await peel('signal-press');await peel('bare-html');
 await p.eval(()=>document.querySelector('.is-current').contentDocument.querySelector('[data-reset-stack]').click());await settled(all[0]);
 assert.deepEqual((await verify()).deck,all);assert.deepEqual((await verify()).papers,[]);
 await p.eval(()=>{localStorage.setItem('harry-paper-stack-theme','bare-html');localStorage.setItem('harry-paper-stack-theme-papers',JSON.stringify(['bare-html','signal-press']));localStorage.removeItem('harry-paper-stack-theme-deck');});
 await p.goto(base,{settleMs:250});await verify();
 assert.deepEqual((await verify()).papers,[1,0,2,3,4]);
 assert.deepEqual(p.consoleErrors,[]);
 console.log('PASS mutually exclusive locations, dynamic peel order, repeated retrieval, HTML floor, reload, reset and legacy-state migration');
}finally{await p.close();await b.close();}
