# Site Christoph Brandner — Guide projet pour Claude

> Document de référence pour toute nouvelle session de travail sur ce projet.
> Dernière mise à jour : 2026-07-23

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
- Frames existantes : Home (0:38), sous-menu Instruments (8:212), Instruments vue d'ensemble (31:816), Biographie (7:171), Contact (9:274), Atelier (22:201)
- **Frames instruments (une par instrument/bois)** : Soprano Reich 415 Buis (30:256) / Olivier (30:312) / Cormier (30:358), Alto Bressan 415 Buis (30:233) / Olivier (30:748) / Cormier (30:680), Hautbois Schlegel 415 (30:279). Les anciennes frames accordéon (1:34/1:56/1:78) sont obsolètes.
- **Mobile : Simeon designera ses propres frames mobiles** — ne pas inventer de responsive, attendre ses maquettes.
- Pour chaque nouvelle page : Simeon donne le lien avec le node sélectionné → récupérer via le MCP Figma (get_design_context + get_screenshot).

## Design tokens (tout est dans css/tokens.css)

- Fond `#000000`, texte `#fafafa`, accent orange `#fe990a`
- Police : **Bricolage Grotesque variable** (graisse 200–800, largeur 75–100%), auto-hébergée en woff2 (pas de CDN Google — protection des données suisse)
- Rail central : 1403px max, gouttières 19px
- **Tous les filets 1px sont orange**. Les filets « pleine page » (menu, footer, séparateurs de section) font toujours **100% de largeur avec 18px de marge de chaque côté** (`--rule-margin`), à toutes les tailles d'écran. Les filets internes aux colonnes de contenu (ex. entêtes de bois des pages instrument) restent à la largeur de leur bloc.
- Menu : lien actif **blanc** (`aria-current="page"` posé dans le HTML de chaque page), les autres **orange**. Le menu est **collant (sticky) sur toutes les pages**. Hauteur réelle : `--header-h: 55px`.
- Titres condensés (ex. titre instrument) : `font-stretch: 88%` / entêtes de bois `76%` — la police auto-hébergée inclut l'axe wdth.

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
    ├── 2. Versioning/    ← snapshots aux jalons : un dossier AAAA-MM-JJ/
    │                       (copie de Sources + LISEZMOI.txt), hors git —
    │                       convention posée par Simeon le 2026-07-20
    └── 3. Build : export/
        ├── 1. Staging/   ← résultat du build (préviews, tests)
        ├── 2. Final/     ← copie validée aux jalons
        └── 3. Archive/
```

**Workflow :** modifier les Sources → lancer `build.sh` (copie pure, aucune réécriture : le HTML est écrit avec les chemins finaux `css/…`, `js/…`, `assets/…`) → prévisualiser Staging.

**Préview :** `.claude/launch.json` définit « site-staging » (python3 http.server, port 8642, servant Staging). Toujours vérifier à 1440px contre la maquette Figma.

**Header/footer :** dupliqués dans chaque page HTML (pas d'include JS). Toute modification du menu ou du footer doit être reportée dans **toutes** les pages + le _template-stub.html. Le header contient désormais aussi, avant le `.rail`, un `.menu-reveal` (voile mobile) et, dans le `.rail`, une `.mobile-bar` (logo + bouton `.menu-toggle` Menu/Retour) — invisibles au-dessus de 900px. La **nav est unique** : la même `ul.site-nav#site-nav` sert de menu horizontal en desktop et de liste plein écran en mobile (voir « Menu mobile » ci-dessous).

### Menu mobile (≤ 900px) — maquettes 41:441 (barre) et 41:492 (menu ouvert)

