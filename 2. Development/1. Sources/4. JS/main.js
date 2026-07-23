/* Site Christoph Brandner — JS minimal.

   Pages instruments (une page par instrument) :
   1. Défilement différencié « ancré » — la photo suit le défilement normal ;
      la colonne texte avance plus lentement, sa course étant calée pour
      qu'elle finisse juste au-dessus du footer quand la page atteint le bas.
   2. Bascule de bois (soprano, alto) — rail vertical + accordéon changent
      l'instrument affiché sur place, en deux temps.
   3. Défilement automatique très lent — la page avance toute seule ; dès que
      l'utilisateur défile lui-même il reprend la main, et le défilement
      automatique ne repart qu'après une pause d'inactivité. */

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Page Instruments (vue d'ensemble) : zoom au défilement -----------
     Chaque photo grossit à mesure qu'elle remonte : échelle 1 en bas de
     fenêtre (ou au chargement pour celles déjà visibles, hautbois compris)
     → +20% quand elle sort par le haut. Deux rampes, on prend la plus
     basse : pView (position dans la fenêtre) et pRise (défilement depuis
     le chargement) — les deux atteignent 1 exactement à la sortie haute.
     Origine haut-gauche (voir instruments-index.css) : le bord haut ne
     bouge pas, les marges de la maquette absorbent la croissance vers le
     bas ; à droite, le hautbois peut dépasser du cadre, clippé par
     overflow sur .instr-index. Le zoom +10% au survol est en CSS, sur le
     wrapper .instr-zoom (il se multiplie avec celui-ci). */

  const figs = document.querySelectorAll(".instr-fig");
  if (figs.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const GROW = 0.2; // agrandissement maximal au défilement (+20%)
    let meta = []; // {el, top0 (position document), h} par figure

    const update = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      meta.forEach((m) => {
        const top = m.top0 - y; // position fenêtre (le scale n'affecte pas le haut)
        const pView = (vh - top) / (vh + m.h); // 0 : entre en bas → 1 : sortie en haut
        const pRise = y / (m.top0 + m.h); // 0 : au chargement → 1 : sortie en haut
        const p = Math.min(1, Math.max(0, Math.min(pView, pRise)));
        m.el.style.transform = "scale(" + (1 + GROW * p).toFixed(4) + ")";
      });
    };

    const measureFigs = () => {
      meta = [];
      figs.forEach((el) => {
        el.style.transform = "none";
      });
      figs.forEach((el) => {
        const rect = el.getBoundingClientRect();
        meta.push({ el, top0: rect.top + window.scrollY, h: rect.height });
      });
      update();
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measureFigs);
    window.addEventListener("load", measureFigs);
    measureFigs();
  }

  /* ---- Menu mobile : ouverture / fermeture animée -----------------------
     Toute l'animation (filet qui descend, logo qui grandit, entrées en
     cascade, et l'inverse à la fermeture) est portée par le CSS via la
     classe .menu-open. Ici on ne fait que basculer cette classe et l'état
     ARIA du bouton. Le voile reste dans le DOM en permanence (fermé, il se
     réduit à la barre du haut) : pas de gestion d'affichage à faire. */

  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) {
    const nav = document.getElementById("site-nav");
    const isOpen = () => document.body.classList.contains("menu-open");

    const setMenu = (open) => {
      document.body.classList.toggle("menu-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    menuToggle.addEventListener("click", () => setMenu(!isOpen()));

    // Échap ferme le menu
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) setMenu(false);
    });

    // Cliquer une entrée ferme le menu (utile pour l'ancre de la page courante)
    if (nav) {
      nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => setMenu(false));
      });
    }
  }

  /* ---- Footer-rideau (mobile) -------------------------------------------
     Sous 900px, layout.css épingle le main en sticky pour que le footer
     glisse par-dessus. Le top nécessaire (100vh − hauteur du main, jamais
     positif) dépend du contenu : on le pose ici en variable CSS et on le
     recalcule quand le main ou la fenêtre change de taille. */

  const curtainMain = document.querySelector("main");
  if (curtainMain) {
    const setCurtain = () => {
      const top = Math.min(0, window.innerHeight - curtainMain.offsetHeight);
      document.documentElement.style.setProperty("--curtain-top", top + "px");
    };
    setCurtain();
    window.addEventListener("resize", setCurtain);
    window.addEventListener("load", setCurtain);
    if ("ResizeObserver" in window) new ResizeObserver(setCurtain).observe(curtainMain);
  }

  /* ---- Atelier (mobile) : glissement des têtes de flûtes -----------------
     L'image, plus large que l'écran, se déplace de droite à gauche pendant
     le défilement. La course démarre quand l'image entre en bas de fenêtre
     et se termine au plus tard quand le main s'épingle (footer-rideau),
     pour que la fin du mouvement reste visible. */

  const slideImg = document.querySelector(".atelier-bottom img");
  if (slideImg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const mqMobile = window.matchMedia("(max-width: 900px)");
    let slideStart = 0;
    let slideEnd = 1;
    let slideTravel = 0;

    const updateSlide = () => {
      if (!slideTravel) return;
      const p = Math.min(1, Math.max(0, (window.scrollY - slideStart) / (slideEnd - slideStart)));
      slideImg.style.transform = "translate3d(" + (-slideTravel * p).toFixed(1) + "px, 0, 0)";
    };

    const measureSlide = () => {
      if (!mqMobile.matches) {
        slideTravel = 0;
        slideImg.style.transform = "";
        return;
      }
      slideImg.style.transform = "none";
      const rect = slideImg.getBoundingClientRect();
      const wrap = slideImg.parentElement.getBoundingClientRect();
      const top0 = rect.top + window.scrollY;
      const vh = window.innerHeight;
      slideTravel = Math.max(0, rect.width - wrap.width);
      slideStart = top0 - vh; // l'image apparaît en bas de la fenêtre
      const pin = curtainMain
        ? curtainMain.offsetTop + curtainMain.offsetHeight - vh
        : Infinity;
      slideEnd = Math.min(top0 + rect.height, Math.max(slideStart + 1, pin));
      updateSlide();
    };

    window.addEventListener("scroll", updateSlide, { passive: true });
    window.addEventListener("resize", measureSlide);
    window.addEventListener("load", measureSlide);
    measureSlide();
  }

  /* ---- Instruments (mobile) : cartes à balayer ---------------------------
     Le balayage lui-même est natif (scroll-snap horizontal). Ici on suit
     seulement la carte visible pour allumer le bon trait de progression —
     le remplissage gauche→droite est la transition CSS de .is-active. */

  const cardsTrack = document.querySelector(".cards-track");
  if (cardsTrack) {
    const lines = document.querySelectorAll(".cards-line");
    let activeCard = 0;

    const syncLines = () => {
      const i = Math.max(
        0,
        Math.min(lines.length - 1, Math.round(cardsTrack.scrollLeft / cardsTrack.clientWidth))
      );
      if (i === activeCard) return;
      activeCard = i;
      lines.forEach((line, j) => line.classList.toggle("is-active", j === i));
    };

    cardsTrack.addEventListener("scroll", syncLines, { passive: true });
  }

  /* ---- Contact (mobile) : zoom lent de la carte au défilement ------------
     La carte grossit doucement (jusqu'à +15%) à mesure qu'elle remonte dans
     la fenêtre — même principe de double rampe que le zoom de la page
     Instruments : échelle 1 en bas de fenêtre ET au chargement. Le cadre
     .contact-map-link (overflow hidden) contient le débord. */

  const mapImg = document.querySelector(".contact-map");
  if (mapImg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const mqMap = window.matchMedia("(max-width: 900px)");
    const MAP_GROW = 0.15;
    const MAP_BASE = 1.72; // cadrage de base de la maquette (contact.css)
    let mapTop0 = 0;
    let mapH = 1;

    const updateMap = () => {
      if (!mqMap.matches) return;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const top = mapTop0 - y;
      const pView = (vh - top) / (vh + mapH);
      const pRise = y / (mapTop0 + mapH);
      const p = Math.min(1, Math.max(0, Math.min(pView, pRise)));
      mapImg.style.transform = "scale(" + (MAP_BASE * (1 + MAP_GROW * p)).toFixed(4) + ")";
    };

    const measureMap = () => {
      if (!mqMap.matches) {
        mapImg.style.transform = "";
        return;
      }
      const rect = mapImg.parentElement.getBoundingClientRect();
      mapTop0 = rect.top + window.scrollY;
      mapH = rect.height;
      updateMap();
    };

    window.addEventListener("scroll", updateMap, { passive: true });
    window.addEventListener("resize", measureMap);
    window.addEventListener("load", measureMap);
    measureMap();
  }

  const panel = document.querySelector(".instrument-panel");
  if (!panel) return;

  /* ---- Défilement différencié du texte (modèle ancré) -------------------
     Le panneau passe en position:fixed : le défilement natif ne le déplace
     plus, seul notre transform le fait. Sans cela, le compositeur fait
     défiler le panneau à pleine vitesse puis le transform le recale une
     frame plus tard → saccades (très visibles sur le hautbois où le texte
     ne bouge qu'à ~14% de la vitesse). En fixed, l'amplitude d'un éventuel
     retard n'est que la petite course du texte. Sans JS, le CSS (absolute)
     garde un défilement normal.
     Modèle affine ancré : shift(y) = anchorShift + (y − anchorY) × slope.
     Quand la hauteur du panneau change (accordéon des bois), le recalage
     ancre la position visuelle courante — le panneau ne bouge pas d'un
     pixel, seule la pente restante jusqu'au footer change. */

  const footer = document.querySelector(".site-footer");
  const END_GAP = 60; // espace gardé entre le bas du texte et le footer en fin de course
  const PANEL_TOP = 207; // position du panneau à scroll 0 (CSS : 152 + menu 55)

  /* En mobile (≤ 900px), le gabarit Photo/Description (instruments.css)
     remplace le défilement différencié : le panneau reste en flux normal
     et le CSS mobile le pilote — aucun style inline. */
  const mqInstr = window.matchMedia("(max-width: 900px)");

  const setPanelDesktopStyles = () => {
    if (mqInstr.matches) {
      panel.style.position = "";
      panel.style.top = "";
      panel.style.transform = "";
    } else {
      panel.style.position = "fixed";
      panel.style.top = PANEL_TOP + "px";
    }
  };
  setPanelDesktopStyles();
  mqInstr.addEventListener("change", () => {
    setPanelDesktopStyles();
    if (!mqInstr.matches) calibrate();
  });

  let scrollMax = 1;
  let measuredDocH = 0; // hauteur du document lors de la dernière mesure
  let anchorY = 0; // scroll au dernier recalage
  let anchorShift = 0; // translate du panneau à ce moment-là
  let slope = 0; // px de translate par px de scroll (≤ 0 : jamais vers le bas)
  let calibrated = false;

  const clampY = (y) => Math.max(0, Math.min(y, scrollMax));
  const shiftAt = (y) => anchorShift + (clampY(y) - anchorY) * slope;

  const applyShift = () => {
    if (mqInstr.matches) return;
    panel.style.transform = "translate3d(0, " + shiftAt(window.scrollY) + "px, 0)";
  };

  const calibrate = () => {
    if (mqInstr.matches) return;
    measuredDocH = document.documentElement.scrollHeight;
    scrollMax = Math.max(1, measuredDocH - window.innerHeight);
    // Premier passage : ancre en haut de page (course linéaire classique) ;
    // ensuite : ancre sur la position courante → aucun déplacement visible
    const y = calibrated ? clampY(window.scrollY) : 0;
    const current = calibrated ? shiftAt(y) : 0;
    const panelH = panel.getBoundingClientRect().height; // le translate n'affecte pas la hauteur
    const footerTop = footer
      ? footer.getBoundingClientRect().top + window.scrollY
      : measuredDocH;
    // Translate final : bas du panneau END_GAP au-dessus du footer en bas de page
    let end = footerTop - scrollMax - END_GAP - (PANEL_TOP + panelH);
    end = Math.min(end, current); // le panneau ne redescend jamais
    slope = scrollMax - y > 1 ? (end - current) / (scrollMax - y) : 0;
    anchorY = y;
    anchorShift = current;
    calibrated = true;
    applyShift();
  };

  // Directement dans l'événement (pas de rAF différé) : le transform part
  // dans la même frame que le défilement. Si la hauteur de page a changé
  // depuis la mesure (police/image tardive), on remesure d'abord.
  window.addEventListener(
    "scroll",
    () => {
      if (document.documentElement.scrollHeight !== measuredDocH) calibrate();
      else applyShift();
    },
    { passive: true }
  );

  window.addEventListener("resize", calibrate);
  window.addEventListener("load", calibrate); // hauteurs définitives une fois tout chargé
  calibrate();

  /* ---- Pages à bois multiples : rail vertical, accordéon, bascule -------
     (soprano.html, alto.html — main porte .instrument--bois). La bascule en
     deux temps : 1. l'ancienne photo s'éloigne (scale 0.7 + fondu, ease-out,
     origine posée au centre de la fenêtre) ; 2. la nouvelle arrive du bas en
     plus grand (scale 1.4) et se pose. Rail et accordéon pilotent la même
     bascule ; le recalage du panneau après l'accordéon est ancré (aucun
     saut). Lien profond : #buis / #olivier / #cormier. */

  const media = document.querySelector(".instrument-media");
  const woodImgs = media ? media.querySelectorAll("img[data-wood]") : [];
  if (woodImgs.length) {
    const imgs = {};
    woodImgs.forEach((img) => {
      imgs[img.dataset.wood] = img;
    });
    const railBtns = document.querySelectorAll(".wood-rail-btn");
    const sections = document.querySelectorAll(".wood-acc");

    let current = media.querySelector("img.is-active").dataset.wood;
    let enterTimer = null;
    const LEAVE_MS = 450; // = durée de .is-leaving : la nouvelle photo attend la fin

    const setStates = (wood) => {
      railBtns.forEach((btn) => {
        if (btn.dataset.wood === wood) btn.setAttribute("aria-current", "true");
        else btn.removeAttribute("aria-current");
      });
      sections.forEach((sec) => {
        const open = sec.dataset.wood === wood;
        sec.classList.toggle("is-open", open);
        sec.querySelector(".acc-head").setAttribute("aria-expanded", open);
      });
      // Le panneau change de hauteur : recalage ancré une fois l'accordéon posé
      setTimeout(calibrate, 500);
    };

    const switchWood = (wood) => {
      if (wood === current || !imgs[wood]) return;
      const oldImg = imgs[current];
      const newImg = imgs[wood];

      // Clic rapide : on purge la bascule en cours
      clearTimeout(enterTimer);
      Object.values(imgs).forEach((img) => {
        if (img !== oldImg) img.classList.remove("is-active", "is-entering", "is-leaving");
      });

      // Origine du transform : le centre actuel de la fenêtre, pour que la
      // photo « s'éloigne » depuis ce que l'on regarde
      const rect = media.getBoundingClientRect();
      const originY = Math.max(0, Math.min(window.innerHeight / 2 - rect.top, rect.height));
      oldImg.style.transformOrigin = "50% " + originY + "px";
      newImg.style.transformOrigin = "50% " + originY + "px";

      // 1. l'ancienne s'éloigne…
      oldImg.classList.remove("is-active", "is-entering");
      oldImg.classList.add("is-leaving");

      // 2. …puis la nouvelle arrive
      enterTimer = setTimeout(() => {
        oldImg.classList.remove("is-leaving");
        newImg.classList.add("is-entering");
        void newImg.offsetWidth; // fige l'état de départ (reflow forcé, pas de rAF)
        newImg.classList.remove("is-entering");
        newImg.classList.add("is-active");
      }, LEAVE_MS);

      current = wood;
      history.replaceState(null, "", "#" + wood);
      setStates(wood);

      // Onglet photo mobile : la miniature suit le bois affiché
      const tabImg = document.querySelector(".side-btn--photo img");
      if (tabImg) tabImg.src = newImg.getAttribute("src");
    };

    railBtns.forEach((btn) => {
      btn.addEventListener("click", () => switchWood(btn.dataset.wood));
    });
    sections.forEach((sec) => {
      sec.querySelector(".acc-head").addEventListener("click", () => switchWood(sec.dataset.wood));
    });

    // Lien profond : état posé sans animation (on est avant la première
    // peinture, les transitions CSS ne jouent pas encore)
    const hashWood = location.hash.slice(1);
    if (imgs[hashWood] && hashWood !== current) {
      imgs[current].classList.remove("is-active");
      imgs[hashWood].classList.add("is-active");
      current = hashWood;
      setStates(hashWood);
    }
  }

  /* ---- Bascule mobile Photo / Description --------------------------------
     Trois temps orchestrés ici, animations dans instruments.css :
     1. clic « Description » → .m-exit : la ligne orange part vers la gauche,
        l'onglet s'efface, la photo rétrécit et vient se poser sur l'onglet
        gauche (transform calculé sur sa position réelle) ;
     2. après la course → .mode-text : le texte entre par la droite, la
        miniature apparaît dans l'onglet, retour en haut de page ;
     3. clic sur la miniature → retour : la photo repart de l'onglet vers sa
        place (mêmes cotes, transition inversée). */

  const dock = document.querySelector(".side-dock");
  const instrMain = document.querySelector("main.instrument");
  // Variante mobile simplifiée (m-simple) : pas de bascule Photo/Description —
  // le CSS masque les onglets, on ne branche donc rien.
  if (dock && instrMain && !instrMain.classList.contains("m-simple")) {
    const descBtn = dock.querySelector(".side-btn--desc");
    const photoBtn = dock.querySelector(".side-btn--photo");
    const mediaBox = document.querySelector(".instrument-media");
    const MORPH_MS = 560; // = transition 0.55s de .is-morph
    const activeImg = () =>
      mediaBox.querySelector("img.is-active") || mediaBox.querySelector("img");

    // Translation + échelle amenant l'image sur l'onglet gauche (53px de
    // large, centrée verticalement sous la barre)
    const tabTransform = (rect) => {
      const s = 53 / rect.width;
      const barH = 44;
      const top = barH + (window.innerHeight - barH - rect.height * s) / 2;
      return "translate(" + (9.5 - rect.left) + "px, " + (top - rect.top) + "px) scale(" + s.toFixed(4) + ")";
    };

    let morphTimer = null;

    descBtn.addEventListener("click", () => {
      const img = activeImg();
      clearTimeout(morphTimer);
      instrMain.classList.add("m-exit"); // la ligne glisse, « Description » s'efface
      img.classList.add("is-morph");
      void img.offsetWidth;
      img.style.transform = tabTransform(img.getBoundingClientRect());
      morphTimer = setTimeout(() => {
        instrMain.classList.remove("m-exit");
        instrMain.classList.add("mode-text");
        img.classList.remove("is-morph");
        img.style.transform = "";
        window.scrollTo(0, 0); // on repart du titre
      }, MORPH_MS);
    });

    photoBtn.addEventListener("click", () => {
      clearTimeout(morphTimer);
      instrMain.classList.remove("mode-text"); // photo réaffichée, ligne repart à droite
      window.scrollTo(0, 0);
      const img = activeImg();
      img.classList.add("is-morph");
      img.style.transition = "none"; // état de départ posé sans animation
      img.style.transform = tabTransform(img.getBoundingClientRect());
      void img.offsetWidth;
      img.style.transition = "";
      img.style.transform = ""; // la photo grandit vers sa place
      morphTimer = setTimeout(() => img.classList.remove("is-morph"), MORPH_MS);
    });
  }

  /* ---- Défilement automatique ------------------------------------------- */

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (mqInstr.matches) return; // pas de défilement automatique en mobile

  const SPEED = 22; // px par seconde
  const RESUME_DELAY = 4000; // d'inactivité avant de reprendre la descente

  let pos = 0;
  let lastTime = null;
  let rafId = null;
  let resumeTimer = null;

  const step = (time) => {
    // La page a bougé autrement (barre de défilement…) : on laisse la main
    if (Math.abs(window.scrollY - pos) > 2) {
      pause();
      return;
    }
    if (lastTime !== null) {
      // dt borné : pas de bond au retour d'un onglet inactif (rAF suspendu)
      const dt = Math.min(time - lastTime, 100);
      pos = Math.min(pos + (SPEED * dt) / 1000, scrollMax);
      window.scrollTo(0, pos);
      if (pos >= scrollMax) {
        rafId = null; // bas de page atteint : on s'arrête
        return;
      }
    }
    lastTime = time;
    rafId = requestAnimationFrame(step);
  };

  const start = () => {
    pos = window.scrollY;
    lastTime = null;
    if (rafId === null) rafId = requestAnimationFrame(step);
  };

  const pause = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(start, RESUME_DELAY);
  };

  ["wheel", "touchstart", "touchmove", "keydown", "pointerdown"].forEach((type) => {
    window.addEventListener(type, pause, { passive: true });
  });

  start();
});
