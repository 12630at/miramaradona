gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Entrata: il sito si apre con il testo grande dell'intro.
------------------------------------------------------------------ */
gsap.from(".intro__text", {
  opacity: 0,
  y: 40,
  duration: 1.1,
  ease: "power3.out",
});

gsap.from(".logo, .menu", {
  opacity: 0,
  duration: 1.1,
  delay: 0.3,
  ease: "power2.out",
});

/* ------------------------------------------------------------------
   Scroll: l'intro resta bloccata nel viewport (scroll-to-lock) mentre
   il testo grande rimpicciolisce e si SOVRAPPONE al titolo dell'hero
   (la prima pagina), che si rivela sotto.
------------------------------------------------------------------ */
const introText = document.querySelector(".intro__text");
const heroTitle = document.querySelector(".hero__title");

let tl;

function buildTimeline() {
  const it = introText.getBoundingClientRect();
  const ht = heroTitle.getBoundingClientRect();

  // allinea i centri e adatta la scala al titolo dell'hero
  const dx = (ht.left + ht.width / 2) - (it.left + it.width / 2);
  const dy = (ht.top + ht.height / 2) - (it.top + it.height / 2);
  const scale = ht.height / it.height;

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#intro",
      start: "top top",
      end: "+=120%",
      scrub: true,
      pin: true,
      anticipatePin: 1,
    },
  });

  // l'hero (con il suo titolo) si rivela sotto
  tl.fromTo(".hero", { opacity: 0 }, { opacity: 1, ease: "none" }, 0)
    // il testo grande rimpicciolisce e scivola fino a sovrapporsi al titolo dell'hero
    .to(
      introText,
      {
        x: dx,
        y: dy,
        scale: scale,
        transformOrigin: "center center",
        ease: "none",
      },
      0
    );
}

buildTimeline();

/* ------------------------------------------------------------------
   Effetto "lock viewport": snap dello scroll alle due pagine.
------------------------------------------------------------------ */
ScrollTrigger.create({
  snap: {
    snapTo: [0, 1],
    duration: { min: 0.2, max: 0.6 },
    ease: "power2.inOut",
  },
  start: 0,
  end: "max",
});

/* Ricalcolo posizioni al resize */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (tl) {
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    }
    gsap.set(introText, { clearProps: "all" });
    buildTimeline();
    ScrollTrigger.refresh();
  }, 200);
});
