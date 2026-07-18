/* Site Christoph Brandner — JS minimal.

   Pages instruments (une page par bois) :
   1. Défilement différencié — la photo suit le défilement normal ; la colonne
      texte avance plus lentement, sa course étant calée pour qu'elle finisse
      juste au-dessus du footer quand la page atteint le bas.
   2. Défilement automatique très lent — la page avance toute seule ; dès que
      l'utilisateur défile lui-même il reprend la main, et le défilement
      automatique ne repart qu'après une pause d'inactivité. */

document.addEventListener("DOMContentLoaded", () => {
  const panel = document.querySelector(".instrument-panel");
  if (!panel) return;

  /* ---- Défilement différencié du texte ---------------------------------- */

  const footer = document.querySelector(".site-footer");
  const END_GAP = 60; // espace gardé entre le bas du texte et le footer en fin de course

  let scrollMax = 1;
  let slack = 0; // descente totale du panneau sur toute la hauteur de page (px)

  const applyShift = () => {
    const y = Math.max(0, Math.min(window.scrollY, scrollMax));
    panel.style.transform = "translate3d(0, " + (slack * y) / scrollMax + "px, 0)";
  };

  const measure = () => {
    panel.style.transform = "none";
    scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const panelBottom = panel.getBoundingClientRect().bottom + window.scrollY;
    const footerTop = footer
      ? footer.getBoundingClientRect().top + window.scrollY
      : document.documentElement.scrollHeight;
    slack = Math.max(0, Math.min(scrollMax, footerTop - END_GAP - panelBottom));
    applyShift();
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        applyShift();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", measure);
  window.addEventListener("load", measure); // hauteurs définitives une fois tout chargé
  measure();

  /* ---- Défilement automatique ------------------------------------------- */

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const SPEED = 22; // px par seconde
  const START_DELAY = 2500; // avant le premier départ
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

  resumeTimer = setTimeout(start, START_DELAY);
});
