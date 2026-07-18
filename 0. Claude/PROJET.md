# Site Christoph Brandner — Guide projet pour Claude

> Document de référence pour toute nouvelle session de travail sur ce projet.
> Dernière mise à jour : 2026-07-18

**🌐 Site en ligne :** https://simeonbrandner-gif.github.io/Instruments-a-vent/

## Le projet

Site vitrine statique pour **Christoph Brandner** (le père de Simeon), facteur d'instruments à vent baroques à Genève : flûtes à bec (soprano, alto) et hautbois baroques.

- **Simeon** fait le design dans Figma → **Claude** écrit tout le code (HTML/CSS/JS vanilla, aucun framework, aucune dépendance).
- Site **français uniquement**.
- Déploiement : **hébergeur classique via FTP** — le dossier Staging est directement uploadable.
- Contact : liens **mailto/tel uniquement**, pas de formulaire, pas de backend.

## Figma

- Fichier : `c7zvOYoKuuDCGfB5bYqpo0` (Site_CHR)
- Frames desktop en **1440px**, préfixe « D - » (D - Home, D - Instruments…)
- Frames existantes : Home (0:38), sous-menu Instruments (8:212), Biographie (7:171), Contact (9:274), Atelier (22:201)
- **Frames instruments (une par instrument/bois)** : Soprano Reich 415 Buis (30:256) / Olivier (30:312) / Cormier (30:358), Alto Bressan 415 Buis (30:233) / Olivier (30:748) / Cormier (30:680), Hautbois Schlegel 415 (30:279). Les anciennes frames accordéon (1:34/1:56/1:78) sont obsolètes.
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
⚠️ **Règle : le sous-menu ne liste QUE les instruments dont la page existe.** À chaque création d'une nouvelle page instrument : (1) créer la page, (2) ajouter son entrée dans le `ul.sub-menu` de **toutes** les pages HTML + `_template-stub.html` (et régénérer les stubs), (3) mettre à jour ce document. Entrées actuelles : « Soprano 415Hz » → soprano-buis.html, « Alto 415Hz » → alto-buis.html, « Hautbois 415Hz » → hautbois.html. Le lien « Instruments » du menu et du footer pointe sur soprano-buis.html.

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
| soprano-{buis,olivier,cormier}.html | ✅ faites | maquettes 30:256/312/358 — une page par bois (voir gabarit commun ci-dessous) |
| alto-{buis,olivier,cormier}.html | ✅ faites | maquettes 30:233/748/680 |
| hautbois.html | ✅ faite | maquette 30:279 — un seul bois (buis), pas de section bois |
| instruments.html | 🔁 redirection | meta refresh + noindex → soprano-buis.html (l'ancienne page accordéon est remplacée par une page par bois) |
| atelier.html | ⏳ stub | attend la maquette Figma |
| biographie.html | ✅ faite | maquette 7:171 — portrait + nom, filet, photo atelier + texte |
| contact.html | ✅ faite | maquette 9:274 — carte Genève + coordonnées 38px (mailto/tel), photo hautbois pleine largeur. La carte : cliquable → Google Maps sur l'adresse (nouvel onglet, `rel="noopener"`), cadre façon « Fill » Figma (hauteur fixe 676px, `object-fit: cover` centré) qui s'étire à gauche jusqu'à la marge de 18px comme les filets |
| mentions-legales.html, protection-des-donnees.html, conditions-generales.html | ⏳ stubs | gabarit typographique simple, pas de maquette prévue |

## Reste à faire (phases)

1. Pages restantes au fil des maquettes Figma
2. Responsive d'après les frames mobiles de Simeon (le menu deviendra un toggle) — aussi un enjeu SEO : Google indexe en mobile-first
3. Finitions : favicon, Open Graph, SEO (voir checklist ci-dessous), Lighthouse, validation
   - ⚠️ **Footer : ajouter 36px de bottom margin**
4. Validation finale : snapshot dans `2. Versioning/V1` (GitHub Pages publie automatiquement chaque push sur `main`)

### Gabarit pages instrument (fait le 2026-07-18)

- **Une page par instrument et par bois** (7 pages). Grande photo à gauche en flux normal (c'est elle qui fait la hauteur de page), colonne texte absolue à droite (titre 62px à 207px du haut, intro à 478px, largeur 772/624). Le bois de la page : entête 32px orange + texte ; les autres bois : entêtes blanches = **liens vers les pages sœurs**. CSS : `instruments.css` (variantes `.instrument--soprano/alto/hautbois` pour les cotes photo).
- **Défilement différencié** (main.js) : la photo suit le scroll normal ; la colonne texte est passée en `position: fixed` par le JS (le CSS reste `absolute` = défilement normal sans JS) et déplacée par un `translate3d` appliqué directement dans l'événement scroll — sa course est calée pour finir 60px au-dessus du footer en bas de page (vitesse auto : ~40% sur les sopranos, ~14% sur le hautbois). ⚠️ Ne pas revenir à un panneau qui suit le flux + correction au rAF suivant : le compositeur le fait défiler à pleine vitesse avant la correction → saccades. Le handler remesure si la hauteur du document change (police/image tardive).
- **Défilement automatique** (main.js) : la page descend seule à 22px/s après 2,5s ; toute interaction (molette, touche, toucher, écart de position) rend la main à l'utilisateur, reprise après 4s d'inactivité ; arrêt en bas de page ; désactivé si `prefers-reduced-motion`.
- Les `<img>` portent `width`/`height` explicites (mesures du scroll fiables avant chargement + pas de layout shift).

### Checklist SEO (audit du 2026-07-13 — à faire vers la fin, la plupart après l'achat du domaine)

Les bases on-page sont déjà bonnes (titles/descriptions uniques, un seul h1 par page, alt partout, `lang="fr"`, HTML sémantique). Par ordre d'impact :

1. **Domaine + Google Business Profile** — le levier n°1. Acheter le domaine, le brancher sur GitHub Pages, puis créer une fiche Google Business (« Christoph Brandner, facteur d'instruments à vent, 15 rue des Gares, Genève ») : pour les recherches locales, la carte Google passe devant tous les résultats organiques.
2. **Backlinks monde de la musique ancienne** — annuaires de facteurs (FLAME…), pages de festivals/ensembles, conservatoires, forums (flute-a-bec.com). Pour un site de niche, quelques bons liens pèsent plus que tout le reste. (Action de Christoph/Simeon, pas de code.)
3. **Quick wins code (~1-2h, Claude)** : balises canonical sur chaque page (URLs du domaine final → attendre l'achat), robots.txt + sitemap.xml, JSON-LD `LocalBusiness` sur contact.html + `Person` sur biographie.html, squelette Open Graph + favicon (déjà en phase 3).
4. **Titles à retravailler** : mettre le mot-clé avant le nom (personne ne cherche encore « Christoph Brandner »). Ex. instruments.html : « Flûte à bec soprano en do (Reich, 415 Hz) — Christoph Brandner » (le title actuel ne contient même pas « flûte à bec ») ; atelier.html : « Atelier de facture de flûtes à bec et hautbois baroques à Genève — … ».
5. **Poids des images = problème Core Web Vitals** : les re-exports prévus (qualité ~80) + `loading="lazy"` + attributs `width`/`height` explicites (évite le layout shift).
6. **Une page par instrument** (déjà envisagé pour la structure) : c'est aussi le bon découpage SEO — un title/URL par instrument cible les recherches longue traîne des musiciens (« flûte à bec alto 415 Hz Bressan »…).
7. **⚠️ Contenu dupliqué au lancement** : quand le domaine sera en ligne, le Staging GitHub Pages deviendra un doublon — soit le passer en noindex, soit y pointer les canonical vers le domaine final.
8. (Optionnel, plus tard) versions DE/EN avec `hreflang` — clientèle internationale, mais décision à part, le site est volontairement FR pour l'instant.

## Journal des sessions

### 2026-07-18 — 7 pages instrument + scroll différencié + auto-scroll

- **7 pages instrument créées** (maquettes 30:…) : soprano-{buis,olivier,cormier}, alto-{buis,olivier,cormier}, hautbois — gabarit décrit dans « Gabarit pages instrument » ci-dessus. `instruments.html` devient une redirection vers soprano-buis.html ; l'accordéon des bois disparaît (remplacé par des liens entre pages), le code accordéon retiré de main.js.
- **Sous-menu Instruments** mis à jour dans toutes les pages + `_template-stub.html` : Soprano/Alto/Hautbois 415Hz ; liens « Instruments » (menu + footer) → soprano-buis.html.
- **Scroll différencié + auto-scroll** implémentés dans main.js (détails dans le gabarit) — vérifiés en préview : cotes pixel-perfect à 1440, texte finissant exactement 60px au-dessus du footer en bas de page.
- ~~⚠️ Poids images~~ **✅ résolu le 2026-07-18** : Simeon a re-exporté les 7 webp instruments aux largeurs 2× (sopranos 1000×3777, altos 1250×~5430, hautbois 1600×9705), qualité ~80 → **0,2–0,6 MB par image** (au lieu de 2,3–6,2 MB). Mêmes cadrages, attributs `width`/`height` mis à jour dans les 7 pages.

### 2026-07-13 — Audit SEO → checklist dans la roadmap

- Audit SEO du site (pages, meta, images, staging) : bases on-page déjà bonnes ; le reste est consigné dans la **« Checklist SEO »** ajoutée à la section « Reste à faire » — à dérouler vers la fin du projet, l'essentiel après l'achat du domaine. Aucun changement de code.

### 2026-07-13 — Héro Home homothétique + footer fluide

- **Héro Home** (home.css) : plus aucune cote px fixe. Une unité `--hero-px: min(calc(100vw / 1440), 1px)` vaut 1px à 1440 et rétrécit avec la fenêtre ; position du titre, largeur du bloc, tailles de police et interlignes sont exprimés en `calc(N * var(--hero-px))` → le bloc titre se réduit de façon **homothétique avec la photo** et reste dans la zone sombre à toutes les largeurs.
- **Placement du titre revu à la demande de Simeon** (⚠️ diverge de la maquette Figma 0:38) : l'espace noir menu→photo passe de 119 à **180** unités (`padding-top` sur `.hero`) et le titre est calé à **53** unités sous le menu (au lieu de 73 sous le haut de la photo) → le sous-titre « fabriqués par… » ne touche plus jamais la tête de la flûte.
- **Footer fluide** (layout.css) : colonnes en fractions proportionnelles à la maquette (`376fr 316fr 316fr 298fr`), `padding-left: min(78px, 5.5%)`, logo `min(260px, 90%)`, copyright sans `white-space: nowrap`. Sous **800px** : 2 colonnes (logo | adresse+contact, puis les deux navigations), copyright pleine largeur. Plus aucun débordement horizontal.
- **Menu opaque bord à bord** (layout.css) : le fond noir du `.site-header` va désormais jusqu'aux bords de la fenêtre (plus de `margin-inline`) pour que rien ne dépasse quand une image défile dessous ; le filet orange garde ses 18px de marge via un `::after` (hauteur totale inchangée : 55px).
- ⚠️ Reste connu : le **menu** déborde sous ~900px — sera traité avec les maquettes mobiles de Simeon (toggle).

### 2026-07-12 — Page Atelier + renommage des images

- **Renommage images** (par Simeon, tirets → underscores + nouveaux noms) : `soprano-do-*` → `soprano_415_reich_*`, `carte-geneve.png` → `carte_geneve.png`, `contact-hautbois` → `contact_hautbois`, `gravure-flutes` → `gravure_flutes` — toutes les références HTML/CSS mises à jour. Nouveaux webp livrés : `alto_415_bressan_{buis,cormier,olivier}.webp` (future page Alto) et `tetes_flutes_atelier.webp` (**6,2 MB, 4772px — à re-exporter plus léger**, comme la gravure).
- **Page Atelier** (maquette 22:201) : même grille que la Biographie (298px + 772px, gouttière 176px). Colonne de 7 photos d'atelier (placeholders `atelier_01..07.jpg` tirés de Figma, redimensionnés 800px — Simeon livrera les webp finaux), titre condensé 62px (mêmes réglages que les titres instruments), filet + 3 paragraphes, **rectangle gris 16/9 en placeholder vidéo**, photo pleine largeur `tetes_flutes_atelier.webp` collée au filet du footer. CSS : `atelier.css`.
- **Vidéo de l'atelier (à venir, Simeon la tourne)** : décision = **auto-hébergée en MP4 dans le repo** (balise `<video>`, pas de YouTube — trackers Google incompatibles avec la posture protection des données ; limite GitHub 100 MB par fichier → compresser avec ffmpeg à la livraison, viser < 50 MB).

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
