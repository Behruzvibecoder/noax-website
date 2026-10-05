#!/usr/bin/env bash
# Rebuilds the CORPUS site from the Noax mirror one level up.
#
# Only index.html is authored here — every asset (main.css, the WebGL bundles,
# .glb models, .ktx2 textures, Basis transcoder, fonts, images) is copied from
# the mirror so the two stay byte-identical and Git does not store 27 MB twice.
#
# Usage:  ./build.sh          (run from inside corpus-site/)
set -euo pipefail
cd "$(dirname "$0")"
SRC=".."

ASSETS=(
  main.css app.js 404.html about.html books.html shows.html watch-listen.html
  server.py .basepath .nojekyll
  chunk-022tjzda.js chunk-qbk4gmdw.js
  69b574b7e8a1b256fc6f5504 69b5b66f2b64db75535e2eca
  basis books js legal models textures
)

for item in "${ASSETS[@]}"; do
  [ -e "$SRC/$item" ] || { echo "missing in mirror: $item" >&2; exit 1; }
  cp -r "$SRC/$item" ./
done

echo "assets copied. index.html is authored in this folder and was left untouched."
echo "run:  PORT=3000 python3 server.py"
