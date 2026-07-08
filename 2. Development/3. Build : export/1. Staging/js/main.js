/* Site Christoph Brandner — JS minimal. */

/* Accordéon des bois (page instrument) :
   un seul volet ouvert à la fois, la photo suit le bois sélectionné. */
document.addEventListener("DOMContentLoaded", () => {
  const woods = document.querySelectorAll(".wood");
  if (!woods.length) return;

  const photo = document.getElementById("instrument-photo");

  // Précharge les photos des autres bois pour un changement instantané
  woods.forEach((wood) => {
    const src = wood.dataset.image;
    if (src && photo && src !== photo.getAttribute("src")) {
      new Image().src = src;
    }
  });

  woods.forEach((wood) => {
    const button = wood.querySelector(".wood-head button");
    button.addEventListener("click", () => {
      if (wood.classList.contains("open")) return;

      woods.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".wood-head button").setAttribute("aria-expanded", "false");
      });
      wood.classList.add("open");
      button.setAttribute("aria-expanded", "true");

      if (photo && wood.dataset.image && photo.getAttribute("src") !== wood.dataset.image) {
        photo.style.opacity = "0";
        const next = new Image();
        next.onload = () => {
          photo.src = wood.dataset.image;
          if (wood.dataset.alt) photo.alt = wood.dataset.alt;
          requestAnimationFrame(() => {
            photo.style.opacity = "1";
          });
        };
        next.src = wood.dataset.image;
      }
    });
  });
});