- **Bascule à 900px** (et non 768) : sous ~793px la nav horizontale débordait (bug connu de longue date) ; le bouton « Menu » la remplace donc dès 900px. Valeur en dur dans les `@media` de `layout.css` (une variable CSS ne peut pas piloter une media query ; `--bp-mobile: 900px` dans tokens.css n'est que documentaire).
- **Barre du haut** : logo à gauche (réutilise `logo-footer.svg`, 45px → 88px à l'ouverture), bouton « Menu »/« Retour » à droite (fondu croisé des deux mots empilés en grille). Le filet orange du haut n'est plus `.site-header::after` (masqué en mobile) mais le bord bas du voile `.menu-reveal`.
- **Ouverture animée** (classe `.menu-open` posée sur `<body>` par `main.js`) : 1) le voile noir `.menu-reveal` grandit de 44px à 100dvh — son filet orange « descend » jusqu'en bas ; 2) le logo grandit (`transform: scale(1.955)`, delay 0.5s) ; 3) les 5 entrées apparaissent en fondu, en cascade (delays 0.50→0.90s). **Fermeture = ordre inverse** : les délais d'entrée sont sur les règles `.menu-open`, ceux de sortie sur les règles de base → une seule classe pilote les deux sens.
- **Liste** : réutilise `ul.site-nav`, `sub-menu` masqué (pas de sous-pages : on passe par la page Instruments), entrées 48px alignées à droite, alignées en haut (~110px). Lien actif **blanc** via l'`aria-current` déjà posé par page (ex. « Instruments » blanc sur les pages instrument).
- **JS** (`main.js`, avant le `return` des pages instrument, donc actif partout) : le bouton bascule `.menu-open`, met à jour `aria-expanded` ; Échap ferme ; cliquer une entrée ferme. Le voile reste dans le DOM (fermé = barre de 44px) : aucune gestion d'affichage. `body.menu-open { overflow: hidden }` fige la page.
- **Layering** : `.site-header` passe à `z-index: 100` en mobile ; à l'intérieur voile 40 < liste 41 < barre 42. Vérifié au-dessus du panneau fixe et du rail des pages instrument (z-index 5).

**Sous-menu Instruments (maquette Figma 8:212) :** l'entrée « Instruments » du menu porte un menu déroulant (`li.has-sub` > `ul.sub-menu`, styles dans layout.css) — panneau noir 245px sous le menu, libellés 20px ExtraBold orange avec 18px au-dessus/en-dessous, filet orange 1px entre chaque entrée. Ouverture au survol et au clavier (focus-within).
⚠️ **Règle : le sous-menu ne liste QUE les instruments dont la page existe.** À chaque création d'une nouvelle page instrument : (1) créer la page, (2) ajouter son entrée dans le `ul.sub-menu` de **toutes** les pages HTML + `_template-stub.html` (et régénérer les stubs), (3) mettre à jour ce document. Entrées actuelles : « Soprano 415Hz » → soprano.html, « Alto 415Hz » → alto.html, « Hautbois 415Hz » → hautbois.html. Le lien « Instruments » du menu et du footer pointe sur instruments.html (vue d'ensemble).

## Images — règles

- Simeon exporte les **WebP finaux** : **2× la taille d'affichage** de la maquette, qualité 80–85, à déposer dans `1. assets/img/`.
- Pour une future image sans webp livré : placeholder tiré des assets Figma en attendant, puis remplacer et supprimer à la livraison. ⚠️ Placeholder d'image à fond transparent en **PNG** — pas de JPEG, qui remplace l'alpha par du blanc (le Mac n'a pas d'encodeur webp en ligne de commande). Toujours poser les attributs `width`/`height` (sauf héro, voir plus bas).
- Cibles de poids : héro ≤ 400 KB, grandes images ≤ 500–600 KB.
- Noms : suivre les exports de Simeon — **underscores** pour les photos (`soprano_415_reich_buis.webp`, `carte_geneve.webp`…) ; quelques anciens fichiers restent en kebab-case (`hero-home.webp`, `bio-portrait.webp`, `logo-footer.svg`, favicons).
- Logo footer : `logo-footer.svg` (déjà en place, vectoriel).
- **✅ Toutes les images du site sont livrées et aux poids cibles (2026-07-19)** : 7 instruments (2×, 0,2–0,6 MB), atelier ×7 (600×260), bio ×2 (600×600, cadrage carré par Simeon), héro (2880×1621, 231 KB), gravure (950×1541, 495 KB), carte Genève webp (alpha, 554 KB), têtes de flûtes (2880×1509, 202 KB), hautbois contact (alpha, 347 KB), nouveau `logo-footer.svg`, favicon (`favicon-512.png` de Simeon → `favicon-32.png` + `apple-touch-icon.png` dérivés via sips, liés dans toutes les pages).
- ⚠️ Le héro Home garde son ratio via le CSS (`aspect-ratio` + `object-fit: cover`) : **ne pas lui mettre d'attribut height**, il écraserait le ratio.
- Manquant : **vidéo atelier** (MP4 auto-hébergé, < 50 MB) — dernier asset du site.
- ⚠️ Placeholders temporaires : **`atelier_fenetre_01.jpg` et `atelier_fenetre_02.jpg`** (fenêtres plein écran de l'Atelier mobile, tirés de Figma, ~550 KB, 1624px de haut) — à remplacer par les webp de Simeon (cible : portrait ≥ 750×1624, qualité 80).

### Images de la version mobile (inventaire du 2026-07-23)

Toutes les images affichées par les pages mobiles, avec leur taille d'affichage à 375px
et la taille d'export recommandée (règle : **2× l'affichage**, qualité 80–85). Les photos
des cartes/pages instrument grandissent avec la hauteur d'écran (échelle ×k, jusqu'à
~×1,45 sur un grand téléphone) — c'est intégré dans la colonne « export ».

