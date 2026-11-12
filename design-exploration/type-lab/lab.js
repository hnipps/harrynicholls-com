// Type and colour lab for the home page. Local only: scripts/lab-server.py
// injects this into the page; nothing here is deployed.
//
// Three type roles:
//   display  the name
//   text     paragraphs, entry names, lists
//   detail   section heads, dates, role lines, graph labels, small print

const F = '/lab/fonts/';
const face = (name, stack, files, extra = {}) => ({ name, stack, files, italic: false, ...extra });

const FACES = {
  literata: face('Literata', '"Literata", Georgia, serif', [], { italic: true, note: 'current' }),

  // Two pairings of my own
  besley: face('Besley', '"Lab Besley", Georgia, serif', [
    ['besley.woff2', '400 900'], ['besley-italic.woff2', '400 900', 'italic']], { italic: true }),
  hanken: face('Hanken Grotesk', '"Lab Hanken", system-ui, sans-serif', [
    ['hanken-grotesk.woff2', '100 900'], ['hanken-grotesk-italic.woff2', '100 900', 'italic']], { italic: true }),
  mona: face('Mona Sans', '"Lab Mona", system-ui, sans-serif', [
    ['mona-sans.woff2', '200 900'], ['mona-sans-italic.woff2', '200 900', 'italic']], { italic: true }),
  monaspace: face('Monaspace Neon', '"Lab Monaspace", ui-monospace, monospace', [
    ['monaspace-neon-400.woff2', '400'], ['monaspace-neon-600.woff2', '600 700']]),

  // The faces you listed
  saint: face('Saint', '"Lab Saint", Georgia, serif', [['saint-saint-regular.ttf', '400']]),
  hikaru: face('Hikaru Mono', '"Lab Hikaru", ui-monospace, monospace', [['hikaru-mono.otf', '400']]),
  instrumentSerif: face('Instrument Serif', '"Lab Instrument Serif", Georgia, serif', [
    ['instrument-serif-400.woff2', '400'], ['instrument-serif-400-italic.woff2', '400', 'italic']], { italic: true }),
  redaction: face('Redaction', '"Lab Redaction", Georgia, serif', [
    ['redaction-400.woff2', '400'], ['redaction-400-italic.woff2', '400', 'italic'], ['redaction-700.woff2', '700']], { italic: true }),
  redaction20: face('Redaction 20', '"Lab Redaction 20", Georgia, serif', [['redaction-20-400.woff2', '400']]),
  monor: face('Monor', '"Lab Monor", ui-monospace, monospace', [['monor-400.otf', '400'], ['monor-700.otf', '700']]),
  commit: face('Commit Mono', '"Lab Commit", ui-monospace, monospace', [
    ['commit-mono-400.woff2', '400'], ['commit-mono-400-italic.woff2', '400', 'italic'], ['commit-mono-700.woff2', '700']], { italic: true }),
  spaceGrotesk: face('Space Grotesk', '"Lab Space Grotesk", system-ui, sans-serif', [['space-grotesk.woff2', '300 700']]),
  hyperlegible: face('Hyperlegible Sans', '"Lab Hyperlegible", system-ui, sans-serif', [
    ['hyperlegible-sans-400.otf', '400'], ['hyperlegible-sans-400-italic.otf', '400', 'italic'],
    ['hyperlegible-sans-500.otf', '500'], ['hyperlegible-sans-700.otf', '700']], { italic: true }),
  haskoy: face('Hasköy', '"Lab Haskoy", system-ui, sans-serif', [
    ['haskoy-400.otf', '400'], ['haskoy-400-italic.otf', '400', 'italic'], ['haskoy-500.otf', '500'], ['haskoy-700.otf', '700']], { italic: true }),
  instrumentSans: face('Instrument Sans', '"Lab Instrument Sans", system-ui, sans-serif', [
    ['instrument-sans.woff2', '400 700'], ['instrument-sans-italic.woff2', '400 700', 'italic']], { italic: true }),
  departure: face('Departure Mono', '"Lab Departure", ui-monospace, monospace', [['departure-mono.woff2', '400']]),
};

