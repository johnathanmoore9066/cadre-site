// Motion engine: Lenis (inertia smooth scroll) synced to GSAP ScrollTrigger.
// Locomotive Scroll v5 is built on Lenis — this is the same feel, lighter core.
// Everything here is gated on prefers-reduced-motion: if the user opts out we
// run zero JS animation and let the browser scroll natively.

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// We respect the OS "reduce motion" setting in production (Windows: Settings >
// Accessibility > Visual effects > Animation effects). The catch: if YOU have
// that turned off, the smooth scroll never runs and tuning values looks like it
// does nothing. Append ?motion to the URL to force the motion path on for
// testing, regardless of the OS setting.
const forceMotion = new URLSearchParams(window.location.search).has("motion");
const prefersReduced =
  !forceMotion &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Nav condenses to a frosted bar once you leave the hero. */
function initNav() {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 32);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMotion() {
  initNav();

  if (prefersReduced) return; // calm path — content is already fully visible

  document.documentElement.classList.add("anim");
  gsap.registerPlugin(ScrollTrigger);

  // --- smooth scroll ---
  // The "weight" of the scroll lives in `lerp`: each frame the page eases this
  // fraction of the way toward the target position. Lower = heavier, with a
  // longer glide and slower settle.
  //   0.05 = very heavy   0.07 = heavy (here)   0.10 = Lenis default   0.14 = light
  // `wheelMultiplier` scales how far one wheel notch travels — nudge up if the
  // heavier glide makes the page feel slow to cover distance.
  // `autoRaf: false` is essential: we step Lenis from GSAP's ticker below, so
  // letting Lenis also run its own rAF loop double-steps it and causes the
  // stuttery, "light" feel.
  const lenis = new Lenis({
    duration: .67, // seconds to glide; ↑ heavier/longer
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic — soft settle
    wheelMultiplier: .5,
    smoothWheel: true,
    autoRaf: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // anchor links routed through Lenis for the smooth glide
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -90 });
    });
  });

  // --- single-element reveals ---
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });

  // --- staggered groups ---
  gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
    const items = group.querySelectorAll("[data-reveal-item]");
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: "power3.out",
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: "top 82%" },
    });
  });

  // --- parallax depth (hero + accents) ---
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || "0.15");
    const scope = el.closest<HTMLElement>("[data-parallax-scope]") || el;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: scope,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // --- redaction beat: black out the identifying fields on scroll ---
  const redactScope = document.querySelector<HTMLElement>("[data-redact-scope]");
  if (redactScope) {
    gsap.to("[data-redact]", {
      "--redact-w": "100%",
      stagger: 0.18,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: redactScope,
        start: "top 70%",
        end: "center center",
        scrub: true,
      },
    });
  }

  // --- modules: pin the section and scroll the track horizontally ---
  const track = document.querySelector<HTMLElement>("[data-modules-track]");
  const modulesSection = document.querySelector<HTMLElement>("[data-modules]");
  const wide = window.matchMedia("(min-width: 860px)").matches;
  if (track && modulesSection && wide) {
    const distance = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: modulesSection,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + distance(),
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  }

  ScrollTrigger.refresh();
}

if (document.readyState !== "loading") initMotion();
else window.addEventListener("DOMContentLoaded", initMotion);
