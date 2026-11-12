// Type and colour lab for the home page. Local only: scripts/lab-server.py
// injects this into the page; nothing here is deployed.
//
// Type tab, three roles:
//   display  the name
//   text     paragraphs, entry names, lists
//   detail   section heads, dates, role lines, graph labels, small print
//
// Colour tab: a palette per mode, tuned by colour-theory controls or picked by hand.

const F = '/lab/fonts/';
const face = (name, stack, files, extra = {}) => ({ name, stack, files, italic: false, ...extra });

const FACES = {
  literata: face('Literata', '"Lab Literata", Georgia, serif', [
    ['literata-roman.woff2', '300 700'], ['literata-italic.woff2', '300 700', 'italic']], { italic: true }),

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
    ['instrument-serif-400.woff2', '400'], ['instrument-serif-400-italic.woff2', '400', 'italic']], { italic: true, note: 'current' }),
  redaction: face('Redaction', '"Lab Redaction", Georgia, serif', [
    ['redaction-400.woff2', '400'], ['redaction-400-italic.woff2', '400', 'italic'], ['redaction-700.woff2', '700']], { italic: true }),
  redaction20: face('Redaction 20', '"Lab Redaction 20", Georgia, serif', [['redaction-20-400.woff2', '400']]),
  monor: face('Monor', '"Lab Monor", ui-monospace, monospace', [['monor-400.otf', '400'], ['monor-700.otf', '700']]),
  commit: face('Commit Mono', '"Lab Commit", ui-monospace, monospace', [
    ['commit-mono-400.woff2', '400'], ['commit-mono-400-italic.woff2', '400', 'italic'], ['commit-mono-700.woff2', '700']], { italic: true }),
  spaceGrotesk: face('Space Grotesk', '"Lab Space Grotesk", system-ui, sans-serif', [['space-grotesk.woff2', '300 700']]),
  hyperlegible: face('Hyperlegible Sans', '"Lab Hyperlegible", system-ui, sans-serif', [
    ['hyperlegible-sans-400.otf', '400'], ['hyperlegible-sans-400-italic.otf', '400', 'italic'],
    ['hyperlegible-sans-500.otf', '500'], ['hyperlegible-sans-700.otf', '700']], { italic: true, note: 'current' }),
  haskoy: face('Hasköy', '"Lab Haskoy", system-ui, sans-serif', [
    ['haskoy-400.otf', '400'], ['haskoy-400-italic.otf', '400', 'italic'], ['haskoy-500.otf', '500'], ['haskoy-700.otf', '700']], { italic: true }),
  instrumentSans: face('Instrument Sans', '"Lab Instrument Sans", system-ui, sans-serif', [
    ['instrument-sans.woff2', '400 700'], ['instrument-sans-italic.woff2', '400 700', 'italic']], { italic: true }),
  departure: face('Departure Mono', '"Lab Departure", ui-monospace, monospace', [['departure-mono.woff2', '400']]),
};

const PAIRINGS = [
  ['Instrument Serif + Hyperlegible', 'What the page ships with today.', 'instrumentSerif', 'hyperlegible', 'hyperlegible'],
  ['Literata throughout', 'The first version: one book serif for everything.', 'literata', 'literata', 'literata'],
  ['Besley + Hanken Grotesk', 'My pick. A sturdy Clarendon for the name, a plain grotesk to read.', 'besley', 'hanken', 'hanken'],
  ['Mona Sans + Monaspace', 'My pick. GitHub’s own faces, next to your GitHub graph.', 'mona', 'mona', 'monaspace'],
  ['Instrument Serif + Sans', 'A tall, sharp display serif over its sibling sans.', 'instrumentSerif', 'instrumentSans', 'instrumentSans'],
  ['Redaction + Commit Mono', 'A degraded legal serif for the name, mono for the dates.', 'redaction20', 'redaction', 'commit'],
  ['Saint + Hasköy', 'An expressive display face over a quiet sans.', 'saint', 'haskoy', 'haskoy'],
  ['Space Grotesk + Hyperlegible', 'Grotesk name, high-legibility text, pixel details.', 'spaceGrotesk', 'hyperlegible', 'departure'],
  ['Hikaru + Commit Mono', 'All monospace. The terminal resume.', 'hikaru', 'commit', 'commit'],
  ['Monor + Instrument Sans', 'A mono with odd shapes for name and details.', 'monor', 'instrumentSans', 'monor'],
];

const ROLES = ['display', 'text', 'detail'];
const DEFAULTS = { display: 'instrumentSerif', text: 'hyperlegible', detail: 'hyperlegible' };

