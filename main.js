gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
   Scroll su undici pagine (dieci segmenti), senza scroll-to-snap.

   1 : compare il titolo "OPERAZIONE MARADONA (2026)" che sale al centro.
   2 : la foto hero si rimpicciolisce in alto a destra e il titolo la segue.
   3 : (ABOUT) foto b/n + testo about appaiono; "iconografia" si dissolve
       e titolo + foto hero scompaiono.
   4 : (ABOUT) la foto b/n si alza e scompare, il testo about RESTA sul nero.
   5 : (GALLERY ingresso) il testo about si alza e scompare; appaiono due
       colonne di foto.
   6 : (GALLERY) scorrimento opposto verso la seconda coppia.
   7 : (GALLERY) scorrimento fino alla terza coppia.
   8 : (TEAM ingresso) la gallery si alza e scompare; appare il team con
       "creative directors" che sta per entrare dal margine inferiore.
   9 : (TEAM) i crediti scorrono verticalmente verso l'alto.
  10 : (MAPS) il team si alza e scompare, appare il footer "CERCA DIEGO".
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

/* TEAM: il track parte spinto in basso ("creative directors" che sta per
   entrare dal margine inferiore) e scorre verso l'alto fino a mostrare
   l'ultima riga. Valori in px, ricalcolati su resize. */
const teamTrack = document.querySelector(".team-track");
const teamStart = () => window.innerHeight * 0.8;
const teamEnd = () =>
  -(teamTrack.offsetHeight - window.innerHeight);
gsap.set(".team-track", { y: teamStart });

const SEGMENTS = 10;

const tl = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: ".scroll-track",
    start: "top top",
    end: "bottom bottom",
    scrub: 1, // smoothing: scorrimento più morbido, meno scattoso
    invalidateOnRefresh: true,
  },
});

/* --- Segmento 1: il titolo compare e sale al centro --- */
tl.fromTo(
  ".hero__title",
  { xPercent: -50, yPercent: -50, x: 0, y: 90, opacity: 0 },
  { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 1, ease: "power2.out" },
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
tl.to(".about-bg", { opacity: 1, ease: "power1.inOut" }, 2);
tl.fromTo(
  ".about-text",
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, ease: "power2.out" },
  2
);
tl.to(".intro-text", { opacity: 0, ease: "power1.out" }, 2);
tl.to(
  ".bg",
  { y: () => M - window.innerHeight, opacity: 0, ease: "power2.in" },
  2
);
tl.to(".hero__title", { y: "-=350", opacity: 0, ease: "power2.in" }, 2);

/* --- Segmento 4 (ABOUT): la foto b/n si alza e scompare, il testo resta --- */
tl.to(".about-bg", { yPercent: -100, opacity: 0, ease: "power2.inOut" }, 3);

/* --- Segmento 5 (GALLERY ingresso): il testo about si alza e scompare;
       la gallery (due colonne) appare --- */
tl.to(".about-text", { yPercent: -120, opacity: 0, ease: "power2.in" }, 4);
tl.to(".gallery-section", { opacity: 1, ease: "power2.out" }, 4);

/* --- Segmento 6 (GALLERY): scorrimento verso la seconda coppia --- */
tl.fromTo(
  '.gallery__track[data-col="left"]',
  { yPercent: 0 },
  { yPercent: -33.333, ease: "power2.inOut" },
  5
);
tl.fromTo(
  '.gallery__track[data-col="right"]',
  { yPercent: -66.667 },
  { yPercent: -33.333, ease: "power2.inOut" },
  5
);

/* --- Segmento 7 (GALLERY): scorrimento verso la terza coppia --- */
tl.fromTo(
  '.gallery__track[data-col="left"]',
  { yPercent: -33.333 },
  { yPercent: -66.667, ease: "power2.inOut" },
  6
);
tl.fromTo(
  '.gallery__track[data-col="right"]',
  { yPercent: -33.333 },
  { yPercent: 0, ease: "power2.inOut" },
  6
);

/* --- Segmento 8 (TEAM ingresso): la gallery si alza e scompare, appare la
       sezione team con "creative directors" che entra dal basso --- */
tl.to(".gallery-section", { yPercent: -100, opacity: 0, ease: "power2.inOut" }, 7);
tl.to(".team-section", { opacity: 1, ease: "power2.out" }, 7);

