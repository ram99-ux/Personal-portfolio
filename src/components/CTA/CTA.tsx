import Image from "next/image";
import { profile } from "@/data/site";
import { ContactButton } from "@/components/Contact/ContactProvider";
export function CTA() {
  return (
    <section className="cta section-offset" aria-labelledby="cta-title">
      <div className="cta-inner">
        <h2 id="cta-title" data-reveal>
          Make room
          <br />
          for your next
          <br />
          <span className="cta-word">big idea.</span>
        </h2>
        <p data-reveal>
          Maybe it’s a new beginning. Maybe it’s making something good a little
          better. Let’s find the shape of your next digital experience.
        </p>
        <div className="chat-cta" data-reveal>
          <div className="chat-avatar">
            <Image
              src={profile.portrait}
              alt="Illustrated sample avatar"
              width={52}
              height={78}
            />
          </div>
          <div>
            <span className="chat-bubble">Something on your mind?</span>
            <ContactButton>Let’s talk about it</ContactButton>
          </div>
        </div>
      </div>
    </section>
  );
}
