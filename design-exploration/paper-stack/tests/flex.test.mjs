import test from 'node:test';
import assert from 'node:assert/strict';
import {sheetMesh,meshTriangles} from '../paper-flex.js';
const pose={x:1200,y:600,angle:-6,printScale:1};
test('the landing maps the complete front back onto the viewport',()=>{
 const {vertices:v}=sheetMesh(1440,1000,pose,1);
 assert.ok(Math.abs(v[0]-1440)<.01);assert.ok(Math.abs(v[1])<.01);
 const last=64*6;assert.ok(Math.abs(v[last])<.01);assert.ok(Math.abs(v[last+2])<.01);
 assert.ok(Math.abs(v.at(-5)-1000)<.01);
});
test('the middle of the turn is curved and exposes both sides of the same connected sheet',()=>{
 const {vertices:v,bend}=sheetMesh(1440,1000,pose,.48);
 const row=8*65*6;
 const deviation=Math.hypot(...[0,1,2].map(axis=>v[row+32*6+axis]-(v[row+axis]+v[row+64*6+axis])/2));
 assert.ok(deviation>200);assert.ok(bend>1.5);
 const normals=Array.from({length:65},(_,i)=>v[row+i*6+5]);
 assert.ok(normals.some(n=>n<-.5));assert.ok(normals.some(n=>n>.5));
});
test('strip integration preserves sheet length through every bend',()=>{
 for(const t of [0,.1,.3,.5,.7,.9,1]){
  const {vertices:v}=sheetMesh(1440,1000,pose,t);
  for(let col=0;col<64;col++){
   const at=(8*65+col)*6,next=at+6;
   const dx=v[next]-v[at],dy=v[next+1]-v[at+1],dz=v[next+2]-v[at+2];
   assert.ok(Math.abs(Math.hypot(dx,dy,dz)-22.5)<.04);
  }
 }
});
test('the mesh is finite at desktop and phone sizes and its triangles share vertices',()=>{
 for(const [w,h]of[[1440,1000],[390,844]])for(const t of [0,.25,.5,.75,1])assert.ok(sheetMesh(w,h,pose,t).vertices.every(Number.isFinite));
 const indices=meshTriangles();assert.equal(indices.length,64*16*6);assert.ok(Math.max(...indices)<65*17);
});
