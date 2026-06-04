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
   Scroll su tre pagine.

   Pagina 1 -> 2 : compare il titolo "OPERAZIONE MARADONA (2026)" che
                   sale al centro del viewport (logo, menu e testo
                   restano fissi, lo sfondo è a tutto schermo).

   Pagina 2 -> 3 : lo SFONDO (la fotografia) si rimpicciolisce con
                   un'animazione GSAP e si posiziona in alto a destra,
                   rispettando il margine; il titolo lo segue,
                   rimpicciolendosi e centrandosi sopra la foto; il
                   testo di descrizione si dissolve.

   Lo snap blocca il viewport su ciascuna delle tre pagine.
------------------------------------------------------------------ */

/* Geometria del riquadro finale della fotografia (in alto a destra).
   S = frazione di larghezza viewport occupata dalla foto rimpicciolita
   M = margine dall'angolo in alto a destra (px). */
const M = 48;
const S = 0.37;

const boxW = () => S * window.innerWidth;
const boxH = () => S * window.innerHeight;
/* centro del riquadro finale */
const boxCX = () => window.innerWidth - M - boxW() / 2;
const boxCY = () => M + boxH() / 2;

const tl = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: ".scroll-track",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    invalidateOnRefresh: true,
    snap: {
      snapTo: [0, 0.5, 1],
      duration: { min: 0.2, max: 0.6 },
      ease: "power2.inOut",
    },
  },
});

/* --- Segmento 1 (pagina 1 -> 2): il titolo compare e sale al centro --- */
tl.fromTo(
  ".hero__title",
  { xPercent: -50, yPercent: -50, x: 0, y: 90, opacity: 0 },
  { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 1 },
  0
);

/* --- Segmento 2 (pagina 2 -> 3): la foto si rimpicciolisce in alto a destra,
       il titolo la segue e il testo di descrizione si dissolve. --- */
tl.to(
  ".bg",
  {
    scale: () => S,
    x: () => -M,
    y: () => M,
    ease: "power2.inOut",
  },
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

tl.to(
  ".intro-text",
  { opacity: 0, ease: "none" },
  1
);

window.addEventListener("resize", () => ScrollTrigger.refresh());
