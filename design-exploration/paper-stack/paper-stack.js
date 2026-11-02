import { peelGeometry } from './peel-geometry.js?v=band-20261031-2';

import { themes } from './paper-materials.js?v=band-20261031-2';
import { PaperSheaf } from './paper-sheaf.js?v=band-20261031-2';
import { paperPose,pullPaper } from './paper-return.js?v=band-20261031-2';

import {restorePapers,peelPaper,retrievePaper} from './paper-state.js?v=band-20261031-2';
import {resting,step,layers} from './paper-machine.js?v=band-20261031-2';

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
let state = resting(0);
let pointer = { x:0, y:0 };
let animation = 0;
let gesture = null;
let openingTimer = 0;
let discarded = [];
let deck = [0,1,2,3,4,5];
const nextView = () => deck[1];
let cornerHovered = false;
let cornerReturning = false;
const boundDocuments = new WeakSet();
const sheaf = new PaperSheaf(sheafRoot,themes,index => selectTheme(index),focusCurrentView,reducedMotion);

// Inert frames are skipped by hit-testing, so the reading frame must be the one that is not.
function markReading(frame,reading) {
  frame.classList.toggle('is-reading',reading);
  frame.inert = !reading;
}

function dispatch(event) {
  const next = step(state,event);
  if (next === state) return false;
  state = next;
  const plan = layers(state);
  document.body.classList.toggle('is-turning',plan.turning);
  document.body.classList.toggle('is-returning',plan.returning);
  document.body.classList.toggle('corner-asleep',!plan.cornerLive);
  frames.forEach((frame,index) => markReading(frame,index === plan.reading));
  sheaf.setBusy(plan.turning);
  return true;
}

