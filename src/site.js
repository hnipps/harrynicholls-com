// Two small enhancements. The page reads the same without either.

// Copy the email address.
const copy = document.querySelector('[data-copy]');
if (copy && navigator.clipboard) {
  const label = copy.querySelector('.copy-label');
  let reset;
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.copy);
      label.textContent = 'Copied';
      copy.classList.add('is-done');
    } catch {
      label.textContent = 'Could not copy. Select the address instead.';
    }
    clearTimeout(reset);
    reset = setTimeout(() => {
      label.textContent = 'Copy';
      copy.classList.remove('is-done');
    }, 2400);
  });
}

// Name the day under the pointer on the commit graph.
const graph = document.querySelector('.graph[data-counts]');
if (graph) {
  const dots = graph.querySelectorAll('circle');
  const counts = graph.dataset.counts.split(',').map(Number);
  const start = new Date(`${graph.dataset.start}T00:00:00Z`);
  const offset = start.getUTCDay();
  const day = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
  const prompt = 'Point at a day to read it.';

  const readout = document.createElement('p');
  readout.className = 'graph-readout in-measure';
  readout.setAttribute('aria-hidden', 'true');
  readout.textContent = prompt;
  graph.querySelector('.graph-year').after(readout);

  let lit;
  const clear = () => {
    lit?.classList.remove('is-on');
    lit = undefined;
    readout.textContent = prompt;
  };

  const read = (event) => {
    const svg = event.currentTarget;
    const weeks = Number(svg.dataset.weeks);
    const base = Number(svg.dataset.base);
    const box = svg.getBoundingClientRect();
    const column = Math.floor(((event.clientX - box.left) / box.width) * weeks);
    const row = Math.floor(((event.clientY - box.top) / box.height) * 7);
    // Only the year's very first week can start mid-week.
    const index = base + column * 7 + row - (base === 0 ? offset : 0);
    if (column < 0 || column >= weeks || row < 0 || row > 6 || index < 0 || index >= counts.length) {
      clear();
      return;
    }
    if (dots[index] === lit) return;
    lit?.classList.remove('is-on');
    lit = dots[index];
    lit.classList.add('is-on');
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + index);
    const n = counts[index];
    const what = n === 0 ? 'Nothing' : `${n.toLocaleString('en-GB')} ${n === 1 ? 'contribution' : 'contributions'}`;
    readout.textContent = `${what} on ${day.format(date)}.`;
  };

  for (const svg of graph.querySelectorAll('svg')) {
    svg.addEventListener('pointermove', read);
    svg.addEventListener('pointerdown', read);
    svg.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse') clear();
    });
  }

  // Ink the year in when the reader reaches it, not at page load where nobody sees it.
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!still && 'IntersectionObserver' in window) {
    graph.classList.add('is-pending');
    const watch = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      graph.classList.replace('is-pending', 'is-inking');
      watch.disconnect();
    }, { threshold: 0.35 });
    watch.observe(graph.querySelector('.graph-year'));
  }
}
