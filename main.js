gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Entrata: il sito si apre con sfondo, logo, menu e testo iniziale.
------------------------------------------------------------------ */
gsap.from(".intro-text", {
  opacity: 0,
  y: 24,
  duration: 1.1,
  ease: "power3.out",
});

gsap.from(".logo, .menu", {
  opacity: 0,
  duration: 1.1,
  delay: 0.25,
  ease: "power2.out",
});

/* ------------------------------------------------------------------
   Scroll: lo sfondo, il logo, il menu e il testo iniziale restano FISSI.
   L'unico elemento che si muove è il titolo "OPERAZIONE MARADONA (2026)",
   che compare e sale al centro passando dalla pagina 1 alla pagina 2.
   Effetto scroll-to-lock: snap del viewport tra le due pagine.
------------------------------------------------------------------ */
gsap.fromTo(
  ".hero__title",
  { xPercent: -50, yPercent: -50, y: 90, opacity: 0 },
  {
    xPercent: -50,
    yPercent: -50,
    y: 0,
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".scroll-track",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      snap: {
        snapTo: [0, 1],
        duration: { min: 0.2, max: 0.6 },
        ease: "power2.inOut",
      },
    },
  }
);

window.addEventListener("resize", () => ScrollTrigger.refresh());