const PAIRINGS = [
  ['Literata throughout', 'What the page ships with today.', 'literata', 'literata', 'literata'],
  ['Besley + Hanken Grotesk', 'My pick. A sturdy Clarendon for the name, a plain grotesk to read.', 'besley', 'hanken', 'hanken'],
  ['Mona Sans + Monaspace', 'My pick. GitHub’s own faces, next to your GitHub graph.', 'mona', 'mona', 'monaspace'],
  ['Instrument Serif + Sans', 'A tall, sharp display serif over its sibling sans.', 'instrumentSerif', 'instrumentSans', 'instrumentSans'],
  ['Redaction + Commit Mono', 'A degraded legal serif for the name, mono for the dates.', 'redaction20', 'redaction', 'commit'],
  ['Saint + Hasköy', 'An expressive display face over a quiet sans.', 'saint', 'haskoy', 'haskoy'],
  ['Space Grotesk + Hyperlegible', 'Grotesk name, high-legibility text, pixel details.', 'spaceGrotesk', 'hyperlegible', 'departure'],
  ['Hikaru + Commit Mono', 'All monospace. The terminal resume.', 'hikaru', 'commit', 'commit'],
  ['Monor + Instrument Sans', 'A mono with odd shapes for name and details.', 'monor', 'instrumentSans', 'monor'],
];

// paper, ink, ink-soft, hairline, rest, frame, pencil, pencil-ink, pencil-wash
const PALETTES = {
  ink: ['Ink and persimmon', 'light', 'oklch(97.8% 0.006 255)', 'oklch(27% 0.075 268)', 'oklch(44% 0.055 268)', 'oklch(87% 0.018 265)', 'oklch(83% 0.03 265)', 'oklch(92.5% 0.012 265)', 'oklch(64% 0.19 40)', 'oklch(46% 0.15 40)', 'oklch(92% 0.055 55)'],
  spruce: ['Spruce and brass', 'light', 'oklch(97.6% 0.008 150)', 'oklch(27% 0.05 165)', 'oklch(43% 0.04 165)', 'oklch(87% 0.016 155)', 'oklch(83% 0.028 155)', 'oklch(93% 0.013 155)', 'oklch(68% 0.13 80)', 'oklch(44% 0.09 75)', 'oklch(92% 0.06 90)'],
  graphite: ['Graphite and cobalt', 'light', 'oklch(98.6% 0 0)', 'oklch(22% 0.01 260)', 'oklch(44% 0.012 260)', 'oklch(88% 0.004 260)', 'oklch(83% 0.006 260)', 'oklch(93.5% 0.004 260)', 'oklch(55% 0.21 262)', 'oklch(44% 0.2 262)', 'oklch(92% 0.05 262)'],
  oxblood: ['Oxblood and sage', 'light', 'oklch(96.8% 0.008 60)', 'oklch(28% 0.075 20)', 'oklch(45% 0.055 20)', 'oklch(87% 0.016 50)', 'oklch(83% 0.022 50)', 'oklch(92.5% 0.012 60)', 'oklch(60% 0.09 160)', 'oklch(41% 0.08 160)', 'oklch(92% 0.04 160)'],
  plum: ['Plum and marigold', 'light', 'oklch(97.5% 0.008 320)', 'oklch(28% 0.09 320)', 'oklch(45% 0.065 320)', 'oklch(88% 0.018 320)', 'oklch(84% 0.03 320)', 'oklch(93% 0.014 320)', 'oklch(74% 0.16 75)', 'oklch(46% 0.11 70)', 'oklch(93% 0.07 85)'],
  night: ['Night shift', 'dark', 'oklch(20% 0.035 268)', 'oklch(93% 0.015 265)', 'oklch(75% 0.03 265)', 'oklch(34% 0.04 268)', 'oklch(40% 0.045 268)', 'oklch(27% 0.035 268)', 'oklch(72% 0.17 45)', 'oklch(81% 0.13 50)', 'oklch(40% 0.09 45)'],
  blueprint: ['Blueprint', 'dark', 'oklch(40% 0.15 262)', 'oklch(97% 0.012 250)', 'oklch(87% 0.045 255)', 'oklch(53% 0.12 262)', 'oklch(56% 0.11 262)', 'oklch(46% 0.14 262)', 'oklch(87% 0.15 95)', 'oklch(91% 0.13 95)', 'oklch(58% 0.13 262)'],
};
const TOKENS = ['paper', 'ink', 'ink-soft', 'hairline', 'rest', 'frame', 'pencil', 'pencil-ink', 'pencil-wash'];
const ROLES = ['display', 'text', 'detail'];
const DEFAULTS = { display: 'literata', text: 'literata', detail: 'literata', palette: 'ink' };

