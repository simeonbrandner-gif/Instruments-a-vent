# Site Christoph Brandner — Guide projet pour Claude

> Document de référence pour toute nouvelle session de travail sur ce projet.
> Dernière mise à jour : 2026-07-19

**🌐 Site en ligne :** https://atelier-brandner.ch (GitHub Pages, publication automatique à chaque push — miroir : https://simeonbrandner-gif.github.io/Instruments-a-vent/)

## Le projet

Site vitrine statique pour **Christoph Brandner** (le père de Simeon), facteur d'instruments à vent baroques à Genève : flûtes à bec (soprano, alto) et hautbois baroques.

- **Simeon** fait le design dans Figma → **Claude** écrit tout le code (HTML/CSS/JS vanilla, aucun framework, aucune dépendance).
- Site **français uniquement**.
- Déploiement : **GitHub Pages + domaine atelier-brandner.ch** (chaque push sur `main` publie le Staging). L'option FTP classique est abandonnée.
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
- **GitHub Pages** : chaque push sur `main` publie automatiquement le dossier Staging (workflow `.github/workflows/deploy-pages.yml`) sur **https://simeonbrandner-gif.github.io/Instruments-a-vent/**. 
- **Domaine personnalisé** : **atelier-brandner.ch** ✅ **LIVE** (2026-07-19) — enregistrements DNS A configurés chez Infomaniak, CNAME pour www ajouté, domaine personnalisé activé dans GitHub Pages Settings. Site accessible sur https://atelier-brandner.ch/

## Structure des dossiers

```
Site_Chr/
├── 0. Claude/            ← ce document
├── 1. Crea/              ← sources créa (textes .doc, PSD, shooting, AI)
│   └── Textes/textes_pour_le_site_03.doc  ← textes du site
└── 2. Development/
    ├── 1. Sources/       ← on développe ICI
    │   ├── 1. assets/    → img/ (webp finaux — plus aucun placeholder), fonts/
    │   ├── 2. HTML/      → pages (+ _template-stub.html pour les pages à venir,
    │   │                    exclu du build ; symlinks css/js/assets pour ouvrir
    │   │                    les fichiers directement pendant le dev)
    │   ├── 3. CSS/       → tokens.css, base.css, layout.css (menu+sous-menu+footer),
    │   │                    home.css, instruments.css (pages instrument),
    │   │                    instruments-index.css (vue d'ensemble), atelier.css,
    │   │                    biographie.css, contact.css, legal.css
    │   ├── 4. JS/        → main.js (scroll différencié + auto-scroll des pages
    │   │                    instrument, zoom de la vue d'ensemble ; garder minimal)
    │   └── build.sh      → assemble le site déployable dans Staging
    ├── 2. Versioning/V1/ ← snapshots aux jalons
    └── 3. Build : export/
        ├── 1. Staging/   ← résultat du build (préviews, tests)
        ├── 2. Final/     ← copie validée aux jalons
        └── 3. Archive/
```

**Workflow :** modifier les Sources → lancer `build.sh` (copie pure, aucune réécriture : le HTML est écrit avec les chemins finaux `css/…`, `js/…`, `assets/…`) → prévisualiser Staging.

**Préview :** `.claude/launch.json` définit « site-staging » (python3 http.server, port 8642, servant Staging). Toujours vérifier à 1440px contre la maquette Figma.

**Header/footer :** dupliqués dans chaque page HTML (pas d'include JS). Toute modification du menu ou du footer doit être reportée dans **toutes** les pages + le _template-stub.html.

**Sous-menu Instruments (maquette Figma 8:212) :** l'entrée « Instruments » du menu porte un menu déroulant (`li.has-sub` > `ul.sub-menu`, styles dans layout.css) — panneau noir 245px sous le menu, libellés 20px ExtraBold orange avec 18px au-dessus/en-dessous, filet orange 1px entre chaque entrée. Ouverture au survol et au clavier (focus-within).
⚠️ **Règle : le sous-menu ne liste QUE les instruments dont la page existe.** À chaque création d'une nouvelle page instrument : (1) créer la page, (2) ajouter son entrée dans le `ul.sub-menu` de **toutes** les pages HTML + `_template-stub.html` (et régénérer les stubs), (3) mettre à jour ce document. Entrées actuelles : « Soprano 415Hz » → soprano-buis.html, « Alto 415Hz » → alto-buis.html, « Hautbois 415Hz » → hautbois.html. Le lien « Instruments » du menu et du footer pointe sur instruments.html (vue d'ensemble).

