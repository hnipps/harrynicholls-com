import { peelGeometry } from './peel-geometry.js?v=scroll-20261030-1';

import { themes } from './paper-materials.js?v=scroll-20261030-1';
import { PaperSheaf } from './paper-sheaf.js?v=scroll-20261030-1';
import { paperPose,pullPaper } from './paper-return.js?v=scroll-20261030-1';

import {restorePapers,peelPaper,retrievePaper} from './paper-state.js?v=scroll-20261030-1';

const storageKey = 'harry-paper-stack-theme';
const stack = document.querySelector('#stack');
const corner = document.querySelector('#peel-corner');
const curl = document.querySelector('#paper-curl');
const paper = document.querySelector('#fold-paper');
const shadow = document.querySelector('#fold-shadow'); // taste-skill-ignore: the lifted sheet physically floats.
const edge = document.querySelector('#fold-edge');
const crease = document.querySelector('#fold-crease');
const shade = document.querySelector('#paper-shade');
const print = document.querySelector('#fold-print');
const pattern = document.querySelector('#reverse-pattern');
const sheafRoot = document.querySelector('#paper-sheaf');
const status = document.querySelector('#view-status');
const hint = document.querySelector('#drag-hint');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const frames = new Map([[0,document.querySelector('#first-sheet')],[1,document.querySelector('#second-sheet')]]);
frames.forEach((frame,index)=>frame.style.setProperty('--sheet-paper',themes[index].paper));
const ready = new Map();
let active = 0;
let pointer = { x:0, y:0 };
let animation = 0;
let gesture = null;
let turning = false;
let openingTimer = 0;
let waitingForTheme = false;
let discarded = [];
let deck = [0,1,2,3,4,5];
const nextView = () => deck[1];
let cornerHovered = false;
const boundDocuments = new WeakSet();
const sheaf = new PaperSheaf(sheafRoot,themes,index => selectTheme(index),focusCurrentView,reducedMotion);

// Wheel/touch events over navigation belong to the readable document, not its locked host.
function scrollCurrentPage(x,y) {
  sheaf.close();
  getFrame(active).contentWindow.scrollBy({left:x,top:y,behavior:'instant'});
}
sheafRoot.addEventListener('wheel',event=>{
  if (turning || gesture) return;
  event.preventDefault();
  const unit = event.deltaMode===1 ? 16 : event.deltaMode===2 ? innerHeight : 1;
  scrollCurrentPage(event.deltaX*unit,event.deltaY*unit);
},{passive:false});
let sheafTouch = null;
let sheafPanned = false;
sheafRoot.addEventListener('pointerdown',event=>{if(event.pointerType!=='touch')sheafPanned=false;});
sheafRoot.addEventListener('touchstart',event=>{
  sheafPanned = false;
  sheafTouch = event.touches.length===1 ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
},{passive:true});
sheafRoot.addEventListener('touchmove',event=>{
  if (!sheafTouch || event.touches.length!==1 || turning) return;
  const touch = event.touches[0],dx=sheafTouch.x-touch.clientX,dy=sheafTouch.y-touch.clientY;
  if (!sheafPanned && Math.hypot(dx,dy)<8) return;
  event.preventDefault();
  sheafPanned = true;
  sheafTouch = {x:touch.clientX,y:touch.clientY};
  scrollCurrentPage(dx,dy);
},{passive:false});
sheafRoot.addEventListener('touchend',()=>{sheafTouch=null;});
sheafRoot.addEventListener('touchcancel',()=>{sheafTouch=null;});
sheafRoot.addEventListener('click',event=>{
  if (!sheafPanned || event.detail===0) return;
  event.preventDefault();event.stopImmediatePropagation();sheafPanned=false;
},true);

function rememberTheme(index) {
  try {
    localStorage.setItem(storageKey, themes[index].slug);
    localStorage.setItem(storageKey + '-papers',JSON.stringify(discarded.map(i => themes[i].slug)));
    localStorage.setItem(storageKey + '-deck',JSON.stringify(deck.map(i => themes[i].slug)));
  } catch { /* The stack also works with storage blocked. */ }
}

