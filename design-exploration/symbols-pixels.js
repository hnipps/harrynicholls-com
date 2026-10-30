const treatmentButtons = [...document.querySelectorAll('[data-treatment]')];
function chooseTreatment(treatment) {
  document.body.dataset.treatment = treatment;
  treatmentButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.treatment === treatment)));
}
treatmentButtons.forEach(button => button.addEventListener('click', () => chooseTreatment(button.dataset.treatment)));
chooseTreatment('dots');

// The raster print is derived from the actual local screenshot, never invented UI.
function printHalftone(image) {
  const view = image.closest('.matrix-view');
  const canvas = view.querySelector('canvas');
  const context = canvas.getContext('2d');
  const source = document.createElement('canvas');
  source.width = 160; source.height = 110;
  const sample = source.getContext('2d', { willReadFrequently:true });
  sample.drawImage(image,0,0,160,110);
  const pixels = sample.getImageData(0,0,160,110).data;
  context.fillStyle = '#f8f8f5';context.fillRect(0,0,640,440);
  context.fillStyle = '#151515';
  for (let y=0;y<110;y++) for (let x=0;x<160;x++) {
    const index=(y*160+x)*4;
    const light=(pixels[index]*.2126+pixels[index+1]*.7152+pixels[index+2]*.0722)/255;
    const radius=Math.sqrt(1-light)*1.82;
    if (radius<.2) continue;
    context.beginPath();context.arc(x*4+2,y*4+2,radius,0,Math.PI*2);context.fill();
  }
  view.classList.add('is-ready');
}
document.querySelectorAll('.matrix-view img').forEach(image => {
  if(image.complete && image.naturalWidth) printHalftone(image);
  else image.addEventListener('load',()=>printHalftone(image),{once:true});
});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
if(!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries=>{
    entries.forEach((entry,index)=>{
      if(!entry.isIntersecting)return;
      entry.target.style.setProperty('--delay',`${index%4*65}ms`);
      entry.target.classList.add('matrix-arrive');observer.unobserve(entry.target);
    });
  },{threshold:.12});
  document.querySelectorAll('h1,h2,.introduction,.current,.primary,.matrix-project,.other-projects a,.about p,.story summary,.email').forEach(element=>observer.observe(element));
}
reducedMotion.addEventListener('change',event=>{if(event.matches)document.getAnimations().forEach(animation=>animation.cancel());});
