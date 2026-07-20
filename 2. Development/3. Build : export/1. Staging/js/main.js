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

  panel.style.position = "fixed";
  panel.style.top = PANEL_TOP + "px";

  let scrollMax = 1;
  let measuredDocH = 0; // hauteur du document lors de la dernière mesure
  let anchorY = 0; // scroll au dernier recalage
  let anchorShift = 0; // translate du panneau à ce moment-là
  let slope = 0; // px de translate par px de scroll (≤ 0 : jamais vers le bas)
  let calibrated = false;

  const clampY = (y) => Math.max(0, Math.min(y, scrollMax));
  const shiftAt = (y) => anchorShift + (clampY(y) - anchorY) * slope;

  const applyShift = () => {
    panel.style.transform = "translate3d(0, " + shiftAt(window.scrollY) + "px, 0)";
  };

  const calibrate = () => {
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

  /* ---- Défilement automatique ------------------------------------------- */

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
