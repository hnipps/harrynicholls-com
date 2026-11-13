// Draws the favicon rasters and the 1200 by 630 share images in src/og/.
// Run by hand when a page title or description changes: it needs Playwright and
// is not part of the build.
//
//   node scripts/make-share-images.js
//
// Then make favicon.ico from the 32px file it writes (see the end of this file).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src');
const font = (file) => `data:font/woff2;base64,${fs.readFileSync(path.join(src, 'fonts', file)).toString('base64')}`;

// One card per page: the title in the serif, one line under it, the address below.
const cards = [
  ['home', 'Harry Nicholls', 'Software Engineer'],
  ['portfolio', 'Portfolio', 'Five projects of my own, each written up on its own page.'],
  ['colophon', 'Colophon', 'How this site is built.'],
  ['gitrove', 'gitrove', 'Daily discoveries from your GitHub network.'],
  ['crosscheck', 'Crosscheck', 'Formal verification for AI-generated code.'],
  ['recommender', 'Recommender', 'A film and TV recommender that learns my taste.'],
  ['opsdeck', 'opsdeck', 'A personal dashboard for the pull requests that need me.'],
  ['go-home', 'GoHome', 'One home for the services on my home server.'],
];

const card = (name, title, line) => `<!doctype html><meta charset="utf-8"><style>
  @font-face { font-family: "Instrument Serif"; src: url(${font('instrument-serif-regular.woff2')}); }
  @font-face { font-family: "Hyperlegible Sans"; src: url(${font('hyperlegible-sans-regular.woff')}); }
  @font-face { font-family: "Hyperlegible Sans"; font-style: italic; src: url(${font('hyperlegible-sans-italic.woff')}); }
  * { margin: 0; }
  body { width: 1200px; height: 630px; box-sizing: border-box; padding: 84px 96px 72px; display: flex; flex-direction: column;
    background: #fafcff; color: #03409c; font-family: "Hyperlegible Sans"; }
  h1 { font: 400 ${name === 'home' ? 176 : 160}px/1 "Instrument Serif"; letter-spacing: -0.012em; white-space: nowrap; }
  p { margin-top: 28px; max-width: 880px; font-size: 40px; line-height: 1.35; }
  footer { margin-top: auto; padding-top: 30px; border-top: 2px solid #c9deff; display: flex; justify-content: space-between;
    color: #4373c1; font-size: 28px; font-style: italic; }
  u { text-decoration: underline #de0039 3px; text-underline-offset: 8px; color: #03409c; font-style: normal; }
</style><h1>${title}</h1><p>${line}</p>
<footer><span>${name === 'home' ? 'Selected work, projects and writing' : 'Harry Nicholls'}</span><u>harrynicholls.com</u></footer>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const [name, title, line] of cards) {
    await page.setContent(card(name, title, line));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(src, 'og', `${name}.png`) });
  }

  // The touch icon is square and opaque: the phone rounds its corners itself.
  const svg = fs.readFileSync(path.join(src, 'favicon.svg'), 'utf8');
  for (const [file, size, square] of [['apple-touch-icon.png', 180, true], ['favicon-32.png', 32, false]]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${square ? svg.replace(' rx="180"', '') : svg}`);
    await page.screenshot({ path: path.join(src, file), omitBackground: true });
  }
  await browser.close();
  // favicon.ico, for browsers that ask for it by name:
  //   python3 -c "from PIL import Image; Image.open('src/favicon-32.png').save('src/favicon.ico', sizes=[(32, 32)])"
})();