| Fichier | Usage mobile | Affichage à 375px | Export recommandé | Statut |
|---|---|---|---|---|
| `atelier_fenetre_01.jpg` | Atelier — fenêtre fixe 1 (plein écran derrière l'ouverture de 130px) | plein écran, cover (375×812 → ~430×930 max) | **portrait ~900×1700** | ⚠️ **placeholder JPEG à remplacer par webp** |
| `atelier_fenetre_02.jpg` | Atelier — fenêtre fixe 2 | idem | **portrait ~900×1700** | ⚠️ **placeholder JPEG à remplacer par webp** |
| `hero-home.webp` | Home — héro (recadré à gauche) | 375×304 cover | 750×608 suffit — l'export actuel 2880×1621 ✓ | webp OK |
| `gravure_flutes.webp` | Home — gravure pleine largeur | 349×566 | 700×1130 — actuel 950×1541 ✓ | webp OK |
| `tetes_flutes_atelier.webp` | Atelier — glissement droite→gauche en bas | h 556, larg. ~1061 (déborde de l'écran) | 2122×1112 — actuel 2880×1509 ✓ | webp OK |
| `bio-portrait.webp` | Biographie — portrait | 284×281 | 568×562 — actuel 600×600 ✓ | webp OK |
| `bio-atelier.webp` | Biographie — photo atelier | 284×276 | 568×552 — actuel 600×600 ✓ | webp OK |
| `carte_geneve.webp` | Contact — carte (cadre 375×179, zoom ×1,72→×1,98) | portion centrale ~218×104 agrandie au cadre | actuel 1544×1352 ✓ (large réserve) | webp OK |
| `contact_hautbois.webp` | Contact — hautbois qui déborde à droite | 415×88 | 830×176 — actuel (alpha, 347 KB) ✓ | webp OK |
| `hautbois_415_buis_schlegel.webp` | Carte 1 (105×636×k), page hautbois (78% de large), miniature onglet (53px) | jusqu'à ~150×910 (carte) / ~330×2000 (page) | actuel 1600×9705 ✓ | webp OK |
| `alto_415_bressan_buis/olivier/cormier.webp` | Carte 2 (3 flûtes, 112–121 de large ×k), page alto (80% de large), miniatures | jusqu'à ~175×790 (carte) / ~340×1480 (page) | actuels 1250×~5430 ✓ | webp OK |
| `soprano_415_reich_buis/olivier/cormier.webp` | Carte 3 (107–121 de large ×k), page soprano, miniatures | jusqu'à ~175×660 (carte) | actuels 1000×3777 ✓ | webp OK |
| `logo-footer.svg` | Barre du haut, menu ouvert, footer | 45px → 88px (menu), ~304px (footer) | — | vectoriel ✓ |

**Action minimale : remplacer les 2 `atelier_fenetre_0X.jpg` par des webp.** Tous les autres
exports existants couvrent déjà largement les tailles mobiles (les affichages mobiles sont
plus petits que les affichages desktop pour lesquels les 2× ont été exportés).

### Optimisation mobile (prochaine session — fine tuning)

Pour servir des images **plus légères en mobile**, il faut des exports dédiés + `srcset`
(le HTML garde une seule balise `<img>` ; le navigateur choisit la version d'après la
largeur d'affichage). Plan : Simeon exporte les versions ci-dessous avec le suffixe
**`_m`** (ex. `hero-home_m.webp`) → Claude câble les `srcset`/`sizes` dans le HTML.

| Export mobile à livrer | Taille (2× l'affichage mobile) | Remplace en mobile |
|---|---|---|
| `hero-home_m.webp` | **750×608** (cadré comme l'affichage mobile : gauche) | hero-home.webp (2880) |
| `gravure_flutes_m.webp` | **700×1135** | gravure_flutes.webp (950) — gain modeste |
| `tetes_flutes_atelier_m.webp` | **2130×1115** | tetes_flutes_atelier.webp (2880) — gain modeste |
| `atelier_fenetre_01.webp` / `_02.webp` | **~900×1700** portrait | les 2 placeholders JPEG (seules obligatoires) |
| `hautbois_415_buis_schlegel_m.webp` | **~660×4000** | version 1600×9705 |
| `alto_415_bressan_{buis,olivier,cormier}_m.webp` | **~680×2950** | versions 1250 |
| `soprano_415_reich_{buis,olivier,cormier}_m.webp` | **~680×2570** | versions 1000 |
| bio, carte, contact_hautbois | — | déjà aux bonnes tailles, rien à exporter |

Qualité 80 partout. NB : les photos instruments mobiles servent 3 usages (carte, page,
miniature 53px) — la version `_m` ci-dessus couvre les trois.

## Pages

| Page | État | Notes |
|---|---|---|
| index.html (Accueil) | ✅ faite | héro + section « Pourquoi fabriquer… » |
| soprano.html | ✅ faite | gabarit une-page (maquette 38:908 transposée) — les 3 bois sur la même page : rail vertical, accordéon, bascule animée |
| alto.html | ✅ faite | maquette 38:908 — même gabarit une-page |
| hautbois.html | ✅ faite | maquette 30:279 — un seul bois (buis), pas de section bois |
| instruments.html | ✅ faite | maquette 31:816 — vue d'ensemble des 7 instruments couchés à l'horizontale, zoom au défilement (×1 en bas de fenêtre → ×1,20 en haut) + zoom +10% au survol croisé photo ↔ entête (voir gabarit ci-dessous) |
| atelier.html | ✅ faite | maquette 22:201 — colonne de 7 photos, titre condensé, 3 paragraphes, photo têtes de flûtes pleine largeur. Le bloc vidéo (16/9) sera ajouté à la livraison du MP4 — placeholder retiré du site en ligne |
| biographie.html | ✅ faite | maquette 7:171 — portrait + nom, filet, photo atelier + texte |
| contact.html | ✅ faite | maquette 9:274 — carte Genève + coordonnées 38px (mailto/tel), photo hautbois pleine largeur. La carte : cliquable → Google Maps sur l'adresse (nouvel onglet, `rel="noopener"`), cadre façon « Fill » Figma (hauteur fixe 676px, `object-fit: cover` centré) qui s'étire à gauche jusqu'à la marge de 18px comme les filets |
| mentions-legales.html, protection-des-donnees.html | ✅ faites | pages légales (legal.css). Les Conditions générales ont été supprimées le 2026-07-19 (inutiles sans vente en ligne) — leur clause « caractéristiques et photos indicatives » est fusionnée dans les Mentions légales (section « Instruments et informations »). Notes de vérification retirées. TVA : non assujetti (< 100 000 CHF/an, confirmé par Simeon) — indiqué dans la section Statut ; pas de crédit de conception (choix de Simeon).

## Reste à faire (phases)

Toutes les pages sont faites, toutes les images sont livrées, le domaine est en ligne. Reste :

1. **Vidéo atelier** (Simeon la tourne) → ajouter un bloc `<video>` MP4 auto-hébergé dans atelier.html entre le texte et la photo des têtes de flûtes (< 50 MB, compresser via ffmpeg). Le placeholder gris a été **retiré du site en ligne le 2026-07-19** (demande de Simeon) — le bloc sera recréé à la livraison (ancien CSS : `.atelier-video`, marge `56px min(157px, 11%) 0`, `aspect-ratio: 16/9`).
2. **Responsive** d'après les frames mobiles de Simeon — aussi un enjeu SEO : Google indexe en mobile-first.
   - ✅ **Menu mobile fait le 2026-07-23** (toggle Menu/Retour animé, ≤ 900px — voir « Menu mobile » plus haut).
   - ✅ **Marges mobiles 9px** (demande de Simeon) : sous 900px, `--rail-gutter` et `--rule-margin` passent à 9px (override dans tokens.css) → tout le site à 9px de marge.
   - ✅ **Corps de la page Accueil (mobile, maquette 41:474)** : titre au-dessus de la photo (recadrée à gauche), section « Pourquoi » en une colonne + gravure pleine largeur. Cotes : H1 28px/48, sous-titre 18px/28, H2 24px/34, texte 16px/30 (bloc mobile dans home.css).
   - ✅ **Footer mobile (maquette 41:446)** : colonne empilée (nav → légal → contact → atelier → filet → gros logo centré → filet → copyright centré → filet), 4 filets pleine largeur, réordonné en flex **sans changer le HTML** (partagé par toutes les pages via layout.css). Remplace l'ancien bloc `@media 800px` (2 colonnes).
   - ✅ **Corps mobile de toutes les pages fait le 2026-07-23** (atelier, biographie, contact, instruments-cartes, pages instrument — voir journal). **Reste** : vérifier les pages légales à 375px (aucune maquette — la colonne de lecture legal.css devrait passer telle quelle) et remplacer les 2 placeholders `atelier_fenetre_0X.jpg` par les webp de Simeon.
3. **Finitions SEO/qualité** : voir checklist ci-dessous (canonical/sitemap/JSON-LD débloqués maintenant que le domaine est live), Open Graph, Lighthouse, validation HTML
   - ⚠️ **Footer : ajouter 36px de bottom margin**
4. Validation finale : snapshot dans `2. Versioning/V1`

### Gabarit pages instrument (2026-07-18, refondu une-page le 2026-07-20)

- **Une page par instrument** (3 pages : soprano, alto, hautbois). Grande photo à gauche en flux normal (c'est elle qui fait la hauteur de page), colonne texte absolue à droite (titre 62px à 207px du haut, largeur 772/624 ; intro à **544px** sur les pages à bois, 478px sur le hautbois). CSS : `instruments.css` (variantes `.instrument--soprano/alto/hautbois` pour les cotes photo ; `.instrument--bois` = page à bois multiples).
- **Pages à bois multiples (soprano, alto — maquette 38:908)** : les 3 bois vivent sur la même page.
  - **Rail vertical** de 90px à gauche (`.wood-rail-track` absolu sur le main + `.wood-rail` sticky sous le menu, pleine hauteur de fenêtre, fond noir, filet orange à droite) ; mots verticaux (`writing-mode: vertical-rl`) répartis en `space-evenly`, bois affiché en orange (`aria-current`). Le rail s'efface à l'arrivée du footer (sa piste s'arrête avec le main). La photo alto est décalée à 55px (`--media-left: 3.82%`) pour dégager le rail.
  - **Accordéon des bois** en bas de colonne (`.wood-acc` > bouton `.acc-head` + `.wood-body` animé par `grid-template-rows`) : un seul ouvert, entête orange quand ouvert.
  - **Bascule d'instrument** (rail OU accordéon, main.js), **en deux temps** : 1) l'ancienne photo s'éloigne (scale 0.7 + fondu, 0.45s ease-out, origine posée au centre de la fenêtre) ; 2) la nouvelle arrive du bas en plus grand (translateY 9vh + scale 1.4 → place, 0.7s). Les 3 webp sont empilées dans une grille (hauteur de page stable, préchargées) ; photos inactives en `visibility: hidden` (⚠️ pas de `will-change` permanent : 3 calques GPU géants). Le passage entering→active se fait par **reflow forcé synchrone** (pas de rAF, suspendu en onglet caché).
  - **Liens profonds** : `#buis` / `#olivier` / `#cormier` ouvrent la page sur ce bois sans animation ; la bascule met à jour le hash (`history.replaceState`). Les anciennes URL par bois redirigent dessus.
- **Défilement différencié « ancré »** (main.js) : la photo suit le scroll normal ; la colonne texte est passée en `position: fixed` par le JS (le CSS reste `absolute` = défilement normal sans JS) et déplacée par un `translate3d` appliqué directement dans l'événement scroll — sa course est calée pour finir 60px au-dessus du footer en bas de page. **Modèle affine ancré** : `shift(y) = anchorShift + (y − anchorY) × slope` ; premier calage linéaire depuis le haut de page, puis chaque recalage (accordéon ouvert/fermé, resize) **préserve la position visuelle courante au pixel près** (demande de Simeon) et ne recalcule que la pente restante jusqu'au footer. ⚠️ Ne pas revenir à un panneau qui suit le flux + correction au rAF suivant : le compositeur le fait défiler à pleine vitesse avant la correction → saccades. Le handler recale si la hauteur du document change (police/image tardive).
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

### 2026-07-23 — Corps mobile de toutes les pages (footer-rideau, Atelier, Bio, Contact, cartes Instruments, pages instrument)

Session d'après les maquettes mobiles 43:… / 44:… de Simeon. Tout est sous `@media (max-width: 900px)` ; le desktop est inchangé (vérifié page par page à 1280).

- **Footer-rideau (toutes les pages)** : en mobile le footer **recouvre le site** en glissant par-dessus. Mécanique : `main` passe en `position: sticky` avec un `top` négatif calculé par main.js (`--curtain-top` = 100vh − hauteur du main, ResizeObserver) → le contenu s'épingle quand son bas touche le bas de la fenêtre, et le footer (opaque, bord à bord, `z-index: 30`, filets haut/bas en pseudo-éléments) continue de monter par-dessus. ⚠️ Toute règle qui redonne `position: relative` au main en mobile casse l'effet (le `top` s'applique en relatif → page décalée) — d'où le `position: sticky` re-déclaré dans le bloc mobile d'instruments.css.
- **Atelier (43:581)** : titre condensé 28px ; les **2 « fenêtres »** sont des `figure.atelier-window` (130px, pleine largeur, `clip-path: inset(0)`) contenant une image en `position: fixed` plein écran → l'image ne bouge pas, seule l'ouverture voyage. ⚠️ Ne jamais mettre de transform/filter sur la fenêtre (ça deviendrait le containing block du fixed). Placeholders `atelier_fenetre_01/02.jpg` (~550 KB, tirés de Figma, redimensionnés à 1624px) **à remplacer par les webp de Simeon**. En bas, les **têtes de flûtes glissent de droite à gauche** au défilement (main.js : course de l'entrée en bas de fenêtre jusqu'à l'épinglage du rideau).
- **Biographie (43:597)** : simple empilement (portrait 284×281, nom 28/48, filet, texte 16/30, photo atelier dessous via flex order).
- **Contact (43:608)** : coordonnées 28/48 d'abord (flex order), carte pleine largeur 179px avec **zoom de base ×1,72** (cadrage maquette) **+ zoom lent au défilement** (main.js, +15% max, même double rampe que la page Instruments), hautbois qui déborde du bord droit (123,5%, overflow hidden), filet inter-sections masqué. ⚠️ `align-items: stretch` nécessaire sur `.contact-grid` mobile (le `start` desktop rétrécissait la carte).
- **Instruments — cartes (44:766/777/791)** : en mobile la vue d'ensemble devient **3 cartes plein écran à balayer** (scroll-snap horizontal natif, `scroll-snap-stop: always`), **sans footer ni défilement vertical** (`body:has(.instr-cards)` : overflow hidden, footer masqué). Unité `--k` = (100dvh − barre)/623 → photos et jalons verticaux homothétiques à toute hauteur d'écran ; textes ancrés comme la maquette (left 70%−75.5px). CTA « Découvrir » 138×44 vers chaque page. **3 traits de progression** en bas : l'actif se **remplit de gauche à droite** (span scaleX 0→1, classe .is-active posée par main.js d'après scrollLeft). Ajouter une carte = copier un `article.instr-card` + un trait.
- **Pages instrument (44:873/891 hautbois, 44:880/902 alto ; soprano = gabarit alto)** : **deux faces**. Face Photo : grande photo en flux + onglet vertical « Description » docké à droite (pleine hauteur d'écran, ligne orange à sa gauche). Face Texte : onglet gauche avec **miniature en miroir** de la photo (53px, suit le bois affiché), titre 28 condensé, filet, texte 16/30, accordéon des bois en bas (alto/soprano). **Bascule** (main.js, classes sur le main) : `.m-exit` → la **ligne orange glisse à gauche** pendant que la **photo rétrécit et se range dans l'onglet** (transform calculé sur sa position réelle) ; puis `.mode-text` → le **texte entre par la droite** (keyframes 80vw→0) et on **revient en haut de page**. Retour symétrique (la photo repart de l'onglet). `overflow-x: clip` sur le main (les animations débordantes élargissaient le viewport mobile). **Rail des bois → barre horizontale dockée en bas** (fixed, 60px, filet orange au-dessus, Buis/Olivier/Cormier, actif orange — mêmes boutons `.wood-rail-btn`, donc bascule de bois/hash/accordéon inchangés), présente sur les deux faces, recouverte par le footer-rideau ; hautbois sans barre. En mobile le **défilement différencié et l'auto-scroll sont désactivés** (garde `mqInstr` dans main.js, styles inline retirés).
- **Vérifié en préview staging à 375×812** (chaque page + bascules, bois, cartes, rideau) **et à 1280** (desktop intact partout, console propre). NB préview : le navigateur intégré ne rend les frames qu'à la demande — transitions/scroll-events paraissent figés entre deux captures, c'est un artefact de l'outil, pas du site.
- **Commité et poussé le 2026-07-23** (demande de Simeon) → GitHub Pages publie la version mobile sur atelier-brandner.ch. **Snapshot** du jalon dans `2. Versioning/2026-07-23/` (copie de « 1. Sources » + LISEZMOI.txt, hors git).
- **Prochaine session (Simeon)** : fine tuning + images — remplacer les 2 placeholders des fenêtres Atelier, livrer les exports `_m` (voir « Optimisation mobile » plus haut) puis câbler les `srcset`, vérifier les pages légales à 375px.

### 2026-07-23 — Menu mobile animé (début de la version mobile)

- **Premier pas de la version mobile** : le menu devient un bouton « Menu » (barre du haut, ≤ 900px) qui ouvre un plein écran noir animé, d'après les maquettes **41:441** (barre) et **41:492** (menu ouvert). Détails techniques dans la section « Menu mobile » plus haut.
- **Animation d'ouverture** (demande de Simeon) : le filet orange descend jusqu'en bas (le voile noir se déploie), « Menu » → « Retour » en fondu croisé, le logo grandit (45→88px) une fois le filet en bas, puis les 5 entrées apparaissent en cascade. **Fermeture = même animation à l'envers** (délais d'entrée sur `.menu-open`, délais de sortie sur les règles de base → une seule classe pilote les deux sens). Instruments **sans sous-pages** en mobile (on passe par la page Instruments).
- **DRY** : une seule `ul.site-nav` sert desktop (horizontal) et mobile (plein écran) ; ajouts HTML minimes par page (`.menu-reveal` + `.mobile-bar`, injectés dans les 11 fichiers via script). CSS dans `layout.css` (bloc « Menu mobile »), token `--header-h-m: 44px` / `--bp-mobile: 900px`, logique dans `main.js` (avant le `return` des pages instrument). Logo = `logo-footer.svg` réutilisé (même figure, ratio identique).
- **Bascule remontée à 900px** (au lieu de 767) : c'est le seuil où la nav horizontale débordait — le toggle couvre donc toute la zone de débordement. `prefers-reduced-motion` : transitions coupées.
- **Vérifié en préview staging** : Home 375px (ouverture/fermeture, logo qui grandit, cascade), pages instrument 768px (voile bien au-dessus du panneau fixe + rail z-index 5), desktop 1280px intact, plus aucun débordement horizontal à 768/900. Lien actif blanc par page (Accueil sur Home, Instruments sur soprano).
- **Pas encore commité/poussé** — publication à la demande de Simeon. Prochaine étape : mise en page mobile du **corps** des pages (frames de Simeon).

### 2026-07-23 — Corps mobile de la page Accueil (maquette 41:474)

- **Marges de page mobile = 9px** (valeur donnée par Simeon) : override de `--rail-gutter` et `--rule-margin` à 9px sous 900px dans tokens.css → tout le site (menu, filets, footer, rail) passe à 9px de marge en mobile.
- **Accueil mobile** (bloc `@media (max-width: 900px)` dans home.css) : le héro n'est plus une superposition — le **titre passe au-dessus de la photo** (`.hero` en `column-reverse`), la photo est élargie et **recadrée à gauche** (`aspect-ratio: 375/304`, `object-position: left`) pour garder la tête de flûte. Section « Pourquoi » en **une colonne** (`.why-grid` en `block`), gravure en pleine largeur dessous. Cotes de Simeon : **H1 28px** (lh 48), sous-titre 18px (lh 28), **H2 24px** (lh 34), **texte 16px** (lh 30).
- **Vérifié à 375px** : titre/photo/typo conformes à la maquette, marges 9px, aucun débordement horizontal ; toutes les cotes de police mesurées exactes.
- **Footer mobile fait ensuite (maquette 41:446)** : colonne empilée, ordre nav → légal → contact → atelier → filet → **gros logo centré** → filet → **copyright centré** → filet. Réordonné entièrement en **flex `order`** dans layout.css (aucun changement de HTML) ; les 4 filets pleine largeur viennent des bords haut/bas du `.site-footer`, du bas du bloc texte et du haut du copyright. L'ancien bloc `@media (max-width: 800px)` (2 colonnes) est supprimé. Rythme 36px autour des filets, 28px entre les blocs de texte, 18px de noir sous le filet du bas. Desktop (> 900px) inchangé (grille 4 colonnes, marges 18px). **Vérifié à 375px et 1280px.**
- La page **Accueil est donc entièrement mobile** (menu + héro + « Pourquoi » + footer). Menu et footer sont mobiles sur **toutes** les pages ; reste le corps mobile des autres pages.

### 2026-07-20 — Pages une-page Soprano et Alto pour de vrai

- **Le prototype est promu en vraies pages** : nouveaux `soprano.html` et `alto.html` (gabarit une-page complet, décrit dans « Gabarit pages instrument » ci-dessus). Le CSS du proto est intégré à `instruments.css` (section « Pages à bois multiples », scope `.instrument--bois`), la logique JS à `main.js` (bascule de bois + défilement différencié **ancré**, qui remplace le modèle linéaire — le hautbois passe aussi sur le modèle ancré, comportement identique vérifié).
- **Les 6 anciennes pages par bois sont supprimées** (décision de Simeon : d'abord transformées en redirections, puis jugées inutiles — les URLs par bois n'ont vécu que ~2 jours sur un domaine tout neuf, sans sitemap ni lien externe ; les anciennes URL renverront un 404 GitHub Pages).
- **Sous-menu Instruments** mis à jour dans toutes les pages + gabarit (« Soprano 415Hz » → soprano.html, « Alto 415Hz » → alto.html). **instruments.html** (vue d'ensemble) : titres → pages instrument, entêtes de bois et photos → `page#bois`.
- `_alto-proto.html` supprimé (conservé dans le snapshot V1) ; la préview « site-sources » (8643) reste dans launch.json.
- **Vérifié en préview staging (1440×900)** : rendu soprano/alto, lien profond `#cormier`, redirection `soprano-olivier.html` → `soprano.html#olivier`, bascule par rail et par accordéon (hash/image/rail/accordéon synchrones), panneau immobile au recalage (0px), arrivée à ~60px du footer sur les 3 pages instrument, aucune erreur console.
- **Pas encore commité/poussé** — publication en ligne à la demande de Simeon.

### 2026-07-20 — Prototype « Alto une-page » (local, non déployé)

- **Essai demandé par Simeon** (maquette Figma **38:908**) : une seule page Alto où le changement de bois (Buis/Olivier/Cormier) se fait **sur place, animé** — les 3 pages alto-*.html existantes restent la version en ligne, intactes.
- Fichier : **`2. HTML/_alto-proto.html`** — préfixe `_` = **exclu du build**, donc impossible à publier par accident ; tout le CSS/JS spécifique est **inline dans ce seul fichier** (les feuilles partagées et main.js sont chargés via les symlinks, non modifiés).
- **Préview** : nouvelle config `site-sources` dans `.claude/launch.json` (port 8643, sert « 2. HTML » directement grâce aux symlinks) → http://localhost:8643/_alto-proto.html
- Contenu du prototype :
  - **Rail vertical des bois** : colonne collante de **90px** à gauche (sous le menu, pleine hauteur de fenêtre, fond noir, filet orange à droite), mots verticaux (`writing-mode: vertical-rl`) répartis en `space-evenly` (espace, Buis, espace, Olivier, espace, Cormier, espace). Piste absolue calée sur le main → le rail s'efface à l'arrivée du footer.
  - **Accordéon des bois** en bas de la colonne texte (remplace les liens vers les pages sœurs) : un seul ouvert, entête orange quand ouvert, animation `grid-template-rows`.
  - **Bascule d'instrument** (rail OU accordéon), **en deux temps** : 1) l'ancienne photo **s'éloigne** (scale **0.7** + fondu, 0.45s ease-out, origine posée au centre de la fenêtre) ; 2) une fois partie, la nouvelle **arrive du bas en plus grand** (translateY 9vh + scale **1.4** → place, 0.7s) — « comme depuis derrière la caméra ». Les 3 webp alto sont empilées dans une grille (hauteur de page stable, préchargées). Le passage entering→active se fait par reflow forcé synchrone (pas de rAF : suspendu quand l'onglet n'est pas visible).
  - Photo décalée à 55px du bord (maquette), intro à 544px (au lieu de 478).
  - **Défilement différencié « ancré »** : le panneau s'appelle `.proto-panel` (main.js ne le trouve pas et s'arrête) ; le script local reprend le défilement différencié **et** l'auto-scroll de main.js, avec un modèle affine ancré — au recalage après un accordéon, la position visuelle du panneau est **préservée au pixel près** (demande de Simeon : « je ne veux pas qu'il bouge »), seule la pente restante jusqu'au footer change (arrivée toujours ~60px au-dessus du footer, vérifié 59,5px).
- ⚠️ Leçon : pas de `will-change` permanent sur les 3 grandes photos (calques GPU géants) — les photos inactives sont en `visibility: hidden`, visibles seulement pendant la transition.
- **Rien n'est commité** : prototype + launch.json + cette note restent locaux tant que Simeon n'a pas validé l'essai.
- Après validation du rendu par Simeon (animation deux temps + panneau immobile) : **snapshot** dans `2. Versioning/` (copie de « 1. Sources », LISEZMOI.txt inclus) — renommé ensuite `2026-07-20/` par Simeon, qui fixe la convention : un dossier `AAAA-MM-JJ/` par jalon, directement sous `2. Versioning/` (le niveau V1 disparaît). Dossier exclu de git le jour même.

### 2026-07-19 — Conditions générales supprimées, notes internes retirées

- Décision de Simeon (site vitrine, pas de vente en ligne) : **conditions-generales.html supprimée**, lien retiré du footer des 15 pages + gabarit. Sa clause utile (« caractéristiques, bois, délais indicatifs ; photos non contractuelles ; demandes traitées de gré à gré avec l'atelier ») est reprise dans les Mentions légales, section « Instruments et informations ».
- Les **notes internes `.legal-note`** des deux pages restantes sont supprimées : l'hébergement GitHub Pages est confirmé (domaine branché). Questions résolues le jour même : Christoph n'est **pas assujetti à la TVA** (< 100 000 CHF/an) — ligne ajoutée à la section « Statut » des Mentions légales (art. 10 al. 2 LTVA) ; **pas de crédit de conception** (choix de Simeon).

### 2026-07-19 (soir) — Panne DNS du domaine, réparée

- **atelier-brandner.ch a cessé de résoudre** dans l'après-midi : la zone Infomaniak affichait les 4 A records GitHub Pages (couche « Adresse web ») mais les serveurs nsany1/nsany2 les servaient à vide (NOERROR, 0 réponse) — TXT/CNAME de la même zone OK. Incohérence côté Infomaniak.
- **Réparation** : suppression des 4 lignes « Adresse web » et recréation **à la main** comme enregistrements A ordinaires dans la Zone DNS → publication immédiate, site de retour (HTTPS 200, certificat OK).
- ⚠️ **Piège Infomaniak** : à partir du 2ᵉ enregistrement A, un dialogue propose « Remplacer » (pré-coché) ou « Ajouter en complément » — toujours choisir **Ajouter en complément** (GitHub Pages a besoin des 4 IP côte à côte). Après une panne, les résolveurs gardent la réponse négative en cache jusqu'à 1h (TTL SOA 3600).

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
