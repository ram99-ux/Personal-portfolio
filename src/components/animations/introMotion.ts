import gsap from "gsap";

/** The centre-screen lettering docks into the exact hero wordmark rectangle. */
export function createIntro() {
  const root = document.documentElement;
  const loader = document.querySelector<HTMLElement>(".intro-loader");
  const name = document.querySelector<HTMLElement>(".intro-name");
  const heroName = document.querySelector<HTMLElement>(".hero-wordmark");
  if (!loader || !name || !heroName || root.dataset.intro !== "pending") {
    delete root.dataset.intro;
    return;
  }
  if (window.scrollY > 40) {
    // A reload restores the previous scroll position. Refreshing is a request
    // for the opening, so return to the top behind the curtain that already
    // covers the page rather than abandoning the sequence. Any other load that
    // starts part-way down the page is left where it is.
    const entry = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    if (entry?.type !== "reload") {
      delete root.dataset.intro;
      return;
    }
    window.scrollTo(0, 0);
  }

  const destination = heroName.getBoundingClientRect();
  gsap.set(name, {
    left: destination.left,
    width: destination.width,
    height: destination.height,
    top: (window.innerHeight - destination.height) / 2,
    x: window.innerWidth * 0.17,
  });
  gsap.set(".intro-name .wordmark-letter", { y: 0, yPercent: 115 });
  gsap.set(".hero-wordmark > svg", { opacity: 0 });
  gsap.set(".hero-portrait-reveal", {
    opacity: 0,
    scale: 0.88,
    y: 60,
    filter: "blur(16px)",
  });
  gsap.set(".hero-line > span", {
    yPercent: 100,
    opacity: 0,
    filter: "blur(10px)",
  });
  const details =
    ".hero-badge > *, .hero-buttons > *, .hero-nav > div, .hero-intro, .hero-description, .hero-demo, .hero-scroll";
  gsap.set(details, { opacity: 0, filter: "blur(8px)" });
  gsap.set(".hero-badge", { visibility: "hidden", filter: "blur(8px)" });

  const finish = () => {
    root.dataset.intro = "complete";
    gsap.set(loader, { display: "none" });
    // Only remove animation-owned properties. Next/Image owns the image's
    // absolute positioning and dimensions, which must survive every intro.
    gsap.set(".hero-wordmark > svg, .hero-portrait-reveal, .hero-line > span", {
      clearProps: "transform,opacity,filter",
    });
    gsap.set(details, { clearProps: "opacity,filter" });
    gsap.set(".hero-badge", { clearProps: "visibility,filter" });
  };
  const intro = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out" },
    onComplete: finish,
  });
  intro
    .to(
      ".intro-name .wordmark-letter",
      { yPercent: 0, duration: 0.95, stagger: 0.16 },
      0.08,
    )
    .to(name, { x: 0, duration: 1.4 }, 0.08)
    .to(
      name,
      { top: destination.top, duration: 0.95, ease: "power3.inOut" },
      1.5,
    )
    .to(".intro-curtain", { opacity: 0, duration: 0.65 }, 2)
    .to(
      ".hero-portrait-reveal",
      { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 1.25 },
      2.1,
    )
    .set(".hero-wordmark > svg", { opacity: 1 }, 2.45)
    .set(name, { opacity: 0 }, 2.45)
    .to(
      ".hero-line > span",
      {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.11,
      },
      2.4,
    )
    .set(".hero-badge", { visibility: "visible" }, 2.8)
    .to(".hero-badge", { filter: "blur(0px)", duration: 0.75 }, 2.8)
    .to(
      details,
      { opacity: 1, filter: "blur(0px)", duration: 0.75, stagger: 0.025 },
      2.75,
    );

  let cancelled = false;
  let readyTimer: number;
  const image = document.querySelector<HTMLImageElement>(".hero-portrait img");
  // Local font/image readiness prevents a jump halfway through the name reveal.
  const ready = Promise.allSettled([document.fonts.ready, image?.decode()]);
  Promise.race([
    ready,
    new Promise((resolve) => {
      readyTimer = window.setTimeout(resolve, 700);
    }),
  ]).then(() => {
    clearTimeout(readyTimer);
    if (cancelled) return;
    root.dataset.intro = "playing";
    intro.play();
  });
  // Intentional navigation, rotation, or scroll can always interrupt the opening.
  const skip = () => {
    cancelled = true;
    clearTimeout(readyTimer);
    if (root.dataset.intro !== "complete") intro.progress(1);
  };
  const scroll = () => {
    if (window.scrollY > 40) skip();
  };
  const key = (event: KeyboardEvent) => {
    if (["Tab", "Escape", "PageDown", "End", " "].includes(event.key)) skip();
  };
  // The docking geometry is derived from viewport width, so only a width change
  // invalidates it. Mobile browsers fire resize when the URL bar collapses or the
  // on-screen keyboard opens, which changes height alone and must not cut the
  // opening short.
  let width = window.innerWidth;
  const resize = () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    skip();
  };
  window.addEventListener("scroll", scroll, { passive: true });
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", key);
  window.addEventListener("portfolio:pause", skip);
  document.addEventListener("click", skip);
  return () => {
    cancelled = true;
    clearTimeout(readyTimer);
    window.removeEventListener("scroll", scroll);
    window.removeEventListener("resize", resize);
    window.removeEventListener("keydown", key);
    window.removeEventListener("portfolio:pause", skip);
    document.removeEventListener("click", skip);
    if (root.dataset.intro !== "complete") root.dataset.intro = "pending";
  };
}