function frameReady(frame) {
  if (!ready.has(frame)) {
    ready.set(frame, new Promise(resolve => {
      if (frame.contentDocument?.readyState === 'complete' && frame.contentDocument.querySelector('main')) resolve(frame);
      else frame.addEventListener('load', () => resolve(frame), { once:true });
    }));
  }
  return ready.get(frame);
}

function getFrame(index) {
  if (!frames.has(index)) {
    const frame = document.createElement('iframe');
    frame.className = 'sheet';
    frame.style.setProperty('--sheet-paper',themes[index].paper);
    frame.title = `Harry Nicholls — ${themes[index].name}`;
    frame.inert = true;
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    frame.src = `themes/${themes[index].slug}.html`;
    stack.append(frame);
    frames.set(index, frame);
    observeFrame(frame);
  }
  return frames.get(index);
}

function restPosition() {
  const small = innerWidth <= 600;
  return { x:((small ? 58 : 88) + [0,5,-3,3,-2][active]) * (cornerHovered ? 1.12 : 1), y:((small ? 53 : 79) + [0,-3,4,-2,2][active]) * (cornerHovered ? 1.08 : 1) };
}

function paint(position) {
  pointer = position;
  const current = getFrame(active);
  const scrollY = current.contentWindow?.scrollY || 0;
  const geometry = peelGeometry(innerWidth, innerHeight, position,scrollY);
  current.style.clipPath = geometry.clip;
  for (const path of [paper,print,edge]) path.setAttribute('d',geometry.path);
  shadow.setAttribute('d',geometry.shadowPath);
  shade.setAttribute('x1',geometry.center.x);
  shade.setAttribute('y1',geometry.center.y);
  shade.setAttribute('x2',geometry.tip.x);
  shade.setAttribute('y2',geometry.tip.y);
  const lift = Math.min(16,Math.hypot(position.x,position.y)*.065);
  shadow.setAttribute('transform',`translate(${geometry.normal.x * lift * .35} ${geometry.normal.y * lift * .35})`);
  const contacts = geometry.folded.filter(point => Math.abs(point.x*geometry.normal.x + point.y*geometry.normal.y-geometry.distance)<.01);
  crease.setAttribute('d',contacts.length===2 ? `M${contacts[0].x},${contacts[0].y} L${contacts[1].x},${contacts[1].y}` : '');
  curl.style.opacity = Math.min(1, Math.hypot(position.x,position.y) / 15);
  const { x:nx,y:ny } = geometry.normal;
  const k = 1 + geometry.reach;
  pattern.setAttribute('patternTransform',`matrix(${1-k*nx*nx} ${-k*nx*ny} ${-k*nx*ny} ${1-k*ny*ny} ${k*geometry.distance*nx} ${k*geometry.distance*ny})`);
  positionCorner(scrollY);
}

function stopAnimation() {
  cancelAnimationFrame(animation);
  clearTimeout(openingTimer);
}

function animateTo(target, { duration=650, spring=false }={}) {
  stopAnimation();
  const start = { ...pointer };
  const started = performance.now();
  return new Promise(resolve => {
    if (reducedMotion.matches) { paint(target); resolve(); return; }
    function tick(now) {
      const elapsed = Math.min(1, (now - started) / duration);
      const eased = spring ? 1 - Math.exp(-7 * elapsed) * Math.cos((13 + active * .3) * elapsed) : 1 - (1 - elapsed) ** 3;
      paint({ x:start.x + (target.x - start.x) * eased, y:start.y + (target.y - start.y) * eased });
      if (elapsed < 1) animation = requestAnimationFrame(tick);
      else { paint(target); resolve(); }
    }
    animation = requestAnimationFrame(tick);
  });
}