// ---------- Fonts ----------

const fontCss = Object.values(FACES).flatMap((f) => f.files.map(([file, weight, style = 'normal']) => {
  const family = f.stack.split(',')[0];
  const format = file.endsWith('.woff2') ? 'woff2' : file.endsWith('.otf') ? 'opentype' : 'truetype';
  return `@font-face{font-family:${family};src:url("${F}${file}") format("${format}");font-weight:${weight};font-style:${style};font-display:swap}`;
})).join('\n');

const DETAIL = 'h2, .when, .role, .graph-months, .graph-readout, .graph table, .graph summary, .fine, .copy, .note, .photo-caption';

const style = document.createElement('style');
style.textContent = `${fontCss}
:root { font-synthesis-style: none; }
body { font-family: var(--lab-text); font-size-adjust: var(--lab-text-x, none); }
h1 { font-family: var(--lab-display); font-size-adjust: none; }
${DETAIL} { font-family: var(--lab-detail); font-size-adjust: var(--lab-detail-x, none); }

#type-lab { position: fixed; right: 12px; bottom: 12px; z-index: 9999; width: 288px; max-height: calc(100vh - 24px);
  display: flex; flex-direction: column; background: #16171a; color: #e9eaee; border-radius: 10px;
  box-shadow: 0 2px 6px rgb(0 0 0 / .25), 0 18px 48px -12px rgb(0 0 0 / .55);
  font: 13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; font-size-adjust: none; font-variant-numeric: normal; }
#type-lab * { box-sizing: border-box; font-family: inherit; font-size-adjust: none; }
#type-lab header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; }
#type-lab header strong { font-weight: 600; letter-spacing: .01em; }
#type-lab .scroll { overflow-y: auto; padding: 0 12px 12px; }
#type-lab.is-closed .scroll { display: none; }
#type-lab.is-closed { width: auto; }
#type-lab h4 { margin: 14px 0 6px; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #9a9da8; }
#type-lab button { appearance: none; border: 0; background: #26282e; color: inherit; font-size: 13px; border-radius: 6px; cursor: pointer; }
#type-lab button:hover { background: #33363e; }
#type-lab button:focus-visible, #type-lab select:focus-visible, #type-lab label:focus-within { outline: 2px solid #8ab4ff; outline-offset: 1px; }
#type-lab header button { padding: 4px 9px; }
#type-lab .pairings { display: grid; gap: 4px; }
#type-lab .pairings button { padding: 7px 9px; text-align: left; }
#type-lab .pairings small { display: block; color: #9a9da8; font-size: 11.5px; }
#type-lab [aria-pressed="true"] { background: #e9eaee; color: #16171a; }
#type-lab [aria-pressed="true"]:hover { background: #fff; }
#type-lab [aria-pressed="true"] small { color: #4a4d57; }
#type-lab .role { display: grid; grid-template-columns: 58px 1fr; align-items: center; gap: 8px; margin-top: 5px; color: #c6c8d0; font-family: inherit; }
#type-lab select { width: 100%; padding: 6px 7px; background: #26282e; color: #e9eaee; border: 1px solid #3a3d46; border-radius: 6px; font-size: 13px; }
#type-lab .palettes { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
#type-lab .palettes button { display: flex; align-items: center; gap: 7px; padding: 6px 8px; text-align: left; font-size: 12px; }
#type-lab .swatch { flex: none; display: flex; width: 34px; height: 18px; border-radius: 4px; overflow: hidden; box-shadow: 0 0 0 1px rgb(255 255 255 / .18); }
#type-lab .swatch i { flex: 1; }
#type-lab .drop { display: block; margin-top: 2px; padding: 10px; border: 1px dashed #4a4d57; border-radius: 6px; color: #c6c8d0; text-align: center; cursor: pointer; }
#type-lab .drop.is-over { border-color: #8ab4ff; color: #fff; }
#type-lab .drop input { position: absolute; opacity: 0; pointer-events: none; }
#type-lab .pick { margin-top: 14px; padding: 9px; background: #0e0f11; border-radius: 6px; color: #c6c8d0; font-size: 12px; white-space: pre-wrap; }
#type-lab .actions { display: flex; gap: 6px; margin-top: 8px; }
#type-lab .actions button { flex: 1; padding: 7px; }
@media (max-width: 30rem) { #type-lab { left: 8px; right: 8px; bottom: 8px; width: auto; max-height: 70vh; } }
@media print { #type-lab { display: none; } }
`;
document.head.append(style);

