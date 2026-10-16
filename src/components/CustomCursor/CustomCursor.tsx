"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const el = ref.current!;
        const x = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3" });
        const y = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3" });
        const move = (e: PointerEvent) => {
          x(e.clientX);
          y(e.clientY);
          const target = (e.target as Element).closest<HTMLElement>(
            "[data-cursor]",
          );
          el.dataset.visible = String(!!target);
          el.textContent = target?.dataset.cursor || "";
        };
        const leave = () => {
          el.dataset.visible = "false";
        };
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerleave", leave);
        return () => {
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerleave", leave);
        };
      },
    );
    return () => media.revert();
  }, []);
  return <div ref={ref} className="custom-cursor" aria-hidden="true" />;
}