// ---------- Colour model ----------
//
// Each mode (light, dark) is three chosen colours in OKLCH: paper, ink and accent.
// The other six theme colours are derived from them, unless one is picked by hand.
//   l  lightness, 0 to 100     c  chroma, 0 (grey) to about 0.3     h  hue angle, 0 to 360

const TOKENS = [
  ['paper', 'Paper', 'The page background.'],
  ['ink', 'Ink', 'Body text and the name.'],
  ['ink-soft', 'Soft ink', 'Dates, role lines, asides.'],
  ['hairline', 'Hairline', 'The rule above each section.'],
  ['rest', 'Quiet dot', 'A day with no commits.'],
  ['frame', 'Tile', 'Empty album and photo tiles.'],
  ['pencil', 'Accent', 'Link underlines, bullets, today’s dot.'],
  ['pencil-ink', 'Accent text', 'A link while hovered.'],
  ['pencil-wash', 'Selection', 'Behind selected text.'],
];
const col = (l, c, h) => ({ l, c, h });
const PRESETS = {
  blue: ['Blue ink', col(99, 0.005, 260), col(40, 0.2925, 260), col(57, 0.27, 20)],
  blueNight: ['Blue night', col(8.5, 0.06, 260), col(84, 0.16, 260), col(70, 0.2295, 20)],
  graphite: ['Graphite and cobalt', col(98.6, 0, 260), col(22, 0.01, 260), col(55, 0.21, 262)],
  ink: ['Ink and persimmon', col(97.8, 0.006, 255), col(27, 0.075, 268), col(64, 0.19, 40)],
  spruce: ['Spruce and brass', col(97.6, 0.008, 150), col(27, 0.05, 165), col(68, 0.13, 80)],
  oxblood: ['Oxblood and sage', col(96.8, 0.008, 60), col(28, 0.075, 20), col(60, 0.09, 160)],
  plum: ['Plum and marigold', col(97.5, 0.008, 320), col(28, 0.09, 320), col(74, 0.16, 75)],
  night: ['Night shift', col(20, 0.035, 268), col(93, 0.015, 265), col(72, 0.17, 45)],
  blueprint: ['Blueprint', col(40, 0.15, 262), col(97, 0.012, 250), col(87, 0.15, 95)],
};
const fromPreset = (id) => {
  const [, paper, ink, accent] = PRESETS[id];
  return { paper: { ...paper }, ink: { ...ink }, accent: { ...accent }, harmony: 'free', flip: false, overrides: {}, touched: false };
};
const SHIPPED = { light: 'blue', dark: 'blueNight' };

const HARMONIES = {
  free: ['Free', null, 'The accent hue is whatever you set.'],
  mono: ['Monochromatic', 0, 'Accent and neutrals share one hue. Calm; contrast comes from value and chroma alone.'],
  analogous: ['Analogous', 30, 'A neighbour on the wheel. Harmonious and quiet.'],
  triadic: ['Triadic', 120, 'A third of the way round. Lively but balanced.'],
  split: ['Split-complementary', 150, 'Just beside the opposite. Nearly as much punch as a complement, less tension.'],
  complementary: ['Complementary', 180, 'Directly opposite. The two hues make each other look as vivid as they can.'],
};

