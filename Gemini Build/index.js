
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".journey",
    start: "top top",
    end: "bottom bottom",
    pin: ".journey__sticky",
    scrub: 1,
  }
});

// Phase 1: Split
tl.to(".journey__card-row", { gap: "20px" }, "split")
  .to(".card", { width: "300px", height: "464px" }, "split")

// Phase 2: Settled — GSAP holds naturally, no code needed

// Phase 3: Flip
  .to(".card__front", {
    transform: "perspective(1200px) rotateY(-180deg)",
    stagger: 0.05,
  }, "flip")
  .to(".card__back", {
    transform: "perspective(1200px) rotateY(0deg)",
    stagger: 0.05,
  }, "flip");

