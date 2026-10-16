"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/data/site";
import { Modal } from "@/components/ui/Modal";

export function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
      () => {
        const el = track.current!;
        tween.current = gsap.to(el, {
          x: () => -(el.scrollWidth - el.parentElement!.clientWidth),
          ease: "none",
          scrollTrigger: {
            id: "project-gallery",
            trigger: root.current,
            start: "top top",
            end: () => `+=${el.scrollWidth - el.parentElement!.clientWidth}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          tween.current = null;
        };
      },
      root,
    );
    return () => media.revert();
  }, []);
  function advance(direction: number) {
    const trigger = tween.current?.scrollTrigger;
    if (trigger) {
      const amount = (trigger.end - trigger.start) / (projects.length - 2);
      window.scrollTo({
        top: Math.min(
          trigger.end,
          Math.max(trigger.start, window.scrollY + direction * amount),
        ),
        behavior: "smooth",
      });
    } else {
      const viewport = track.current?.parentElement;
      viewport?.scrollBy({
        left: direction * (viewport.clientWidth * 0.8),
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }
  function focusCard(index: number) {
    const trigger = tween.current?.scrollTrigger;
    if (trigger) {
      const progress = Math.min(1, Math.max(0, index / (projects.length - 2)));
      window.scrollTo({
        top: trigger.start + progress * (trigger.end - trigger.start),
        behavior: "instant",
      });
    }
  }
  return (
    <>
      <section
        id="projects"
        className="selected-work"
        ref={root}
        aria-labelledby="projects-title"
      >
        <div className="work-heading section-offset">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2 id="projects-title">
              Ideas made tangible.
              <br />
              Built to be explored.
            </h2>
          </div>
          <p>
            A collection of built projects, from everyday automation and
            internal tools to storefronts and full-stack applications.
          </p>
        </div>
        <div
          className="project-viewport"
          tabIndex={0}
          aria-label="Project gallery"
        >
          <div className="project-track" ref={track}>
            {projects.map((p, i) => (
              <button
                className="project-card"
                key={p.slug}
                style={{ backgroundColor: p.color }}
                onClick={() => setProject(p)}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible"))
                    focusCard(i);
                }}
                data-cursor="Explore"
                aria-label={`Explore ${p.title}, ${p.category}`}
              >
                <Image
                  src={p.image}
                  alt={`${p.title} project artwork`}
                  fill
                  sizes="(max-width: 700px) 85vw, 420px"
                />
                <div className="project-top">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="project-info">
                  <span className="project-category">
                    {p.category} · {p.year}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <span className="project-arrow">
                    <ArrowUpRight size={19} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="work-bottom section-offset">
          <span>
            {projects.length} projects · Scroll to explore
          </span>
          <div>
            <button
              className="icon-button"
              onClick={() => advance(-1)}
              aria-label="Previous projects"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              className="icon-button"
              onClick={() => advance(1)}
              aria-label="Next projects"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
      <Modal
        open={!!project}
        onClose={() => setProject(null)}
        title={project ? `${project.title} project` : "Project"}
        className="project-modal"
      >
        {project && (
          <>
            <div
              className="project-modal-art"
              style={{ background: project.color }}
            >
              <Image
                src={project.image}
                alt={`${project.title} project artwork`}
                width={800}
                height={1000}
              />
            </div>
            <div className="project-modal-copy">
              <span className="eyebrow">
                {project.category} · {project.year}
              </span>
              <h2>{project.title}</h2>
              <p>{project.detail}</p>
              <div className="project-tags">
                {project.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <ul>
                {project.features.map((f) => (
                  <li key={f}>
                    <Check size={16} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="button button-yellow"
                onClick={() =>
                  setProject(
                    projects[(projects.indexOf(project) + 1) % projects.length],
                  )
                }
              >
                Next project <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
