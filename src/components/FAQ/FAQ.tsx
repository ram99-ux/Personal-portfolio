"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/data/site";
import { DisplayWordmark } from "@/components/ui/DisplayWordmark";
export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section
      id="faq"
      className="faq section-offset"
      aria-labelledby="faq-title"
    >
      <div className="footer-wordmark" aria-hidden="true">
        <DisplayWordmark />
      </div>
      <div className="section-intro" data-reveal>
        <span className="eyebrow">A few useful answers</span>
        <h2 id="faq-title">
          Still
          <br />
          wondering?
        </h2>
      </div>
      <div className="faq-grid">
        {[0, 1].map((column) => (
          <div className="faq-column" key={column}>
            {faqs.slice(column * 4, column * 4 + 4).map((faq, row) => {
              const i = column * 4 + row;
              const expanded = open === i;
              return (
                <article
                  className={`faq-item ${expanded ? "is-open" : ""}`}
                  key={faq.question}
                >
                  <h3>
                    <button
                      id={`faq-button-${i}`}
                      aria-expanded={expanded}
                      aria-controls={`faq-answer-${i}`}
                      onClick={() => setOpen(expanded ? null : i)}
                    >
                      {faq.question}
                      <Plus size={22} aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    aria-hidden={!expanded}
                    inert={!expanded}
                    className="faq-answer"
                  >
                    <div>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
