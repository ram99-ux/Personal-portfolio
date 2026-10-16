"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { journeyItems } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";

export function About() {
  const [story, setStory] = useState<number | null>(null);
  const selected = story === null ? null : journeyItems[story];
  return (
    <section
      id="about"
      className="about section-offset"
      aria-labelledby="about-title"
    >
      <div className="section-intro" data-reveal>
        <span className="eyebrow">Always a work in progress</span>
        <h2 id="about-title">
          A little about me.
          <br />A look at the journey.
        </h2>
        <p>
          Every new idea starts somewhere. Here’s a sample path through the
          experiments, discoveries, and small steps along the way.
        </p>
        <span className="sample-note">
          Illustrative timeline · replace with your story
        </span>
      </div>
      <div className="journey-track">
        <svg
          className="journey-line"
          viewBox="0 0 1000 2520"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M550 0 C1000 30 1070 220 850 330 S-100 510 160 740 S1100 960 800 1180 S-80 1450 170 1620 S1130 1840 800 2050 S100 2350 450 2520"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="journey-progress"
            d="M550 0 C1000 30 1070 220 850 330 S-100 510 160 740 S1100 960 800 1180 S-80 1450 170 1620 S1130 1840 800 2050 S100 2350 450 2520"
            stroke="#ffff00"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {journeyItems.map((item, i) => (
          <article
            className={`journey-card glass journey-${i}`}
            key={item.year}
            data-reveal
          >
            <span className="journey-dot" aria-hidden="true" />
            <span className="journey-year" aria-hidden="true">
              <svg viewBox="0 0 180 90" className="year-odometer">
                <text x="0" y="78">
                  ’
                </text>
                {item.year
                  .slice(2)
                  .split("")
                  .map((digit, index) => (
                    <svg
                      key={index}
                      x={25 + index * 60}
                      width="64"
                      height="90"
                      viewBox="0 0 64 90"
                      overflow="hidden"
                    >
                      <g className="journey-digit">
                        {Array.from({ length: 6 }, (_, step) => (
                          <text key={step} x="0" y={78 + step * 90}>
                            {(Number(digit) + 5 - step) % 10}
                          </text>
                        ))}
                      </g>
                    </svg>
                  ))}
              </svg>
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="journey-card-bottom">
              <div className="journey-symbol">
                <Icon name={item.icon} size={27} />
              </div>
              <span className="journey-tag">
                {item.tag}
                <small>{item.year}</small>
              </span>
              <button
                className="small-button"
                onClick={() => setStory(i)}
                aria-label={`Read more: ${item.title}`}
              >
                Read more <ArrowUpRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <Modal
        open={story !== null}
        onClose={() => setStory(null)}
        title={selected?.title || "Journey story"}
        className="story-modal"
      >
        {selected && (
          <>
            <Image
              src={selected.image}
              alt="Original abstract illustration for this sample chapter"
              width={800}
              height={450}
            />
            <span className="eyebrow">Sample chapter · {selected.year}</span>
            <h2>{selected.title}</h2>
            <p>{selected.detail}</p>
            <div className="story-controls">
              <button
                className="small-button"
                onClick={() => setStory((v) => Math.max(0, (v || 0) - 1))}
                disabled={story === 0}
              >
                Previous chapter
              </button>
              <span>
                {(story || 0) + 1} / {journeyItems.length}
              </span>
              <button
                className="small-button"
                onClick={() =>
                  setStory((v) =>
                    Math.min(journeyItems.length - 1, (v || 0) + 1),
                  )
                }
                disabled={story === journeyItems.length - 1}
              >
                Next chapter
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