## Images — règles

- Simeon exporte les **WebP finaux** : **2× la taille d'affichage** de la maquette, qualité 80–85, à déposer dans `1. assets/img/`.
- En attendant, Claude pose des **placeholders** tirés des assets Figma ; quand le webp final arrive, remplacer l'extension dans le HTML et supprimer le placeholder. ⚠️ Pour les images à fond transparent (carte, hautbois détouré…), placeholder en **PNG** — pas de JPEG, qui remplace l'alpha par du blanc (le Mac n'a pas d'encodeur webp en ligne de commande).
- Cibles de poids : héro ≤ 400 KB, grandes images ≤ 500–600 KB.
- Noms : suivre les exports de Simeon — **underscores** pour les photos (`soprano_415_reich_buis.webp`, `carte_geneve.webp`…) ; quelques anciens fichiers restent en kebab-case (`hero-home.webp`, `bio-portrait.webp`, `logo-footer.svg`, favicons).
- Logo footer : `logo-footer.svg` (déjà en place, vectoriel).
- **✅ Toutes les images du site sont livrées et aux poids cibles (2026-07-19)** : 7 instruments (2×, 0,2–0,6 MB), atelier ×7 (600×260), bio ×2 (600×600, cadrage carré par Simeon), héro (2880×1621, 231 KB), gravure (950×1541, 495 KB), carte Genève webp (alpha, 554 KB), têtes de flûtes (2880×1509, 202 KB), hautbois contact (alpha, 347 KB), nouveau `logo-footer.svg`, favicon (`favicon-512.png` de Simeon → `favicon-32.png` + `apple-touch-icon.png` dérivés via sips, liés dans toutes les pages).
- ⚠️ Le héro Home garde son ratio via le CSS (`aspect-ratio` + `object-fit: cover`) : **ne pas lui mettre d'attribut height**, il écraserait le ratio.
- Manquant : **vidéo atelier** (MP4 auto-hébergé, < 50 MB) — dernier asset du site.

## Pages

| Page | État | Notes |
|---|---|---|
| index.html (Accueil) | ✅ faite | héro + section « Pourquoi fabriquer… » |
| soprano-{buis,olivier,cormier}.html | ✅ faites | maquettes 30:256/312/358 — une page par bois (voir gabarit commun ci-dessous) |
| alto-{buis,olivier,cormier}.html | ✅ faites | maquettes 30:233/748/680 |
| hautbois.html | ✅ faite | maquette 30:279 — un seul bois (buis), pas de section bois |
| instruments.html | ✅ faite | maquette 31:816 — vue d'ensemble des 7 instruments couchés à l'horizontale, zoom lent au défilement (voir gabarit ci-dessous) |
| atelier.html | ✅ faite | maquette 22:201 — colonne de 7 photos, titre condensé, 3 paragraphes, **placeholder vidéo** (rectangle gris 16/9) en attente du MP4, photo têtes de flûtes pleine largeur |
| biographie.html | ✅ faite | maquette 7:171 — portrait + nom, filet, photo atelier + texte |
| contact.html | ✅ faite | maquette 9:274 — carte Genève + coordonnées 38px (mailto/tel), photo hautbois pleine largeur. La carte : cliquable → Google Maps sur l'adresse (nouvel onglet, `rel="noopener"`), cadre façon « Fill » Figma (hauteur fixe 676px, `object-fit: cover` centré) qui s'étire à gauche jusqu'à la marge de 18px comme les filets |
| mentions-legales.html, protection-des-donnees.html | ✅ faites | pages légales (legal.css). Les Conditions générales ont été supprimées le 2026-07-19 (inutiles sans vente en ligne) — leur clause « caractéristiques et photos indicatives » est fusionnée dans les Mentions légales (section « Instruments et informations »). Notes de vérification retirées. TVA : non assujetti (< 100 000 CHF/an, confirmé par Simeon) — indiqué dans la section Statut ; pas de crédit de conception (choix de Simeon).