// Wheel/touch events over navigation belong to the readable document, not its locked host.
function scrollCurrentPage(x,y) {
  sheaf.close();
  getFrame(layers(state).reading).contentWindow.scrollBy({left:x,top:y,behavior:'instant'});
}
function forwardWheel(event) {
  if (state.mode === 'drag') return;
  event.preventDefault();
  const unit = event.deltaMode===1 ? 16 : event.deltaMode===2 ? innerHeight : 1;
  scrollCurrentPage(event.deltaX*unit,event.deltaY*unit);
}
sheafRoot.addEventListener('wheel',forwardWheel,{passive:false});
// The pointer is still resting on the corner after a click peels the sheet.
corner.addEventListener('wheel',forwardWheel,{passive:false});
let sheafTouch = null;
let sheafPanned = false;
sheafRoot.addEventListener('pointerdown',event=>{if(event.pointerType!=='touch')sheafPanned=false;});
sheafRoot.addEventListener('touchstart',event=>{
  sheafPanned = false;
  sheafTouch = event.touches.length===1 ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
},{passive:true});
sheafRoot.addEventListener('touchmove',event=>{
  if (!sheafTouch || event.touches.length!==1 || layers(state).turning) return;
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
  return { x:((small ? 47 : 80) + [0,5,-3,3,-2][state.active]) * (cornerHovered ? 1.12 : 1), y:((small ? 43 : 72) + [0,-3,4,-2,2][state.active]) * (cornerHovered ? 1.08 : 1) };
}

function paint(position) {
  pointer = position;
  const current = getFrame(state.active);
  // iOS rubber-banding reports a negative scroll; the corner stays put rather than opening further.
  const scrollY = Math.max(0, current.contentWindow?.scrollY || 0);
  const geometry = peelGeometry(innerWidth, innerHeight, position,scrollY);
  current.style.clipPath = geometry.clip;
  for (const path of [paper,shadow,print,edge]) path.setAttribute('d',geometry.path);
  shade.setAttribute('x1',geometry.center.x);
  shade.setAttribute('y1',geometry.center.y);
  shade.setAttribute('x2',position.x);
  shade.setAttribute('y2',position.y);
  const lift = Math.min(16,Math.hypot(position.x,position.y)*.065);
  shadow.setAttribute('transform',`translate(${geometry.normal.x * lift} ${geometry.normal.y * lift})`);
  const contacts = geometry.folded.filter(point => Math.abs(point.x*geometry.normal.x + point.y*geometry.normal.y-geometry.distance)<.01);
  crease.setAttribute('d',contacts.length===2 ? `M${contacts[0].x},${contacts[0].y} L${contacts[1].x},${contacts[1].y}` : '');
  curl.style.opacity = Math.min(1, Math.hypot(position.x,position.y) / 15);
  const { x:nx,y:ny } = geometry.normal;
  pattern.setAttribute('patternTransform',`matrix(${1-2*nx*nx} ${-2*nx*ny} ${-2*nx*ny} ${1-2*ny*ny} ${2*geometry.distance*nx} ${2*geometry.distance*ny})`);
  positionCorner(scrollY);
}

function stopAnimation() {
  cancelAnimationFrame(animation);
  clearTimeout(openingTimer);
  cornerReturning = false;
}

// Curled paper is springy but heavily damped: one ~6% overshoot, a faint
// counter-swing, then rest. Each sheet's stiffness differs slightly.
function paperSpring(t) {
  const damping = .66, frequency = 12.2 * (1 + [0,.04,-.03,.05,-.02][state.active]);
  const decay = damping * frequency, ringing = frequency * Math.sqrt(1 - damping ** 2);
  return 1 - Math.exp(-decay * t) * (Math.cos(ringing * t) + decay / ringing * Math.sin(ringing * t));
}

function animateTo(target, { duration=760, settle=false }={}) {
  stopAnimation();
  const start = { ...pointer };
  const started = performance.now();
  return new Promise(resolve => {
    if (reducedMotion.matches) { paint(target); resolve(); return; }
    function tick(now) {
      const elapsed = Math.min(1, (now - started) / duration);
      const eased = settle ? paperSpring(elapsed) : 1 - (1 - elapsed) ** 3;
      paint({ x:Math.max(0,start.x + (target.x - start.x) * eased), y:Math.max(0,start.y + (target.y - start.y) * eased) });
      if (elapsed < 1) animation = requestAnimationFrame(tick);
      else { paint(target); resolve(); }
    }
    animation = requestAnimationFrame(tick);
  });
}

function updateControls() {
  const theme = themes[state.active];
  const last = state.active === themes.length - 1;
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
  positionCorner(Math.max(0, getFrame(state.active).contentWindow?.scrollY || 0));
  status.textContent = `${theme.name}. ${last ? 'The last sheet. Use Put the paper back to start again.' : `Lift the top-left corner to reveal ${themes[nextView()].name}.`}${discarded.length ? ` ${discarded.length} previously opened ${discarded.length === 1 ? 'view is' : 'views are'} available in the paper sheaf.` : ''}`;
}

function setLayers() {
  getFrame(state.active);
  const { reading } = layers(state);
  frames.forEach((frame,i) => {
    const current = i === state.active, underneath = i === nextView();
    frame.classList.toggle('is-current',current);
    frame.classList.toggle('is-under',underneath);
    markReading(frame,i === reading);
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
  const offPage = state.active === themes.length - 1 || scrollY > Math.max(pointer.x,pointer.y) + 20;
  corner.hidden = offPage;
  document.body.classList.toggle('corner-away', offPage);
  curl.toggleAttribute('hidden',offPage);
  corner.style.transform = `translateY(${-scrollY}px)`;
  curl.style.transform = `translateY(${-scrollY}px)`;
}

function observeFrame(frame) {
  function bind() {
    const doc = frame.contentDocument;
    if (!doc || boundDocuments.has(doc)) return;
    boundDocuments.add(doc);
    doc.documentElement.style.overscrollBehavior = 'none';
    let scrollFrame = 0;
    frame.contentWindow.addEventListener('scroll',() => {
      if (frame !== frames.get(state.active) || layers(state).turning) return;
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        if (!corner.hidden || frame.contentWindow.scrollY < 160) paint(pointer);
        else { frame.style.clipPath = ''; positionCorner(Math.max(0, frame.contentWindow.scrollY)); }
      });
    },{ passive:true });
    doc.addEventListener('pointerdown',() => {
      if (frame === frames.get(state.active)) { sheaf.close(); document.body.classList.remove('using-keyboard'); }
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
  else getFrame(state.active).focus({ preventScroll:true });
}

function completeView(index,previous,{ reset=false,peel=false }={}) {
  const papers = reset ? restorePapers() : peel ? peelPaper({deck,discarded}) : retrievePaper({deck,discarded},index);
  deck = papers.deck;
  discarded = papers.discarded;
  dispatch({ type:'done' });
  setLayers();
  rememberTheme(index);
  sheaf.render(discarded,reset ? undefined : previous);
  pointer = { x:0,y:0 };
  if (index < themes.length - 1) {
    paint(pointer);
    openingTimer = setTimeout(() => animateTo(restPosition(),{ duration:820,settle:true }),70);
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

async function commitPeel(type='peel') {
  if (state.active === themes.length - 1 || !dispatch({ type,index:nextView() })) return;
  corner.disabled = true;
  const next = getFrame(nextView());
  try {
    await frameReady(next);
    const previous = state.active;
    const position = readingPosition(getFrame(state.active));
    matchReadingPosition(next,position);
    dispatch({ type:'ready' });
    await animateTo({ x:innerWidth * 2.18, y:innerHeight * 2.18 },{ duration:1050 });
    completeView(nextView(),previous,{peel:true});
  } catch {
    dispatch({ type:'fail' });
    setLayers();
    status.textContent = 'This view could not load. You can keep reading or try the corner again.';
    animateTo(restPosition(),{ settle:true });
  }
}

async function selectTheme(index, reset=false) {
  if ((!reset && !discarded.includes(index)) || !dispatch({ type:'select',index })) return;
  stopAnimation();
  const previous = state.active;
  const position = readingPosition(getFrame(state.active));
  const source = paperPose(sheaf.button(index));
  const frame = getFrame(index);
  try {
    await frameReady(frame);
    if (sheaf.button(index)) sheaf.button(index).style.visibility = 'hidden';
    getFrame(previous).style.clipPath = '';
    frame.classList.add('is-returning');
    if (reset) frame.contentWindow.scrollTo(0,0);
    else matchReadingPosition(frame,position);
    frame.style.clipPath = '';
    dispatch({ type:'ready' });
    if (!reducedMotion.matches) {
      const finish = await pullPaper(frame,themes[index],source);
      completeView(index,previous,{ reset });
      finish();
    } else completeView(index,previous,{ reset });
    frame.classList.remove('is-returning');
  } catch {
    if (sheaf.button(index)) sheaf.button(index).style.visibility = '';
    frame.classList.remove('is-returning');
    dispatch({ type:'fail' });
    setLayers();
    paint(pointer);
    status.textContent = 'This paper could not be opened. You can keep reading and try again.';
  }
}

corner.addEventListener('pointerenter',event => {
  if (event.pointerType !== 'mouse') return;
  cornerHovered = true;
  if (state.mode === 'rest' && !cornerReturning && Math.hypot(pointer.x,pointer.y)>20) animateTo(restPosition(),{duration:520,settle:true});
});
corner.addEventListener('pointerleave',event => {
  if (event.pointerType !== 'mouse') return;
  cornerHovered = false;
  if (state.mode === 'rest' && !cornerReturning && Math.hypot(pointer.x,pointer.y)>20) animateTo(restPosition(),{duration:620,settle:true});
});
corner.addEventListener('pointerdown',event => {
  if (event.button !== 0 || !dispatch({ type:'press' })) return;
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
  if (!cancel && (!moved || dragCommitted()) && state.active < themes.length - 1) commitPeel('commit');
  else {
    dispatch({ type:cancel ? 'cancel' : 'release' });
    cornerHovered = event.pointerType === 'mouse' && document.elementFromPoint(event.clientX,event.clientY) === corner;
    const settling = animateTo(restPosition(),{ duration:780,settle:true });
    // Releasing pointer capture can fire pointerleave; it must not replace this
    // full return with the much shorter hover animation.
    cornerReturning = true;
    settling.then(() => { cornerReturning = false; });
  }
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
  if (!layers(state).turning && state.active < themes.length - 1) { stopAnimation(); paint(restPosition()); }
});
reducedMotion.addEventListener('change',() => {
  if (!layers(state).turning && state.active < themes.length - 1) { stopAnimation(); paint(restPosition()); }
});

document.addEventListener('pointerdown',event => {
  document.body.classList.remove('using-keyboard');
  if (!event.target.closest('#paper-sheaf')) sheaf.close();
});
window.addEventListener('message',event => {
  if (event.origin === location.origin && event.source === getFrame(state.active).contentWindow && event.data?.type === 'paper-stack:reset') selectTheme(0,true);
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
state = resting(initial);
setLayers();
sheaf.render(discarded);
if (initial < themes.length - 1) {
  paint({ x:0,y:0 });
  openingTimer = setTimeout(() => animateTo(restPosition(),{ duration:900,settle:true }),550);
}
const sourceWave = [...document.childNodes].find(node => node.nodeType === 8 && node.textContent.includes('source-viewers'));
console.info('%c' + (sourceWave?.textContent.trim() || 'Hello, curious person. Thanks for looking closely.'), 'font:12px/1.25 monospace;color:#42657b');
