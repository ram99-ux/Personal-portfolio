import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export function createSectionMotion() {
  gsap.registerPlugin(SplitText);
  const splits: SplitText[] = [];
  function revealLines(
    element: HTMLElement,
    trigger: Element = element,
    reversible = false,
  ) {
    splits.push(
      SplitText.create(element, {
        type: "lines",
        aria: "none",
        mask: "lines",
        linesClass: "reveal-line",
        autoSplit: true,
        onSplit: (split) =>
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 0.65,
            delay: 0.3,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger,
              start: reversible ? "top 82%" : "top 92%",
              toggleActions: reversible
                ? "play none none reverse"
                : "play none none none",
              once: !reversible,
            },
          }),
      }),
    );
  }
  gsap.utils
    .toArray<HTMLElement>(
      "[data-reveal]:not(.journey-card):not(#capabilities-title)",
    )
    .forEach((element) => {
      if (element.matches("h2, p")) revealLines(element);
      else if (element.classList.contains("section-intro")) {
        element
          .querySelectorAll<HTMLElement>("h2, p")
          .forEach((child) => revealLines(child));
        gsap.from(element.querySelectorAll(".eyebrow, .sample-note"), {
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      } else {
        gsap.from(element, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      }
    });

  gsap.utils.toArray<HTMLElement>(".journey-card").forEach((card) => {
    gsap.fromTo(
      card,
      { scale: 0.6, yPercent: 10, opacity: 0 },
      {
        scale: 1,
        yPercent: 0,
        opacity: 1,
        delay: 0.3,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );
    card
      .querySelectorAll<HTMLElement>("h3, p")
      .forEach((element) => revealLines(element, card, true));
    const details = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });
    details
      .fromTo(
        card.querySelectorAll(".journey-digit"),
        { y: 0 },
        { y: -450, duration: 1.65, stagger: 0.13, ease: "power3.inOut" },
        0,
      )
      .from(
        card.querySelectorAll(".journey-symbol, .journey-tag"),
        {
          opacity: 0,
          scale: 0.6,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.2,
      )
      .from(
        card.querySelector(".small-button"),
        { opacity: 0, duration: 1.2 },
        0.8,
      );
  });
  const path = document.querySelector<SVGPathElement>(".journey-progress");
  const lineSvg = document.querySelector<SVGSVGElement>(".journey-line");
  if (path && lineSvg) {
    const samples = 400;
    const userLength = path.getTotalLength();
    const points = Array.from({ length: samples + 1 }, (_, i) => {
      const { x, y } = path.getPointAtLength((userLength * i) / samples);
      return { x, y };
    });
    const ys = points.map((point) => point.y);
    const minY = ys[0];
    const maxY = ys[ys.length - 1];
    // The dash pattern measures in screen pixels because the stroke is
    // non-scaling, but getTotalLength() reports user units — and
    // preserveAspectRatio="none" stretches the axes by different amounts, so the
    // two disagree. Measure the rendered length, or the reveal is miscalibrated.
    // Cumulative rendered length at each sample, so the drawn tip can be placed
    // by vertical position: the curve's horizontal swings mean equal steps of
    // length don't cover equal vertical distance.
    let drawnLengths: number[] = [];
    let renderedLength = 0;
    const measure = () => {
      const box = lineSvg.getBoundingClientRect();
      const viewBox = lineSvg.viewBox.baseVal;
      const scaleX = box.width / viewBox.width;
      const scaleY = box.height / viewBox.height;
      drawnLengths = [0];
      let total = 0;
      for (let i = 1; i <= samples; i++) {
        total += Math.hypot(
          (points[i].x - points[i - 1].x) * scaleX,
          (points[i].y - points[i - 1].y) * scaleY,
        );
        drawnLengths.push(total);
      }
      renderedLength = total;
      path.style.strokeDasharray = `${renderedLength}`;
    };
    measure();
    const drawnForY = (targetY: number) => {
      if (targetY <= minY) return 0;
      if (targetY >= maxY) return renderedLength;
      for (let i = 1; i <= samples; i++) {
        if (ys[i] >= targetY) {
          const y0 = ys[i - 1];
          const y1 = ys[i];
          const l0 = drawnLengths[i - 1];
          const l1 = drawnLengths[i];
          return y1 === y0 ? l0 : l0 + ((targetY - y0) / (y1 - y0)) * (l1 - l0);
        }
      }
      return renderedLength;
    };
    const proxy = { y: minY };
    gsap.fromTo(
      proxy,
      { y: minY },
      {
        y: maxY,
        ease: "none",
        onUpdate: () => {
          path.style.strokeDashoffset = `${renderedLength - drawnForY(proxy.y)}`;
        },
        scrollTrigger: {
          trigger: ".journey-track",
          // Matching percentages pin the drawn tip at that height on screen, so
          // 50% keeps it centered. A long scrub lets it trail off-screen while
          // scrolling, which defeats that.
          start: "top 50%",
          end: "bottom 50%",
          // Lenis already smooths the scroll itself; an extra scrub delay on top
          // only makes the tip trail off-screen.
          scrub: true,
          // Rendered length depends on the stretched width, so remeasure on resize.
          onRefresh: measure,
        },
      },
    );
  }
  const words = gsap.utils.toArray<HTMLElement>(".capability-word");
  words.forEach((word) =>
    splits.push(
      SplitText.create(word, {
        type: "chars",
        charsClass: "capability-char",
        aria: "none",
      }),
    ),
  );
  gsap.fromTo(
    ".capability-char",
    { opacity: 0.1, y: 5 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.025,
      ease: "none",
      scrollTrigger: {
        trigger: ".capability-statement",
        start: "top 92%",
        end: "bottom 67%",
        scrub: 0.45,
      },
    },
  );
  return () => splits.forEach((split) => split.revert());
}
