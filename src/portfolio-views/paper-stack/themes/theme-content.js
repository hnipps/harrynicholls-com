// Native links also work when a theme document is opened on its own.
function openStory(hash) {
  if (!hash || hash === '#') return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  for (let ancestor = target; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor.tagName === 'DETAILS') ancestor.open = true;
  }
  const story = target.closest('.story');
  story?.querySelectorAll('details').forEach(details => { details.open = true; });
  if (target.tagName === 'DETAILS') target.open = true;
  requestAnimationFrame(() => target.scrollIntoView());
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link) {
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (target) {
      event.preventDefault();
      history.replaceState(null, '', link.hash);
      openStory(link.hash);
    }
  }
  if (event.target.closest('[data-reset-stack]')) {
    event.preventDefault();
    if (parent !== window) parent.postMessage({ type:'paper-stack:reset' }, location.origin);
    else location.href = '../?reset';
  }
});
window.addEventListener('hashchange', () => openStory(location.hash));
openStory(location.hash);
