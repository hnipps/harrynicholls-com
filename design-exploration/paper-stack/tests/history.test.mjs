import test from 'node:test';
import assert from 'node:assert/strict';
import {themes,materialSVG} from '../paper-materials.js';
import {restorePapers,peelPaper,retrievePaper} from '../paper-state.js';

function invariant(state) {
 assert.deepEqual([...state.deck,...state.discarded].sort(),[0,1,2,3,4,5]);
 assert.equal(state.deck.at(-1),5);assert.equal(state.discarded.includes(5),false);
 if(state.deck[0]===5) assert.equal(state.discarded.length,5);
}
test('peeling moves exactly the top page into the corner stack',()=>{
 let state=restorePapers();
 for(let i=0;i<5;i++){state=peelPaper(state);invariant(state);assert.equal(state.deck[0],i+1);}
 assert.deepEqual(state,{deck:[5],discarded:[0,1,2,3,4]});assert.equal(peelPaper(state),state);
});
test('retrieving a sheet puts it above the current page, which stays underneath',()=>{
 let state=peelPaper(peelPaper(restorePapers()));
 state=retrievePaper(state,0);assert.deepEqual(state,{deck:[0,2,3,4,5],discarded:[1]});
 assert.deepEqual(peelPaper(state),{deck:[2,3,4,5],discarded:[1,0]});
});
test('HTML remains underneath retrieved papers and cannot enter the corner stack',()=>{
 const state=retrievePaper({deck:[5],discarded:[0,1,2,3,4]},2);
 assert.deepEqual(state,{deck:[2,5],discarded:[0,1,3,4]});
 assert.equal(retrievePaper(state,5),state);invariant(state);
});
test('arbitrary retrieval and peel sequences never duplicate or lose a view',()=>{
 let state=restorePapers();
 for(let i=0;i<200;i++){
  state=i%3===0&&state.discarded.length ? retrievePaper(state,state.discarded[i%state.discarded.length]) : peelPaper(state);
  invariant(state);
  const restored=restorePapers(state.deck[0],state.discarded,state.deck);assert.deepEqual(restored,state);
 }
});
test('old saved state migrates and invalid stored papers are repaired',()=>{
 assert.deepEqual(restorePapers(0,[1,2,5,0]),{deck:[0,3,4,5],discarded:[1,2]});
 invariant(restorePapers(5,[5,1,1,-1]));invariant(restorePapers(2,[0,5],[2,4,4,99,5]));
});

test('all six reverse-side prints are distinct and deliberately low contrast',()=>{
 assert.equal(new Set(themes.map(materialSVG)).size,6);
 assert.ok(themes.every(theme=>theme.opacity>0&&theme.opacity<=.22));
});
