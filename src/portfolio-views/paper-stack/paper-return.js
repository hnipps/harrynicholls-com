import { materialURL } from './paper-materials.js?v=polish-20261030-1';
import {pagePicture} from './paper-snapshot.js?v=polish-20261030-1';
import {flexiblePaper} from './paper-webgl.js?v=polish-20261030-1';

/** Capture the actual paper corner, including a hover transition that is still in flight. */
export function paperPose(button) {
  if (!button) return null;
  const style = getComputedStyle(button);
  const matrix = new DOMMatrix(style.transform);
  const [ox,oy] = style.transformOrigin.split(' ').map(Number.parseFloat);
  const parent = button.offsetParent.getBoundingClientRect();
  const face = button.querySelector('.paper-face');
  const slide = face ? new DOMMatrix(getComputedStyle(face).transform) : new DOMMatrix();
  return {
    x:parent.left + button.offsetLeft + ox + matrix.e - matrix.a * ox - matrix.c * oy + matrix.a * slide.e + matrix.c * slide.f,
    y:parent.top + button.offsetTop + oy + matrix.f - matrix.b * ox - matrix.d * oy + matrix.b * slide.e + matrix.d * slide.f,
    angle:Math.atan2(matrix.b,matrix.a) * 180 / Math.PI,
    printScale:Math.hypot(matrix.a,matrix.b)
  };
}

function bowedEdge(width,height,bend) {
  // Opposing edges flex by different amounts as tension travels across the sheet.
  return `path("M0 0 C${width*.28} ${bend} ${width*.72} ${bend*.35} ${width} 0 C${width-bend*.4} ${height*.3} ${width-bend} ${height*.7} ${width} ${height} C${width*.72} ${height-bend*.55} ${width*.28} ${height-bend} 0 ${height} C${bend*.3} ${height*.7} ${bend*.7} ${height*.3} 0 0 Z")`;
}

export function flightFrames(width,height,pose,front=false) {
  const angle = pose.angle * Math.PI / 180;
  // The full-size paper initially shares the visible corner of its discarded sheet.
  const x = pose.x - width/2 + Math.cos(angle)*width/2 - Math.sin(angle)*height/2;
  const y = pose.y - height/2 + Math.sin(angle)*width/2 + Math.cos(angle)*height/2;
  const perspective = Math.max(1600,width*2.2);
  const flex = Math.min(34,width*.045);
  const phases = [
    { offset:0, x,y,z:0,rz:pose.angle,rx:0,ry:0,bend:0 },
    { offset:.13,x:x*.92-24,y:y*.94-18,z:20,rz:pose.angle-2,rx:3,ry:-12,bend:flex*.35 },
    { offset:.38,x:x*.3,y:y*.28,z:85,rz:-8,rx:7,ry:-58,bend:flex },
    { offset:.6,x:x*.055,y:y*.07,z:72,rz:-3.5,rx:4,ry:-116,bend:flex*.8 },
    { offset:.84,x:-2,y:-6,z:12,rz:.35,rx:-.5,ry:-177,bend:flex*.16 },
    { offset:.94,x:0,y:1.5,z:1,rz:.08,rx:.15,ry:-180,bend:1 },
    { offset:1,x:0,y:0,z:0,rz:0,rx:0,ry:-180,bend:0 }
  ];
  return phases.map(phase => ({
    offset:phase.offset,
    transform:`perspective(${perspective}px) translate3d(${phase.x}px,${phase.y}px,${phase.z}px) rotateZ(${phase.rz}deg) rotateX(${phase.rx}deg) rotateY(${phase.ry}deg)${front ? ' rotateY(180deg)' : ''}`,
    clipPath:bowedEdge(width,height,phase.bend)
  }));
}

/** Two opposite faces of one full-size sheet. The live iframe never leaves its document. */
async function rigidPaper(frame,theme,source) {
  const width = innerWidth,height = innerHeight;
  const pose = source || { x:width-100,y:height-80,angle:-8,printScale:1 };
  const reverse = document.createElement('div');
  reverse.className = 'paper-return-back';
  reverse.setAttribute('aria-hidden','true');
  reverse.style.backgroundColor = theme.paper;
  const print = document.createElement('span');
  print.className = 'paper-return-print';
  print.style.backgroundImage = materialURL(theme);
  print.style.backgroundSize = `${theme.unit*pose.printScale}px ${theme.unit*pose.printScale}px`;
  print.style.opacity = theme.opacity;
  reverse.append(print);
  const shadow = document.createElement('div'); // taste-skill-ignore: cast only by the moving sheet.
  shadow.className = 'paper-return-shadow';
  shadow.setAttribute('aria-hidden','true');
  document.body.append(shadow,reverse);
  const previousOrigin = frame.style.transformOrigin;
  frame.style.transformOrigin = '50% 50%';
  // The authored poses already accelerate the pull and decelerate the landing.
  // An overall ease-out would rush past the back/front turn near the beginning.
  const timing = { duration:1450,easing:'linear',fill:'forwards' };
  const backFrames = flightFrames(width,height,pose);
  const frontFrames = flightFrames(width,height,pose,true);
  const animations = [
    reverse.animate(backFrames,timing),
    frame.animate(frontFrames,timing),
    shadow.animate(backFrames.map(({transform,offset},index)=>({transform,offset,opacity:[.03,.08,.17,.13,.06,.025,0][index]})),timing)
  ];
  function finish() {
    animations.forEach(animation => animation.cancel());
    reverse.remove();
    shadow.remove();
    frame.style.transformOrigin = previousOrigin;
  }
  try { await Promise.all(animations.map(animation => animation.finished)); }
  catch (error) { finish(); throw error; }
  return finish;
}

/** Rasterize only for the brief deforming turn, then restore the untouched live document. */
export async function pullPaper(frame,theme,source) {
  frame.classList.add('is-flexing');
  try {
    const picture=await pagePicture(frame);
    const finish=await flexiblePaper(picture,theme,source||{x:innerWidth-100,y:innerHeight-80,angle:-8,printScale:1});
    return ()=>{finish();frame.classList.remove('is-flexing');};
  }catch(error) {
    frame.classList.remove('is-flexing');
    // Keep navigation available on engines that cannot rasterize HTML or create a GPU context.
    console.info('Flexible paper unavailable; using the matte fallback.',error.message);
    return rigidPaper(frame,theme,source);
  }
}
