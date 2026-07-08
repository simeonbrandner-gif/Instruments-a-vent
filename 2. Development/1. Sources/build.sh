#!/bin/zsh
# Assemble le site déployable dans « 3. Build : export/1. Staging »
# HTML → racine, CSS → /css, JS → /js, assets → /assets
# Copie pure, aucune réécriture : le HTML est écrit avec les chemins finaux.

set -e

SRC="$(cd "$(dirname "$0")" && pwd)"
OUT="$SRC/../3. Build : export/1. Staging"

rm -rf "$OUT"
mkdir -p "$OUT/css" "$OUT/js" "$OUT/assets"

# HTML (on exclut le gabarit de travail _template-stub.html)
for f in "$SRC/2. HTML"/*.html; do
  base="$(basename "$f")"
  [[ "$base" == _* ]] && continue
  cp "$f" "$OUT/$base"
done

cp -R "$SRC/3. CSS/"* "$OUT/css/"
cp -R "$SRC/4. JS/"*  "$OUT/js/"
cp -R "$SRC/1. assets/"* "$OUT/assets/"

echo "Build OK → $OUT"
find "$OUT" -type f | sed "s|$OUT/||" | sort