// ---------- State ----------

const fromHash = () => {
  const m = location.hash.match(/lab=([\w]+)\.([\w]+)\.([\w]+)\.([\w]+)/);
  return m ? { display: m[1], text: m[2], detail: m[3], palette: m[4] } : null;
};
const saved = () => { try { return JSON.parse(localStorage.getItem('type-lab')); } catch { return null; } };
const state = { ...DEFAULTS, ...(fromHash() ?? saved() ?? {}) };
for (const role of ROLES) if (!FACES[state[role]]) state[role] = DEFAULTS[role];
if (!PALETTES[state.palette]) state.palette = DEFAULTS.palette;

// x-height of a face relative to its em, read from the font itself. Text and detail
// faces are scaled to match Literata's, so every option is compared at the same apparent size.
const probe = document.createElement('canvas').getContext('2d');
const xHeight = (stack) => {
  probe.font = `200px ${stack}`;
  return probe.measureText('x').actualBoundingBoxAscent / 200;
};
let target;

const apply = async () => {
  const root = document.documentElement;
  for (const role of ROLES) root.style.setProperty(`--lab-${role}`, FACES[state[role]].stack);
  await Promise.all(ROLES.map((role) => document.fonts.load(`16px ${FACES[state[role]].stack}`).catch(() => {})));
  target ??= xHeight(FACES.literata.stack);
  for (const role of ['text', 'detail']) {
    root.style.setProperty(`--lab-${role}-x`, state[role] === 'literata' ? 'none' : target.toFixed(3));
  }
  const [, scheme, ...values] = PALETTES[state.palette];
  TOKENS.forEach((token, i) => root.style.setProperty(`--${token}`, values[i]));
  root.style.colorScheme = scheme;
  root.style.scrollbarColor = `${values[3]} ${values[0]}`;
  try { localStorage.setItem('type-lab', JSON.stringify(state)); } catch { /* private mode */ }
  history.replaceState(null, '', `#lab=${state.display}.${state.text}.${state.detail}.${state.palette}`);
  render();
};

// ---------- Panel ----------

const panel = document.createElement('aside');
panel.id = 'type-lab';
panel.setAttribute('aria-label', 'Type and colour lab');
const el = (tag, props = {}, ...children) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

const summary = () => `Display: ${FACES[state.display].name}
Text: ${FACES[state.text].name}
Detail: ${FACES[state.detail].name}
Palette: ${PALETTES[state.palette][0]}`;

