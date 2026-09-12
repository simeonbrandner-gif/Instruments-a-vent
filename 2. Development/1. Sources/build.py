#!/usr/bin/env python3
# ==========================================================================
# Assemble les pages HTML du site à partir des partials et des sources de page.
# Appelé par build.sh — ne rien lancer d'autre à la main.
#
#   2. HTML/_partials/   head.html, header.html, footer.html  (le « chrome »,
#                        écrit UNE fois, commun aux 3 langues)
#   2. HTML/_i18n/       fr.conf, de.conf, en.conf  (les chaînes du chrome)
#   2. HTML/fr|de|en/    une source par page : front-matter + <main>
#
# Sortie : le français à la racine du site (les URLs indexées ne bougent pas),
# les autres langues dans un sous-dossier — /de/alto.html, /en/alto.html.
# Les noms de fichiers sont les mêmes dans les trois langues (décision du
# 2026-09-12) : le sélecteur de langue n'est donc qu'un changement de dossier.
# ==========================================================================

import re
import sys
import pathlib
import shutil

SRC = pathlib.Path(__file__).resolve().parent / "2. HTML"
PARTIALS = SRC / "_partials"
I18N = SRC / "_i18n"

BASE = "https://atelier-brandner.ch/"
SITE_NAME = "Atelier Brandner — Christoph Brandner"
OG_IMAGE = BASE + "assets/img/hero-home.webp"
# Date déclarée dans le sitemap — à remonter quand le contenu change réellement
# (surtout pas la date du jour : elle changerait à chaque build pour rien).
LASTMOD = "2026-09-12"
# Priorités du sitemap, par page (les pages légales en noindex en sont exclues)
PRIORITY = {"index": "1.0", "instruments": "0.9", "soprano": "0.8", "alto": "0.8",
            "hautbois": "0.8", "atelier": "0.7", "biographie": "0.7", "contact": "0.7"}

# Langue servie à la racine du site (pas de préfixe de dossier)
ROOT_LANG = "fr"
# Ordre d'affichage du sélecteur — voir PROJET.md : l'ordre du menu déroulant
# desktop (maquette 2053:63) et celui de la ligne mobile (2053:92) diffèrent,
# les deux maquettes sont reproduites telles quelles.
ORDER_DESKTOP = ["fr", "de", "en"]
ORDER_MOBILE = ["en", "de", "fr"]

# L'entrée de menu à marquer aria-current pour chaque page
NAV_KEYS = {
    "accueil": "CUR_ACCUEIL",
    "atelier": "CUR_ATELIER",
    "instruments": "CUR_INSTRUMENTS",
    "biographie": "CUR_BIOGRAPHIE",
    "contact": "CUR_CONTACT",
    "mentions-legales": "CUR_MENTIONS",
    "protection-des-donnees": "CUR_PROTECTION",
}


def read_conf(path):
    """Lit un fichier « clé = valeur » (# = commentaire)."""
    conf = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        key, _, value = line.partition("=")
        conf[key.strip()] = value.strip()
    return conf


def read_page(path):
    """Découpe une source de page en (meta, jsonld, main)."""
    meta, jsonld, main = {}, [], []
    section = None
    for line in path.read_text(encoding="utf-8").splitlines():
        if line in ("#meta", "#jsonld", "#main"):
            section = line[1:]
            continue
        if section == "meta":
            if line.strip():
                key, _, value = line.partition(":")
                meta[key.strip()] = value.strip()
        elif section == "jsonld":
            jsonld.append(line)
        elif section == "main":
            main.append(line)
    if not main:
        sys.exit(f"{path} : section #main absente ou vide")
    return meta, "\n".join(jsonld).rstrip("\n"), "\n".join(main).rstrip("\n")


def put_block(tpl, key, value):
    """Remplace une ligne « {{CLE}} » seule ; la ligne disparaît si la valeur est vide."""
    token = "{{" + key + "}}\n"
    return tpl.replace(token, (value + "\n") if value else "")


def page_path(lang, name):
    """Chemin de la page dans le site fini, relatif à la racine."""
    prefix = "" if lang == ROOT_LANG else f"{lang}/"
    return prefix + ("" if name == "index" else f"{name}.html")


