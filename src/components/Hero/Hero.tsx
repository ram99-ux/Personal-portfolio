import { getImageProps } from "next/image";
import {
  ArrowDown,
  Code2,
  Layers,
  Sparkles,
  Heart,
  Zap,
  ScanFace,
} from "lucide-react";
import { profile, navigation, projects } from "@/data/site";
import { ContactButton } from "@/components/Contact/ContactProvider";
import { DisplayWordmark } from "@/components/ui/DisplayWordmark";

export function Hero() {
  const qualityIcons = [Sparkles, Heart, Layers, ScanFace, Zap];
  // Art direction: phones get a tighter head-and-shoulders crop, since at 56% of
  // the viewport the full-length portrait reads too small. One <img> with a
  // <source> keeps a single optimized download per breakpoint.
  const portraitAlt = `${profile.name}, ${profile.role}`;
  const {
    props: { srcSet: phonePortrait },
  } = getImageProps({
    alt: portraitAlt,
    src: profile.portraitMobile,
    fill: true,
    sizes: "56vw",
  });
  const { props: portraitProps } = getImageProps({
    alt: portraitAlt,
    src: profile.portrait,
    fill: true,
    sizes: "(max-width: 999px) 79vw, 55vw",
    loading: "eager",
    fetchPriority: "high",
  });
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="hero-stage">
        <div className="hero-wordmark" aria-hidden="true">
          <DisplayWordmark />
        </div>
        <nav className="hero-nav" aria-label="Introduction navigation">
          <div>
            {navigation.slice(0, 3).map((n) => (
              <a href={`#${n.id}`} key={n.id}>
                {n.label}
              </a>
            ))}
          </div>
          <div>
            {navigation.slice(3).map((n) => (
              <a href={`#${n.id}`} key={n.id}>
                {n.label}
              </a>
            ))}
          </div>
        </nav>
        <div className="hero-portrait">
          <div className="hero-portrait-reveal">
            <picture>
              <source media="(max-width: 599px)" srcSet={phonePortrait} />
              {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in portraitProps */}
              <img {...portraitProps} />
            </picture>
          </div>
        </div>
        <div className="hero-heading-wrap">
          <h1 id="hero-heading">
            {profile.headline.map((line) => (
              <span className="hero-line" key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <div className="hero-buttons">
            <ContactButton />
            <a className="button button-yellow" href="#about">
              <span>About me</span>
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-badge badge-projects glass">
          <Code2 aria-hidden="true" />
          <span>
            <b>{String(projects.length).padStart(2, "0")}</b>
            <br />
            Projects built
          </span>
        </div>
        <div className="hero-badge badge-stack glass">
          <b>
            4<span>+</span>
          </b>
          <span>
            Tools.
            <br />
            One connected stack.
          </span>
        </div>
        <div className="hero-badge badge-qualities glass">
          {profile.qualities.map((q, i) => {
            const QIcon = qualityIcons[i];
            return (
              <div key={q}>
                <QIcon size={19} aria-hidden="true" />
                <span>{q}</span>
              </div>
            );
          })}
        </div>
        <p className="hero-intro">
          {profile.name}. <br />
          {profile.role}.
        </p>
        <p className="hero-description">{profile.intro}</p>
        <a href="#about" className="hero-scroll">
          <span>Keep exploring</span>
          <ArrowDown size={16} />
        </a>
        <span className="hero-demo">Illustrated sample profile</span>
      </div>
    </section>
  );
}