function render() {
  const closed = panel.classList.contains('is-closed');
  const scroll = el('div', { className: 'scroll' });

  scroll.append(el('h4', {}, 'Pairings'));
  const pairings = el('div', { className: 'pairings' });
  for (const [name, why, display, text, detail] of PAIRINGS) {
    const on = state.display === display && state.text === text && state.detail === detail;
    const button = el('button', { type: 'button' }, name, el('small', {}, why));
    button.setAttribute('aria-pressed', on);
    button.onclick = () => { Object.assign(state, { display, text, detail }); apply(); };
    pairings.append(button);
  }
  scroll.append(pairings);

  scroll.append(el('h4', {}, 'Or mix by role'));
  for (const role of ROLES) {
    const select = el('select');
    for (const [id, f] of Object.entries(FACES)) {
      select.append(el('option', { value: id, selected: state[role] === id }, f.note ? `${f.name} (${f.note})` : f.name));
    }
    select.onchange = () => { state[role] = select.value; apply(); };
    scroll.append(el('label', { className: 'role' }, role[0].toUpperCase() + role.slice(1), select));
  }

  scroll.append(el('h4', {}, 'Palette'));
  const palettes = el('div', { className: 'palettes' });
  for (const [id, [name, , paper, ink, , , , , pencil]] of Object.entries(PALETTES)) {
    const swatch = el('span', { className: 'swatch' });
    for (const colour of [paper, ink, pencil]) swatch.append(el('i', { style: `background:${colour}` }));
    const button = el('button', { type: 'button' }, swatch, name);
    button.setAttribute('aria-pressed', state.palette === id);
    button.onclick = () => { state.palette = id; apply(); };
    palettes.append(button);
  }
  scroll.append(palettes);

  scroll.append(el('h4', {}, 'Your own font'));
  const input = el('input', { type: 'file', accept: '.woff2,.woff,.otf,.ttf', multiple: true });
  const drop = el('label', { className: 'drop' }, 'Drop font files here, or click to choose', input);
  const take = async (files) => {
    for (const file of files) {
      const id = `custom${Object.keys(FACES).length}`;
      const family = `Lab Custom ${id}`;
      try {
        const loaded = await new FontFace(family, await file.arrayBuffer()).load();
        document.fonts.add(loaded);
        FACES[id] = face(file.name.replace(/\.\w+$/, ''), `"${family}", serif`, [], { note: 'dropped' });
        state.display = id;
      } catch { drop.firstChild.textContent = `Could not read ${file.name}. Try a .woff2, .otf or .ttf file.`; return; }
    }
    apply();
  };
  input.onchange = () => take(input.files);
  drop.ondragover = (event) => { event.preventDefault(); drop.classList.add('is-over'); };
  drop.ondragleave = () => drop.classList.remove('is-over');
  drop.ondrop = (event) => { event.preventDefault(); drop.classList.remove('is-over'); take(event.dataTransfer.files); };
  scroll.append(drop);

  scroll.append(el('div', { className: 'pick' }, summary()));
  const copy = el('button', { type: 'button' }, 'Copy choice');
  copy.onclick = async () => {
    try { await navigator.clipboard.writeText(summary()); copy.textContent = 'Copied'; }
    catch { copy.textContent = 'Select the text above'; }
  };
  const reset = el('button', { type: 'button' }, 'Reset');
  reset.onclick = () => { Object.assign(state, DEFAULTS); apply(); };
  scroll.append(el('div', { className: 'actions' }, copy, reset));

  const toggle = el('button', { type: 'button' }, closed ? 'Open' : 'Hide');
  toggle.onclick = () => { panel.classList.toggle('is-closed'); render(); };
  const top = scroll.scrollTop;
  const previous = panel.querySelector('.scroll')?.scrollTop ?? top;
  panel.replaceChildren(el('header', {}, el('strong', {}, 'Type and colour lab'), toggle), scroll);
  scroll.scrollTop = previous;
}

if (matchMedia('(max-width: 30rem)').matches || /[#&]lab-closed/.test(location.hash)) panel.classList.add('is-closed');
if (!/[#&]lab-hidden/.test(location.hash)) document.body.append(panel);
apply();
