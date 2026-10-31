// Styled papers share the native story revealer; bare HTML keeps its own behavior.
function focusReadingTarget(hash) {
  openStory(hash);
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  const heading = target.querySelector('h1,h2,h3');
  const destination = target.matches('main') ? target : heading || target;
  destination.setAttribute('tabindex', '-1');
  requestAnimationFrame(() => destination.focus({preventScroll:true}));
}

document.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href^="#"]');
  if (!link || !document.getElementById(decodeURIComponent(link.hash.slice(1)))) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  focusReadingTarget(link.hash);
}, true);

window.addEventListener('popstate', () => focusReadingTarget(location.hash || '#main'));

document.querySelectorAll('[data-reading-target]').forEach(button => {
  button.addEventListener('click', () => focusReadingTarget(button.dataset.readingTarget));
});

const newTabHint = document.createElement('span');
newTabHint.id = 'new-tab-hint';
newTabHint.className = 'reading-only';
newTabHint.textContent = 'Opens in a new tab';
document.body.append(newTabHint);
document.querySelectorAll('a[target="_blank"]:not(.story-image)').forEach(link => {
  link.setAttribute('aria-describedby', [link.getAttribute('aria-describedby'), newTabHint.id].filter(Boolean).join(' '));
  if (!link.title) link.title = newTabHint.textContent;
});