def seo_block(lang, conf, name, meta, langs):
    """Bloc canonical / robots / Open Graph / hreflang du <head>."""
    url = BASE + page_path(lang, name)
    if meta.get("robots") == "noindex":
        # Pages légales : pas d'Open Graph, pas de hreflang (Google les ignore
        # sur une page noindex). Ordre historique conservé : canonical puis robots.
        return (f'  <link rel="canonical" href="{url}">\n'
                f'  <meta name="robots" content="noindex, follow">')

    lines = [
        '  <meta name="robots" content="max-image-preview:large">',
        f'  <link rel="canonical" href="{url}">',
    ]
    # hreflang : chaque page déclare ses sœurs + x-default sur le français
    if len(langs) > 1:
        for other in ORDER_DESKTOP:
            if other in langs:
                lines.append(f'  <link rel="alternate" hreflang="{other}" '
                             f'href="{BASE + page_path(other, name)}">')
        lines.append(f'  <link rel="alternate" hreflang="x-default" '
                     f'href="{BASE + page_path(ROOT_LANG, name)}">')
    lines += [
        f'  <meta property="og:type" content="{meta.get("og-type", "website")}">',
        f'  <meta property="og:site_name" content="{SITE_NAME}">',
        f'  <meta property="og:locale" content="{conf["locale"]}">',
        f'  <meta property="og:title" content="{meta["title"]}">',
        f'  <meta property="og:description" content="{meta["description"]}">',
        f'  <meta property="og:url" content="{url}">',
        f'  <meta property="og:image" content="{BASE + meta["og-image"] if meta.get("og-image") else OG_IMAGE}">',
        '  <meta name="twitter:card" content="summary_large_image">',
    ]
    return "\n".join(lines)


def lang_switch(lang, name, langs, confs):
    """Sélecteur de langue — un seul balisage pour les deux mises en page
       (menu déroulant en desktop, ligne de 3 langues en mobile).
       Maquettes Figma 2053:63 (desktop) et 2053:92 (mobile)."""
    if len(langs) < 2:
        return ""
    conf = confs[lang]
    out = [f'        <div class="lang-switch">',
           f'          <button type="button" class="lang-current" aria-expanded="false"'
           f' aria-controls="lang-list" aria-label="{conf["T_LANG_CHOOSE"]}">'
           f'{conf["lang-label"]}</button>',
           f'          <ul class="lang-list" id="lang-list" aria-label="{conf["T_LANG_ARIA"]}">']
    # Desktop : les autres langues seulement (la courante est déjà dans la barre).
    # Mobile : les trois, dans l'ordre de la maquette — d'où les deux attributs
    # data-order, exploités par l'ordre flex en CSS (aucune duplication de lien).
    for other in ORDER_MOBILE:
        if other not in langs:
            continue
        oc = confs[other]
        current = ' aria-current="true"' if other == lang else ""
        klass = ' class="is-current"' if other == lang else ""
        href = relative_href(lang, other, name)
        out.append(f'            <li data-lang="{other}"{klass}'
                   f' style="--order-d:{ORDER_DESKTOP.index(other)};'
                   f'--order-m:{ORDER_MOBILE.index(other)}">'
                   f'<a href="{href}" lang="{other}" hreflang="{other}"{current}>'
                   f'{oc["lang-label"]}</a></li>')
    out += ['          </ul>', '        </div>']
    return "\n".join(out)


LANG_DETECT = """  <script>
  /* Détection de la langue du navigateur — accueil français seulement.
     Ne se déclenche qu'à la PREMIÈRE visite : dès qu'un visiteur a vu une page
     (ou cliqué une langue dans le menu), son choix est mémorisé et cette
     redirection ne le contrarie plus jamais. Les liens profonds partagés ne
     sont jamais redirigés : seul « / » l'est. Inline dans le <head> pour agir
     avant le premier affichage. */
  (function () {
    try {
      var saved = localStorage.getItem("lang");
      if (saved) {
        if (saved !== "fr") location.replace(saved + "/");
        return;
      }
      /* venu d'une autre page du site : c'est une navigation, pas une arrivée */
      if (document.referrer && document.referrer.indexOf(location.origin) === 0) return;
      var list = navigator.languages || [navigator.language || ""];
      for (var i = 0; i < list.length; i++) {
        var code = String(list[i]).slice(0, 2).toLowerCase();
        if (code === "fr") return;
        if (code === "de" || code === "en") { location.replace(code + "/"); return; }
      }
    } catch (e) {}
  })();
  </script>"""


def relative_href(from_lang, to_lang, name):
    """Lien d'une page vers son équivalent dans une autre langue."""
    file = "index.html" if name == "index" else f"{name}.html"
    if from_lang == to_lang:
        return file  # la langue courante : pas de détour par « ../de/ »
    up = "" if from_lang == ROOT_LANG else "../"
    down = "" if to_lang == ROOT_LANG else f"{to_lang}/"
    return f"{up}{down}{file}"


