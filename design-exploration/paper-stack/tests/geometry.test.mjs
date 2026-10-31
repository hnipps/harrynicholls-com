import test from 'node:test';
import assert from 'node:assert/strict';
import { peelGeometry, clipHalfPlane } from '../peel-geometry.js';
const area = points => Math.abs(points.reduce((sum,point,i) => {
  const next = points[(i + 1) % points.length];
  return sum + point.x * next.y - next.x * point.y;
},0)) / 2;

test('the original sheet is intact before the first lift',() => {
  const geometry = peelGeometry(1440,1000,{ x:0,y:0 });
  assert.equal(area(geometry.remaining),1440000);
  assert.equal(geometry.path,'');
});

test('a folded corner and the remaining page conserve area at all drag angles',() => {
  for (const [width,height] of [[1440,1000],[768,1000],[390,844]]) {
    for (const point of [{ x:47,y:43 },{ x:80,y:72 },{ x:350,y:600 },{ x:1700,y:200 },{ x:width * 2.18,y:height * 2.18 }]) {
      const geometry = peelGeometry(width,height,point);
      assert.ok(Math.abs(area(geometry.remaining) + area(geometry.folded) - width * height) < .001);
      assert.ok(!/NaN|Infinity/.test(geometry.path + geometry.clip));
    }
  }
});

test('the reflected corner meets the dragged position and the crease stays fixed',() => {
  const pointer = { x:240,y:180 };
  const geometry = peelGeometry(1440,1000,pointer);
  assert.ok(geometry.folded.some(point => Math.hypot(point.x-pointer.x,point.y-pointer.y) < .001));
  const crease = clipHalfPlane([{ x:0,y:0 },{ x:1440,y:0 },{ x:1440,y:1000 },{ x:0,y:1000 }],geometry.normal,geometry.distance,false)
    .filter(point => Math.abs(point.x*geometry.normal.x+point.y*geometry.normal.y-geometry.distance)<.001);
  assert.equal(crease.length,2);
  for (const point of crease) assert.ok(geometry.folded.some(folded => Math.hypot(folded.x-point.x,folded.y-point.y)<.001));
});

test('the completion target clears every viewport corner',() => {
  for(const [width,height] of [[1440,1000],[390,844],[2560,900]]) {
    assert.equal(peelGeometry(width,height,{ x:width*2.18,y:height*2.18 }).remaining.length,0);
  }
});

test('the rendered curl reaches both crease endpoints without rounding them away',() => {
  for (const [width,height] of [[1440,1000],[390,844]]) {
    for (const pointer of [{x:47,y:43},{x:80,y:72},{x:240,y:180},{x:width*.8,y:height*.2}]) {
      const geometry = peelGeometry(width,height,pointer);
      const curves = [...geometry.path.matchAll(/Q([\d.e+,-]+) ([\d.e+,-]+)/g)];
      let contacts = 0;
      geometry.folded.forEach((point,i) => {
        if (Math.abs(point.x * geometry.normal.x + point.y * geometry.normal.y - geometry.distance) >= .01) return;
        contacts += 1;
        assert.equal(curves[i][1],`${point.x},${point.y}`);
        assert.equal(curves[i][2],`${point.x},${point.y}`);
      });
      assert.equal(contacts,2);
      assert.ok(curves.some(curve => curve[1] !== curve[2]),'the free tip keeps its curve');
    }
  }
});

test('the lifted corner leaves the viewport as the document scrolls',() => {
  const before = peelGeometry(390,844,{ x:47,y:43 },0);
  const partly = peelGeometry(390,844,{ x:47,y:43 },20);
  const away = peelGeometry(390,844,{ x:47,y:43 },100);
  assert.ok(area(partly.remaining)>area(before.remaining));
  assert.equal(area(away.remaining),390*844);
  assert.ok(partly.remaining.every(point=>point.y>=0&&point.y<=844));
});
