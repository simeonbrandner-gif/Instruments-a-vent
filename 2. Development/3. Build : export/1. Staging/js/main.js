/* Site Christoph Brandner — JS minimal.

   Pages instruments (une page par bois) :
   1. Défilement différencié — la photo suit le défilement normal ; la colonne
      texte avance plus lentement, sa course étant calée pour qu'elle finisse
      juste au-dessus du footer quand la page atteint le bas.
   2. Défilement automatique très lent — la page avance toute seule ; dès que
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

  /* ---- Défilement différencié du texte ----------------------------------
     Le panneau passe en position:fixed : le défilement natif ne le déplace
     plus, seul notre transform le fait. Sans cela, le compositeur fait
     défiler le panneau à pleine vitesse puis le transform le recale une
     frame plus tard → saccades (très visibles sur le hautbois où le texte
     ne bouge qu'à ~14% de la vitesse). En fixed, l'amplitude d'un éventuel
     retard n'est que la petite course du texte. Sans JS, le CSS (absolute)
     garde un défilement normal. */

  const footer = document.querySelector(".site-footer");
  const END_GAP = 60; // espace gardé entre le bas du texte et le footer en fin de course
  const PANEL_TOP = 207; // position du panneau à scroll 0 (CSS : 152 + menu 55)

  panel.style.position = "fixed";
  panel.style.top = PANEL_TOP + "px";

  let scrollMax = 1;
  let rate = 0; // vitesse du texte, en fraction de la vitesse de la page
  let measuredDocH = 0; // hauteur du document lors de la dernière mesure

  const applyShift = () => {
    const y = Math.max(0, Math.min(window.scrollY, scrollMax));
    panel.style.transform = "translate3d(0, " + -(y * rate) + "px, 0)";
  };

  const measure = () => {
    panel.style.transform = "none";
    measuredDocH = document.documentElement.scrollHeight;
    scrollMax = Math.max(1, measuredDocH - window.innerHeight);
    const panelH = panel.getBoundingClientRect().height;
    const footerTop = footer
      ? footer.getBoundingClientRect().top + window.scrollY
      : measuredDocH;
    // Descente restante du panneau (en coordonnées document) jusqu'au footer
    const slack = Math.max(0, Math.min(scrollMax, footerTop - END_GAP - (PANEL_TOP + panelH)));
    rate = (scrollMax - slack) / scrollMax;
    applyShift();
  };

  // Directement dans l'événement (pas de rAF différé) : le transform part
  // dans la même frame que le défilement. Si la hauteur de page a changé
  // depuis la mesure (police/image tardive), on remesure d'abord.
  window.addEventListener(
    "scroll",
    () => {
      if (document.documentElement.scrollHeight !== measuredDocH) measure();
      else applyShift();
    },
    { passive: true }
  );

  window.addEventListener("resize", measure);
  window.addEventListener("load", measure); // hauteurs définitives une fois tout chargé
  measure();

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