def build(out_dir):
    out_dir = pathlib.Path(out_dir)
    head_tpl = (PARTIALS / "head.html").read_text(encoding="utf-8")
    header_tpl = (PARTIALS / "header.html").read_text(encoding="utf-8")
    footer_tpl = (PARTIALS / "footer.html").read_text(encoding="utf-8")

    langs = [l for l in ORDER_DESKTOP if (SRC / l).is_dir()]
    if ROOT_LANG not in langs:
        sys.exit(f"Le dossier de la langue racine « {ROOT_LANG} » est introuvable")
    confs = {l: read_conf(I18N / f"{l}.conf") for l in langs}

    names = sorted(p.stem for p in (SRC / ROOT_LANG).glob("*.html"))
    count = 0

    for lang in langs:
        conf = confs[lang]
        root = "" if lang == ROOT_LANG else "../"
        target = out_dir if lang == ROOT_LANG else out_dir / lang
        target.mkdir(parents=True, exist_ok=True)

        missing = [n for n in names if not (SRC / lang / f"{n}.html").exists()]
        if missing:
            print(f"  ⚠️  {lang} : page(s) manquante(s) → {', '.join(missing)}")

        for name in names:
            page = SRC / lang / f"{name}.html"
            if not page.exists():
                continue
            meta, jsonld, main = read_page(page)

            css = (f'  <link rel="stylesheet" href="{{{{ROOT}}}}css/{meta["css"]}">'
                   if meta.get("css") else "")
            body_class = (f' class="{meta["body-class"]}"'
                          if meta.get("body-class") else "")

            html = head_tpl
            detect = (LANG_DETECT
                      if lang == ROOT_LANG and name == "index" and len(langs) > 1 else "")
            html = put_block(html, "LANG_DETECT", detect)
            html = put_block(html, "SEO", seo_block(lang, conf, name, meta, langs))
            html = put_block(html, "CSS", css)
            html = put_block(html, "JSONLD", jsonld)
            html += header_tpl
            html = put_block(html, "LANG_SWITCH", lang_switch(lang, name, langs, confs))
            html += "\n" + main + "\n"
            html += footer_tpl
            html += "\n</body>\n</html>\n"

            # Jetons restants : d'abord les libellés traduits, puis le reste
            html = html.replace("{{TITLE}}", meta["title"])
            html = html.replace("{{DESCRIPTION}}", meta["description"])
            html = html.replace("{{BODY_CLASS}}", body_class)
            html = html.replace("{{LANG}}", conf["lang"])
            html = html.replace("{{ROOT}}", root)
            for key, value in conf.items():
                if key.startswith("T_"):
                    html = html.replace("{{" + key + "}}", value)
            for key in NAV_KEYS.values():
                marker = ' aria-current="page"' if key == NAV_KEYS.get(meta.get("nav")) else ""
                html = html.replace("{{" + key + "}}", marker)

            left = re.findall(r"\{\{[A-Z_]+\}\}", html)
            if left:
                sys.exit(f"{lang}/{name} : jeton(s) non remplacé(s) → {sorted(set(left))}")

            (target / f"{name}.html").write_text(html, encoding="utf-8")
            count += 1

    write_sitemap(out_dir, langs, names)
    print(f"  {count} pages assemblées ({', '.join(langs)})")


def write_sitemap(out_dir, langs, names):
    """sitemap.xml — les pages indexables des trois langues.
       Les alternances de langue sont déclarées par les <link rel="alternate">
       du <head> de chaque page : Google n'a pas besoin qu'on les répète ici."""
    urls = []
    for lang in langs:
        # ordre du sitemap : par importance (accueil d'abord), pas alphabétique
        for name in PRIORITY:
            if name not in names:
                continue
            urls.append(f"  <url>\n"
                        f"    <loc>{BASE + page_path(lang, name)}</loc>\n"
                        f"    <lastmod>{LASTMOD}</lastmod>\n"
                        f"    <priority>{PRIORITY[name]}</priority>\n"
                        f"  </url>")
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(urls) + "\n"
           "  <!-- Fichier ENGENDRÉ par build.py — ne pas éditer à la main.\n"
           "       mentions-legales.html et protection-des-donnees.html sont\n"
           "       volontairement absentes (elles sont en noindex) : les lister\n"
           "       n'ajouterait qu'un avertissement dans la Search Console. -->\n"
           "</urlset>\n")
    (pathlib.Path(out_dir) / "sitemap.xml").write_text(xml, encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: build.py <dossier de sortie>")
    build(sys.argv[1])
