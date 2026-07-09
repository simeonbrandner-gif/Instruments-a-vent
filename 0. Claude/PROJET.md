# Site Christoph Brandner — Guide projet pour Claude

> Document de référence pour toute nouvelle session de travail sur ce projet.
> Dernière mise à jour : 2026-07-08

## Le projet

Site vitrine statique pour **Christoph Brandner** (le père de Simeon), facteur d'instruments à vent baroques à Genève : flûtes à bec (soprano, alto) et hautbois baroques.

- **Simeon** fait le design dans Figma → **Claude** écrit tout le code (HTML/CSS/JS vanilla, aucun framework, aucune dépendance).
- Site **français uniquement**.
- Déploiement : **hébergeur classique via FTP** — le dossier Staging est directement uploadable.
- Contact : liens **mailto/tel uniquement**, pas de formulaire, pas de backend.

## Figma

- Fichier : `c7zvOYoKuuDCGfB5bYqpo0` (Site_CHR)
- Frames desktop en **1440px**, préfixe « D - » (D - Home, D - Instruments…)
- Frames existantes : Home (0:38), Instruments Soprano Buis (1:34) / Olivier (1:56) / Cormier (1:78), sous-menu Instruments (8:212), Biographie (7:171), Contact (9:274)
- **Mobile : Simeon designera ses propres frames mobiles** — ne pas inventer de responsive, attendre ses maquettes.
- Pour chaque nouvelle page : Simeon donne le lien avec le node sélectionné → récupérer via le MCP Figma (get_design_context + get_screenshot).

## Design tokens (tout est dans css/tokens.css)

- Fond `#000000`, texte `#fafafa`, accent orange `#fe990a`
- Police : **Bricolage Grotesque variable** (graisse 200–800, largeur 75–100%), auto-hébergée en woff2 (pas de CDN Google — protection des données suisse)
- Rail central : 1403px max, gouttières 19px
- **Tous les filets 1px sont orange**. Les filets « pleine page » (menu, footer, séparateurs de section) font toujours **100% de largeur avec 18px de marge de chaque côté** (`--rule-margin`), à toutes les tailles d'écran. Les filets internes aux colonnes de contenu (ex. accordéon) restent à la largeur de leur bloc.
- Menu : lien actif **blanc** (`aria-current="page"` posé dans le HTML de chaque page), les autres **orange**. Le menu est **collant (sticky) sur toutes les pages**. Hauteur réelle : `--header-h: 55px`.
- Titres condensés (ex. titre instrument) : `font-stretch: 88%` / accordéon `76%` — la police auto-hébergée inclut l'axe wdth.

## Git / GitHub

- Dépôt : **https://github.com/simeonbrandner-gif/Instruments-a-vent** (public), branche `main`.
- Le dossier `1. Crea/` (83 Go) est exclu via `.gitignore` — seuls le code, le build et les docs sont versionnés.
- GitHub CLI installé dans `~/.local/bin/gh` (pas dans le PATH), connecté au compte **simeonbrandner-gif** (HTTPS, credentials gérés par gh).
- Après un changement notable : `git add -A && git commit -m "…" && git push`.
- **GitHub Pages** : chaque push sur `main` publie automatiquement le dossier Staging (workflow `.github/workflows/deploy-pages.yml`) sur **https://simeonbrandner-gif.github.io/Instruments-a-vent/**. Quand Simeon aura acheté le nom de domaine, le brancher ici (Settings → Pages → Custom domain + DNS) — GitHub Pages peut remplacer l'hébergeur FTP prévu initialement.

## Structure des dossiers

