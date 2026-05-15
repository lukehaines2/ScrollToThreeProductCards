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
  Phase map. The "animation" portion (Phases 1–4) is fixed at 0.9 timeline
  units; the two hold phases (top rest + bottom dwell) are the user-tunable
  scroll-feel knobs.

    Phase 0  Resting    duration = TIMELINE_REST_TOP   (no visual change)
    Phase 1  Shrink + overlay fade (0.25)
    Phase 2  Split + reshape       (0.15)
    Phase 3  Settled               (0.10)
    Phase 4  Flip + Fan            (0.40)
    Phase 5  Dwell      duration = TIMELINE_DWELL      (cards stay revealed)

  Both knobs are timeline units. ~300vh of scroll = 1.0 timeline unit, so:
    Top hold scroll  ≈ TIMELINE_REST_TOP × 300vh
    Bottom hold scroll ≈ TIMELINE_DWELL   × 300vh
  When changing either, update `.journey { height }` in CSS so total scroll
  stays in lockstep — formula in the CSS comment.
*/

const TIMELINE_REST_TOP = 0.2;
const TIMELINE_DWELL    = 0.2;

// Row height is 540 (cards are 540 tall). Split-state target is 450
// (matches card-back asset ratio: clean 2:3 portrait).
const scaleToIntermediate = 450 / 540;

// ── Phase 0: Resting ──────────────────────────────────
// Top hold before the shrink begins — gives the banner a moment to register.
tl.to({}, { duration: TIMELINE_REST_TOP });

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

// ── Phase 5: Dwell on revealed state ──────────────────
// Empty tween that consumes timeline time without changing anything visually.
// With scrub, this means scroll continues but cards stay in their final state.
tl.to({}, { duration: TIMELINE_DWELL });
