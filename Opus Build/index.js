gsap.registerPlugin(ScrollTrigger);

/* ── Initial 3D state ──────────────────────────────── */

gsap.set(".card__front", { transformPerspective: 1200, rotateY: 0 });
gsap.set(".card__back",  { transformPerspective: 1200, rotateY: 180 });

/* ── Master timeline ───────────────────────────────── */

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".journey",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
  },
});

/*
  Phase map (proportional durations totalling 1.0):
    0.00 – 0.10  Resting   (no visual change)
    0.10 – 0.45  Split     (gap opens, cards reshape to portrait)
    0.45 – 0.55  Settled   (brief pause)
    0.55 – 1.00  Flip+Fan  (cards flip, left/right tilt outward)
*/

// ── Phase 0: Resting ──────────────────────────────────
tl.to({}, { duration: 0.1 });

// ── Phase 1: Split ────────────────────────────────────
tl.to(".journey__card-row", { gap: "20px", duration: 0.35, ease: "none" })
  .to(".card", { width: 300, height: 464, duration: 0.35, ease: "none" }, "<");

// ── Phase 2: Settled ──────────────────────────────────
tl.to({}, { duration: 0.1 });

// ── Phase 3: Flip + Fan ───────────────────────────────
tl.to(".card__front", { rotateY: -180, duration: 0.45, ease: "none", stagger: 0.02 }, "flip")
  .to(".card__back",  { rotateY: 0,    duration: 0.45, ease: "none", stagger: 0.02 }, "flip")
  .to(".card--left",  { rotate: -15,   duration: 0.45, ease: "none" }, "flip")
  .to(".card--right", { rotate: 10,    duration: 0.45, ease: "none" }, "flip");
