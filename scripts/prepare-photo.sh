#!/bin/sh
# Prepare a photo for the home page's gallery.
#
#   sh scripts/prepare-photo.sh <input image> <name>
#
# Writes src/photos/<name>.jpg (at most 1600px on its long side) and
# src/photos/<name>-thumb.jpg (a 480px square crop from the centre). Both are
# rotated upright, converted to sRGB and stripped of all metadata, so no EXIF,
# GPS position, camera details or timestamps are published. Needs ImageMagick.
# Then add an entry to content/photos.json and run `npm run build`.
set -eu
[ $# -eq 2 ] || { echo "usage: sh scripts/prepare-photo.sh <input image> <name>" >&2; exit 1; }
IN="$1"; NAME="$2"
OUT="$(cd "$(dirname "$0")/.." && pwd)/src/photos"
SRGB="/System/Library/ColorSync/Profiles/sRGB Profile.icc"
mkdir -p "$OUT"

# -profile converts from the photo's own colour space (iPhones use Display P3) to
# sRGB; -strip then removes every profile and metadata block, which is safe
# because the pixels are now sRGB, the web's default.
if [ -f "$SRGB" ]; then
  set -- -profile "$SRGB"
else
  set -- -colorspace sRGB
fi

magick "$IN" -auto-orient "$@" -resize '1600x1600>' -strip -interlace Plane -sampling-factor 4:2:0 -quality 82 "$OUT/$NAME.jpg"
magick "$IN" -auto-orient "$@" -resize '480x480^' -gravity center -extent 480x480 -strip -interlace Plane -sampling-factor 4:2:0 -quality 80 "$OUT/$NAME-thumb.jpg"

left=$(magick identify -format '%[EXIF:*]%[IPTC:*]' "$OUT/$NAME.jpg" "$OUT/$NAME-thumb.jpg" 2>/dev/null | wc -c | tr -d ' ')
size=$(magick identify -format '%wx%h' "$OUT/$NAME.jpg")
echo "$NAME: $size, $(($(wc -c < "$OUT/$NAME.jpg") / 1024)) KB + $(($(wc -c < "$OUT/$NAME-thumb.jpg") / 1024)) KB thumb, metadata bytes left: $left"
