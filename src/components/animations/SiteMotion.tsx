"use client";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { DisplayWordmark } from "@/components/ui/DisplayWordmark";
import { createIntro } from "./introMotion";
import { createHeroMotion } from "./heroMotion";
import { createSectionMotion } from "./sectionMotion";

export function SiteMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let lenis: Lenis | undefined;
    media.add("(prefers-reduced-motion: no-preference)", () => {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const cleanupIntro = createIntro();
      const cleanupSections = createSectionMotion();
      return () => {
        cleanupIntro?.();
        cleanupSections();
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = undefined;
      };
    });
    media.add(
      "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
      () => {
        document.documentElement.dataset.desktopMotion = "true";
        createHeroMotion();
        return () => {
          delete document.documentElement.dataset.desktopMotion;
        };
      },
    );
    media.add(
      "(max-width: 999px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.to(".hero-portrait", {
          y: 90,
          filter: "blur(10px)",
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
          },
        });
        gsap.to(".background-portrait", {
          opacity: 0.18,
          scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "top 30%",
            scrub: true,
          },
        });
      },
    );
    function anchor(e: MouseEvent) {
      const link = (e.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      e.preventDefault();
      history.replaceState(null, "", link.hash);
      const offset = window.innerWidth < 1000 ? -90 : -24;
      const pin =
        target.id === "projects"
          ? ScrollTrigger.getById("project-gallery")
          : undefined;
      const destination =
        (pin?.start ?? target.getBoundingClientRect().top + window.scrollY) +
        offset;
      if (lenis) lenis.scrollTo(destination, { duration: 1.3, force: true });
      else window.scrollTo({ top: destination, behavior: "instant" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
    const pause = () => lenis?.stop();
    const resume = () => lenis?.start();
    document.addEventListener("click", anchor);
    window.addEventListener("portfolio:pause", pause);
    window.addEventListener("portfolio:resume", resume);
    let disposed = false;
    let interacted = false;
    const initialHash = window.location.hash;
    const markInteraction = () => {
      interacted = true;
    };
    window.addEventListener("wheel", markInteraction, { passive: true });
    window.addEventListener("pointerdown", markInteraction, { passive: true });
    window.addEventListener("keydown", markInteraction);
    const refresh = () => {
      if (!disposed) {
        // The gallery adds pin spacing above later sections. Refresh in document
        // order so their reading/reveal ranges include that additional distance.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event("scroll"));
      }
    };
    let readyFrame = 0;
    document.fonts.ready.then(() => {
      if (disposed) return;
      readyFrame = requestAnimationFrame(() => {
        refresh();
        if (
          initialHash &&
          !interacted &&
          location.hash === initialHash &&
          (
            performance.getEntriesByType(
              "navigation",
            )[0] as PerformanceNavigationTiming
          )?.type !== "back_forward"
        ) {
          const target = document.getElementById(initialHash.slice(1));
          if (target) {
            const pin =
              target.id === "projects"
                ? ScrollTrigger.getById("project-gallery")
                : undefined;
            const destination =
              (pin?.start ?? target.getBoundingClientRect().top + scrollY) -
              (innerWidth < 1000 ? 90 : 24);
            if (lenis)
              lenis.scrollTo(destination, { immediate: true, force: true });
            else window.scrollTo({ top: destination, behavior: "instant" });
          }
        }
        document.documentElement.dataset.motionReady = "true";
      });
    });
    window.addEventListener("load", refresh);
    const refreshTimer = window.setTimeout(refresh, 1200);
    return () => {
      disposed = true;
      cancelAnimationFrame(readyFrame);
      clearTimeout(refreshTimer);
      media.revert();
      delete document.documentElement.dataset.motionReady;
      window.removeEventListener("wheel", markInteraction);
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener("keydown", markInteraction);
      document.removeEventListener("click", anchor);
      window.removeEventListener("portfolio:pause", pause);
      window.removeEventListener("portfolio:resume", resume);
      window.removeEventListener("load", refresh);
    };
  }, []);
  return (
    <div className="intro-loader" aria-hidden="true">
      <div className="intro-curtain" />
      <div className="intro-name">
        <DisplayWordmark />
      </div>
    </div>
  );
}
