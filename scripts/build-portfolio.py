"""Build the paper-stack homepage and its assets into the existing static deployment root."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
EXPLORATION = ROOT / 'design-exploration'
SOURCE = EXPLORATION / 'paper-stack'
OUTPUT = ROOT / 'src' / 'portfolio-views'


def publish(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    text = source.read_text()
    text = text.replace('../../../src/assets/', '/assets/')
    text = text.replace('../src/assets/', '/assets/')
    text = text.replace('<a href="../../index.html" target="_top">Design exploration</a>', '')
    destination.write_text(text)


for name in ['prototype.css', 'prototype.js', 'reading-studies.css',
             'symbols-pixels.css', 'symbols-pixels.js', 'minimal-data.css', 'minimal-data.js']:
    publish(EXPLORATION / name, OUTPUT / name)

for source in SOURCE.iterdir():
    if source.suffix in {'.js', '.css'}:
        publish(source, OUTPUT / 'paper-stack' / source.name)

for source in (SOURCE / 'themes').iterdir():
    if source.suffix in {'.html', '.css', '.js'}:
        publish(source, OUTPUT / 'paper-stack' / 'themes' / source.name)

# Dot matrix's existing graphic is a runtime asset, rather than a review capture.
(OUTPUT / 'screenshots').mkdir(parents=True, exist_ok=True)
shutil.copyfile(EXPLORATION / 'screenshots' / 'symbols-pixels-mark.jpg',
                OUTPUT / 'screenshots' / 'symbols-pixels-mark.jpg')

page = (SOURCE / 'index.html').read_text()
page = page.replace('<head>', '<head>\n  <base href="/portfolio-views/paper-stack/">')
page = page.replace('  <meta name="robots" content="noindex">', (SOURCE / 'site-head.html').read_text())
page = page.replace('<title>Harry Nicholls · A personal letter</title>', '<title>Harry Nicholls | Product Engineer</title>')
(ROOT / 'src' / 'index.html').write_text(page)
print('Built src/index.html and six complete portfolio views.')