## Reste à faire (phases)

Toutes les pages sont faites, toutes les images sont livrées, le domaine est en ligne. Reste :

1. **Vidéo atelier** (Simeon la tourne) → remplacer le placeholder gris d'atelier.html par un `<video>` MP4 auto-hébergé (< 50 MB, compresser via ffmpeg)
2. **Responsive** d'après les frames mobiles de Simeon (le menu deviendra un toggle) — aussi un enjeu SEO : Google indexe en mobile-first
3. **Finitions SEO/qualité** : voir checklist ci-dessous (canonical/sitemap/JSON-LD débloqués maintenant que le domaine est live), Open Graph, Lighthouse, validation HTML
   - ⚠️ **Footer : ajouter 36px de bottom margin**
4. Validation finale : snapshot dans `2. Versioning/V1`

### Gabarit pages instrument (fait le 2026-07-18)

- **Une page par instrument et par bois** (7 pages). Grande photo à gauche en flux normal (c'est elle qui fait la hauteur de page), colonne texte absolue à droite (titre 62px à 207px du haut, intro à 478px, largeur 772/624). Le bois de la page : entête 32px orange + texte ; les autres bois : entêtes blanches = **liens vers les pages sœurs**. CSS : `instruments.css` (variantes `.instrument--soprano/alto/hautbois` pour les cotes photo).
- **Défilement différencié** (main.js) : la photo suit le scroll normal ; la colonne texte est passée en `position: fixed` par le JS (le CSS reste `absolute` = défilement normal sans JS) et déplacée par un `translate3d` appliqué directement dans l'événement scroll — sa course est calée pour finir 60px au-dessus du footer en bas de page (vitesse auto : ~40% sur les sopranos, ~14% sur le hautbois). ⚠️ Ne pas revenir à un panneau qui suit le flux + correction au rAF suivant : le compositeur le fait défiler à pleine vitesse avant la correction → saccades. Le handler remesure si la hauteur du document change (police/image tardive).
- **Défilement automatique** (main.js) : la page descend seule à 22px/s **dès le chargement** (délai initial supprimé à la demande de Simeon) ; toute interaction (molette, touche, toucher, écart de position) rend la main à l'utilisateur, reprise après 4s d'inactivité ; arrêt en bas de page ; désactivé si `prefers-reduced-motion`.
- Les `<img>` portent `width`/`height` explicites (mesures du scroll fiables avant chargement + pas de layout shift).

### Gabarit page Instruments — vue d'ensemble (fait le 2026-07-18)

- **instruments.html** (maquette 31:816, CSS `instruments-index.css`) : les 7 photos portrait sont couchées à l'horizontale (rotation CSS 90°, socle de pierre à gauche) et débordent du bord gauche comme sur la maquette (hautbois −154px, altos −82px, sopranos −39px à 1440). Composition entièrement homothétique via `--u: min(100vw/1440, 1px)` (même principe que le héro Home) → aucune collision à aucune largeur. `flex: none` sur le main (le `flex: 1` de layout.css écraserait sa hauteur, tous ses enfants étant absolus).
- **Zoom au défilement** (main.js) : chaque photo est à l'échelle **1 au chargement** (hautbois compris) et grossit jusqu'à **+20%** (`GROW = 0.2`) à mesure qu'elle monte — plus bas dans la fenêtre = plus petit. Formule : p = min(pView, pRise) où pView = position dans la fenêtre et pRise = défilement depuis le chargement rapporté à la sortie de la figure ; les deux rampes valent 1 pile quand la figure sort en haut. Origine haut-gauche → le bord haut ne bouge pas. Le hautbois zoomé dépasse du bord droit : clippé par `overflow: clip` sur `.instr-index`. Désactivé si `prefers-reduced-motion`.
- **Survol (2026-07-18)** : la photo (`a.instr-fig` > wrapper `span.instr-zoom`) grossit de **+10%** en douceur (transition CSS 0.4s sur le wrapper — se multiplie avec le zoom au défilement porté par la figure) et l'entête juste au-dessus passe à l'orange (`:has(+ .instr-fig:hover)`). Symétrique : survoler l'entête (« Buis », « Olivier »…, ou le titre pour le hautbois) zoome la photo adjacente (`entête:hover + .instr-fig`). Les paires reposent sur l'adjacence entête→figure dans le HTML — la préserver.
- Chaque photo, entête de bois et titre est un **lien vers la page instrument** correspondante (survol → orange).
- ⚠️ Dans la maquette Figma, les calques photo des sopranos « Buis » et « Olivier » semblent intervertis (le calque nommé olivier est sous l'entête Buis) ; le code suit les **entêtes** (buis sous Buis).

### Checklist SEO (audit du 2026-07-13, statuts mis à jour au 2026-07-19)

Les bases on-page sont déjà bonnes (titles/descriptions uniques, un seul h1 par page, alt partout, `lang="fr"`, HTML sémantique). Par ordre d'impact :

1. **Domaine ✅ (atelier-brandner.ch en ligne) + Google Business Profile — le levier n°1, reste à faire.** Créer une fiche Google Business (« Christoph Brandner, facteur d'instruments à vent, 15 rue des Gares, Genève ») : pour les recherches locales, la carte Google passe devant tous les résultats organiques.
2. **Backlinks monde de la musique ancienne** — annuaires de facteurs (FLAME…), pages de festivals/ensembles, conservatoires, forums (flute-a-bec.com). Pour un site de niche, quelques bons liens pèsent plus que tout le reste. (Action de Christoph/Simeon, pas de code.)
3. **Quick wins code (~1-2h, Claude, débloqués)** : balises canonical `https://atelier-brandner.ch/…` sur chaque page, robots.txt + sitemap.xml, JSON-LD `LocalBusiness` sur contact.html + `Person` sur biographie.html, Open Graph. Favicon ✅.
4. **Titles** : en grande partie fait (pages instrument « Flûte à bec … 415 Hz — Christoph Brandner ») ; à revoir éventuellement pour atelier.html (« Atelier de facture de flûtes à bec et hautbois baroques à Genève — … ») et la Home.
5. **Poids des images ✅** (tous les re-exports sont faits, attributs `width`/`height` posés) — vérifier au passage les `loading="lazy"` sous la ligne de flottaison.
6. **Une page par instrument ✅** (fait le 2026-07-18) — un title/URL par instrument pour la longue traîne.
7. **Contenu dupliqué ✅ réglé de fait** : avec le domaine personnalisé configuré, GitHub Pages redirige les URLs github.io vers atelier-brandner.ch. Les canonical (point 3) finiront de verrouiller.
8. (Optionnel, plus tard) versions DE/EN avec `hreflang` — clientèle internationale, mais décision à part, le site est volontairement FR pour l'instant.

## Journal des sessions

### 2026-07-19 — Conditions générales supprimées, notes internes retirées

- Décision de Simeon (site vitrine, pas de vente en ligne) : **conditions-generales.html supprimée**, lien retiré du footer des 15 pages + gabarit. Sa clause utile (« caractéristiques, bois, délais indicatifs ; photos non contractuelles ; demandes traitées de gré à gré avec l'atelier ») est reprise dans les Mentions légales, section « Instruments et informations ».
- Les **notes internes `.legal-note`** des deux pages restantes sont supprimées : l'hébergement GitHub Pages est confirmé (domaine branché). Questions résolues le jour même : Christoph n'est **pas assujetti à la TVA** (< 100 000 CHF/an) — ligne ajoutée à la section « Statut » des Mentions légales (art. 10 al. 2 LTVA) ; **pas de crédit de conception** (choix de Simeon).

### 2026-07-19 — Domaine en ligne, tous les assets finaux, purge git

- **atelier-brandner.ch est en ligne** (DNS Infomaniak + custom domain GitHub Pages, configuré par Simeon).
- **Derniers assets livrés par Simeon et intégrés** : héro, gravure (950px), carte Genève en webp (alpha — contact.html basculé du .png), têtes de flûtes (2880×1509), nouveau `logo-footer.svg`, favicon 512 (→ 32 + apple-touch-icon dérivés, liens posés sur toutes les pages). Leçon : **pas d'attribut height sur le héro** (il écraserait l'`aspect-ratio` CSS).
- **Incident facture** : un `git add -A` avait embarqué `2. Development/0. Admin/Facture 8031732.pdf` sur le dépôt public → fichier retiré, **historique réécrit** (filter-branch + force push, plus aucune trace), dossier admin gitignoré. La facture vit désormais dans `1. Crea/Admin/` (hors git). Simeon renonce à la purge du cache GitHub (fenêtre d'exposition ~1h, risque jugé nul).

### 2026-07-19 — Pages légales rédigées (mentions / données / conditions)

- Les 3 stubs légaux sont remplis, **cadre juridique suisse** (pas de RGPD/mentions légales à la française) : **mentions-legales.html** = Impressum (éditeur, statut artisan non inscrit au RC, activité, hébergement, PI) ; **protection-des-donnees.html** = nLPD (site vitrine sans collecte active, journaux serveur de l'hébergeur, aucun cookie/analytics, polices auto-hébergées, contact courriel, transfert USA via GitHub Pages + Swiss–U.S. DPF, droits, PFPDT) ; **conditions-generales.html** = CGU (titre « Conditions générales d'utilisation » car **pas de vente en ligne** → des CGV de vente n'ont pas d'objet ; objet, PI, responsabilité, droit suisse / for Genève).
- Nouveau CSS partagé **`3. CSS/legal.css`** (colonne de lecture ~68ch sur le rail, tokens du site, h1 orange comme le stub, h2 condensés 88 %). Header/footer dupliqués comme les autres pages ; `aria-current="page"` posé sur le lien légal actif du footer.
- ⚠️ **3 notes internes `.legal-note`** laissées en bas de chaque page (à vérifier avec Christoph puis **supprimer**) : (1) hébergeur réel si passage GitHub Pages → FTP suisse — supprimer alors la section « Hébergement hors de Suisse » des données ; (2) statut TVA (assujetti ou non < 100 000 CHF) ; (3) crédit conception éventuel ; (4) une vraie page CGV deviendra nécessaire le jour d'une vente en ligne.
- Build : `rm -rf` du Staging refusé dans le sandbox (droits mount) — les 4 fichiers (3 HTML + legal.css) ont été copiés directement dans Staging. **À relancer `build.sh` proprement sur le Mac** pour régénérer un Staging complet et cohérent.

### 2026-07-18 — Page Instruments (vue d'ensemble) + zoom au défilement

- **instruments.html** : la redirection est remplacée par la vraie page « D - Instruments » (maquette 31:816) — 7 instruments couchés, zoom lent au scroll (détails dans « Gabarit page Instruments » ci-dessus). Nouveau CSS `instruments-index.css`, bloc zoom ajouté dans main.js, utilitaire `.visually-hidden` ajouté à base.css (h1 masqué pour le SEO).
- Liens « Instruments » (menu + footer) de **toutes** les pages + `_template-stub.html` → instruments.html.
- `.claude/launch.json` : `autoPort: true` (le port 8642 peut être occupé par une autre session ; le serveur lit désormais `$PORT`).
- **Webp atelier livrés par Simeon** : `atelier_01..07.webp` (600×260) remplacent les placeholders .jpg — références et attributs `width`/`height` mis à jour dans atelier.html.

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
