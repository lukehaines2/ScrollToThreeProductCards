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
    0.00 – 0.10  Resting             (no visual change)
    0.10 – 0.35  Shrink + headline   (uniform scale to ~464 height, overlay fades 0.10–0.25)
    0.35 – 0.50  Split               (unscale + gap + cards reshape to portrait)
    0.50 – 0.60  Settled             (brief pause)
    0.60 – 1.00  Flip + Fan          (cards flip, left/right tilt outward)
*/

// Row height is 540 (cards are 540 tall). Split-state target is 450
// (matches card-back asset ratio: clean 2:3 portrait).
const scaleToIntermediate = 450 / 540;

// ── Phase 0: Resting ──────────────────────────────────
tl.to({}, { duration: 0.1 });

// ── Phase 1: Shrink + overlay fade ────────────────────
tl.to(".journey__card-row", { scale: scaleToIntermediate, duration: 0.25, ease: "none", force3D: true });
// Fade overlay in parallel with shrink, completing well before split (0.35).
tl.to(".journey__overlay", { opacity: 0, duration: 0.15, ease: "none" }, 0.10);

// ── Phase 2: Split (unscale + reshape to portrait) ────
tl.to(".journey__card-row", { scale: 1, duration: 0.15, ease: "none", force3D: true })
  .to(".journey__card-row", { gap: "20px", duration: 0.15, ease: "none" }, "<")
  .to(".card", { width: 300, height: 450, duration: 0.15, ease: "none" }, "<")
  .to(".card", { borderRadius: "16px", duration: 0.15, ease: "none" }, "<")
  .to(".journey__card-row", { overflow: "visible", duration: 0.15, ease: "none" }, "<");

// ── Phase 3: Settled ───────────────────────────────────
tl.to({}, { duration: 0.1 });

// ── Phase 4: Flip + Fan ───────────────────────────────
// L/R cards rotate AND translate down so their topmost corners align with
// the centre card's flat top edge. Offsets derived from the rotation:
//   L: H/2 * (1 - cos θ) + W/2 * sin θ  where H=450, W=300, θ=15°  ≈ 31
//   R:  same formula with θ=10°                                    ≈ 23
tl.to(".card__front", { rotateY: -180, duration: 0.4, ease: "none", stagger: 0.02 }, "flip")
  .to(".card__back",  { rotateY: 0,    duration: 0.4, ease: "none", stagger: 0.02 }, "flip")
  .to(".card--left",  { rotate: -15, y: 31, duration: 0.4, ease: "none" }, "flip")
  .to(".card--right", { rotate: 10,  y: 23, duration: 0.4, ease: "none" }, "flip");