function updateControls() {
  const theme = themes[active];
  const last = active === themes.length - 1;
  document.body.dataset.theme = theme.slug;
  document.documentElement.style.setProperty('--paper',theme.paper);
  document.documentElement.style.setProperty('--ink',theme.ink);
  document.querySelector('meta[name="theme-color"]').content = theme.paper;
  document.title = `Harry Nicholls · ${theme.name}`;
  corner.hidden = last;
  curl.toggleAttribute('hidden',last);
  corner.disabled = false;
  if (!last) {
    corner.setAttribute('aria-label',`Peel to reveal ${themes[nextView()].name}. Click, or drag down and right.`);
    shade.querySelectorAll('stop').forEach((stop,index) => stop.setAttribute('stop-color',index===0 ? theme.back[1] : theme.paper));
    pattern.setAttribute('width',theme.unit);
    pattern.setAttribute('height',theme.unit);
    pattern.innerHTML = `<g fill="${theme.print}" stroke="${theme.print}">${theme.mark}</g>`;
    print.setAttribute('opacity',theme.opacity);
  }
  positionCorner(getFrame(active).contentWindow?.scrollY || 0);
  status.textContent = `${theme.name}. ${last ? 'The last sheet. Use Put the paper back to start again.' : `Lift the top-left corner to reveal ${themes[nextView()].name}.`}${discarded.length ? ` ${discarded.length} previously opened ${discarded.length === 1 ? 'view is' : 'views are'} available in the paper sheaf.` : ''}`;
}

function setLayers(index) {
  getFrame(index);
  active = index;
  frames.forEach((frame,i) => {
    const current = i === active, underneath = i === nextView();
    frame.classList.toggle('is-current',current);
    frame.classList.toggle('is-under',underneath);
    frame.inert = !current;
    frame.tabIndex = current ? 0 : -1;
    frame.setAttribute('aria-hidden',String(!current));
    frame.style.clipPath = '';
  });
  if (nextView() !== undefined) {
    const under = getFrame(nextView());
    under.classList.add('is-under');
  }
  updateControls();
}

function positionCorner(scrollY) {
  const offPage = active === themes.length - 1 || scrollY > Math.max(pointer.x,pointer.y) + 20;
  corner.hidden = offPage;
  curl.toggleAttribute('hidden',offPage);
  corner.style.transform = `translateY(${-scrollY}px)`;
  curl.style.transform = `translateY(${-scrollY}px)`;
}

function observeFrame(frame) {
  function bind() {
    const doc = frame.contentDocument;
    if (!doc || boundDocuments.has(doc)) return;
    boundDocuments.add(doc);
    let scrollFrame = 0;
    frame.contentWindow.addEventListener('scroll',() => {
      if (frame !== frames.get(active) || turning) return;
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        if (!corner.hidden || frame.contentWindow.scrollY < 160) paint(pointer);
        else { frame.style.clipPath = ''; positionCorner(frame.contentWindow.scrollY); }
      });
    },{ passive:true });
    doc.addEventListener('pointerdown',() => {
      if (frame === frames.get(active)) { sheaf.close(); document.body.classList.remove('using-keyboard'); }
    });
    doc.addEventListener('keydown',event => {
      if (event.key === 'Tab') document.body.classList.add('using-keyboard');
      if (event.key === 'Escape') sheaf.close();
    });
  }
  frame.addEventListener('load',bind);
  bind();
}

function focusCurrentView() {
  if (!corner.hidden && document.body.classList.contains('using-keyboard')) corner.focus({ preventScroll:true });
  else getFrame(active).focus({ preventScroll:true });
}

function completeView(index,previous,{ reset=false,peel=false }={}) {
  const state = reset ? restorePapers() : peel ? peelPaper({deck,discarded}) : retrievePaper({deck,discarded},index);
  deck = state.deck;
  discarded = state.discarded;
  setLayers(index);
  rememberTheme(index);
  sheaf.render(discarded,reset ? undefined : previous);
  turning = false;
  waitingForTheme = false;
  document.body.classList.remove('is-turning','is-returning');
  sheaf.setBusy(false);
  pointer = { x:0,y:0 };
  if (index < themes.length - 1) {
    paint(pointer);
    openingTimer = setTimeout(() => animateTo(restPosition(),{ duration:760,spring:true }),70);
  }
  focusCurrentView();
}

function readingPosition(frame) {
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win || win.scrollY < 100) return { id:'main', top:true };
  const sections = [...doc.querySelectorAll('section[id],footer[id]')];
  const visible = sections.filter(section => section.getClientRects().length && section.getBoundingClientRect().top <= innerHeight * .3).at(-1);
  return { id:visible?.id || 'main', top:false };
}

