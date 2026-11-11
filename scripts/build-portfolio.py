"""Publish the six paper-stack portfolio views into the static deployment root.

The home page (src/index.html) is not built here; see the note at the end."""
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

# The home page is src/index.html, written by hand with its assets in src/landing/.
# This script no longer generates it: the paper stack came off the home page on
# 2026-11-11 and its six views are published here unlinked.
print('Published six portfolio views to src/portfolio-views/ (src/index.html is hand-written).')
