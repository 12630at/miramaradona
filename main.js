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
   Scroll su cinque pagine.

   Pag. 1 -> 2 : compare il titolo "OPERAZIONE MARADONA (2026)" che
                 sale al centro del viewport (logo, menu e testo
                 restano fissi, lo sfondo è a tutto schermo).

   Pag. 2 -> 3 : lo SFONDO hero si rimpicciolisce con un'animazione GSAP
                 e si posiziona in alto a destra, rispettando il margine;
                 il titolo lo segue rimpicciolendosi e centrandosi sopra
                 la foto. Il testo "iconografia del mito argentino…"
                 RIMANE al suo posto.

   Pag. 3 -> 4 : (ABOUT) la foto b/n a tutto schermo e il testo about
                 appaiono gradualmente fino a fermarsi in posizione.

   Pag. 4 -> 5 : (GALLERY) la foto b/n si alza e scompare insieme alla
                 foto hero e al titolo in alto a destra, mentre il testo
                 about resta sullo sfondo nero.

   Lo snap blocca il viewport su ciascuna delle cinque pagine.
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
      snapTo: [0, 0.25, 0.5, 0.75, 1],
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

/* --- Segmento 2 (pag. 2 -> 3): la foto hero si rimpicciolisce in alto a
       destra e il titolo la segue. Il testo iniziale resta fermo. --- */
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

/* --- Segmento 3 (pag. 3 -> 4, ABOUT): la foto b/n e il testo about
       appaiono gradualmente; contemporaneamente il titolo "OPERAZIONE
       MARADONA" e la sua foto in alto a destra scompaiono. --- */
tl.to(".about-bg", { opacity: 1, ease: "none" }, 2);
tl.fromTo(
  ".about-text",
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, ease: "power2.out" },
  2
);
tl.to(
  ".bg",
  { y: () => M - window.innerHeight, opacity: 0, ease: "power2.in" },
  2
);
tl.to(".hero__title", { y: "-=350", opacity: 0, ease: "power2.in" }, 2);

/* --- Segmento 4 (pag. 4 -> 5, GALLERY): la foto b/n si alza e scompare,
       mentre il testo about resta sullo sfondo nero. --- */
tl.to(".about-bg", { yPercent: -100, opacity: 0, ease: "power2.in" }, 3);

/* Stato attivo del menu: "ABOUT" diventa bianco dalle sezioni about/gallery. */
ScrollTrigger.create({
  trigger: ".scroll-track",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) =>
    document.body.classList.toggle("nav-about", self.progress > 0.6),
});

window.addEventListener("resize", () => ScrollTrigger.refresh());
