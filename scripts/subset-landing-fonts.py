"""Subset the landing page's four fonts to Latin and write them as WOFF.

usage: subset-landing-fonts.py <page.html> <font-sources-dir> src/landing/fonts

Run this only when the fonts change. <font-sources-dir> needs the uncompressed
originals, which are not in this repo:
  HyperlegibleSans-Regular.otf, HyperlegibleSans-Bold.otf
      https://github.com/matthewlarn/hyperlegible-sans (fonts/otf)
  SpaceGrotesk-wght.ttf
      https://github.com/floriankarsten/space-grotesk (fonts/ttf, variable)
  CasimirDunmore-Regular.otf
      ifthisfindsyou.app, set 1t26sd, the hand's "Download font" button. Take
      the downloaded font, never the one the page previews with: that preview
      is a 25-character subset.
plus the OFL and credits text files, which are copied beside the output.
It prints any character used in <page.html> that a subset font lacks.
Needs fontTools (pip install fonttools)."""
import html
import pathlib
import re
import shutil
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

letter, src, out = (pathlib.Path(a) for a in sys.argv[1:4])
out.mkdir(parents=True, exist_ok=True)
body = letter.read_text()
body = body[body.find("<body"):]
text = html.unescape(re.sub(r"<[^>]+>", "", body))
extra = sorted({c for c in text if ord(c) > 126})
print("non-ascii in copy:", [f"{c} U+{ord(c):04X}" for c in extra])
print("inline tags:", {k: len(re.findall("<" + k + r"[\s>]", body)) for k in ["em", "i", "b", "strong", "code"]})

# Basic Latin, Latin-1, and the typographic punctuation a letter needs.
UNICODES = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [
    0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x2212, 0x2022, 0x2190, 0x2192] + [ord(c) for c in extra]

JOBS = [
    ("HyperlegibleSans-Regular.otf", "hyperlegible-sans-400.woff", ["kern", "liga", "calt", "tnum", "zero", "case", "ss01", "ss02", "ss03"]),
    ("HyperlegibleSans-Bold.otf", "hyperlegible-sans-700.woff", ["kern", "liga", "calt", "tnum", "zero", "case", "ss01", "ss02", "ss03"]),
    ("SpaceGrotesk-wght.ttf", "space-grotesk-var.woff", ["kern", "liga", "tnum", "zero", "case"]),
    ("CasimirDunmore-Regular.otf", "casimir-dunmore-400.woff", ["*"]),
]
for name, dest, feats in JOBS:
    font = TTFont(src / name)
    have = set(font.getBestCmap())
    opts = subset.Options()
    opts.layout_features = feats
    opts.flavor = "woff"
    opts.name_IDs = ["*"]          # keep the licence and copyright records
    opts.name_languages = ["*"]
    opts.notdef_outline = True
    opts.hinting = False
    opts.desubroutinize = True
    s = subset.Subsetter(opts)
    s.populate(unicodes=[u for u in UNICODES if u in have])
    s.subset(font)
    font.flavor = "woff"
    font.save(out / dest)
    cm = TTFont(out / dest).getBestCmap()
    missing = [f"U+{u:04X}" for u in [ord(c) for c in set(text) if ord(c) > 32] if u not in cm]
    print(f"{dest:30} {(src / name).stat().st_size:>7} -> {(out / dest).stat().st_size:>7} bytes, {len(cm)} chars, copy chars missing: {sorted(set(missing)) or 'none'}")

for lic in ["OFL-HyperlegibleSans.txt", "OFL-SpaceGrotesk.txt", "OFL-CasimirDunmore.txt", "CREDITS-CasimirDunmore.txt"]:
    shutil.copyfile(src / lic, out / lic)
print("licences copied")
