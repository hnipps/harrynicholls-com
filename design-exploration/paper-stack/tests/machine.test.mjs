import test from 'node:test';
import assert from 'node:assert/strict';
import {modes,events,resting,step,layers} from '../paper-machine.js';

const views=[0,1,2,3,4,5];
const inputs=events.flatMap(type=>['peel','commit','select'].includes(type)?views.map(index=>({type,index})):[{type}]);
const key=s=>`${s.mode}:${s.active}:${s.incoming}`;

function explore() {
  const seen=new Map(),edges=[],queue=views.map(resting);
  queue.forEach(s=>seen.set(key(s),s));
  while(queue.length){
    const s=queue.shift();
    for(const e of inputs){
      const next=step(s,e);
      edges.push([s,e,next]);
      if(!seen.has(key(next))){seen.set(key(next),next);queue.push(next);}
    }
  }
  return {states:[...seen.values()],edges};
}
const {states,edges}=explore();

test('every reachable state is a known mode with a readable page',()=>{
  assert.ok(states.length>views.length);
  for(const s of states){
    assert.ok(modes.includes(s.mode),key(s));
    assert.ok(views.includes(layers(s).reading),`${key(s)} has a page to read`);
  }
});

test('a moving sheet takes input only on the page it lands on',()=>{
  for(const [s,e,next] of edges){
    if(!layers(s).turning||next===s||e.type==='fail') continue;
    assert.equal(layers(next).reading,layers(s).reading,`${key(s)} --${e.type}--> ${key(next)}`);
    assert.equal(next.active,layers(s).reading);
  }
  for(const [s,,next] of edges){
    if(!layers(s).turning&&layers(next).turning) assert.equal(layers(next).reading,s.incoming,`${key(s)} starts moving toward its page`);
  }
});

test('the corner takes no input while a sheet is moving',()=>{
  for(const s of states) if(layers(s).turning) assert.equal(layers(s).cornerLive,false,key(s));
});

test('an event a mode does not handle changes nothing',()=>{
  for(const [s,e,next] of edges) if(key(s)===key(next)) assert.equal(next,s,`${key(s)} ignores ${e.type}`);
});

test('every state can get back to rest',()=>{
  const back=new Set(states.filter(s=>s.mode==='rest').map(key));
  for(let grew=true;grew;){
    grew=false;
    for(const [s,,next] of edges) if(!back.has(key(s))&&back.has(key(next))){back.add(key(s));grew=true;}
  }
  for(const s of states) assert.ok(back.has(key(s)),`${key(s)} is stuck`);
});
