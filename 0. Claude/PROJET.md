# Site Christoph Brandner — Guide projet pour Claude

> Document de référence pour toute nouvelle session de travail sur ce projet.
> Dernière mise à jour : 2026-07-25

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
- Frames existantes : Home (0:38), sous-menu Instruments (8:212), **Instruments vue d'ensemble « bois groupés » (49:1178) — c'est la maquette en vigueur** (l'ancienne vue à 7 instruments, 31:816, est remplacée depuis le 2026-07-24), Biographie (7:171), Contact (9:274), Atelier (22:201)
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
- **+ 2 images de groupe (2026-07-24)** pour la vue d'ensemble Instruments refondue : `alto_groupe.webp` **1970×793** (139 KB) et `soprano_groupe.webp` **1492×691** (116 KB) — les 3 bois + le socle réunis en une seule image horizontale, fond transparent. ⚠️ Dimensions = **exactement 2× la boîte d'affichage** de la maquette 49:1178 : un ré-export doit conserver ces ratios. Les 7 photos par bois restent utilisées ailleurs (pages instrument, cartes mobiles) — ne pas les supprimer.
- ⚠️ Le héro Home garde son ratio via le CSS (`aspect-ratio` + `object-fit: cover`) : **ne pas lui mettre d'attribut height**, il écraserait le ratio.
- Manquant : **vidéo atelier** (MP4 auto-hébergé, < 50 MB) — dernier asset du site.
- ✅ **Plus aucun placeholder (2026-07-25)** : les fenêtres de l'Atelier mobile utilisent désormais `atelier_fenetre_01.webp` / `_02.webp` (858×1900, 460 / 263 KB) livrées par Simeon ; les JPEG provisoires sont supprimés.

### Images de la version mobile (inventaire du 2026-07-23)

Toutes les images affichées par les pages mobiles, avec leur taille d'affichage à 375px
et la taille d'export recommandée (règle : **2× l'affichage**, qualité 80–85). Les photos
des cartes/pages instrument grandissent avec la hauteur d'écran (échelle ×k, jusqu'à
~×1,45 sur un grand téléphone) — c'est intégré dans la colonne « export ».