/* --- Segmento 9 (TEAM): i crediti scorrono verticalmente verso l'alto
       (parte da metà segmento 8, dura due segmenti) --- */
tl.fromTo(
  ".team-track",
  { y: teamStart },
  { y: teamEnd, ease: "none", duration: 2 },
  7
);

/* --- Segmento 10 (MAPS): il team si alza e scompare, appare il footer --- */
tl.to(".team-section", { yPercent: -100, opacity: 0, ease: "power2.inOut" }, 9);
tl.fromTo(
  ".footer-section",
  { opacity: 0 },
  { opacity: 1, ease: "power2.out" },
  9
);
tl.fromTo(
  ".footer-title",
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, ease: "power2.out" },
  9
);

/* ------------------------------------------------------------------
   Menu: voce attiva in base alla sezione. Il marker passa da "/" a "_"
   con una dissolvenza/scorrimento GSAP morbida + cambio colore.
------------------------------------------------------------------ */
const menuLinks = {
  about: document.querySelector(".menu a.about"),
  gallery: document.querySelector(".menu a.gallery"),
  team: document.querySelector(".menu a.team"),
  maps: document.querySelector(".menu a.maps"),
};

/* Stato iniziale dei marker: "/" visibile, "_" pronto poco più in basso. */
Object.values(menuLinks).forEach((a) => {
  if (!a) return;
  gsap.set(a.querySelector(".slash"), { yPercent: 0, autoAlpha: 1 });
  gsap.set(a.querySelector(".underscore"), { yPercent: 60, autoAlpha: 0 });
});

function animateMarker(link, active) {
  if (!link) return;
  const slash = link.querySelector(".slash");
  const underscore = link.querySelector(".underscore");
  gsap.killTweensOf([link, slash, underscore]);

  gsap.to(link, {
    color: active ? "#FFFFFF" : "#8DC5D9",
    duration: 0.4,
    ease: "power2.out",
  });
  gsap.to(slash, {
    yPercent: active ? -60 : 0,
    autoAlpha: active ? 0 : 1,
    duration: 0.4,
    ease: "power2.inOut",
  });
  gsap.to(underscore, {
    yPercent: active ? 0 : 60,
    autoAlpha: active ? 1 : 0,
    duration: 0.4,
    ease: "power2.inOut",
  });
}

let activeSection = null;
function setActiveSection(section) {
  if (section === activeSection) return;
  if (menuLinks[activeSection]) animateMarker(menuLinks[activeSection], false);
  activeSection = section;
  if (menuLinks[section]) animateMarker(menuLinks[section], true);
}

/* Attivazione voci di menu in base al progress (su 10 segmenti). */
ScrollTrigger.create({
  trigger: ".scroll-track",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    const p = self.progress;
    let section = null;
    if (p >= 2.6 / SEGMENTS && p < 4.5 / SEGMENTS) section = "about";
    else if (p >= 4.5 / SEGMENTS && p < 7.3 / SEGMENTS) section = "gallery";
    else if (p >= 7.3 / SEGMENTS && p < 9.3 / SEGMENTS) section = "team";
    else if (p >= 9.3 / SEGMENTS) section = "maps";
    setActiveSection(section);
  },
});

/* ------------------------------------------------------------------
   Click sul menu: scroll animato fino alla sezione selezionata.
   Per ogni voce definiamo il progress (0..1) in cui la sezione è a video;
   lo convertiamo nella posizione di scroll della timeline.
------------------------------------------------------------------ */
const SECTION_PROGRESS = {
  about: 3 / SEGMENTS,    // about con foto + testo
  gallery: 5 / SEGMENTS,  // prima coppia di foto
  team: 8.6 / SEGMENTS,   // crediti in vista
  maps: 1,                // footer "cerca diego"
};

Object.entries(menuLinks).forEach(([key, link]) => {
  if (!link) return;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const st = tl.scrollTrigger;
    const y = st.start + SECTION_PROGRESS[key] * (st.end - st.start);
    gsap.to(window, {
      scrollTo: { y, autoKill: false },
      duration: 1.2,
      ease: "power2.inOut",
    });
  });
});

window.addEventListener("resize", () => ScrollTrigger.refresh());
