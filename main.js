gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Entrata: animazione iniziale della prima scritta (reveal a maschera,
   riga per riga) insieme alla comparsa di logo e menu.
------------------------------------------------------------------ */
const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

intro
  .from(".intro-text .line > span", {
    yPercent: 120,
    duration: 1.1,
    stagger: 0.15,
    delay: 0.2,
  })
  .from(
    ".intro-text",
    { opacity: 0, duration: 0.6, ease: "none" },
    0
  )
  .from(
    ".logo, .menu",
    { opacity: 0, y: 12, duration: 1, ease: "power2.out" },
    0.45
  );

/* ------------------------------------------------------------------
   Scroll su sette pagine (sei segmenti).

   1 -> 2 : compare il titolo "OPERAZIONE MARADONA (2026)" che sale al
            centro del viewport.
   2 -> 3 : la foto hero si rimpicciolisce in alto a destra e il titolo
            la segue, centrandosi sopra la foto.
   3 -> 4 : (ABOUT) la foto b/n e il testo about appaiono; nel frattempo
            il testo "iconografia…" si dissolve e il titolo + la sua foto
            scompaiono.
   4 -> 5 : (GALLERY, ingresso) il testo about si alza e scompare con la
            foto b/n; appaiono due foto che dividono la pagina a metà.
   5 -> 6 : (GALLERY) le due colonne scorrono in direzioni opposte verso
            la seconda coppia di foto (sx dal basso, dx dall'alto).
   6 -> 7 : (GALLERY) si scorre fino alla terza coppia di foto.

   Lo snap blocca il viewport su ciascuna delle sette pagine.
------------------------------------------------------------------ */

/* Geometria del riquadro finale della fotografia hero (in alto a destra).
   S = frazione di larghezza viewport occupata dalla foto rimpicciolita
   M = margine dall'angolo in alto a destra (px). */
const M = 48;
const S = 0.37;

const boxW = () => S * window.innerWidth;
const boxH = () => S * window.innerHeight;
const boxCX = () => window.innerWidth - M - boxW() / 2;
const boxCY = () => M + boxH() / 2;

/* La colonna destra della gallery parte dal basso (mostra la prima coppia). */
gsap.set('.gallery__track[data-col="right"]', { yPercent: -66.667 });

const SEGMENTS = 6;
const snapTo = Array.from({ length: SEGMENTS + 1 }, (_, i) => i / SEGMENTS);

const tl = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: ".scroll-track",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    invalidateOnRefresh: true,
    snap: {
      snapTo,
      duration: { min: 0.2, max: 0.6 },
      ease: "power2.inOut",
    },
  },
});

/* --- Segmento 1: il titolo compare e sale al centro --- */
tl.fromTo(
  ".hero__title",
  { xPercent: -50, yPercent: -50, x: 0, y: 90, opacity: 0 },
  { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 1 },
  0
);

/* --- Segmento 2: la foto hero si rimpicciolisce in alto a destra --- */
tl.to(
  ".bg",
  { scale: () => S, x: () => -M, y: () => M, ease: "power2.inOut" },
  1
);
tl.to(
  ".hero__title",
  {
    x: () => boxCX() - window.innerWidth / 2,
    y: () => boxCY() - window.innerHeight / 2,
    fontSize: () => (boxW() / 378) * 60,
    ease: "power2.inOut",
  },
  1
);

/* --- Segmento 3 (ABOUT): foto b/n + testo about appaiono; "iconografia"
       sparisce; titolo e foto hero scompaiono --- */
tl.to(".about-bg", { opacity: 1 }, 2);
tl.fromTo(
  ".about-text",
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, ease: "power2.out" },
  2
);
tl.to(".intro-text", { opacity: 0 }, 2);
tl.to(
  ".bg",
  { y: () => M - window.innerHeight, opacity: 0, ease: "power2.in" },
  2
);
tl.to(".hero__title", { y: "-=350", opacity: 0, ease: "power2.in" }, 2);

/* --- Segmento 4 (GALLERY ingresso): il testo about e la foto b/n si
       alzano e scompaiono; la gallery (due colonne) appare --- */
tl.to(".about-text", { yPercent: -120, opacity: 0, ease: "power2.in" }, 3);
tl.to(".about-bg", { yPercent: -100, opacity: 0, ease: "power2.in" }, 3);
tl.to(".gallery-section", { opacity: 1, ease: "power2.out" }, 3);

/* --- Segmento 5 (GALLERY): scorrimento verso la seconda coppia --- */
tl.fromTo(
  '.gallery__track[data-col="left"]',
  { yPercent: 0 },
  { yPercent: -33.333 },
  4
);
tl.fromTo(
  '.gallery__track[data-col="right"]',
  { yPercent: -66.667 },
  { yPercent: -33.333 },
  4
);

/* --- Segmento 6 (GALLERY): scorrimento verso la terza coppia --- */
tl.fromTo(
  '.gallery__track[data-col="left"]',
  { yPercent: -33.333 },
  { yPercent: -66.667 },
  5
);
tl.fromTo(
  '.gallery__track[data-col="right"]',
  { yPercent: -33.333 },
  { yPercent: 0 },
  5
);

/* ------------------------------------------------------------------
   Menu: voce attiva in base alla sezione. La voce passa da "/" a "_"
   con un'animazione GSAP a "rullo" (slot) + cambio colore.
------------------------------------------------------------------ */
const menuLinks = {
  about: document.querySelector(".menu a.about"),
  gallery: document.querySelector(".menu a.gallery"),
};

/* Stato iniziale dei marker: "/" visibile, "_" pronto sotto la finestra. */
Object.values(menuLinks).forEach((a) => {
  if (!a) return;
  gsap.set(a.querySelector(".underscore"), { yPercent: 110, opacity: 0 });
});

function animateMarker(link, active) {
  if (!link) return;
  const slash = link.querySelector(".slash");
  const underscore = link.querySelector(".underscore");
  gsap.killTweensOf([link, slash, underscore]);

  gsap.to(link, {
    color: active ? "#FFFFFF" : "#8DC5D9",
    duration: 0.45,
    ease: "power2.out",
  });
  gsap.to(slash, {
    yPercent: active ? -110 : 0,
    opacity: active ? 0 : 1,
    duration: 0.5,
    ease: active ? "back.in(2)" : "back.out(2)",
  });
  gsap.to(underscore, {
    yPercent: active ? 0 : 110,
    opacity: active ? 1 : 0,
    duration: 0.5,
    ease: active ? "back.out(2)" : "back.in(2)",
  });
}

let activeSection = null;
function setActiveSection(section) {
  if (section === activeSection) return;
  if (menuLinks[activeSection]) animateMarker(menuLinks[activeSection], false);
  activeSection = section;
  if (menuLinks[section]) animateMarker(menuLinks[section], true);
}

/* La voce ABOUT si attiva quando appare il testo about; GALLERY quando
   entriamo nella sezione gallery (progress calcolato sui 6 segmenti). */
ScrollTrigger.create({
  trigger: ".scroll-track",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    const p = self.progress;
    let section = null;
    if (p >= 2.4 / SEGMENTS && p < 3.4 / SEGMENTS) section = "about";
    else if (p >= 3.4 / SEGMENTS) section = "gallery";
    setActiveSection(section);
  },
});

window.addEventListener("resize", () => ScrollTrigger.refresh());