| Fichier | Usage mobile | Affichage à 375px | Export recommandé | Statut |
|---|---|---|---|---|
| `atelier_fenetre_01.webp` | Atelier — fenêtre fixe 1 (plein écran derrière l'ouverture de 130px) | plein écran, cover (375×812 → ~430×930 max) | portrait ~900×1700 | ✅ **858×1900 livrée (2026-07-25)** |
| `atelier_fenetre_02.webp` | Atelier — fenêtre fixe 2 | idem | portrait ~900×1700 | ✅ **858×1900 livrée (2026-07-25)** |
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

**✅ Action minimale faite le 2026-07-25** (les 2 fenêtres Atelier sont en webp). Tous les autres
exports existants couvrent déjà largement les tailles mobiles (les affichages mobiles sont
plus petits que les affichages desktop pour lesquels les 2× ont été exportés).

### Optimisation mobile — ❌ ABANDONNÉE le 2026-07-25 (décision de Simeon, chiffres à l'appui)

Le plan était de livrer des exports `_m` (une version mobile de chaque image) et de câbler
des `srcset`. **Abandonné** : le poids total du dossier images (5,4 Mo) n'est pas ce qu'un
visiteur télécharge — seul compte le poids **par page**, et il est déjà correct.

| Page | Images téléchargées |
|---|---|
| **instruments.html** | **2 640 Ko** ⚠️ (voir ci-dessous) |
| atelier.html | 1 519 Ko |
| alto.html | 1 204 Ko |
| contact.html | 1 176 Ko |
| hautbois.html | 875 Ko |
| soprano.html | 862 Ko |
| index.html | 770 Ko |
| biographie.html | 182 Ko |

Les exports `_m` auraient demandé 8+ fichiers à Simeon pour ~300–500 Ko sur des pages qui
ne sont pas le problème. **Si un jour on veut alléger, la vraie piste est ci-dessous.**

#### ⚠️ instruments.html embarque DEUX jeux d'images (constat du 2026-07-25)

La page contient les deux mises en page dans le même HTML : les figures **desktop**
(hautbois + `alto_groupe` + `soprano_groupe`) **et** les 7 photos des **cartes mobiles**.
En desktop, les 6 photos alto/soprano des cartes sont **quand même téléchargées**
(~1,5 Mo) alors que `.instr-cards` est en `display: none` — personne ne les voit.

❌ **`loading="lazy"` ne règle PAS ce cas** — testé et mesuré le 2026-07-25 : Chrome
télécharge les images `lazy` situées dans un conteneur `display: none` (6/6 requises à
1440px, chargement neuf, `transferSize` > 0). Les attributs `lazy` posés ce jour-là sur les
6 images de cartes sont donc **inertes pour le desktop** ; ils sont laissés en place (sans
effet négatif, et conformes à l'usage pour des images hors écran en mobile).
NB : côté mobile le problème symétrique n'existe pas — `alto_groupe`/`soprano_groupe` ne
sont pas requises à 375px (vérifié).

✅ **La solution qui marcherait** : `<picture>` + condition `media` — le navigateur ne
télécharge que la source correspondante.
```html
<picture>
  <source media="(max-width: 900px)" srcset="assets/img/alto_415_bressan_buis.webp">
  <img class="card-img--back-left" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="">
</picture>
```
En desktop l'`<img>` retombe sur un GIF transparent 1×1 en data-URI = **aucune requête** ;
en mobile la source correspond et la vraie photo est chargée. Le CSS n'a pas à bouger
(`.card-media img` cible toujours l'`<img>` interne). Gain : instruments.html desktop
passerait de ~2 640 Ko à ~1 070 Ko.
**Non fait — Simeon a choisi de laisser tel quel** (gaspillage desktop uniquement, alors que
le chemin mobile, celui que Google évalue, est déjà propre).

## Pages

| Page | État | Notes |
|---|---|---|
| index.html (Accueil) | ✅ faite | héro + section « Pourquoi fabriquer… » |
| soprano.html | ✅ faite | gabarit une-page (maquette 38:908 transposée) — les 3 bois sur la même page : rail vertical, accordéon, bascule animée |
| alto.html | ✅ faite | maquette 38:908 — même gabarit une-page |
| hautbois.html | ✅ faite | maquette 30:279 — un seul bois (buis), pas de section bois |
| instruments.html | ✅ faite | maquette **49:1178** (refonte du 2026-07-24) — vue d'ensemble à **3 instruments** (bois groupés) : hautbois, alto, soprano ; chacun un titre + un sous-titre orange listant les bois. Zoom au défilement (×1 en bas de fenêtre → ×1,20 en haut) + zoom +10% au survol, **le groupe entier grandit en bloc** (voir gabarit ci-dessous). Remplace l'ancienne vue à 7 instruments (maquette 31:816, un bloc par bois) — snapshot dans `2. Versioning/2026-07-24/` |
| atelier.html | ✅ faite | maquette 22:201 — colonne de 7 photos, titre condensé, 3 paragraphes, photo têtes de flûtes pleine largeur. Le bloc vidéo (16/9) sera ajouté à la livraison du MP4 — placeholder retiré du site en ligne |
| biographie.html | ✅ faite | maquette 7:171 — portrait + nom, filet, photo atelier + texte |
| contact.html | ✅ faite | maquette 9:274 — carte Genève + coordonnées 38px (mailto/tel), photo hautbois pleine largeur. La carte : cliquable → Google Maps sur l'adresse (nouvel onglet, `rel="noopener"`), cadre façon « Fill » Figma (hauteur fixe 676px, `object-fit: cover` centré) qui s'étire à gauche jusqu'à la marge de 18px comme les filets |
| mentions-legales.html, protection-des-donnees.html | ✅ faites | pages légales (legal.css). Les Conditions générales ont été supprimées le 2026-07-19 (inutiles sans vente en ligne) — leur clause « caractéristiques et photos indicatives » est fusionnée dans les Mentions légales (section « Instruments et informations »). Notes de vérification retirées. TVA : non assujetti (< 100 000 CHF/an, confirmé par Simeon) — indiqué dans la section Statut ; pas de crédit de conception (choix de Simeon).

## Reste à faire (phases)

Toutes les pages sont faites, toutes les images sont livrées, le domaine est en ligne. Reste :

0. ⏳ **OUVERT — Atelier (mobile) : les têtes de flûtes glissent encore un peu trop vite** (retour de Simeon le 2026-07-25, après la mise en ligne). Le réglage du 2026-07-25 (`SLIDE_EASE = 3`, `SLIDE_END_MARGIN = 0.18`) a bien adouci le **départ**, mais l'impression générale reste trop rapide.
   ⚠️ **Ne pas se contenter de remonter `SLIDE_EASE` ou `SLIDE_END_MARGIN`** : le budget de défilement (entrée de l'image → épinglage du footer-rideau) est **fixe**, donc tout ce qu'on gagne au début se paie à la fin — c'est déjà le cas, plus de la moitié de la course se fait sur le dernier quart. **La vraie piste, jamais essayée : allonger le budget en retardant le footer-rideau sur cette page** (ou en augmentant la hauteur de défilement disponible avant l'épinglage), ce qui ralentit partout sans raccourcir la course. Constantes et mesures dans « Corrections faites » §3 (bloc « Atelier (mobile) » de main.js).
1. **Vidéo atelier** (Simeon la tourne) → ajouter un bloc `<video>` MP4 auto-hébergé dans atelier.html entre le texte et la photo des têtes de flûtes (< 50 MB, compresser via ffmpeg). Le placeholder gris a été **retiré du site en ligne le 2026-07-19** (demande de Simeon) — le bloc sera recréé à la livraison (ancien CSS : `.atelier-video`, marge `56px min(157px, 11%) 0`, `aspect-ratio: 16/9`).
2. **Responsive** d'après les frames mobiles de Simeon — aussi un enjeu SEO : Google indexe en mobile-first.
   - ✅ **Menu mobile fait le 2026-07-23** (toggle Menu/Retour animé, ≤ 900px — voir « Menu mobile » plus haut).
   - ✅ **Marges mobiles 9px** (demande de Simeon) : sous 900px, `--rail-gutter` et `--rule-margin` passent à 9px (override dans tokens.css) → tout le site à 9px de marge.
   - ✅ **Corps de la page Accueil (mobile, maquette 41:474)** : titre au-dessus de la photo (recadrée à gauche), section « Pourquoi » en une colonne + gravure pleine largeur. Cotes : H1 28px/48, sous-titre 18px/28, H2 24px/34, texte 16px/30 (bloc mobile dans home.css).
   - ✅ **Footer mobile (maquette 41:446)** : colonne empilée (nav → légal → contact → atelier → filet → gros logo centré → filet → copyright centré → filet), 4 filets pleine largeur, réordonné en flex **sans changer le HTML** (partagé par toutes les pages via layout.css). Remplace l'ancien bloc `@media 800px` (2 colonnes).
   - ✅ **Corps mobile de toutes les pages fait le 2026-07-23** (atelier, biographie, contact, instruments-cartes, pages instrument — voir journal).
   - ✅ **Pages légales mobiles ajustées le 2026-07-24** : la colonne de lecture ne passait PAS telle quelle (typo desktop trop grosse à 375px, retour de Simeon). Bloc `@media (max-width: 900px)` ajouté dans `legal.css` alignant les cotes sur les pages instrument / Accueil : **h1 28px/34, h2 22px/28, corps 16px/30** (`.legal-inner` porte le 16/30, hérité par p/adresse ; `.legal-updated` reste 12px), padding `.legal` réduit à 56/80px. Vérifié à 375px sur les 2 pages (aucun débordement).
   - ✅ **Placeholders des fenêtres Atelier remplacés (2026-07-25)** : `atelier_fenetre_01.webp` et `_02.webp` livrés par Simeon (**858×1900**, 460 / 263 KB, portrait — conformes à la cible ~900×1700), les 2 JPEG supprimés, `src` mis à jour dans atelier.html. Vérifié à 375px : les deux images chargent. **Plus aucun placeholder sur le site.**
3. **Finitions SEO/qualité** : voir checklist ci-dessous (canonical/sitemap/JSON-LD débloqués maintenant que le domaine est live), Open Graph, Lighthouse, validation HTML
   - ✅ **Footer desktop : 36px au-dessus du filet du haut ET sous le filet du bas, en permanence** (fait le 2026-07-23 ; `.site-footer margin: auto … 52px` → `36px var(--rule-margin)` ; le pied reste collé en bas des pages courtes via `main { flex: 1 }`).
   - ✅ **Accueil : la gravure s'étire jusqu'à la marge des filets (2026-07-24, demande de Simeon)** — la 2ᵉ image de l'Accueil (`gravure_flutes.webp`) s'arrêtait au bord du **rail** ; sur les écrans **> 1440px** le rail est plafonné à 1403px et centré, son bord droit s'éloigne donc du bord de l'écran alors que les filets orange restent à **18px** → l'image paraissait « pas alignée à droite » (à 1440 l'écart n'était que d'**1px**, d'où l'effet invisible sur la maquette). Corrigé dans `home.css` par une **marge négative** sur `.why-figure` (élément de grille étiré → la figure et l'image en `width:100%` s'élargissent vers la droite) : `margin-right: calc(-1 * ((100vw − min(--rail-max, 100vw − 2×--rail-gutter)) / 2 − --rule-margin))`. Scopé `@media (min-width: 901px)` (le mobile garde ses 9px) + `overflow-x: clip` sur `.why` par sécurité (100vw inclut la barre de défilement quand elle occupe de la place — pas le cas des barres flottantes macOS). Vérifié par mesure DOM : bord droit de l'image **strictement égal** à celui du filet orange et du footer à **1920** (1902 = 1920−18), **1440** (1422) et **920** (902) ; écart 0,0px partout, aucun débordement horizontal, colonne de texte et bord gauche de l'image inchangés, mobile intact (marge 0, image à 9px).
   - ✅ **Exception Accueil + Atelier : pas de 36px au-dessus du filet (2026-07-24, demande de Simeon)** — ces deux pages se terminent par une image (gravure sur l'Accueil, têtes de flûtes sur l'Atelier) qui doit **toucher le filet du haut du footer**. Deux nouvelles classes de page (`page-home` sur index.html, `page-atelier` sur atelier.html — même convention que `page-instrument`) + une règle `@media (min-width: 901px) { .page-home .site-footer, .page-atelier .site-footer { margin-top: 0 } }` dans layout.css. Les **36px sous le filet du bas restent**, et les autres pages gardent leurs 36px au-dessus. ⚠️ Volontairement fait sur la **marge du footer** et non par un `padding-bottom` sur `main` : le main de la page Instruments a une `height` fixe + `flex: none` (enfants absolus) et les pages instrument mesurent la hauteur du document en JS pour le défilement différencié — un padding global les aurait perturbés. Scopé au desktop : en mobile le footer-rideau remet `margin: 0`. Vérifié par mesure DOM (Accueil/Atelier : `margin-top` 0, bas 36px, image collée au filet ; Biographie témoin : 36px des deux côtés ; 375px : rideau intact).
   - ✅ **Menu mobile amélioré le 2026-07-23** (voir journal) : filet orange de la barre fermée solidaire du logo/bouton (ne se sépare plus au rebond) ; barre 9px au-dessus **et** au-dessous du contenu (`--header-h-m` 44→53px) ; menu ouvert sans scroll, entrées réparties sur la hauteur (`space-between`).
   - ✅ **Page Contact (mobile) : zoom carte au défilement 2× plus fort** (2026-07-23) — `main.js`, `MAP_GROW` 0.15 → 0.30 (échelle 1.72 → 2.236 au lieu de 1.978).
   - ✅ **Menu : logo et « Menu » solidaires de la barre** — vérifié le 2026-07-25 : `.site-header` est en `position: sticky; top: 0` (menu collant sur toutes les pages) et la `.mobile-bar` vit dedans, avec son filet orange en `::after` (rendu solidaire le 2026-07-23) → logo, bouton et filet restent groupés, y compris au rebond élastique. Rien à corriger.
   - ✅ **Page atelier (mobile) : départ très lent + arrêt à 18% du bout (2026-07-25, réglages validés par Simeon)** — `main.js` bloc « Atelier (mobile) ». **Ce qui se passait vraiment avant** : les deux constantes du 2026-07-23 se contredisaient — `slideTravel = min(rawTravel × SLIDE_SPEED 0.5, rawTravel × (1 − SLIDE_END_MARGIN 0.1))` → le plafond de vitesse (50%) l'emportait toujours sur celui de fin de course (90%), donc l'image s'arrêtait en fait à **50% du bout** (et `SLIDE_END_MARGIN` ne servait à rien). `SLIDE_SPEED` supprimé. **Deux réglages, côte à côte dans le bloc Atelier :**
     * **`SLIDE_END_MARGIN = 0.18`** → l'image parcourt **82%** de sa course et s'arrête à 18% du bout (`slideTravel = rawTravel × (1 − SLIDE_END_MARGIN)`).
     * **`SLIDE_EASE = 3`** → course en **ease-in cubique** (`Math.pow(p, SLIDE_EASE)`) : départ très doux puis accélération, même point d'arrivée. `2` = plus doux, `1` = linéaire, monter au-dessus de 3 = départ encore plus amorti.
     ⚠️ **Contrepartie assumée** : le budget de défilement (entrée de l'image → épinglage du footer-rideau) est fixe, donc allonger la course = accélérer la moyenne, et amortir le départ = charger la fin. Avec `SLIDE_EASE = 3`, **plus de la moitié de la course se fait sur le dernier quart du défilement** (237 → 563px) ; c'est le prix du départ lent, pas un bug. Le « 2× plus lent » global du 2026-07-23 est perdu. Pour ralentir partout **sans** raccourcir la course il faudrait retarder le footer-rideau sur cette page (non fait). Vérifié à 375px sur 686px de course disponible : **0 / 9 / 70 / 237 / 563px** à 0-25-50-75-100% du défilement → le premier quart ne consomme que **2%** de la course, arrivée à **82%**. Départ (position d'entrée) inchangé.
   - ✅ **Siècles en exposant unifié partout (vérifié le 2026-07-25)** : forme `17ᵉ`/`18ᵉ`/`20ᵉ`. atelier.html (2026-07-23), index.html (déjà bon), **alto.html fait entre-temps par la session parallèle** (contrôlé : plus aucun `ème` dans le HTML, `20ᵉ`/`17ᵉ`/`18ᵉ` en place ligne 102). soprano/hautbois : pas de notation de siècle.
   - ✅ **Instruments (mobile) : indice de balayage (2026-07-25)** — au chargement, la **1re carte** fait un petit écart **vers la gauche** (sens du geste qui amène la carte suivante), **deux fois** : −26px puis −11px, retour à 0, en 1,4 s (`@keyframes card-swipe-hint` + `.instr-card.is-hint > *` dans instruments-index.css ; classe posée par main.js dans le bloc des cartes). Joué **une seule fois**, ~0,9 s après le chargement, et **seulement si personne n'a encore balayé** (si l'utilisateur s'en charge avant, le minuteur est annulé sans rien jouer) ; coupé si `prefers-reduced-motion`. ⚠️ L'animation porte sur le **contenu** de la carte (`> *` : media, texte, CTA), **jamais sur `.instr-card`** qui est l'élément de scroll-snap — on ne touche ni à sa boîte ni au `scrollLeft`, donc le balayage natif reste prioritaire à tout instant. Vérifié à 375px : courbe mesurée 0 / −12 / **−26** / 0 / **−11** / 0 px aux temps clés, les 3 enfants animés ensemble, `scroll-snap-type` toujours `x mandatory`, balayage et traits de progression (0→1→2) intacts, `transform: none` sur la carte elle-même, console propre. Desktop inchangé (les cartes sont `display: none`, l'animation n'existe que sous 900px).
   - ✅ **Pages instrument : bottom menu + animation photo→texte — clos par Simeon le 2026-07-25** (le gabarit mobile simplifié, qui supprime la bascule Photo/Description et remplace la barre dockée par la barre des bois en flux, a réglé les deux points). ⚠️ **Depuis le nettoyage du 2026-07-25, ce gabarit est le seul** : la classe `m-simple` et tout l'ancien code deux faces ont été supprimés (voir journal).
     * ✅ **CTA « retour aux cartes » ajouté (2026-07-23)** — croix orange 60×60 (maquette 48:1173, node Figma), lien fixe en haut à gauche sous le menu vers `instruments.html`, sur les 3 pages (desktop + mobile, choix de Simeon). `.back-to-cards` dans `instruments.css` : carré 60×60 **fond noir + bordure orange 1px** (`var(--rule)`) autour de la croix SVG inline (`--color-accent`, `stroke-width 2`), z-index 25 > rail 5. Markup dans soprano/alto/hautbois.html. Titre mobile descendu pour dégager le carré : `.instrument-panel` (bloc mobile) margin-top 61→**102px** (titre à ~154px, 36px sous le carré, maquette 46:1108). Desktop (`@media min-width 901px`) : carré **hors du rail** — `top: calc(var(--header-h) + 18px)` (18px sous le filet du menu), `left: 108px` (18px à droite du filet vertical du rail, large de 90px). Hautbois n'a pas de rail desktop → `.instrument--hautbois .back-to-cards { left: var(--rule-margin) }` = aligné sur la gouttière gauche (18px, demande de Simeon).
   - ✅ **Mobile - Atelier : le zoom des images dans les fenêtres au défilement — diagnostiqué et corrigé (2026-07-25)**. Cause : `.atelier-window img` (position fixed, `object-fit: cover`) était en `height: 100dvh`. Le **d**ynamic viewport height se re-mesure quand la barre d'URL de Chrome iOS réapparaît (défilement vers le haut) : la hauteur de l'image perdait ~60px et `cover` re-cadrait/agrandissait toute l'image → zoom visible. Correctif : `height: 100lvh` (**l**arge viewport = hauteur « barre masquée », **constante**), fallback `100vh` juste avant pour les vieux navigateurs. Le débord bas est invisible : la fenêtre ne laisse voir que 130px. Vérifié en préview mobile (lvh supporté, image 812px, effet fenêtre intact). Le comportement iOS n'étant pas reproductible en préview desktop (pas de barre d'URL escamotable), le correctif restait à confirmer sur un vrai iPhone → **✅ confirmé par Simeon le 2026-07-25 après la mise en ligne. Point clos.**
   - ✅ **Menu mobile : « Menu » et « Retour » ne se chevauchent plus** (2026-07-23) — bascule enchaînée au lieu du fondu croisé : le mot sortant s'efface (0.25s) puis l'entrant apparaît (`transition-delay: 0.25s`), dans les deux sens (`layout.css`, règles `.menu-toggle__label--open/--close`).
   - ✅ **Mobile, menu : « Instruments » va droit à la page** — vérifié le 2026-07-25 : `.site-nav .sub-menu { display: none }` dans le bloc `@media (max-width: 900px)` de layout.css, le sous-menu n'existe donc pas en mobile. Rien à corriger.
   - ✅ **Mobile : aucune animation de défilement « desktop »** — vérifié le 2026-07-25. Les animations propres au desktop sont bien neutralisées : défilement différencié et auto-scroll des pages instrument coupés par la garde `mqInstr` (`max-width: 900px`) dans main.js ; le zoom de la vue d'ensemble Instruments ne s'applique qu'à des `.instr-fig` mises en `display: none` en mobile (la page devient les cartes à balayer). Les deux animations qui restent actives sous 900px — glissement des têtes de flûtes (Atelier) et zoom de la carte (Contact) — sont **des animations mobiles voulues**, écrites derrière `matchMedia("(max-width: 900px)")`.
   - ✅ **Desktop, menu : marges à 18px (2026-07-25)** — c'était le **code** qui était à corriger, pas le doc : `--rail-gutter` valait **19px** alors que tous les filets orange sont à **18px** (`--rule-margin`), soit 1px de décalage entre le contenu du rail (menu compris) et les filets. Token passé à **18px** (tokens.css) → contenu et filets sur la même verticale. Dans la maquette la marge exacte vaut (1440−1403)/2 = **18,5px** (ni 18 ni 19) ; on retient 18 comme les filets, et comme le mobile qui met déjà les deux à 9px. Vérifié par mesure DOM : à **1280px**, bord du rail du menu = bord des filets = **18,0px** des deux côtés ; à **1440px** le rail est plafonné par `--rail-max: 1403px` → 18,5px (0,5px des filets, contre 1px avant). Au-dessus de 1440 le rail est centré : ses marges grandissent par construction, seuls les filets restent à 18px.

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

### Gabarit page Instruments — vue d'ensemble « bois groupés » (refonte du 2026-07-24)

- **instruments.html** (maquette **49:1178**, CSS `instruments-index.css`) : **3 instruments** au lieu de 7. Chaque groupe est une `section.instr-group` contenant un `.instr-group-head` (titre 48px blanc `.instr-head` + sous-titre 32px orange `.instr-sub` — « En buis », « En buis, olivier et cormier ») puis sa ou ses photos. Composition entièrement homothétique via `--u: min(100vw/1440, 1px)` (même principe que le héro Home) → aucune collision à aucune largeur. `flex: none` sur le main (le `flex: 1` de layout.css écraserait sa hauteur, tous ses enfants étant absolus). Hauteur du main : 1878 = 2231 (maquette) − 55 (menu) − 298 (footer) ; les Y du CSS sont ceux de la frame **moins 55**.
- **Deux types de figures** (toutes deux `.instr-fig`, débordant du bord gauche comme sur la maquette) :
  - **Hautbois** : photo portrait unique **pivotée 90°** (`rotate(90deg) translateY(-100%)`, socle à gauche), boîte `--thick × --len`.
  - **Alto et soprano** : **une seule image de groupe déjà horizontale** (`alto_groupe.webp` 1970×793, `soprano_groupe.webp` 1492×691) réunissant les 3 bois **et** le socle. Classe `.instr-fig--group` → `img { width/height: 100%; transform: none }` (pas de rotation). Les fichiers font **pile 2×** la boîte de groupe de la maquette (984,786×396,244 et 745,958×345,407) → ratio exact, aucune déformation. ⚠️ Un futur ré-export doit garder ces ratios.
- **Zoom au défilement** (main.js, inchangé depuis le 2026-07-18) : chaque figure est à l'échelle **1 au chargement** et grossit jusqu'à **+20%** (`GROW = 0.2`) à mesure qu'elle monte — plus bas dans la fenêtre = plus petit. Formule : p = min(pView, pRise) où pView = position dans la fenêtre et pRise = défilement depuis le chargement rapporté à la sortie de la figure ; les deux rampes valent 1 pile quand la figure sort en haut. Origine haut-gauche → le bord haut ne bouge pas. Le hautbois zoomé dépasse du bord droit : clippé par `overflow: clip` sur `.instr-index`. Désactivé si `prefers-reduced-motion`. **Aucune modification du JS n'a été nécessaire** : il cible déjà `.instr-fig`.
- **Survol** : la figure (`a.instr-fig` > wrapper `span.instr-zoom`) grossit de **+10%** en douceur (transition CSS 0.4s sur le wrapper — se multiplie avec le zoom au défilement porté par la figure) et le titre du groupe passe à l'orange (`.instr-group:has(.instr-fig:hover)`). Pour l'alto et le soprano, **tout le groupe grandit en bloc** (demande de Simeon) — plus de zoom bois par bois, puisqu'il n'y a plus qu'une image.
- Chaque figure et chaque titre est un **lien vers la page instrument** correspondante (survol → orange). Les ancres par bois (`#buis`…) ont disparu de cette page : le groupe pointe sur la page de l'instrument.
- **Mobile (≤ 900px)** : inchangé — 3 cartes plein écran à balayer (bloc en bas de `instruments-index.css`), qui regroupaient déjà les bois.

### Checklist SEO (audit du 2026-07-13, statuts mis à jour au 2026-07-19)

Les bases on-page sont déjà bonnes (titles/descriptions uniques, un seul h1 par page, alt partout, `lang="fr"`, HTML sémantique). Par ordre d'impact :

1. **Domaine ✅ (atelier-brandner.ch en ligne) + Google Business Profile — le levier n°1, reste à faire.** Créer une fiche Google Business (« Christoph Brandner, facteur d'instruments à vent, 15 rue des Gares, Genève ») : pour les recherches locales, la carte Google passe devant tous les résultats organiques.
2. **Backlinks monde de la musique ancienne** — annuaires de facteurs (FLAME…), pages de festivals/ensembles, conservatoires, forums (flute-a-bec.com). Pour un site de niche, quelques bons liens pèsent plus que tout le reste. (Action de Christoph/Simeon, pas de code.)
3. **Quick wins code ✅ fait le 2026-07-23** : canonical `https://atelier-brandner.ch/…` sur les 10 pages (+ gabarit stub), robots.txt + sitemap.xml (**8 URLs** depuis le 2026-07-25 — les 2 pages légales en `noindex` en ont été retirées ; priorités 1.0→0.7), Open Graph + Twitter card sur toutes les pages, JSON-LD `LocalBusiness` sur contact.html + `Person` sur biographie.html, `noindex` sur les 2 pages légales (contenu non pertinent pour la recherche). Favicon ✅.
4. **Titles ✅** : Home et atelier.html retitrés pour inclure « Atelier Brandner » (nom de domaine / requête de marque) — Home : « Atelier Brandner — Christoph Brandner, facteur d'instruments à vent baroques à Genève » ; Atelier : « Atelier de facture de flûtes à bec et hautbois baroques à Genève — Christoph Brandner ». Pages instrument déjà bonnes (« Flûte à bec … 415 Hz — Christoph Brandner »).
5. **Poids des images ✅** (tous les re-exports sont faits, attributs `width`/`height` posés) — vérifier au passage les `loading="lazy"` sous la ligne de flottaison.
6. **Une page par instrument ✅** (fait le 2026-07-18) — un title/URL par instrument pour la longue traîne.
7. **Contenu dupliqué ✅ réglé de fait** : avec le domaine personnalisé configuré, GitHub Pages redirige les URLs github.io vers atelier-brandner.ch. Les canonical (point 3) finiront de verrouiller.
8. (Optionnel, plus tard) versions DE/EN avec `hreflang` — clientèle internationale, mais décision à part, le site est volontairement FR pour l'instant.

## Journal des sessions

### 2026-07-25 (nuit) — Mise en ligne + un point rouvert

- **Commit `08e2c5b` poussé sur `main`** : tout le travail des 24-25 juillet (refonte « bois groupés », webp des fenêtres Atelier, audit et nettoyage du code, sitemap à 8 URLs). Workflow Pages en succès (18 s). **Vérifié sur le site en production** et pas seulement dans le dépôt : instruments.html sert bien `alto_groupe`/`soprano_groupe`, atelier.html sert les `.webp` (les `.jpg` répondent 404), les 4 nouvelles images en HTTP 200, sitemap à 8 URLs, et 0 occurrence de `side-dock`/`m-simple`/`wood-head`/`legal-list`/`mode-text`/`is-morph` dans le HTML, le CSS et le JS servis.
- ✅ **Zoom des fenêtres Atelier sur iOS : confirmé OK par Simeon** après la mise en ligne. Le correctif `100lvh` fonctionne, le point est clos.
- ⏳ **Rouvert : les têtes de flûtes de l'Atelier glissent encore un peu trop vite** (retour de Simeon en regardant le site en ligne). Voir le point **0** de « Reste à faire » — avec l'avertissement sur la fausse piste (remonter les constantes ne fait que déplacer le problème vers la fin de la course ; il faut allonger le budget de défilement).

### 2026-07-25 (soir) — Audit final : suppression du code mort, sitemap resserré

**Audit demandé par Simeon avant la mise en ligne** (« vieilles choses pas supprimées, vieilles images »).

**Images : rien à jeter.** Les 32 fichiers de `1. assets/img/` sont tous référencés — aucun orphelin. Les 2 JPEG placeholders des fenêtres Atelier étaient déjà supprimés, plus aucune référence nulle part.

**Code mort supprimé :**
- `instruments.css` — `.wood-head`, `section.wood .wood-head`, `a.wood-head` (+ `:hover/:focus-visible`), `.wood p` ×2 : reliquats du gabarit **avant** la refonte une-page du 2026-07-20 (une page par bois), remplacés depuis par `.acc-head` / `.wood-rail-btn`.
- `legal.css` — `.legal ul.legal-list`, `.legal ul.legal-list li`, `.legal .legal-note` : reliquats des **Conditions générales** supprimées le 2026-07-19 et des notes de vérification retirées.

**Ancien gabarit mobile deux faces Photo/Description — supprimé en entier (décision de Simeon).** Il ne servait plus que de voie de retour arrière depuis le 2026-07-23 ; `m-simple` est validé, donc l'échafaudage part :
- **HTML** (soprano/alto/hautbois) : bloc `.side-dock` (ligne orange + 2 boutons + miniature) retiré, classe `m-simple` retirée du `<main>`, commentaire de retour arrière retiré.
- **JS** (`main.js`) : les ~65 lignes de la bascule (`.m-exit` → `.mode-text`, `tabTransform`, `MORPH_MS`, `morphTimer`) supprimées, ainsi que la ligne qui mettait à jour la miniature de l'onglet à chaque changement de bois.
- **CSS** (`instruments.css`) : le bloc « Corps mobile » deux faces et le bloc « Variante mobile simplifiée » sont **fusionnés en un seul bloc mobile**, sans la classe `m-simple`. Supprimés au passage : `.side-dock`, `.side-line`, `.side-btn*`, `.mode-text *`, `.m-exit *`, `.is-morph`, `@keyframes instr-panel-in`, la barre des bois dockée en bas (`.wood-rail` fixed) et les valeurs que `m-simple` écrasait de toute façon (`.instrument-panel { display:none }`, marge 64/82px, `max-width: 249px`, `margin-top: 30px`, `.acc-head { font-size: 24px }`).
- ⚠️ **Point de vigilance du dé-classement** : les règles passaient de `.instrument.m-simple X` (spécificité 0,3,0) à `X` (0,1,0). Vérifié un par un que les sélecteurs desktop plus spécifiques ne reprennent pas la main — `.instrument--bois .instrument-media` ne pose que `display: grid` (pas de conflit), `.instrument--hautbois .instrument-media { left: 0 }` (0,2,0) bat bien la règle générique, `.wood-body-inner p:first-child` (0,2,1) reste prioritaire.
- **Vérifié par mesure DOM avant/après, à 375px, sur les 3 pages** : toutes les boîtes (main, panneau, titre, filet, intro, barre des bois, accordéon, photo, footer) et la hauteur de document sont **identiques au pixel** (soprano 2954px, alto 3752px, hautbois 3912px) ; seul `.side-dock` passe de `display:none` à absent. Bascule de bois retestée (photo, texte, `aria-current`, hash `#cormier`) ✓. Desktop recontrôlé à 1440px sur alto et hautbois : rail vertical, 3 entêtes d'accordéon, panneau en `fixed`, `left: auto` sur la photo, aucun débordement horizontal. Console propre partout.

**Sitemap :** les 2 pages légales en `noindex` retirées de `sitemap.xml` (8 URLs au lieu de 10) — les lister ne produisait qu'un avertissement « URL envoyée marquée noindex » dans Search Console. XML revalidé.

**Laissé volontairement :** `--bp-mobile: 900px` (0 usage, mais documentaire — une variable CSS ne peut pas piloter une media query) ; les `loading="lazy"` inertes des cartes Instruments (voir « Optimisation mobile »).

**Constat de fin d'audit :** aucun code commenté (0 bloc en CSS/JS/HTML), aucun `TODO`/`FIXME`, header et footer strictement identiques sur les 11 pages (seuls les `aria-current` diffèrent), Staging à jour avec Sources, `.DS_Store` bien ignoré. Après nettoyage, **plus une seule classe CSS orpheline**.

⚠️ **Au moment de l'audit, tout le travail des 24 et 25 juillet était encore local** (44 fichiers modifiés, 4 images non suivies, `origin/main` = `HEAD`) : le site en ligne n'avait ni la refonte « bois groupés » d'instruments.html, ni les webp des fenêtres Atelier (il servait encore les JPEG). À commiter et pousser.

### 2026-07-25 — Revue de la to-do : 5 points vérifiés/clos, 3 corrections, marges unifiées à 18px

**Points déclarés faits par Simeon — vérifiés dans le code avant d'être cochés** (détails en §3) :
- Menu mobile « Instruments » → va droit à la page (`.sub-menu { display:none }` sous 900px) ✅
- Aucune animation de défilement desktop en mobile (gardes `mqInstr` ; les figures de la vue d'ensemble sont `display:none` ; les 2 animations restantes sont des animations mobiles voulues) ✅
- Logo + « Menu » solidaires de la barre (`.site-header` sticky, filet en `::after` de la barre) ✅
- Pages instrument : bottom menu + animation photo→texte — **clos par Simeon** (réglés par la variante `m-simple`) ✅
- Siècles en exposant sur alto.html — **déjà fait par la session parallèle** (plus aucun `ème`) ✅

**Décision — optimisation des images abandonnée (avec chiffres) :**
- Simeon a demandé si les exports `_m` + `srcset` étaient vraiment nécessaires (dossier images = 5,4 Mo). **Mesure du poids par page** (le total du dossier n'est pas ce qu'on télécharge) : 182 Ko à 1 519 Ko selon les pages, sauf **instruments.html à 2 640 Ko**. → Le plan `_m`/`srcset` est **abandonné** : 8+ exports pour ~300–500 Ko sur des pages qui ne posent pas problème.
- En cherchant, j'ai trouvé la vraie cause du poids d'instruments.html : elle **embarque les deux jeux d'images** (figures desktop + 7 photos des cartes mobiles), et le desktop télécharge ~1,5 Mo de photos invisibles.
- ⚠️ **J'ai d'abord proposé `loading="lazy"` en affirmant que ça réglerait le cas — c'était faux**, et je l'ai constaté en mesurant après coup : Chrome télécharge les images `lazy` dans un conteneur `display: none` (6/6 requises à 1440, chargement neuf). Les 6 attributs posés restent en place mais sont **inertes** pour le desktop. La solution qui marcherait (`<picture>` + `media`) est documentée en détail dans « Optimisation mobile » — **non faite, choix de Simeon** de laisser tel quel (gaspillage desktop seulement, chemin mobile déjà propre).

**Ajout :**
- **Indice de balayage sur les cartes Instruments (mobile)** : la 1re carte s'écarte brièvement vers la gauche au chargement (deux fois, −26 puis −11px) pour montrer qu'on peut balayer. Purement visuel — l'animation porte sur le contenu de la carte, jamais sur l'élément de scroll-snap ni sur `scrollLeft`, donc le geste de l'utilisateur reste prioritaire. Détails en §3.

**Corrections faites :**
- **Fenêtres de l'Atelier mobile** : les 2 derniers placeholders JPEG remplacés par `atelier_fenetre_01/02.webp` (858×1900, 460 / 263 KB) livrées par Simeon → **le site n'a plus aucun placeholder**.
- **Marges desktop unifiées à 18px** : c'était le code qui était faux (`--rail-gutter: 19px` contre `--rule-margin: 18px`) — token passé à 18px, contenu du rail et filets désormais alignés (mesuré : 18,0px des deux côtés à 1280).
- **Atelier mobile, glissement des têtes de flûtes** : trois passes dans la même session, réglé à l'œil par Simeon. D'abord l'arrêt porté à 10% du bout — en analysant, les deux constantes du 2026-07-23 se contredisaient et le plafond de vitesse (50%) masquait entièrement celui de fin de course, l'image s'arrêtant en fait à mi-parcours. Puis ajout d'un **départ lent** (ease-in) et essai à 15%. **Valeurs retenues : `SLIDE_EASE = 3` (ease-in cubique) et `SLIDE_END_MARGIN = 0.18` (course 82%)**. Mesuré à 375px : 0 / 9 / 70 / 237 / 563px sur 686 disponibles aux quarts du défilement — le premier quart ne consomme que 2% de la course. ⚠️ Contrepartie assumée : le budget de défilement étant fixe, allonger la course = accélérer la moyenne et amortir le départ = charger la fin (plus de la moitié de la course sur le dernier quart). Le « 2× plus lent » global est perdu ; seul le début est ralenti.

### 2026-07-25 — Biographie : 3e paragraphe (apprentissage) + espacement des paragraphes

- **Texte de la Biographie mis à jour** (fourni par Simeon) : ajout d'un **3e paragraphe** sur l'absence de filière d'apprentissage du métier et les transmissions reçues de **Denise Rutishauser** et **Philippe Laché**. Le balisage étant unique (une seule `.bio-text`, la mise en page mobile n'étant qu'un `@media`), la modification vaut pour **desktop et mobile**.
- **Correction** : « loin d'avoir **nuit** » → « loin d'avoir **nui** » (participe passé de *nuire*). Conservé « a au contraire **comporté** » (le texte transmis écrivait « comportait », incorrect après l'auxiliaire *a*).
- **Espacement des paragraphes ajouté** (`biographie.css`) : la page était la seule à ne pas avoir de règle `p + p`, ses paragraphes se suivaient donc **collés** — visible dès 2 paragraphes, franchement gênant à 3. Aligné sur la convention du site (`atelier.css`, `home.css`) : `var(--text-body-line)` = 32px en desktop, 30px sous 900px.
- Vérifié en préview par mesure DOM et captures : 3 paragraphes présents, gouttières 32/30px, photo d'atelier toujours sous le texte en mobile, aucun débordement horizontal à 375px.

### 2026-07-24 — Refonte de la page Instruments : bois groupés (3 instruments au lieu de 7)

- **Demande de Simeon** : une version DESKTOP de la vue d'ensemble Instruments où les bois sont **regroupés** → 3 instruments affichés (hautbois, alto, soprano) au lieu des 7 blocs par bois. Le zoom au défilement (image qui grandit) reste **identique**. Maquette **49:1178**.
- **Snapshot d'abord** : `2. Versioning/2026-07-24/` (copie de « 1. Sources » + LISEZMOI.txt, convention habituelle) avant toute modification → **l'ancienne vue à 7 instruments y est conservée** (c'est la seule copie : elle a été supprimée des Sources, voir plus bas).
- **Déroulé en 3 temps** (demandes successives de Simeon dans la session) :
  1. **Essai créé à côté** (`instruments-groupes.html` + `instruments-groupes.css`), l'ancienne page intacte, non liée au menu, en `noindex`.
  2. **Alto & soprano = UNE image de groupe** : Simeon a livré `Alto_groupe.png` / `Soprano_groupe.png`, chacune réunissant les 3 bois **et** le socle en une seule image horizontale (fond transparent). Les 3 `.instr-fig` par bois ont été remplacées par **une seule** `.instr-fig--group` par instrument → au survol **tout le groupe grandit en bloc**, plus bois par bois (c'était la demande). Ces fichiers font **pile 2×** la boîte de groupe de la maquette → posés sans rotation (`img { width/height:100%; transform:none }`), ratio exact.
  3. **Promotion + nettoyage** : Simeon a livré les webp et demandé de supprimer l'ancienne version. Voir ci-dessous.
- **État final** : la nouvelle page **est** `instruments.html` (et son CSS `instruments-index.css`) — l'ancienne page à 7 instruments et son CSS ont été **supprimés des Sources**, les fichiers `instruments-groupes.*` renommés aux noms canoniques, le `noindex` retiré. **Conséquence voulue : tous les liens existants pointent déjà au bon endroit** — menu et footer des 11 pages, et surtout le **CTA croix « retour aux cartes »** des pages soprano/alto/hautbois (`href="instruments.html"`), qui mène donc maintenant à la vue groupée. Aucun lien n'a eu besoin d'être réécrit.
- **Images** : `alto_groupe.webp` **1970×793** (139 KB) et `soprano_groupe.webp` **1492×691** (116 KB), renommées en minuscules-underscore (convention du site) ; les 2 PNG provisoires supprimés. ⚠️ Ces dimensions sont exactement 2× la boîte d'affichage — **un ré-export doit garder ces ratios** (sinon déformation). Les 7 anciennes photos par bois (`alto_415_bressan_*`, `soprano_415_reich_*`) **restent utilisées** par les pages instrument et les cartes mobiles : ne pas les supprimer.
- **Vérifié en préview staging à 1440px** : positions mesurées au DOM = exactement celles de la maquette (entêtes à 188/683/1319, figures aux Y/X Figma), titre blanc + sous-titre orange, zoom au défilement actif (échelle 1,159 mesurée), survol du groupe en bloc, les 2 webp chargées aux bonnes dimensions natives, aucun débordement horizontal (hautbois zoomé clippé par `overflow:clip`), console propre. **Parcours testé au clic** : soprano.html → croix « retour » → arrive bien sur la vue groupée. Aucune référence morte (grep `instruments-groupes` / `Alto_groupe` / `.png` = vide).
- **Buildé dans le Staging** (build.sh repart d'un dossier vide : aucun fichier de l'ancienne version ne subsiste).

### 2026-07-24 — CTA « retour aux cartes » (pages instrument) + finitions, puis pause

- **CTA croix ajouté** (maquette Figma 48:1173 dans la frame 46:1108) sur soprano/alto/hautbois : carré 60×60 fond noir + bordure orange 1px (`var(--rule)`), croix SVG inline orange (`stroke-width 2`), lien **fixe** vers `instruments.html`. Détail complet dans « Reste à faire » §3. Itérations avec Simeon : (1) bordure du carré oubliée au 1er jet puis ajoutée (get_design_context Figma : `bg-black` + `border #fe990a`) ; (2) titre mobile descendu (`.m-simple .instrument-panel` 61→**102px**, 36px sous le carré) ; (3) desktop **hors du rail** (`top: header-h+18px`, `left: 108px` = 18px à droite du filet du rail) ; (4) hautbois sans rail → aligné sur la **gouttière** (`left: var(--rule-margin)` = 18px).
- **Autres finitions de la session** (détaillées en §3) : atelier mobile — glissement **2× plus lent** (`SLIDE_SPEED 0.5`) ; contact mobile — zoom carte **2×** (`MAP_GROW 0.3`) ; `17ᵉ/18ᵉ` unifiés sur atelier.html ; menu mobile — « Menu »/« Retour » enchaînés (plus de chevauchement).
- **⚠️ État à la pause de Simeon** : tout est **buildé dans le Staging** (préview 8642) et vérifié en préview. **RIEN n'est commité ni poussé** → le site en ligne (atelier-brandner.ch) montre encore l'ancienne version. Prochaine étape quand Simeon le décide : `git commit` + `git push` (déploiement GitHub Pages).
- **Coordination** : une autre session Claude travaille en parallèle sur les pages instrument (variante m-simple). Fichiers partagés touchés ici : `instruments.css` + soprano/alto/hautbois.html (markup CTA). À réconcilier avant de commiter.
- **Tenu en attente** (territoire de l'autre session) : `alto.html` siècles en exposant ; hint de swipe sur instruments.html ; bottom menu + animation photo→texte des pages instrument.

### 2026-07-24 — Barre mobile : 9px sous le contenu réellement appliqué (build)

- **Symptôme (Simeon)** : « je pensais qu'on l'avait fait mais le bas n'a pas ses 9px ». DevTools sur `body.page-instrument` montrait `padding-bottom: 0` sur `.mobile-bar`.
- **Cause** : l'édition du 2026-07-23 (`.mobile-bar` en `padding: 9px var(--rule-margin)`, symétrique) était restée **dans les Sources uniquement, non buildée / non commitée** (cf. note plus bas). La version que regardait Simeon portait encore l'ancien `padding: 9px var(--rule-margin) 0` (0 en bas).
- **Fait** : `build.sh` relancé → le Staging sert maintenant le CSS corrigé. Vérifié par mesure DOM sur `hautbois.html` (375px) : `padding-bottom` passe de `0` à **9px**, symétrique avec le haut. NB : `--header-h-m` valant 53px et le logo ~26px, l'écart *visuel* haut/bas est ~13px (9px de padding + centrage `align-items: center`) — équilibré, mais le nombre lu à l'écran n'est pas littéralement 9px. Reste à **commiter + déployer** pour que le site en ligne reflète la correction.

### 2026-07-23 — Menu mobile : filet solidaire, barre +9px, ouverture sans scroll

Trois retouches, **toutes contenues dans `layout.css` + une ligne de `tokens.css`** (aucune édition des fichiers instrument, une autre session y travaillait en parallèle) :
- **Filet de la barre fermée solidaire du logo + bouton.** Avant : le filet vivait sur `.menu-reveal` (`position: fixed`) alors que la barre logo/« Menu » est `sticky` → au rebond élastique en haut de page, la barre suivait le contenu et se détachait du filet. Désormais un `.mobile-bar::after` porte le filet en état fermé (donc collant, il bouge avec le logo et le bouton) ; à l'ouverture il s'efface et le filet du voile (`.menu-reveal::after`, masqué au repos) prend le relais pour descendre. Fondu croisé calé sur les délais existants ; les deux coïncident au repos, aucun saut.
- **Barre +9px sous le contenu** (demande de Simeon) : `--header-h-m` 44 → **53px** (9px haut + contenu 35px + 9px bas), `.mobile-bar` en `padding: 9px var(--rule-margin)`. La zone de contenu reste 35px (rien de comprimé). Le token étant partagé, le filet, le voile fermé **et** le dock des pages instrument (`top: var(--header-h-m)`) se recalent tous ensemble → toujours affleurants.
- **Menu ouvert sans scroll** : `.site-nav` passe en `overflow: hidden` ; `.site-nav > ul` en `height: 100%` + `justify-content: space-between` (gap min 12px au lieu du `clamp(32px,9vh,74px)` qui débordait sur les petits écrans). Vérifié à 375×812 et 375×667 (iPhone SE) : `scrollHeight === clientHeight`, entrées réparties du haut vers le bas.
- **Footer desktop — 36px en permanence** (demande de Simeon) : `.site-footer` passe de `margin: auto var(--rule-margin) 52px` à `margin: 36px var(--rule-margin)` → 36px de noir au-dessus du filet du haut et sous le filet du bas. Le `margin-top: auto` n'était plus nécessaire (`main { flex: 1 }` ancre déjà le pied en bas ; flexbox tient compte de la marge dans le calcul de l'espace libre). Vérifié par mesure DOM sur page longue (scroll) et page courte (pied ancré en bas de fenêtre) : 36px des deux côtés dans les deux cas. Mobile inchangé (le bloc `@media ≤900px` remet `margin: 0` pour le footer-rideau).
- **Non buildé / non commité** : édité dans les Sources uniquement (préview « site-sources », 8643), `build.sh` volontairement pas relancé pour ne pas mélanger le Staging avec la session instrument en cours. → **Buildé le 2026-07-24** (voir entrée du jour) : c'est ce build manquant qui expliquait que les 9px du bas « n'apparaissaient pas ».

### 2026-07-23 — Variante mobile simplifiée des pages instrument (m-simple)

- **Essai demandé par Simeon** (maquette **46:1108**, Alto ; hautbois et soprano dérivés) : un gabarit mobile **plus simple** remplace les deux faces Photo/Description — page qui défile normalement : **titre** (pleine largeur, 28 condensé), **filet**, **description**, **barre des bois en flux** (3 CTA entre filets orange, 60px — remplace l'accordéon ET la barre dockée), **texte du bois affiché**, puis la **grande photo** (80 % de large, centrée +10px) et le footer-rideau. Les CTA gardent toutes les interactions : bascule animée photo + texte, `aria-current`, hash `#bois`. Hautbois : pas de barre.
- ~~**Bascule 2 secondes (rien n'est supprimé)** : tout tient dans la classe **`m-simple` posée sur le `<main>`** des 3 pages instrument. **La retirer = retour immédiat à l'ancienne version deux faces**, dont le code (CSS « Corps mobile », JS dock, HTML .side-dock) reste entier.~~ ⚠️ **Caduc depuis le 2026-07-25** : Simeon a validé le gabarit simplifié, la classe `m-simple` et tout l'ancien code deux faces ont été supprimés (voir l'entrée de journal du 2026-07-25 « Nettoyage »). Détails d'époque : bloc « Variante mobile simplifiée » en fin d'instruments.css ; `main.js` saute la bascule Photo/Description si `m-simple` ; nouvelle `nav.wood-bar` (boutons `.wood-rail-btn` → la logique de bois existante les câble toute seule) insérée dans `.instrument-info`, invisible hors variante ; en variante, les entêtes d'accordéon sont masquées et les sections fermées en `display:none`.
- ⚠️ Les titres des 3 pages ont maintenant un **espace avant chaque `<br>`** (`Alto en fa <br>…`) : la variante masque les `<br>` pour laisser le titre s'écouler — sans l'espace les mots se collaient. Invisible en desktop. Ne pas « nettoyer » ces espaces.
- **Vérifié à 375×812** (alto : barre, bascule Cormier, photo/texte ; hautbois sans barre ; rideau) **et à 1280** (desktop identique, rail vertical intact). Poussé sur GitHub (avec les finitions SEO de la session précédente, qui attendaient la publication).

### 2026-07-23 — Finitions SEO code (canonical, robots.txt/sitemap, Open Graph, JSON-LD)

- **Demande de Simeon** : le site ne remonte pas sur la recherche « Atelier Brandner ». Diagnostic — site en ligne depuis seulement 4 jours (pas encore indexé), pas de Google Business Profile, pas de backlinks (leviers hors-code, voir checklist), **et** les quick wins code de la checklist SEO n'étaient pas encore faits. Ces derniers sont maintenant réglés :
  - **`robots.txt`** (`Allow: /` + référence au sitemap) et **`sitemap.xml`** (10 URLs, priorités 1.0 Accueil → 0.3 pages légales) créés dans `2. HTML/`, copiés à la racine du Staging par `build.sh` (nouvelles lignes de copie explicites, ces fichiers n'étant pas du HTML).
  - **Canonical** (`<link rel="canonical" href="https://atelier-brandner.ch/…">`) sur les 10 pages réelles + le gabarit `_template-stub.html` (placeholder `{{PAGE}}`).
  - **Open Graph + Twitter card** sur toutes les pages (title/description dupliqués, image par défaut `hero-home.webp` sauf biographie.html qui utilise `bio-portrait.webp`) — améliore les partages et donne à Google un signal de contenu supplémentaire.
  - **JSON-LD** : `LocalBusiness` sur contact.html (nom, adresse, tél, email, image) et `Person` sur biographie.html (`worksFor` → le LocalBusiness) — vise le knowledge panel / pack local pour les recherches de marque.
  - **`noindex, follow`** ajouté aux 2 pages légales (mentions-légales, protection-des-données) — hors sujet pour la recherche, `follow` laisse le maillage interne fonctionner.
  - **Titles retravaillés** (Home + atelier.html) pour inclure « Atelier Brandner » — nom du domaine, probable requête de marque — sans toucher au H1 visible ni à l'identité visuelle du site.
  - Build relancé, vérifié en préview staging (robots.txt, sitemap.xml, JSON-LD `contact.html` validé via `JSON.parse`, titres corrects, console propre).
- **Reste (hors code, prioritaire selon la checklist)** : créer la fiche **Google Business Profile** (Christoph Brandner, 15 rue des Gares, Genève) — le vrai levier pour une recherche de marque/locale — et obtenir quelques **backlinks** (annuaires facteurs, festivals, flute-a-bec.com). Soumettre le sitemap à **Google Search Console** une fois le compte créé accélérerait aussi l'indexation.
- **Commité et poussé le 2026-07-23**, dans le même push que la variante m-simple (ci-dessus).

### 2026-07-23 — Corps mobile de toutes les pages (footer-rideau, Atelier, Bio, Contact, cartes Instruments, pages instrument)

Session d'après les maquettes mobiles 43:… / 44:… de Simeon. Tout est sous `@media (max-width: 900px)` ; le desktop est inchangé (vérifié page par page à 1280).

- **Footer-rideau (toutes les pages)** : en mobile le footer **recouvre le site** en glissant par-dessus. Mécanique : `main` passe en `position: sticky` avec un `top` négatif calculé par main.js (`--curtain-top` = 100vh − hauteur du main, ResizeObserver) → le contenu s'épingle quand son bas touche le bas de la fenêtre, et le footer (opaque, bord à bord, `z-index: 30`, filets haut/bas en pseudo-éléments) continue de monter par-dessus. ⚠️ Toute règle qui redonne `position: relative` au main en mobile casse l'effet (le `top` s'applique en relatif → page décalée) — d'où le `position: sticky` re-déclaré dans le bloc mobile d'instruments.css.
- **Atelier (43:581)** : titre condensé 28px ; les **2 « fenêtres »** sont des `figure.atelier-window` (130px, pleine largeur, `clip-path: inset(0)`) contenant une image en `position: fixed` plein écran → l'image ne bouge pas, seule l'ouverture voyage. ⚠️ Ne jamais mettre de transform/filter sur la fenêtre (ça deviendrait le containing block du fixed). Images `atelier_fenetre_01/02.webp` (858×1900, livrées le 2026-07-25 — les JPEG provisoires ont été supprimés). En bas, les **têtes de flûtes glissent de droite à gauche** au défilement (main.js : course de l'entrée en bas de fenêtre jusqu'à l'épinglage du rideau ; depuis le 2026-07-25, **82% de la course** avec un **départ en ease-in cubique** — constantes `SLIDE_END_MARGIN` / `SLIDE_EASE`, voir §3).
- **Biographie (43:597)** : simple empilement (portrait 284×281, nom 28/48, filet, texte 16/30, photo atelier dessous via flex order).
- **Contact (43:608)** : coordonnées 28/48 d'abord (flex order), carte pleine largeur 179px avec **zoom de base ×1,72** (cadrage maquette) **+ zoom lent au défilement** (main.js, +15% max, même double rampe que la page Instruments), hautbois qui déborde du bord droit (123,5%, overflow hidden), filet inter-sections masqué. ⚠️ `align-items: stretch` nécessaire sur `.contact-grid` mobile (le `start` desktop rétrécissait la carte).
- **Instruments — cartes (44:766/777/791)** : en mobile la vue d'ensemble devient **3 cartes plein écran à balayer** (scroll-snap horizontal natif, `scroll-snap-stop: always`), **sans footer ni défilement vertical** (`body:has(.instr-cards)` : overflow hidden, footer masqué). Unité `--k` = (100dvh − barre)/623 → photos et jalons verticaux homothétiques à toute hauteur d'écran ; textes ancrés comme la maquette (left 70%−75.5px). CTA « Découvrir » 138×44 vers chaque page. **3 traits de progression** en bas : l'actif se **remplit de gauche à droite** (span scaleX 0→1, classe .is-active posée par main.js d'après scrollLeft). Ajouter une carte = copier un `article.instr-card` + un trait.
- **Pages instrument (44:873/891 hautbois, 44:880/902 alto ; soprano = gabarit alto)** — ⚠️ **gabarit supprimé du code le 2026-07-25, description conservée pour mémoire** : **deux faces**. Face Photo : grande photo en flux + onglet vertical « Description » docké à droite (pleine hauteur d'écran, ligne orange à sa gauche). Face Texte : onglet gauche avec **miniature en miroir** de la photo (53px, suit le bois affiché), titre 28 condensé, filet, texte 16/30, accordéon des bois en bas (alto/soprano). **Bascule** (main.js, classes sur le main) : `.m-exit` → la **ligne orange glisse à gauche** pendant que la **photo rétrécit et se range dans l'onglet** (transform calculé sur sa position réelle) ; puis `.mode-text` → le **texte entre par la droite** (keyframes 80vw→0) et on **revient en haut de page**. Retour symétrique (la photo repart de l'onglet). `overflow-x: clip` sur le main (les animations débordantes élargissaient le viewport mobile). **Rail des bois → barre horizontale dockée en bas** (fixed, 60px, filet orange au-dessus, Buis/Olivier/Cormier, actif orange — mêmes boutons `.wood-rail-btn`, donc bascule de bois/hash/accordéon inchangés), présente sur les deux faces, recouverte par le footer-rideau ; hautbois sans barre. En mobile le **défilement différencié et l'auto-scroll sont désactivés** (garde `mqInstr` dans main.js, styles inline retirés).
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
