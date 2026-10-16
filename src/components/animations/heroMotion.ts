import gsap from "gsap";

/** One reversible scroll clock owns the hero-to-sidebar handoff. */
export function createHeroMotion() {
  const select = <T extends Element = HTMLElement>(selector: string) =>
    document.querySelector<T>(selector)!;
  const hero = select(".hero");
  const wordmark = select(".hero-wordmark");
  const sidebar = select(".sidebar");
  const nav = gsap.utils.toArray<HTMLElement>(".hero-nav a");
  const targets = gsap.utils.toArray<HTMLElement>(
    ".sidebar-nav .rolling-label",
  );
  const panels = gsap.utils.toArray<HTMLElement>(".sidebar > *");
  const vh = () => window.innerHeight;
  const box = (el: Element) => el.getBoundingClientRect();
  // offsetLeft/Top stay untransformed while ScrollTrigger refreshes on resize.
  const origin = (el: HTMLElement) => {
    let x = 0,
      y = 0;
    let current: HTMLElement | null = el;
    while (current && !current.classList.contains("hero-stage")) {
      x += current.offsetLeft;
      y += current.offsetTop;
      current = current.offsetParent as HTMLElement | null;
    }
    return { x, y };
  };
  gsap.set(panels, { opacity: 0 });
  gsap.set(wordmark, { transformOrigin: "0 0" });
  gsap.set(".badge-projects, .badge-stack", { transformOrigin: "0 0" });
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "hero-morph",
      trigger: hero,
      start: "top top",
      end: () => `+=${vh() * 1.5}`,
      scrub: 0.45,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .to(
      ".hero-portrait",
      { filter: "blur(65px)", opacity: 0.42, duration: 0.85 },
      0.05,
    )
    .to(".hero-heading-wrap h1", { y: () => -vh() * 1.3, duration: 1.3 }, 0.2)
    .to(
      ".hero-intro, .hero-description, .hero-demo, .hero-scroll",
      { autoAlpha: 0, duration: 0.17 },
      0,
    )
    .to(
      ".badge-qualities",
      { x: -130, scale: 0.7, opacity: 0, duration: 0.4 },
      0.05,
    )
    .to(
      wordmark,
      {
        x: () => box(select(".sidebar .wordmark")).left - origin(wordmark).x,
        y: () => box(select(".sidebar .wordmark")).top - origin(wordmark).y,
        scaleX: () =>
          box(select(".sidebar .wordmark")).width / wordmark.offsetWidth,
        scaleY: () =>
          box(select(".sidebar .wordmark")).height / wordmark.offsetHeight,
        duration: 1.15,
        ease: "power1.inOut",
      },
      0.15,
    )
    .to(wordmark, { opacity: 0, duration: 0.1 }, 1.3)
    .to(".sidebar-intro", { opacity: 1, duration: 0.22 }, 1.22)
    .to(".sidebar-stats", { opacity: 1, duration: 0.1 }, 0.95)
    .to(".sidebar-nav", { opacity: 1, duration: 0.1 }, 0.95)
    .to(
      ".stack-ticker, .sidebar-contact, .sidebar-cta",
      { opacity: 1, duration: 0.22, stagger: 0.025 },
      0.95,
    )
    .to(".hero-buttons > a", { autoAlpha: 0, duration: 0.18 }, 0.15)
    .to(
      ".hero-buttons > button",
      {
        x: () =>
          box(select(".sidebar-cta")).left -
          origin(select(".hero-buttons > button")).x,
        y: () =>
          box(select(".sidebar-cta")).top -
          origin(select(".hero-buttons > button")).y,
        width: () => sidebar.clientWidth,
        duration: 0.8,
        ease: "power2.inOut",
      },
      0.15,
    )
    .to(".hero-buttons", { autoAlpha: 0, duration: 0.12 }, 1.02)
    .set(".hero-heading-wrap h1", { autoAlpha: 0 }, 1.12)
    .to(".background-portrait", { opacity: 0.42, duration: 0.25 }, 1.2)
    .to(".hero-portrait", { opacity: 0, duration: 0.25 }, 1.2)
    // Keep timeline's total units equal to the measured 1.5 viewport journey.
    .set(".hero-stage", { pointerEvents: "none" }, 1.5);

  nav.forEach((link, index) => {
    timeline
      .to(
        link,
        {
          x: () => box(targets[index]).left - origin(link).x,
          y: () => box(targets[index]).top - origin(link).y,
          borderColor: "transparent",
          duration: 0.72,
          ease: "power2.inOut",
        },
        0.2 + index * 0.01,
      )
      .to(link, { autoAlpha: 0, duration: 0.05 }, 0.95 + index * 0.007);
  });
  [".badge-projects", ".badge-stack"].forEach((selector, index) => {
    const badge = select(selector);
    const target = select(`.sidebar-stats > div:nth-child(${index + 1})`);
    timeline
      .to(
        badge,
        {
          x: () => box(target).left - origin(badge).x,
          y: () => box(target).top - origin(badge).y,
          scale: () => target.clientWidth / badge.clientWidth,
          backgroundColor: "rgba(76,75,67,0)",
          borderColor: "transparent",
          color: "#11120f",
          duration: 0.85,
          ease: "power2.inOut",
        },
        0.12,
      )
      .to(badge, { opacity: 0, duration: 0.06 }, 0.96);
  });
}