function matchReadingPosition(frame, position) {
  const doc = frame.contentDocument;
  const alternate = position.id === 'gitrove-story' ? 'gitrove' : 'gitrove-story';
  const target = doc?.getElementById(position.id) || (['gitrove','gitrove-story'].includes(position.id) ? doc?.getElementById(alternate) : null);
  if (position.top) frame.contentWindow.scrollTo(0,0);
  else if (target) {
    for (let ancestor = target; ancestor; ancestor = ancestor.parentElement) {
      if (ancestor.tagName === 'DETAILS') ancestor.open = true;
    }
    if (target.classList.contains('story')) target.querySelectorAll('details').forEach(details => { details.open = true; });
    target.scrollIntoView();
  }
}

async function commitPeel() {
  if (turning || waitingForTheme || active === themes.length - 1) return;
  waitingForTheme = true;
  corner.disabled = true;
  const next = getFrame(nextView());
  try {
    await frameReady(next);
    waitingForTheme = false;
    turning = true;
    document.body.classList.add('is-turning');
    sheaf.setBusy(true);
    const previous = active;
    const position = readingPosition(getFrame(active));
    matchReadingPosition(next,position);
    await animateTo({ x:innerWidth * 2.18, y:innerHeight * 2.18 },{ duration:1050 });
    completeView(nextView(),previous,{peel:true});
  } catch {
    waitingForTheme = false;
    turning = false;
    corner.disabled = false;
    document.body.classList.remove('is-turning');
    sheaf.setBusy(false);
    status.textContent = 'This view could not load. You can keep reading or try the corner again.';
    animateTo(restPosition(),{ spring:true });
  }
}

async function selectTheme(index, reset=false) {
  if (turning || waitingForTheme || (!reset && !discarded.includes(index))) return;
  stopAnimation();
  waitingForTheme = true;
  const previous = active;
  const position = readingPosition(getFrame(active));
  const source = paperPose(sheaf.button(index));
  const frame = getFrame(index);
  try {
    await frameReady(frame);
    turning = true;
    waitingForTheme = false;
    sheaf.setBusy(true);
    if (sheaf.button(index)) sheaf.button(index).style.visibility = 'hidden';
    document.body.classList.add('is-returning','is-turning');
    getFrame(previous).style.clipPath = '';
    frame.classList.add('is-returning');
    if (reset) frame.contentWindow.scrollTo(0,0);
    else matchReadingPosition(frame,position);
    frame.style.clipPath = '';
    if (!reducedMotion.matches) {
      const finish = await pullPaper(frame,themes[index],source);
      completeView(index,previous,{ reset });
      finish();
    } else completeView(index,previous,{ reset });
    frame.classList.remove('is-returning');
  } catch {
    if (sheaf.button(index)) sheaf.button(index).style.visibility = '';
    frame.classList.remove('is-returning');
    turning = false;
    waitingForTheme = false;
    document.body.classList.remove('is-turning','is-returning');
    sheaf.setBusy(false);
    paint(pointer);
    status.textContent = 'This paper could not be opened. You can keep reading and try again.';
  }
}