```
Site_Chr/
├── 0. Claude/            ← ce document
├── 1. Crea/              ← sources créa (textes .doc, PSD, shooting, AI)
│   └── Textes/textes_pour_le_site_03.doc  ← textes du site
└── 2. Development/
    ├── 1. Sources/       ← on développe ICI
    │   ├── 1. assets/    → img/ (webp finaux + placeholders .jpg), fonts/
    │   ├── 2. HTML/      → pages (+ _template-stub.html pour les pages à venir,
    │   │                    exclu du build ; symlinks css/js/assets pour ouvrir
    │   │                    les fichiers directement pendant le dev)
    │   ├── 3. CSS/       → tokens.css, base.css, layout.css (menu+sous-menu+footer),
    │   │                    home.css, instruments.css, biographie.css,
    │   │                    contact.css (1 fichier par page)
    │   ├── 4. JS/        → main.js (accordéon instruments ; garder minimal)
    │   └── build.sh      → assemble le site déployable dans Staging
    ├── 2. Versioning/V1/ ← snapshots aux jalons
    └── 3. Build : export/
        ├── 1. Staging/   ← résultat du build (préviews, tests)
        ├── 2. Final/     ← copie validée prête pour le FTP
        └── 3. Archive/
```

**Workflow :** modifier les Sources → lancer `build.sh` (copie pure, aucune réécriture : le HTML est écrit avec les chemins finaux `css/…`, `js/…`, `assets/…`) → prévisualiser Staging.

**Préview :** `.claude/launch.json` définit « site-staging » (python3 http.server, port 8642, servant Staging). Toujours vérifier à 1440px contre la maquette Figma.

