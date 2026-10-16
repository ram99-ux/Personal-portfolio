"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { capabilities } from "@/data/site";
import { Icon } from "@/components/ui/Icon";

export function Capabilities() {
  const [active, setActive] = useState<number | null>(null);
  const root = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      if (!(e.target as Element).closest(".capability-control"))
        setActive(null);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && active !== null) {
        buttons.current[active]?.focus();
        setActive(null);
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [active]);
  const words = (str: string) =>
    str.split(" ").map((word, i) => (
      <span key={`${word}-${i}`} className="capability-word">
        {word}{" "}
      </span>
    ));
  function control(index: number) {
    const item = capabilities[index];
    return (
      <span className="capability-control">
        <button
          ref={(el) => {
            buttons.current[index] = el;
          }}
          className={`capability-button ${active === index ? "is-active" : ""}`}
          aria-label={item.title}
          aria-expanded={active === index}
          aria-controls={`capability-${index}`}
          onClick={() => setActive(active === index ? null : index)}
        >
          <Icon name={item.icon} size={34} />
          <ChevronDown size={15} />
        </button>
        <span
          id={`capability-${index}`}
          className="capability-popover glass"
          hidden={active !== index}
        >
          <strong>{item.title}</strong>
          <span>{item.text}</span>
        </span>
      </span>
    );
  }
  return (
    <section
      id="capabilities"
      className="capabilities section-offset"
      ref={root}
      aria-labelledby="capabilities-title"
    >
      <h2 id="capabilities-title" data-reveal>
        What
        <br />
        you get.
      </h2>
      <span className="eyebrow">The pieces, brought together</span>
      <div className="capability-statement">
        {words("Thought, craft, and")} {control(0)}{" "}
        {words("code, working together. Connecting")} {control(1)}{" "}
        {words("your idea to a clearer")} {control(2)}{" "}
        {words("digital experience. A little motion.")} {control(3)}{" "}
        {words("A lot of care.")} {control(4)}
      </div>
      <p className="capabilities-hint">A closer look is one click away.</p>
    </section>
  );
}