corner.addEventListener('pointerenter',event => {
  if (event.pointerType !== 'mouse') return;
  cornerHovered = true;
  if (!turning && !waitingForTheme && !gesture && Math.hypot(pointer.x,pointer.y)>20) animateTo(restPosition(),{duration:260});
});
corner.addEventListener('pointerleave',event => {
  if (event.pointerType !== 'mouse') return;
  cornerHovered = false;
  if (!turning && !waitingForTheme && !gesture && Math.hypot(pointer.x,pointer.y)>20) animateTo(restPosition(),{duration:420,spring:true});
});
corner.addEventListener('pointerdown',event => {
  if (turning || waitingForTheme || event.button !== 0) return;
  event.preventDefault();
  stopAnimation();
  corner.focus({ preventScroll:true });
  corner.setPointerCapture(event.pointerId);
  gesture = { id:event.pointerId, x:event.clientX,y:event.clientY, start:{ ...pointer },moved:false };
});
corner.addEventListener('pointermove',event => {
  if (!gesture || event.pointerId !== gesture.id) return;
  const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
  if (Math.hypot(dx,dy) > 5) gesture.moved = true;
  if (!gesture.moved) return;
  document.body.classList.add('is-dragging');
  const x = Math.max(0,gesture.start.x + dx), y = Math.max(0,gesture.start.y + dy);
  const angle = Math.max(.25,Math.min(1.32,Math.atan2(y,x)));
  const length = Math.min(Math.hypot(x,y),Math.hypot(innerWidth,innerHeight) * 2.2);
  paint({ x:Math.cos(angle) * length,y:Math.sin(angle) * length });
  hint.textContent = dragCommitted() ? `Release to reveal ${themes[nextView()].name}` : 'Keep pulling, or let go to put it back';
});
function dragCommitted() {
  return Math.hypot(pointer.x,pointer.y) > Math.hypot(innerWidth,innerHeight) * .36;
}
function endGesture(event,cancel=false) {
  if (!gesture || (event.pointerId !== undefined && event.pointerId !== gesture.id)) return;
  const moved = gesture.moved;
  const pointerId = gesture.id;
  gesture = null;
  document.body.classList.remove('is-dragging');
  if (corner.hasPointerCapture(pointerId)) corner.releasePointerCapture(pointerId);
  if (!cancel && (!moved || dragCommitted())) commitPeel();
  else animateTo(restPosition(),{ duration:650,spring:true });
}
corner.addEventListener('pointerup',event => endGesture(event));
corner.addEventListener('pointercancel',event => endGesture(event,true));
corner.addEventListener('lostpointercapture',event => endGesture(event,true));
corner.addEventListener('click',event => { if (event.detail === 0) commitPeel(); });
window.addEventListener('keydown',event => {
  document.body.classList.add('using-keyboard');
  if (event.key === 'Escape') {
    if (gesture) endGesture({ pointerId:gesture.id },true);
    sheaf.close();
  }
});
window.addEventListener('resize',() => {
  if (gesture) endGesture({ pointerId:gesture.id },true);
  if (!turning && active < themes.length - 1) { stopAnimation(); paint(restPosition()); }
});
reducedMotion.addEventListener('change',() => {
  if (!turning && active < themes.length - 1) { stopAnimation(); paint(restPosition()); }
});

document.addEventListener('pointerdown',event => {
  document.body.classList.remove('using-keyboard');
  if (!event.target.closest('#paper-sheaf')) sheaf.close();
});
window.addEventListener('message',event => {
  if (event.origin === location.origin && event.source === getFrame(active).contentWindow && event.data?.type === 'paper-stack:reset') selectTheme(0,true);
});

let saved = null;
let storedPapers = null;
let storedDeck = null;
try {
  saved = localStorage.getItem(storageKey);
  storedPapers = JSON.parse(localStorage.getItem(storageKey + '-papers') || 'null');
  storedDeck = JSON.parse(localStorage.getItem(storageKey + '-deck') || 'null');
} catch { /* A storage-free browser starts at the letter. */ }
if (new URLSearchParams(location.search).has('reset')) {
  saved = null;
  storedPapers = [];
  storedDeck = null;
  history.replaceState(null,'',location.pathname);
}
const initial = Math.max(0,themes.findIndex(theme => theme.slug === saved));
const toIndices = values => Array.isArray(values) ? values.map(slug => themes.findIndex(theme => theme.slug === slug)) : null;
const restored = restorePapers(initial,toIndices(storedPapers) || Array.from({length:initial},(_,i)=>i),toIndices(storedDeck));
discarded = restored.discarded;
deck = restored.deck;
rememberTheme(initial);
frames.forEach(observeFrame);
setLayers(initial);
sheaf.render(discarded);
if (initial < themes.length - 1) {
  paint({ x:0,y:0 });
  openingTimer = setTimeout(() => animateTo(restPosition(),{ duration:850,spring:true }),550);
}
const sourceWave = [...document.childNodes].find(node => node.nodeType === 8 && node.textContent.includes('source-viewers'));
console.info('%c' + (sourceWave?.textContent.trim() || 'Hello, curious person. Thanks for looking closely.'), 'font:12px/1.25 monospace;color:#42657b');