**Header/footer :** dupliqués dans chaque page HTML (pas d'include JS). Toute modification du menu ou du footer doit être reportée dans **toutes** les pages + le _template-stub.html.

**Sous-menu Instruments (maquette Figma 8:212) :** l'entrée « Instruments » du menu porte un menu déroulant (`li.has-sub` > `ul.sub-menu`, styles dans layout.css) — panneau noir 245px sous le menu, libellés 20px ExtraBold orange avec 18px au-dessus/en-dessous, filet orange 1px entre chaque entrée. Ouverture au survol et au clavier (focus-within).
⚠️ **Règle : le sous-menu ne liste QUE les instruments dont la page existe.** À chaque création d'une nouvelle page instrument : (1) créer la page, (2) ajouter son entrée dans le `ul.sub-menu` de **toutes** les pages HTML + `_template-stub.html` (et régénérer les stubs), (3) mettre à jour ce document. Entrées actuelles : « Soprano 415Hz » → instruments.html.

## Images — règles

- Simeon exporte les **WebP finaux** : **2× la taille d'affichage** de la maquette, qualité 80–85, à déposer dans `1. assets/img/`.
- En attendant, Claude pose des **placeholders** tirés des assets Figma ; quand le webp final arrive, remplacer l'extension dans le HTML et supprimer le placeholder. ⚠️ Pour les images à fond transparent (carte, hautbois détouré…), placeholder en **PNG** — pas de JPEG, qui remplace l'alpha par du blanc (le Mac n'a pas d'encodeur webp en ligne de commande).
- Cibles de poids : héro ≤ 400 KB, grandes images ≤ 500–600 KB.
- Noms en kebab-case français : `hero-home.webp`, `gravure-flutes.webp`, `soprano-do-buis.webp`…
- Logo footer : `logo-footer.svg` (déjà en place, vectoriel).
- Manquants au 2026-07-06 : re-export `gravure-flutes.webp` (8,6 MB → trop lourd), `bio-portrait.webp` (596×590), `bio-atelier.webp` (596×580), `carte-geneve` (1544×1352, **avec transparence** — webp sans perte ou PNG, c'est du trait), favicon 512×512. Les 3 soprano webp sont livrées (1580×5967) mais lourdes (3,4–3,6 MB chacune) — un re-export qualité ~80 les ramènerait vers ~1–1,5 MB. `contact-hautbois.webp` livrée ✅ (347 KB, alpha) — renommée depuis `hautbois_page_Contact.webp` (garder les noms kebab-case).

## Pages

| Page | État | Notes |
|---|---|---|
| index.html (Accueil) | ✅ faite | héro + section « Pourquoi fabriquer… » |
| instruments.html | ✅ faite (Soprano en do) | accordéon 3 bois (Buis/Olivier/Cormier), photo qui change avec fondu, panneau texte + menu sticky, photo défile. D'autres instruments viendront peut-être → la structure pourrait devenir une page par instrument. |
| atelier.html | ⏳ stub | attend la maquette Figma |
| biographie.html | ✅ faite | maquette 7:171 — portrait + nom, filet, photo atelier + texte |
| contact.html | ✅ faite | maquette 9:274 — carte Genève + coordonnées 38px (mailto/tel), photo hautbois pleine largeur. La carte : cliquable → Google Maps sur l'adresse (nouvel onglet, `rel="noopener"`), cadre façon « Fill » Figma (hauteur fixe 676px, `object-fit: cover` centré) qui s'étire à gauche jusqu'à la marge de 18px comme les filets |
| mentions-legales.html, protection-des-donnees.html, conditions-generales.html | ⏳ stubs | gabarit typographique simple, pas de maquette prévue |

## Reste à faire (phases)

1. Pages restantes au fil des maquettes Figma
2. Responsive d'après les frames mobiles de Simeon (le menu deviendra un toggle)
3. Finitions : favicon, Open Graph, SEO/meta par page, Lighthouse, validation
4. Livraison : copie Staging → `2. Final`, snapshot dans `2. Versioning/V1`, upload FTP par Simeon

## Journal des sessions

### 2026-07-09 — GitHub Pages : le site est en ligne

- Workflow Actions `deploy-pages.yml` : chaque push sur `main` publie le Staging sur **https://simeonbrandner-gif.github.io/Instruments-a-vent/** (vérifié : toutes les pages et assets répondent 200).
- Le domaine définitif sera branché plus tard (achat à venir).

### 2026-07-08 — Mise en place GitHub

- Installation de GitHub CLI (`~/.local/bin/gh`), connexion au compte **simeonbrandner-gif** via device flow.
- `git init` à la racine du projet, `.gitignore` (exclut `1. Crea/` 83 Go, `.DS_Store`, réglages locaux), premier commit (65 fichiers) poussé sur **Instruments-a-vent** (`main`).

### 2026-07-05 / 06 — Fondations, Home, Instruments, Biographie, Contact

- **Fondations** : structure Sources, tokens/base/layout CSS, Bricolage Grotesque auto-hébergée (re-téléchargée ensuite **avec l'axe wdth 75–100** pour les titres condensés), `build.sh`, launch.json (préview port 8642), symlinks css/js/assets dans `2. HTML`, gabarit `_template-stub.html` + stubs de toutes les pages.
- **Home** : héro + titre superposé à droite, section « Pourquoi fabriquer… » 2 colonnes. Webp livrés par Simeon intégrés (héro 2880×1621 ; gravure à re-exporter, 8,6 MB).
- **Filets responsive** : tous les filets pleine page passent à 100% de largeur avec `--rule-margin: 18px` de chaque côté (le contenu reste sur le rail 1403px).
- **Menu** : hauteur corrigée (55px — les li héritaient du line-height 32px du body), **sticky sur toutes les pages**, lien actif blanc.
- **Instruments (Soprano en do)** : grille à chevauchement (photo 0→790, panneau 650→1440), panneau titre+texte **sticky** pendant que la photo défile, **accordéon des bois** (un seul ouvert, entête orange quand ouvert, animation grid-template-rows) avec **photo qui change en fondu** (préchargement des 3). Webp livrés (1580×5967) et intégrés. Titre condensé font-stretch 88%, accordéon 76%.
- **Sous-menu Instruments** (maquette 8:212) : déroulant au survol/focus sous « Instruments », 245px, entrées 20px orange, 18px haut/bas, filets orange. Règle : n'y lister que les pages existantes (voir plus haut).
- **Biographie** (7:171) : portrait + nom 38px, filet pleine largeur, photo atelier + texte 614px. Placeholders en attente des webp.
- **Contact** (9:274) : carte Genève + bloc Atelier/coordonnées en 38px (mailto/tel), filet pleine largeur, photo hautbois de 9,24% jusqu'au bord droit (webp livrée, renommée `contact-hautbois.webp`). Carte **cliquable → Google Maps** (nouvel onglet) et cadre façon « Fill » Figma étiré à gauche jusqu'à la marge de 18px.
- **Docs** : création de `0. Claude/PROJET.md` (ce fichier) + `CLAUDE.md` racine qui pointe dessus (le CLAUDE.md doit rester à la racine pour être chargé automatiquement).
- Leçon retenue : placeholders d'images à fond transparent en PNG, jamais en JPEG (alpha → blanc).
