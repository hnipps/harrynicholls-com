// A camera and arrival storyboard. Real HTML remains separate from the canvas
// until an arrival direction is chosen for the HTML-in-Canvas feasibility study.
const scene = document.querySelector('#scene');
const canvas = document.querySelector('#starfield');
const context = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const query = new URLSearchParams(location.search);
if (query.has('embed')) document.body.classList.add('is-embedded');

const places = {
  work: { label:'Work', x:-230, y:-20, z:0, kind:'region' },
  about: { label:'About', x:230, y:-160, z:-40, kind:'region' },
  writing: { label:'Writing', x:310, y:130, z:-80, kind:'region' },
  contact: { label:'Contact', x:-130, y:230, z:20, kind:'region' },
  gitrove: { label:'gitrove', x:-270, y:-90, z:70, kind:'project', description:'Daily discoveries from your GitHub network.' },
  crosscheck: { label:'Crosscheck', x:-110, y:-100, z:20, kind:'project', description:'Formal verification for AI-generated code.' },
  recommender: { label:'Recommender', x:-330, y:10, z:-20, kind:'project', description:'Film and TV recommendations that learn my taste.' },
  opsdeck: { label:'opsdeck', x:-140, y:30, z:65, kind:'project', description:'The pull requests that need me, in one place.' },
  'go-home': { label:'GoHome', x:-320, y:140, z:20, kind:'project', description:'One home for the services on my home server.' },
  'llm-cover-letters': { label:'LLM Cover Letters', x:-110, y:155, z:-50, kind:'project', description:'Cover letters shaped around the job.' },
};
const projects = Object.entries(places).filter(([,place]) => place.kind === 'project');
const images = { gitrove:'gitrove/v2-1.png', opsdeck:'opsdeck/1.png', 'go-home':'go-home/1.png', recommender:'recommender/1.png', 'llm-cover-letters':'llm-cover-letters/1.png' };
const momentCopy = {
  overview:'Start with a quiet view of the whole galaxy. Major destinations are named; smaller stars become useful as you move closer.',
  work:'Work is a region. As you approach, six named project stars resolve out of the field. Their positions are stable.',
  approach:'The camera follows a short, continuous path toward gitrove. Foreground and distant stars move at different speeds, giving the journey depth.',
  arrival:'The camera rests at the project. Compare how each arrival treatment keeps the star, the reading surface, and the wider galaxy in view.',
  return:'Pull back along the same geography. The wider Work region and its neighbouring destinations become visible again.',
  section:'Sections have places too. The same navigation works at the scale of a region and at the scale of a project.',
};
let state = { phase:'overview', arrival:['beside','open','around'].includes(query.get('arrival')) ? query.get('arrival') : 'beside', selected:'gitrove', paused:reducedMotion.matches };
let camera = {x:0,y:0,z:1000};
let flight = null;
let viewport = {width:1200,height:860,dpr:1};
let pointer = {x:-1000,y:-1000};
let visible = true;
let playTimers = [];

function randomGenerator(seed) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}
function makeParticles() {
  const random = randomGenerator(7340);
  return Array.from({length:3600}, (_,i) => {
    const radius = Math.sqrt(random()) * 900;
    const arm = i % 3 * Math.PI * 2 / 3;
    const angle = radius * .007 + arm + (random()-.5) * 1.25;
    return {x:Math.cos(angle)*radius,y:Math.sin(angle)*radius*.55,z:(random()-.5)*160+(1-radius/900)*120,light:random(),size:random()};
  });
}
const particles = makeParticles();
const farStars = Array.from({length:250}, (() => {
  const random=randomGenerator(7341);
  return () => ({x:random(),y:random(),light:random()});
})());

function resize() {
  const box = scene.getBoundingClientRect();
  viewport = {width:box.width,height:box.height,dpr:Math.min(devicePixelRatio || 1,2)};
  canvas.width = Math.round(box.width*viewport.dpr);
  canvas.height = Math.round(box.height*viewport.dpr);
  context.setTransform(viewport.dpr,0,0,viewport.dpr,0,0);
}
new ResizeObserver(resize).observe(scene);
new IntersectionObserver(entries => { visible=entries[0].isIntersecting; }).observe(scene);
resize();

