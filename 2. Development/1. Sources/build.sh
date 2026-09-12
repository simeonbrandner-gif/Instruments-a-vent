#!/bin/zsh
# Assemble le site déployable dans « 3. Build : export/1. Staging »
# HTML → racine (fr) + /de + /en, CSS → /css, JS → /js, assets → /assets
#
# Les pages sont ASSEMBLÉES par build.py à partir de :
#   2. HTML/_partials/  le chrome commun (head, header/menu, footer)
#   2. HTML/_i18n/      les libellés du chrome, une langue par fichier
#   2. HTML/fr|de|en/   une source par page (front-matter + <main>)
# sitemap.xml est engendré au passage. Les chemins css/js/assets sont écrits
# tels quels pour le français (racine) et préfixés « ../ » pour /de et /en.

set -e

SRC="$(cd "$(dirname "$0")" && pwd)"
OUT="$SRC/../3. Build : export/1. Staging"

rm -rf "$OUT"
mkdir -p "$OUT/css" "$OUT/js" "$OUT/assets"

python3 "$SRC/build.py" "$OUT"

cp "$SRC/2. HTML/robots.txt" "$OUT/robots.txt"
# favicon.ico à la racine : c'est le chemin que le crawler de favicons de Google demande
cp "$SRC/2. HTML/favicon.ico" "$OUT/favicon.ico"

cp -R "$SRC/3. CSS/"* "$OUT/css/"
cp -R "$SRC/4. JS/"*  "$OUT/js/"
cp -R "$SRC/1. assets/"* "$OUT/assets/"

echo "Build OK → $OUT"
