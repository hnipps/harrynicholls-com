#!/bin/sh
# Fetch the trial fonts for the type lab into ./fonts (ignored by git, never deployed).
# Run from anywhere: sh design-exploration/type-lab/fetch-fonts.sh
set -u
cd "$(dirname "$0")" || exit 1
mkdir -p fonts
cd fonts || exit 1

get() { # <file> <url>
  if [ -s "$1" ]; then return; fi
  curl -fsSL -m 60 -o "$1" "$2" && echo "ok   $1" || { echo "FAIL $1  ($2)"; rm -f "$1"; }
}

FS="https://cdn.jsdelivr.net/fontsource/fonts"
RAW="https://raw.githubusercontent.com"

# The page's first typeface, kept for comparison (SIL OFL 1.1)
get literata-roman.woff2               "https://fonts.gstatic.com/s/literata/v40/or3hQ6P12-iJxAIgLYTwJrUXnTPm.woff2"
get literata-italic.woff2              "https://fonts.gstatic.com/s/literata/v40/or3nQ6P12-iJxAIgLYT1FrcdmhHkjko.woff2"

# From the Fontsource catalogue (all SIL OFL 1.1)
get instrument-serif-400.woff2         "$FS/instrument-serif@latest/latin-400-normal.woff2"
get instrument-serif-400-italic.woff2  "$FS/instrument-serif@latest/latin-400-italic.woff2"
get instrument-sans.woff2              "$FS/instrument-sans:vf@latest/latin-wght-normal.woff2"
get instrument-sans-italic.woff2       "$FS/instrument-sans:vf@latest/latin-wght-italic.woff2"
get space-grotesk.woff2                "$FS/space-grotesk:vf@latest/latin-wght-normal.woff2"
get redaction-400.woff2                "$FS/redaction@latest/latin-400-normal.woff2"
get redaction-400-italic.woff2         "$FS/redaction@latest/latin-400-italic.woff2"
get redaction-700.woff2                "$FS/redaction@latest/latin-700-normal.woff2"
get redaction-20-400.woff2             "$FS/redaction-20@latest/latin-400-normal.woff2"
get commit-mono-400.woff2              "$FS/commit-mono@latest/latin-400-normal.woff2"
get commit-mono-400-italic.woff2       "$FS/commit-mono@latest/latin-400-italic.woff2"
get commit-mono-700.woff2              "$FS/commit-mono@latest/latin-700-normal.woff2"
get besley.woff2                       "$FS/besley:vf@latest/latin-wght-normal.woff2"
get besley-italic.woff2                "$FS/besley:vf@latest/latin-wght-italic.woff2"
get hanken-grotesk.woff2               "$FS/hanken-grotesk:vf@latest/latin-wght-normal.woff2"
get hanken-grotesk-italic.woff2        "$FS/hanken-grotesk:vf@latest/latin-wght-italic.woff2"
get mona-sans.woff2                    "$FS/mona-sans:vf@latest/latin-wght-normal.woff2"
get mona-sans-italic.woff2             "$FS/mona-sans:vf@latest/latin-wght-italic.woff2"
get monaspace-neon-400.woff2           "$FS/monaspace-neon@latest/latin-400-normal.woff2"
get monaspace-neon-600.woff2           "$FS/monaspace-neon@latest/latin-600-normal.woff2"

# From each designer's own repository or site
get hikaru-mono.otf                    "$RAW/AntoineVRM/VRM-HIKARU/HEAD/HIKARUMONO-Regular.otf"
get hyperlegible-sans-400.otf          "$RAW/matthewlarn/hyperlegible-sans/HEAD/fonts/otf/HyperlegibleSans-Regular.otf"
get hyperlegible-sans-400-italic.otf   "$RAW/matthewlarn/hyperlegible-sans/HEAD/fonts/otf/HyperlegibleSans-Italic.otf"
get hyperlegible-sans-500.otf          "$RAW/matthewlarn/hyperlegible-sans/HEAD/fonts/otf/HyperlegibleSans-Medium.otf"
get hyperlegible-sans-700.otf          "$RAW/matthewlarn/hyperlegible-sans/HEAD/fonts/otf/HyperlegibleSans-Bold.otf"
get haskoy-400.otf                     "$RAW/ertekinno/haskoy/HEAD/fonts/otf/Haskoy-Regular.otf"
get haskoy-400-italic.otf              "$RAW/ertekinno/haskoy/HEAD/fonts/otf/Haskoy-Italic.otf"
get haskoy-500.otf                     "$RAW/ertekinno/haskoy/HEAD/fonts/otf/Haskoy-Medium.otf"
get haskoy-700.otf                     "$RAW/ertekinno/haskoy/HEAD/fonts/otf/Haskoy-Bold.otf"
get departure-mono.woff2               "$RAW/rektdeckard/departure-mono/HEAD/public/assets/DepartureMono-Regular.woff2"
get monor-400.otf                      "https://fonderiz.fr/site/assets/files/1017/monor.otf"
get monor-700.otf                      "https://fonderiz.fr/site/assets/files/1017/monor-bold.otf"

# Saint ships as a zip; keep only the font files from it.
if ! ls saint*.ttf >/dev/null 2>&1; then
  mkdir -p saint-zip
  if curl -fsSL -m 60 -o saint-zip/saint.zip "https://uncut.wtf/downloads/saint.ttf.zip"; then
    unzip -j -o -q saint-zip/saint.zip '*.ttf' -x '__MACOSX/*' -d saint-zip/out 2>/dev/null
    n=0
    for f in saint-zip/out/*.ttf; do
      [ -f "$f" ] || continue
      cp "$f" "saint-$(basename "$f" | tr 'A-Z ' 'a-z-')"; n=$((n + 1))
    done
    echo "ok   saint ($n files)"
  else
    echo "FAIL saint.zip"
  fi
  rm -rf saint-zip
fi

ls -la