function project(point) {
  const {width,height} = viewport;
  const depth = Math.max(90,camera.z-point.z);
  const factor = width*.85/depth;
  const cx = width * (width<700 ? .5 : .66);
  const cy = height * (width<700 && state.phase==='overview' ? .69 : .5);
  return {x:cx+(point.x-camera.x)*factor,y:cy+(point.y-camera.y)*factor,factor};
}
function nodePosition(id) {
  const {width,height}=viewport;
  if (width<700 && ['overview','return'].includes(state.phase)) {
    const positions={work:[.18,.67],about:[.65,.69],writing:[.26,.82],contact:[.65,.82]};
    const coordinate=positions[id];
    if(coordinate) return {x:width*coordinate[0],y:height*coordinate[1]};
  }
  if (width<700 && state.phase==='work') {
    const index=projects.findIndex(([key])=>key===id);
    if(index>=0) return {x:width*(index%2 ? .55:.1),y:height*(.40+Math.floor(index/2)*.18)};
  }
  if (state.phase==='arrival' && id===state.selected) {
    const layouts=width<700 ? {beside:[.24,.21],open:[.76,.145],around:[.5,.29]} : {beside:[.27,.48],open:[.93,.19],around:[.45,.46]};
    const point=layouts[state.arrival];return {x:width*point[0],y:height*point[1]};
  }
  const point=project(places[id]);
  return {x:Math.max(20,Math.min(width-155,point.x)),y:Math.max(160,Math.min(height-130,point.y))};
}
function drawParticles(time) {
  const {width,height}=viewport;
  context.clearRect(0,0,width,height);
  for(const star of farStars) {
    context.fillStyle=star.light>.9 ? '#8b9caf':'#36414f';
    context.fillRect(Math.floor(star.x*width),Math.floor(star.y*height),1,1);
  }
  const drift=state.paused ? 0 : Math.sin(time*.00007)*.004;
  for(const point of particles) {
    const projected=project({x:point.x+point.y*drift,y:point.y,z:point.z});
    if(projected.x<0||projected.x>width||projected.y<0||projected.y>height) continue;
    const nearPointer=Math.hypot(projected.x-pointer.x,projected.y-pointer.y)<110;
    context.fillStyle=point.light>.97 ? '#a7b5c5':point.light>.8 || nearPointer ? '#66768a':'#303e50';
    const size=point.size>.93 ? 2:1;
    context.fillRect(Math.round(projected.x/2)*2,Math.round(projected.y/2)*2,size,size);
  }
}
function drawOrbits(time) {
  const focus=project({x:0,y:0,z:0});
  const scale=focus.factor;
  context.fillStyle='#344254';
  for(let ring=0;ring<3;ring++) {
    const radius=(350+ring*155)*scale;
    for(let tick=0;tick<290;tick++) {
      if(tick%8>4)continue;
      const angle=tick/290*Math.PI*2+(state.paused?0:time*.000005);
      const x=focus.x+Math.cos(angle)*radius;
      const y=focus.y+Math.sin(angle)*radius*.48;
      context.fillRect(Math.round(x),Math.round(y),1,1);
    }
  }
}
function drawDestination() {
  if(!['arrival','approach'].includes(state.phase)) return;
  const point=nodePosition(state.selected);
  context.fillStyle='#b7d2ff';
  context.fillRect(Math.round(point.x)-3,Math.round(point.y)-3,6,6);
  context.fillStyle='#6c839f';
  for(let i=0;i<32;i++) {
    const angle=i/32*Math.PI*2;
    context.fillRect(Math.round(point.x+Math.cos(angle)*14),Math.round(point.y+Math.sin(angle)*14),1,1);
  }
}
function updateCamera(now) {
  if(!flight)return;
  const amount=Math.min(1,(now-flight.start)/flight.duration);
  const eased=1-Math.pow(1-amount,3);
  for(const axis of ['x','y','z']) camera[axis]=flight.from[axis]+(flight.to[axis]-flight.from[axis])*eased;
  if(amount===1)flight=null;
}
function render(now) {
  if((visible||flight)&&!document.hidden) {
    updateCamera(now);
    drawParticles(now);
    drawOrbits(now);
    drawDestination();
    document.querySelectorAll('.star-link:not([hidden])').forEach(button=>{
      const point=nodePosition(button.dataset.star);
      button.style.left=`${point.x}px`;button.style.top=`${point.y}px`;
    });
  }
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

function cameraFor(phase) {
  if(['overview','return'].includes(phase)) return {x:0,y:0,z:1000};
  if(phase==='work')return {x:-230,y:25,z:560};
  const place=places[state.selected];
  if(phase==='approach')return {x:place.x+30,y:place.y,z:480};
  if(phase==='section')return {x:place.x-100,y:place.y,z:500};
  return {x:place.x+(state.arrival==='beside'?100:0),y:place.y,z:300};
}
function animateCamera(phase,instant) {
  const to=cameraFor(phase);
  if(instant||reducedMotion.matches) { camera=to;flight=null;return; }
  flight={from:{...camera},to,start:performance.now(),duration:phase==='arrival'?1350:1100};
}

function createStars() {
  const root=document.querySelector('#star-links');
  Object.entries(places).forEach(([id,place])=>{
    const button=document.createElement('button');
    button.className='star-link';button.dataset.star=id;button.textContent=place.label;
    button.setAttribute('aria-label',place.description ? `${place.label}: ${place.description}`:`Visit ${place.label}`);
    button.addEventListener('click',()=>go(id));
    root.append(button);
  });
}
createStars();
function updateStars() {
  document.querySelectorAll('[data-star]').forEach(button=>{
    const place=places[button.dataset.star];
    const overview=['overview','return'].includes(state.phase);
    button.hidden=overview ? place.kind!=='region':state.phase==='work'?place.kind!=='project':button.dataset.star!==state.selected;
    button.setAttribute('aria-current',String(!overview&&button.dataset.star===state.selected));
  });
}
function updateIntro() {
  document.querySelector('#scene-title').textContent=state.phase==='work'?'Work':'Harry Nicholls';
  document.querySelector('#scene-description').textContent=state.phase==='work'?'Six projects, made for problems I know firsthand. Choose a star to visit its project.':'A product engineer building AI products, agent infrastructure, and useful things for everyday life.';
  document.querySelector('#moment-description').textContent=momentCopy[state.phase];
  const nested=!['overview','return','section'].includes(state.phase);
  document.querySelector('#region-crumb').hidden=!nested;
  document.querySelector('#project-crumb').hidden=!['approach','arrival'].includes(state.phase);
  document.querySelector('#project-crumb').textContent=` / ${places[state.selected]?.label || 'gitrove'}`;
}
function updateProject() {
  const place=places[state.selected];
  document.querySelector('#arrival-title').textContent=place.label;
  document.querySelector('.arrival-description').textContent=place.description;
  const isGitrove=state.selected==='gitrove';
  const prose=document.querySelector('.arrival-prose');
  prose.innerHTML=isGitrove?'<p>gitrove watches the developers you follow and the repositories you star. Once a day, it sends a digest of the discoveries, releases, and connections worth a closer look.</p><p>Built with Go, PostgreSQL, and a server-rendered TypeScript frontend.</p>':`<p>${place.description}</p><p>This star has its own address in the same Work region. Read the original case study for its purpose, implementation, and screenshots.</p>`;
  const image=document.querySelector('#project-image');
  image.src=`../../src/assets/${images[state.selected] || 'gitrove/v2-2.png'}`;
  image.alt=isGitrove?'gitrove home page and example daily digest':`${place.label} project preview`;
  document.querySelector('.arrival-image').hidden=state.selected==='crosscheck';
  document.querySelector('#read-story').href=`../project-stories.html#${state.selected}`;
  const visit=document.querySelector('#visit-project');visit.hidden=!isGitrove;
}
function updateSection() {
  const contents={
    about:['About me','<p>I’m a software engineer, a dad of three, and a woodworker, based in the Toronto area and working remotely.</p><p>At ev.energy, I build AI products and the agent infrastructure behind them. I care about useful products, strong engineering teams, and work that’s good for people and the planet.</p>'],
    writing:['Writing','<p>A place for ideas, writing, and things worth following.</p><p><a href="https://brainflow.substack.com/">Brainflow on Substack</a><br><a href="https://harrynicholls.medium.com/">Writing on Medium</a><br><a href="https://github.com/hnipps">Code on GitHub</a></p>'],
    contact:['Get in touch','<p><a href="mailto:harry.m.nicholls@gmail.com">harry.m.nicholls@gmail.com</a></p><p><a href="https://www.linkedin.com/in/harry-nicholls-91779959/">LinkedIn</a><br><a href="https://x.com/harrynicholls">X</a></p>'],
  };
  const [title,copy]=contents[state.selected];
  document.querySelector('#section-title').textContent=title;
  document.querySelector('#section-copy').innerHTML=copy;
}
function setPhase(phase,{instant=false,record=true}={}) {
  state.phase=phase;
  scene.dataset.phase=phase;scene.dataset.arrival=state.arrival;
  document.querySelector('#arrival-content').hidden=phase!=='arrival';
  document.querySelector('#section-content').hidden=phase!=='section';
  document.querySelectorAll('[data-phase]').forEach(button=>{
    if(button.tagName==='BUTTON')button.setAttribute('aria-pressed',String(button.dataset.phase===phase));
  });
  document.querySelectorAll('button[data-arrival]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.arrival===state.arrival)));
  if(phase==='arrival')updateProject();
  if(phase==='section')updateSection();
  updateIntro();updateStars();resize();animateCamera(phase,instant);
  document.querySelector('#travel-status').textContent=phase==='arrival'?`${places[state.selected].label}. Camera at rest for reading.`:momentCopy[phase];
  if(record)history.pushState({...state},'',`#place=${state.selected}&moment=${phase}&arrival=${state.arrival}`);
}
function go(id) {
  stopPlayback();
  if(id==='overview'||id==='work') { setPhase(id);return; }
  state.selected=id;
  setPhase(places[id].kind==='project'?'arrival':'section');
}
function chooseArrival(arrival) {
  stopPlayback();state.arrival=arrival;state.selected='gitrove';setPhase('arrival');
}
function stopPlayback() {
  playTimers.forEach(clearTimeout);playTimers=[];
  document.querySelector('#play-journey').textContent='Play the journey';
}
function playJourney() {
  if(playTimers.length) { stopPlayback();return; }
  state.selected='gitrove';
  const phases=['overview','work','approach','arrival','return'];
  phases.forEach((phase,index)=>playTimers.push(setTimeout(()=>setPhase(phase),index*2200)));
  playTimers.push(setTimeout(stopPlayback,phases.length*2200));
  document.querySelector('#play-journey').textContent='Stop the journey';
}

document.querySelectorAll('button[data-phase]').forEach(button=>button.addEventListener('click',()=>{stopPlayback();state.selected='gitrove';setPhase(button.dataset.phase);}));
document.querySelectorAll('[data-destination]').forEach(button=>button.addEventListener('click',()=>go(button.dataset.destination)));
document.querySelectorAll('button[data-arrival]').forEach(button=>button.addEventListener('click',()=>chooseArrival(button.dataset.arrival)));
document.querySelectorAll('[data-try]').forEach(button=>button.addEventListener('click',()=>{chooseArrival(button.dataset.try);scene.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});}));
document.querySelector('#play-journey').addEventListener('click',playJourney);
document.querySelector('#home-star').addEventListener('click',event=>{event.preventDefault();go('overview');});
document.querySelector('#pause-sky').addEventListener('click',()=>{
  state.paused=!state.paused;
  document.querySelector('#pause-sky').setAttribute('aria-pressed',String(state.paused));
  document.querySelector('#pause-sky').textContent=state.paused?'Resume the sky':'Pause the sky';
});
scene.addEventListener('pointermove',event=>{const rect=scene.getBoundingClientRect();pointer={x:event.clientX-rect.left,y:event.clientY-rect.top};});
scene.addEventListener('pointerleave',()=>{pointer={x:-1000,y:-1000};});
window.addEventListener('popstate',event=>{
  if(event.state?.phase) { state={...state,...event.state};setPhase(state.phase,{record:false}); }
  else restoreAddress();
});
function syncPauseControl() {
  const button=document.querySelector('#pause-sky');
  button.setAttribute('aria-pressed',String(state.paused));
  button.textContent=state.paused?'Resume the sky':'Pause the sky';
}
reducedMotion.addEventListener('change',event=>{
  state.paused=event.matches;syncPauseControl();
  if(event.matches) {flight=null;camera=cameraFor(state.phase);}
});
syncPauseControl();
function restoreAddress() {
  const address=new URLSearchParams(location.hash.slice(1));
  state.selected=places[address.get('place')] ? address.get('place') : 'gitrove';
  if(['beside','open','around'].includes(address.get('arrival')))state.arrival=address.get('arrival');
  const requested=address.get('moment') || query.get('phase');
  let phase=['overview','work','approach','arrival','return','section'].includes(requested)?requested:'overview';
  if(phase==='section' && !['about','writing','contact'].includes(state.selected)) phase='overview';
  if(['arrival','approach'].includes(phase) && places[state.selected].kind!=='project') state.selected='gitrove';
  setPhase(phase,{instant:true,record:false});
}
window.addEventListener('hashchange',()=>{stopPlayback();restoreAddress();});
restoreAddress();
