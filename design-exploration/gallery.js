const stages = [...document.querySelectorAll('.preview-stage')];
let previewWidth = 1440;
function sizePreviews() {
  stages.forEach(stage => {
    const scale = Math.min(1, stage.clientWidth / previewWidth);
    const frame = stage.querySelector('iframe');
    const height = previewWidth === 390 ? 844 : 1000;
    stage.classList.toggle('is-mobile', previewWidth === 390);
    stage.style.height = `${height * scale}px`;
    frame.style.width = `${previewWidth}px`;
    frame.style.height = `${height}px`;
    frame.style.transform = previewWidth === 390 ? `translateX(-50%) scale(${scale})` : `scale(${scale})`;
  });
}
new ResizeObserver(sizePreviews).observe(document.querySelector('.compare-panes'));
sizePreviews();

for (const side of ['left', 'right']) {
  document.querySelector(`#${side}-direction`).addEventListener('change', event => {
    const url = `${event.target.value}.html`;
    document.querySelector(`#${side}-preview`).src = url;
    document.querySelector(`#${side}-open`).href = url;
  });
}
document.querySelectorAll('[data-viewport]').forEach(button => button.addEventListener('click', () => {
  previewWidth = button.dataset.viewport === 'mobile' ? 390 : 1440;
  document.querySelectorAll('[data-viewport]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  sizePreviews();
}));
document.querySelector('#reset-previews').addEventListener('click', () => {
  stages.forEach(stage => { const frame = stage.querySelector('iframe'); frame.src = frame.getAttribute('src'); });
});
document.querySelectorAll('[data-board]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-board]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  document.querySelectorAll('[data-source]').forEach(study => { study.hidden = button.dataset.board !== 'all' && study.dataset.source !== button.dataset.board; });
}));
document.querySelectorAll('[data-compare]').forEach(button => button.addEventListener('click', () => {
  const select = document.querySelector('#right-direction');
  select.value = button.dataset.compare;
  select.dispatchEvent(new Event('change'));
  document.querySelector('#compare').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  select.focus({ preventScroll:true });
}));
