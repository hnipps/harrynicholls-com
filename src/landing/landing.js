// Stories open natively through <details>. This only makes links to a story
// (from the screenshot strip, an old bookmark, or a pasted URL) open its row.
function reveal(hash, focus) {
  if (!hash || hash === '#') return false;
  let target;
  try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return false; }
  if (!target) return false;
  const row = target.closest('details.entry');
  if (!row) return false;
  row.open = true;
  requestAnimationFrame(() => {
    row.scrollIntoView({ block: 'start' });
    if (focus) row.querySelector('summary').focus({ preventScroll: true });
  });
  return true;
}

document.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href^="#"]');
  if (!link || !reveal(link.hash, true)) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
});
window.addEventListener('hashchange', () => reveal(location.hash, false));
window.addEventListener('popstate', () => reveal(location.hash, false));
reveal(location.hash, false);
