// Three small enhancements. The page reads the same without any of them.

// Switch between light and dark. Until the reader clicks, the page follows the system.
const toggle = document.querySelector('.theme-toggle');
if (toggle) {
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.dataset.theme ?? (system.matches ? 'dark' : 'light');
  const paper = { light: '#fafcff', dark: '#000014' };
  const sync = () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Switch to ${next} mode`);
    toggle.title = `Switch to ${next} mode`;
    if (root.dataset.theme) {
      for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.content = paper[current()];
    }
  };
  // The button is the dot of the "i" in the name, but only where the browser can
  // anchor it there and the display face it was measured for has loaded.
  const show = () => { toggle.hidden = false; };
  // Only the home page has the name; other pages keep the button in the corner.
  if (document.querySelector('.tittle') && document.fonts && CSS.supports('anchor-name: --tittle')) {
    document.fonts.load('1em "Instrument Serif"')
      .then((faces) => { if (faces.length) root.classList.add('name-ready'); })
      .finally(show);
  } else {
    show();
  }
  toggle.addEventListener('click', () => {
    root.dataset.theme = current() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch { /* private mode: lasts for this visit */ }
    sync();
  });
  system.addEventListener('change', sync);
  sync();
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

// Open a photo or a screenshot over the page. Without this each one is a plain
// link to its file, and a modified click still opens that file in a new tab.
const zoomable = [...document.querySelectorAll('.photo a, .shot a')];
if (zoomable.length && window.HTMLDialogElement && HTMLDialogElement.prototype.showModal) {
  const box = document.createElement('dialog');
  box.className = 'lightbox';
  box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML = `
    <div class="lightbox-bar"><button class="lightbox-close" type="button">Close</button></div>
    <div class="lightbox-stage"><img alt=""></div>
    <ul class="lightbox-strip" role="list" aria-label="Pictures"></ul>`;
  document.body.append(box);

  const stage = box.querySelector('.lightbox-stage');
  const image = stage.querySelector('img');
  const strip = box.querySelector('.lightbox-strip');
  const alone = zoomable.length === 1;
  strip.hidden = alone;
  let at = 0;

  // One small picture per image, in a row that scrolls sideways.
  const picks = zoomable.map((link, index) => {
    const thumb = link.querySelector('img');
    const item = document.createElement('li');
    const pick = document.createElement('button');
    const small = new Image();
    pick.type = 'button';
    pick.setAttribute('aria-label', thumb.alt);
    small.src = thumb.getAttribute('src');
    small.alt = '';
    small.width = thumb.getAttribute('width');
    small.height = thumb.getAttribute('height');
    pick.append(small);
    pick.addEventListener('click', () => show(index));
    item.append(pick);
    strip.append(item);
    return pick;
  });

  const show = (index) => {
    at = (index + zoomable.length) % zoomable.length;
    const link = zoomable[at];
    const thumb = link.querySelector('img');
    // The picture already on the page stands in until the full file arrives.
    image.src = thumb.currentSrc || thumb.src;
    image.alt = thumb.alt;
    image.width = thumb.naturalWidth;
    image.height = thumb.naturalHeight;
    if (link.href !== image.src) {
      const full = new Image();
      const wanted = at;
      full.onload = () => {
        if (wanted !== at || !box.open) return;
        image.src = full.src;
        image.width = full.naturalWidth;
        image.height = full.naturalHeight;
      };
      full.src = link.href;
    }
    picks.forEach((pick, i) => {
      if (i === at) pick.setAttribute('aria-current', 'true');
      else pick.removeAttribute('aria-current');
    });
    if (box.open) picks[at].scrollIntoView({ block: 'nearest', inline: 'center' });
  };

  zoomable.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      box.showModal();
      show(index);
    });
  });

  box.querySelector('.lightbox-close').addEventListener('click', () => box.close());

  // A click anywhere on the picture or the space round it closes; a sideways
  // swipe turns to the next or the previous one.
  let down;
  let swiped = false;
  stage.addEventListener('pointerdown', (event) => { down = event.clientX; swiped = false; });
  stage.addEventListener('pointerup', (event) => {
    const moved = event.clientX - (down ?? event.clientX);
    down = undefined;
    if (alone || Math.abs(moved) < 48) return;
    swiped = true;
    show(at + (moved < 0 ? 1 : -1));
  });
  stage.addEventListener('click', () => { if (!swiped) box.close(); });

  box.addEventListener('keydown', (event) => {
    if (alone || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) return;
    event.preventDefault();
    show(at + (event.key === 'ArrowRight' ? 1 : -1));
    if (strip.contains(document.activeElement)) picks[at].focus({ preventScroll: true });
  });

  // Back to the picture the reader ended on, wherever the browser put focus.
  box.addEventListener('close', () => {
    image.removeAttribute('src');
    zoomable[at].focus({ preventScroll: true });
    zoomable[at].scrollIntoView({ block: 'nearest' });
  });
}