// OKLCH <-> sRGB. Björn Ottosson's OKLab matrices.
const DEG = Math.PI / 180;
const gamma = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const linear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toLinearRgb = ({ l, c, h }) => {
  const L = l / 100, a = c * Math.cos(h * DEG), b = c * Math.sin(h * DEG);
  const l3 = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m3 = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s3 = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3];
};
const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);
// Screens cannot show every OKLCH colour. Pull the chroma in until this one fits.
const fit = (colour) => {
  const l = Math.min(100, Math.max(0, colour.l));
  let rgb = toLinearRgb({ ...colour, l });
  if (inGamut(rgb)) return { l, c: colour.c, h: colour.h, rgb };
  let lo = 0, hi = colour.c;
  for (let i = 0; i < 18; i += 1) {
    const mid = (lo + hi) / 2;
    if (inGamut(toLinearRgb({ l, c: mid, h: colour.h }))) lo = mid; else hi = mid;
  }
  rgb = toLinearRgb({ l, c: lo, h: colour.h }).map((v) => Math.min(1, Math.max(0, v)));
  return { l, c: lo, h: colour.h, rgb };
};
const css = (colour) => { const f = fit(colour); return `oklch(${f.l.toFixed(1)}% ${f.c.toFixed(3)} ${f.h.toFixed(0)})`; };
const hex = (colour) => `#${fit(colour).rgb.map((v) => Math.round(gamma(Math.min(1, Math.max(0, v))) * 255).toString(16).padStart(2, '0')).join('')}`;
const fromHex = (value, keepHue) => {
  const [r, g, b] = [1, 3, 5].map((i) => linear(parseInt(value.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  const c = Math.hypot(A, B);
  // A grey has no hue of its own; keep the one it had so the sliders do not jump.
  return { l: (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s) * 100, c, h: c < 0.004 ? keepHue : (Math.atan2(B, A) / DEG + 360) % 360 };
};
const luminance = (colour) => { const [r, g, b] = fit(colour).rgb; return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

const derive = (p) => {
  const dark = p.paper.l < 50;
  const hueNear = p.paper.c > 0.002 ? p.paper.h : p.ink.h;
  const between = (t, h) => ({ l: p.paper.l + (p.ink.l - p.paper.l) * t, c: p.paper.c + (p.ink.c - p.paper.c) * t, h });
  const tokens = {
    paper: p.paper,
    ink: p.ink,
    'ink-soft': between(0.73, p.ink.h),
    hairline: between(0.16, hueNear),
    rest: between(0.24, hueNear),
    frame: between(0.08, hueNear),
    pencil: p.accent,
    'pencil-ink': { l: p.accent.l + (dark ? 9 : -11), c: p.accent.c * (dark ? 0.78 : 0.95), h: p.accent.h },
    'pencil-wash': { l: p.paper.l + (dark ? 20 : -6.5), c: p.accent.c * (dark ? 0.5 : 0.25), h: p.accent.h },
  };
  return { ...tokens, ...p.overrides };
};

// ---------- Fonts and lab styles ----------

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

#type-lab { position: fixed; right: 12px; bottom: 12px; z-index: 9999; width: 300px; max-height: calc(100vh - 24px);
  display: flex; flex-direction: column; background: #16171a; color: #e9eaee; border-radius: 10px; color-scheme: dark;
  box-shadow: 0 2px 6px rgb(0 0 0 / .25), 0 18px 48px -12px rgb(0 0 0 / .55);
  font: 13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; font-size-adjust: none; font-variant-numeric: tabular-nums; }
#type-lab * { box-sizing: border-box; font-family: inherit; font-size-adjust: none; }
#type-lab header { display: flex; align-items: center; gap: 6px; padding: 10px 12px 8px; }
#type-lab header strong { flex: 1; font-weight: 600; letter-spacing: .01em; }
#type-lab .scroll { overflow-y: auto; padding: 0 12px 12px; }
#type-lab.is-closed .scroll, #type-lab.is-closed .tabs { display: none; }
#type-lab.is-closed { width: auto; }
#type-lab h4 { margin: 16px 0 4px; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #9a9da8; }
#type-lab .hint { margin: 0 0 8px; color: #9a9da8; font-size: 12px; line-height: 1.4; }
#type-lab button { appearance: none; border: 0; background: #26282e; color: inherit; font-size: 13px; border-radius: 6px; cursor: pointer; }
#type-lab button:hover { background: #33363e; }
#type-lab button:focus-visible, #type-lab select:focus-visible, #type-lab input:focus-visible, #type-lab label:focus-within { outline: 2px solid #8ab4ff; outline-offset: 1px; }
#type-lab header button { padding: 4px 9px; }
#type-lab .tabs, #type-lab .seg { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 4px; }
#type-lab .tabs { padding: 0 12px 4px; }
#type-lab .tabs button, #type-lab .seg button { padding: 6px; }
#type-lab .pairings { display: grid; gap: 4px; }
#type-lab .pairings button { padding: 7px 9px; text-align: left; }
#type-lab .pairings small { display: block; color: #9a9da8; font-size: 11.5px; }
#type-lab [aria-pressed="true"] { background: #e9eaee; color: #16171a; }
#type-lab [aria-pressed="true"]:hover { background: #fff; }
#type-lab [aria-pressed="true"] small { color: #4a4d57; }
#type-lab .field { display: grid; grid-template-columns: 62px 1fr; align-items: center; gap: 8px; margin-top: 5px; color: #c6c8d0; }
#type-lab select { width: 100%; padding: 6px 7px; background: #26282e; color: #e9eaee; border: 1px solid #3a3d46; border-radius: 6px; font-size: 13px; }
#type-lab .slide { display: block; margin-top: 8px; color: #c6c8d0; }
#type-lab .slide span { display: flex; justify-content: space-between; }
#type-lab .slide output { color: #e9eaee; }
#type-lab .slide i { display: block; height: 5px; margin-top: 4px; border-radius: 3px; }
#type-lab input[type="range"] { display: block; width: 100%; margin: 3px 0 0; accent-color: #e9eaee; }
#type-lab input[type="range"]:disabled { opacity: .35; }
#type-lab .wheel { display: flex; align-items: center; gap: 12px; margin: 8px 0 2px; }
#type-lab .wheel svg { flex: none; width: 84px; height: 84px; }
#type-lab .wheel p { margin: 0; color: #c6c8d0; font-size: 12px; }
#type-lab .wheel b { color: #e9eaee; font-weight: 600; }
#type-lab table { width: 100%; margin-top: 6px; border-collapse: collapse; font-size: 12px; }
#type-lab td { padding: 3px 0; color: #c6c8d0; }
#type-lab td:nth-child(2) { text-align: right; color: #e9eaee; }
#type-lab td:nth-child(3) { width: 46px; text-align: right; }
#type-lab .pass { color: #7fd69a; } #type-lab .warn { color: #f0c36b; } #type-lab .fail { color: #ff8f8f; }
#type-lab .swatches { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px 6px; }
#type-lab .swatches label { display: block; position: relative; color: #c6c8d0; font-size: 11.5px; cursor: pointer; }
#type-lab input[type="color"] { display: block; width: 100%; height: 30px; margin-bottom: 2px; padding: 0; border: 1px solid #3a3d46; border-radius: 6px; background: none; cursor: pointer; }
#type-lab input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
#type-lab input[type="color"]::-webkit-color-swatch { border: 0; border-radius: 5px; }
#type-lab .swatches button { position: absolute; top: -6px; right: -4px; width: 18px; height: 18px; padding: 0; border-radius: 50%; font-size: 12px; line-height: 1; background: #e9eaee; color: #16171a; }
#type-lab .presets { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
#type-lab .presets button { display: flex; align-items: center; gap: 7px; padding: 6px 8px; text-align: left; font-size: 12px; }
#type-lab .chip { flex: none; display: flex; width: 30px; height: 16px; border-radius: 4px; overflow: hidden; box-shadow: 0 0 0 1px rgb(255 255 255 / .18); }
#type-lab .chip i { flex: 1; }
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
const paletteStyle = document.createElement('style');
document.head.append(paletteStyle);

// Filters for the colour checks.
const filters = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
filters.setAttribute('aria-hidden', 'true');
filters.style.cssText = 'position:absolute;width:0;height:0';
filters.innerHTML = `
<filter id="lab-protan"><feColorMatrix values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/></filter>
<filter id="lab-deutan"><feColorMatrix values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/></filter>
<filter id="lab-tritan"><feColorMatrix values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/></filter>`;
document.body.append(filters);
const VIEWS = {
  normal: ['Normal', 'none'],
  grey: ['Greyscale (value only)', 'grayscale(1)'],
  deutan: ['Green-blind (deuteranopia)', 'url(#lab-deutan)'],
  protan: ['Red-blind (protanopia)', 'url(#lab-protan)'],
  tritan: ['Blue-blind (tritanopia)', 'url(#lab-tritan)'],
};

// ---------- State ----------

const root = document.documentElement;
const systemDark = matchMedia('(prefers-color-scheme: dark)');
const mode = () => root.dataset.theme ?? (systemDark.matches ? 'dark' : 'light');

const saved = (() => { try { return JSON.parse(localStorage.getItem('type-lab')) ?? {}; } catch { return {}; } })();
const hashed = location.hash.match(/lab=(\w+)\.(\w+)\.(\w+)/);
const state = {
  ...DEFAULTS,
  tab: saved.tab === 'colour' ? 'colour' : 'type',
  ...(hashed ? { display: hashed[1], text: hashed[2], detail: hashed[3] } : { display: saved.display, text: saved.text, detail: saved.detail }),
  colour: {
    light: saved.colour?.light?.paper ? saved.colour.light : fromPreset(SHIPPED.light),
    dark: saved.colour?.dark?.paper ? saved.colour.dark : fromPreset(SHIPPED.dark),
  },
  view: 'normal',
};
for (const role of ROLES) if (!FACES[state[role]]) state[role] = DEFAULTS[role];

const save = () => {
  try { localStorage.setItem('type-lab', JSON.stringify({ display: state.display, text: state.text, detail: state.detail, tab: state.tab, colour: state.colour })); } catch { /* private mode */ }
  history.replaceState(null, '', `#lab=${state.display}.${state.text}.${state.detail}`);
};

// ---------- Applying type ----------

// x-height of a face relative to its em, read from the font itself. Text and detail
// faces are scaled to match the shipped text face, so every option is compared at the same apparent size.
const probe = document.createElement('canvas').getContext('2d');
const xHeight = (stack) => { probe.font = `200px ${stack}`; return probe.measureText('x').actualBoundingBoxAscent / 200; };
let target;

const applyType = async () => {
  for (const role of ROLES) root.style.setProperty(`--lab-${role}`, FACES[state[role]].stack);
  // The switcher sits on the name's dot only in the face it was measured for.
  root.classList.toggle('name-ready', state.display === DEFAULTS.display && CSS.supports('anchor-name: --tittle'));
  await Promise.all(ROLES.map((role) => document.fonts.load(`16px ${FACES[state[role]].stack}`).catch(() => {})));
  target ??= xHeight(FACES[DEFAULTS.text].stack);
  for (const role of ['text', 'detail']) {
    root.style.setProperty(`--lab-${role}-x`, state[role] === DEFAULTS.text ? 'none' : target.toFixed(3));
  }
  save();
  render();
};

// ---------- Applying colour ----------

const block = (tokens) => TOKENS.map(([token]) => `--${token}:${css(tokens[token])}`).join(';');
// Untouched modes are left to the real stylesheet, so the lab starts out showing exactly what ships.
const applyColour = () => {
  const { light, dark } = state.colour;
  let out = '';
  if (light.touched) {
    const rule = `{${block(derive(light))}}`;
    out += `@media (prefers-color-scheme: light){:root:root:not([data-theme="dark"])${rule}}:root:root[data-theme="light"]${rule}`;
  }
  if (dark.touched) {
    const rule = `{${block(derive(dark))}}`;
    out += `@media (prefers-color-scheme: dark){:root:root:not([data-theme="light"])${rule}}:root:root[data-theme="dark"]${rule}`;
  }
  paletteStyle.textContent = out;
  root.style.filter = VIEWS[state.view][1];
  save();
};

const applyHarmony = (p) => {
  const offset = HARMONIES[p.harmony][1];
  if (offset !== null) p.accent.h = (p.ink.h + (p.flip ? -offset : offset) + 360) % 360;
};
const hueGap = (p) => { const d = Math.abs(p.accent.h - p.ink.h) % 360; return d > 180 ? 360 - d : d; };
const nearestHarmony = (p) => Object.entries(HARMONIES).filter(([, [, offset]]) => offset !== null)
  .sort((a, b) => Math.abs(a[1][1] - hueGap(p)) - Math.abs(b[1][1] - hueGap(p)))[0][1][0].toLowerCase();

const exportCss = () => ['light', 'dark'].map((m) => {
  const tokens = derive(state.colour[m]);
  const name = m === 'light' ? ':root' : ':root (dark mode)';
  const note = state.colour[m].touched ? '' : '  /* unchanged from what ships */';
  return `${name} {${note}\n${TOKENS.map(([token]) => `  --${token}: ${css(tokens[token])};  /* ${hex(tokens[token])} */`).join('\n')}\n}`;
}).join('\n\n');

// ---------- Panel ----------

const panel = document.createElement('aside');
panel.id = 'type-lab';
panel.setAttribute('aria-label', 'Type and colour lab');
const el = (tag, props = {}, ...children) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children.filter((child) => child !== null && child !== undefined));
  return node;
};
const pressed = (button, on) => { button.setAttribute('aria-pressed', on); return button; };

// Things in the colour tab that must follow a slider while it is being dragged.
let live = [];
const refresh = () => { for (const update of live) update(); };
const changed = (p) => { p.touched = true; applyHarmony(p); applyColour(); refresh(); };

const typeSummary = () => `Display: ${FACES[state.display].name}\nText: ${FACES[state.text].name}\nDetail: ${FACES[state.detail].name}`;

function typeTab(scroll) {
  scroll.append(el('h4', {}, 'Pairings'));
  const pairings = el('div', { className: 'pairings' });
  for (const [name, why, display, text, detail] of PAIRINGS) {
    const button = el('button', { type: 'button' }, name, el('small', {}, why));
    pressed(button, state.display === display && state.text === text && state.detail === detail);
    button.onclick = () => { Object.assign(state, { display, text, detail }); applyType(); };
    pairings.append(button);
  }
  scroll.append(pairings, el('h4', {}, 'Or mix by role'));
  for (const role of ROLES) {
    const select = el('select');
    for (const [id, f] of Object.entries(FACES)) {
      select.append(el('option', { value: id, selected: state[role] === id }, f.note ? `${f.name} (${f.note})` : f.name));
    }
    select.onchange = () => { state[role] = select.value; applyType(); };
    scroll.append(el('label', { className: 'field' }, role[0].toUpperCase() + role.slice(1), select));
  }

  scroll.append(el('h4', {}, 'Your own font'));
  const input = el('input', { type: 'file', accept: '.woff2,.woff,.otf,.ttf', multiple: true });
  const drop = el('label', { className: 'drop' }, 'Drop font files here, or click to choose', input);
  const take = async (files) => {
    for (const file of files) {
      const id = `custom${Object.keys(FACES).length}`;
      const family = `Lab Custom ${id}`;
      try {
        document.fonts.add(await new FontFace(family, await file.arrayBuffer()).load());
        FACES[id] = face(file.name.replace(/\.\w+$/, ''), `"${family}", serif`, [], { note: 'dropped' });
        state.display = id;
      } catch { drop.firstChild.textContent = `Could not read ${file.name}. Try a .woff2, .otf or .ttf file.`; return; }
    }
    applyType();
  };
  input.onchange = () => take(input.files);
  drop.ondragover = (event) => { event.preventDefault(); drop.classList.add('is-over'); };
  drop.ondragleave = () => drop.classList.remove('is-over');
  drop.ondrop = (event) => { event.preventDefault(); drop.classList.remove('is-over'); take(event.dataTransfer.files); };
  scroll.append(drop, el('div', { className: 'pick' }, typeSummary()));

  const copy = el('button', { type: 'button' }, 'Copy choice');
  copy.onclick = async () => {
    try { await navigator.clipboard.writeText(typeSummary()); copy.textContent = 'Copied'; } catch { copy.textContent = 'Select the text above'; }
  };
  const reset = el('button', { type: 'button' }, 'Reset type');
  reset.onclick = () => { Object.assign(state, DEFAULTS); applyType(); };
  scroll.append(el('div', { className: 'actions' }, copy, reset));
}

function colourTab(scroll) {
  const m = mode();
  const p = state.colour[m];

  const slider = (label, min, max, step, read, write, { format = (v) => v.toFixed(0), bar, locked } = {}) => {
    const input = el('input', { type: 'range', min, max, step });
    const output = el('output');
    input.oninput = () => { write(Number(input.value)); changed(p); };
    live.push(() => {
      if (document.activeElement !== input) input.value = read();
      output.textContent = format(read());
      input.disabled = locked ? locked() : false;
    });
    return el('label', { className: 'slide' }, el('span', {}, label, output), bar ? el('i', { style: `background:${bar}` }) : null, input);
  };
  const hueBar = `linear-gradient(to right, ${Array.from({ length: 13 }, (_, i) => hex(col(72, 0.13, i * 30))).join(',')})`;

  // Which mode
  const seg = el('div', { className: 'seg' });
  for (const [id, name] of [['light', 'Light mode'], ['dark', 'Dark mode']]) {
    const button = pressed(el('button', { type: 'button' }, name), m === id);
    button.onclick = () => {
      if (mode() === id) return;
      const toggle = document.querySelector('.theme-toggle');
      if (toggle) toggle.click(); else root.dataset.theme = id;
    };
    seg.append(button);
  }
  scroll.append(el('h4', {}, 'Editing'), seg,
    el('p', { className: 'hint', style: 'margin-top:6px' }, 'Each mode has its own palette. Three colours are chosen (paper, ink, accent); the rest are mixed from them.'));

  // Hue and harmony
  scroll.append(el('h4', {}, 'Hue and harmony'),
    el('p', { className: 'hint' }, 'Hue is a colour’s place on the wheel. The key hue is the undertone of your paper and ink; harmony places the accent by its angle from it.'));
  const wheel = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  wheel.setAttribute('viewBox', '-50 -50 100 100');
  const at = (h, r) => [Math.cos((h - 90) * DEG) * r, Math.sin((h - 90) * DEG) * r];
  wheel.innerHTML = Array.from({ length: 36 }, (_, i) => {
    const [x1, y1] = at(i * 10 - 5.4, 46), [x2, y2] = at(i * 10 + 5.4, 46);
    return `<path d="M${x1} ${y1}A46 46 0 0 1 ${x2} ${y2}" fill="none" stroke="${hex(col(72, 0.13, i * 10))}" stroke-width="7"/>`;
  }).join('') + '<line class="k" stroke="#e9eaee" stroke-width="1.2"/><line class="a" stroke="#e9eaee" stroke-width="1.2" stroke-dasharray="2 2"/>'
    + '<circle class="k" r="6" stroke="#16171a" stroke-width="1.5"/><circle class="a" r="6" stroke="#16171a" stroke-width="1.5"/>';
  const reading = el('p');
  live.push(() => {
    for (const [cls, colour] of [['k', p.ink], ['a', p.accent]]) {
      const [x, y] = at(colour.h, 46);
      const line = wheel.querySelector(`line.${cls}`), dot = wheel.querySelector(`circle.${cls}`);
      line.setAttribute('x2', x * 0.82); line.setAttribute('y2', y * 0.82);
      dot.setAttribute('cx', x); dot.setAttribute('cy', y);
      dot.setAttribute('fill', hex(cls === 'k' ? col(60, 0.13, colour.h) : colour));
    }
    reading.replaceChildren('Accent is ', el('b', {}, `${hueGap(p).toFixed(0)}°`), ' from the key hue: ',
      el('b', {}, p.harmony === 'free' ? `closest to ${nearestHarmony(p)}` : HARMONIES[p.harmony][0].toLowerCase()), '.');
  });
  scroll.append(el('div', { className: 'wheel' }, wheel, reading));

  scroll.append(slider('Key hue', 0, 360, 1, () => p.ink.h, (v) => { p.ink.h = v; p.paper.h = v; }, { format: (v) => `${v.toFixed(0)}°`, bar: hueBar }));
  const harmony = el('select');
  for (const [id, [name]] of Object.entries(HARMONIES)) harmony.append(el('option', { value: id }, name));
  const side = el('button', { type: 'button', style: 'padding:6px 8px;margin-top:5px;width:100%' }, 'Use the other side of the wheel');
  const why = el('p', { className: 'hint', style: 'margin-top:6px' });
  harmony.onchange = () => { p.harmony = harmony.value; changed(p); };
  side.onclick = () => { p.flip = !p.flip; changed(p); };
  live.push(() => {
    harmony.value = p.harmony;
    why.textContent = HARMONIES[p.harmony][2];
    side.hidden = !['analogous', 'triadic', 'split'].includes(p.harmony);
  });
  scroll.append(el('label', { className: 'field', style: 'margin-top:8px' }, 'Harmony', harmony), side, why,
    slider('Accent hue', 0, 360, 1, () => p.accent.h, (v) => { p.accent.h = v; }, { format: (v) => `${v.toFixed(0)}°`, bar: hueBar, locked: () => p.harmony !== 'free' }));

  // Chroma
  scroll.append(el('h4', {}, 'Chroma'),
    el('p', { className: 'hint' }, 'Chroma is how far a colour sits from grey. Near-grey paper and ink with one strong accent is the classic restrained scheme; tinting the neutrals toward the key hue ties them together.'),
    slider('Paper tint', 0, 0.06, 0.001, () => p.paper.c, (v) => { p.paper.c = v; }, { format: (v) => v.toFixed(3) }),
    slider('Ink tint', 0, 0.16, 0.002, () => p.ink.c, (v) => { p.ink.c = v; }, { format: (v) => v.toFixed(3) }),
    slider('Accent strength', 0, 0.32, 0.005, () => p.accent.c, (v) => { p.accent.c = v; }, { format: (v) => v.toFixed(3) }));

  // Value
  scroll.append(el('h4', {}, 'Value'),
    el('p', { className: 'hint' }, 'Value is lightness, and it does most of the work: text is read by value contrast, not hue. The table shows contrast ratios; body text needs 4.5 to 1, marks need 3 to 1.'),
    slider('Paper lightness', 0, 100, 0.5, () => p.paper.l, (v) => { p.paper.l = v; }, { format: (v) => v.toFixed(1) }),
    slider('Ink lightness', 0, 100, 0.5, () => p.ink.l, (v) => { p.ink.l = v; }, { format: (v) => v.toFixed(1) }),
    slider('Accent lightness', 15, 95, 0.5, () => p.accent.l, (v) => { p.accent.l = v; }, { format: (v) => v.toFixed(1) }));
  const table = el('table');
  const checks = [['Text on paper', 'ink', 4.5], ['Soft text on paper', 'ink-soft', 4.5], ['Hovered link on paper', 'pencil-ink', 4.5], ['Accent marks on paper', 'pencil', 3]];
  for (const [name, token, need] of checks) {
    const ratio = el('td'), verdict = el('td');
    table.append(el('tr', {}, el('td', {}, name), ratio, verdict));
    live.push(() => {
      const tokens = derive(p), value = contrast(tokens[token], tokens.paper);
      ratio.textContent = `${value.toFixed(1)} : 1`;
      const [word, cls] = value >= 7 && need > 3 ? ['AAA', 'pass'] : value >= need ? ['Pass', 'pass'] : value >= 3 ? ['Low', 'warn'] : ['Fail', 'fail'];
      verdict.textContent = word; verdict.className = cls;
    });
  }
  scroll.append(table);

  // Checks
  const view = el('select');
  for (const [id, [name]] of Object.entries(VIEWS)) view.append(el('option', { value: id, selected: state.view === id }, name));
  view.onchange = () => { state.view = view.value; applyColour(); };
  scroll.append(el('h4', {}, 'See it another way'),
    el('p', { className: 'hint' }, 'Painters squint at a canvas to see value without colour. Greyscale does the same: if the page still reads, the values are right. The others simulate colour blindness.'),
    el('label', { className: 'field' }, 'View', view));

  // Every colour
  scroll.append(el('h4', {}, 'Every colour'),
    el('p', { className: 'hint' }, 'Pick any colour directly. Paper, ink and accent move the sliders above; the others are pinned until you clear them.'));
  const swatches = el('div', { className: 'swatches' });
  for (const [token, name, what] of TOKENS) {
    const chosen = { paper: 'paper', ink: 'ink', pencil: 'accent' }[token];
    const input = el('input', { type: 'color', title: what });
    const clear = el('button', { type: 'button', title: `Return ${name.toLowerCase()} to the mixed colour` }, '×');
    clear.setAttribute('aria-label', clear.title);
    input.oninput = () => {
      if (chosen) {
        p[chosen] = fromHex(input.value, p[chosen].h);
        if (chosen === 'accent') p.harmony = 'free';
      } else {
        p.overrides[token] = fromHex(input.value, derive(p)[token].h);
      }
      changed(p);
    };
    clear.onclick = () => { delete p.overrides[token]; changed(p); };
    live.push(() => {
      if (document.activeElement !== input) input.value = hex(derive(p)[token]);
      clear.hidden = !(token in p.overrides);
    });
    swatches.append(el('label', {}, input, name, clear));
  }
  scroll.append(swatches);

  // Starting points
  scroll.append(el('h4', {}, 'Start from'));
  const presets = el('div', { className: 'presets' });
  for (const [id, [name, paper, ink, accent]] of Object.entries(PRESETS)) {
    const chip = el('span', { className: 'chip' });
    for (const colour of [paper, ink, accent]) chip.append(el('i', { style: `background:${hex(colour)}` }));
    const button = el('button', { type: 'button' }, chip, name);
    button.onclick = () => { state.colour[m] = { ...fromPreset(id), touched: id !== SHIPPED[m] }; applyColour(); render(); };
    presets.append(button);
  }
  scroll.append(presets);
  if (m === 'dark') {
    const mirror = el('button', { type: 'button', style: 'padding:7px;margin-top:6px;width:100%' }, 'Build dark mode from the light palette');
    mirror.onclick = () => {
      const light = state.colour.light;
      state.colour.dark = { paper: col(19, Math.max(0.02, light.ink.c * 0.5), light.ink.h), ink: col(93, Math.min(0.02, light.paper.c + 0.01), light.ink.h),
        accent: col(Math.max(70, light.accent.l), light.accent.c * 0.85, light.accent.h), harmony: light.harmony, flip: light.flip, overrides: {}, touched: true };
      applyColour(); render();
    };
    scroll.append(mirror, el('p', { className: 'hint', style: 'margin-top:6px' }, 'Dark mode is not an inversion. The paper takes the ink’s hue at low lightness, and the accent gets lighter and a little less saturated so it does not glare.'));
  }

  const copy = el('button', { type: 'button' }, 'Copy both palettes');
  copy.onclick = async () => {
    try { await navigator.clipboard.writeText(exportCss()); copy.textContent = 'Copied'; } catch { copy.textContent = 'Could not copy'; }
  };
  const reset = el('button', { type: 'button' }, 'Reset colours');
  reset.onclick = () => { state.colour = { light: fromPreset(SHIPPED.light), dark: fromPreset(SHIPPED.dark) }; state.view = 'normal'; applyColour(); render(); };
  scroll.append(el('div', { className: 'actions', style: 'margin-top:14px' }, copy, reset));
}

function render() {
  const closed = panel.classList.contains('is-closed');
  const previous = panel.querySelector('.scroll')?.scrollTop ?? 0;
  const scroll = el('div', { className: 'scroll' });
  live = [];
  if (state.tab === 'colour') colourTab(scroll); else typeTab(scroll);

  const tabs = el('div', { className: 'tabs' });
  for (const [id, name] of [['type', 'Type'], ['colour', 'Colour']]) {
    const button = pressed(el('button', { type: 'button' }, name), state.tab === id);
    button.onclick = () => { state.tab = id; save(); panel.querySelector('.scroll').scrollTop = 0; render(); };
    tabs.append(button);
  }
  const toggle = el('button', { type: 'button' }, closed ? 'Open' : 'Hide');
  toggle.onclick = () => { panel.classList.toggle('is-closed'); render(); };
  panel.replaceChildren(el('header', {}, el('strong', {}, 'Type and colour lab'), toggle), tabs, scroll);
  refresh();
  scroll.scrollTop = previous;
}

// Follow the page's own light and dark switcher.
new MutationObserver(() => { if (state.tab === 'colour') render(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
systemDark.addEventListener('change', () => { if (state.tab === 'colour') render(); });

if (matchMedia('(max-width: 30rem)').matches || /[#&]lab-closed/.test(location.hash)) panel.classList.add('is-closed');
if (!/[#&]lab-hidden/.test(location.hash)) document.body.append(panel);
applyColour();
applyType();
