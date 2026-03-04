gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: {
    trigger: ".journey",
    start: "top top",
    end: "bottom bottom",
    pin: ".journey__sticky",
    scrub: 1,
    anticipatePin: 1,
  },
});

// Phase 0-10%: Resting hold (single panoramic strip)
tl.to({}, { duration: 10 });

// Phase 10-45%: Split + reshape to portrait cards
tl.addLabel("split");
tl.to(".journey__card-row", { gap: 20, duration: 35 }, "split").to(
  ".card",
  {
    width: 300,
    height: 464,
    borderRadius: 16,
    duration: 35,
  },
  "split"
);

// Phase 45-55%: Settled pause
tl.to({}, { duration: 10 });

// Phase 55-100%: Flip to backs + fan
tl.addLabel("flip");
tl.to(
  ".card__front",
  {
    transform: "perspective(1200px) rotateY(-180deg)",
    duration: 45,
    stagger: 0.05,
  },
  "flip"
)
  .to(
    ".card__back",
    {
      transform: "perspective(1200px) rotateY(0deg)",
      duration: 45,
      stagger: 0.05,
    },
    "flip"
  )
  // Fan tilt is a fixed final-state treatment, not an animated tween.
  .set(".card--left", { rotate: -15 }, "flip")
  .set(".card--right", { rotate: 10 }, "flip");
