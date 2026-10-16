"use client";
import { Fragment, useEffect, useState } from "react";
import { Check, Copy, ArrowUpRight } from "lucide-react";
import { navigation, profile, projects, skills } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { ContactButton } from "@/components/Contact/ContactProvider";

/** lucide-react v1 dropped brand icons, so the two marks are inlined. */
function GithubMark({ size = 15 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.2c-3.34.72-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedinMark({ size = 15 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      {profile.wordmark}
      <span className="wordmark-star">✳</span>
    </span>
  );
}
/** Rendered in both the desktop sidebar and the mobile menu. */
function socialLinks() {
  return (
    <>
      {profile.githubUrl && (
        <a
          href={profile.githubUrl}
          aria-label="GitHub profile"
          target="_blank"
          rel="noreferrer"
        >
          <GithubMark />
        </a>
      )}
      {profile.linkedinUrl && (
        <a
          href={profile.linkedinUrl}
          aria-label="LinkedIn profile"
          target="_blank"
          rel="noreferrer"
        >
          <LinkedinMark />
        </a>
      )}
    </>
  );
}

/** Every skill, flattened, for the sidebar ticker. */
const stack = skills.flatMap((group) => group.items);
const glyphs = ["✳", "↗", "◈"];
// Timing the loop per item would run it faster here than it was designed to,
// because these labels are far longer than the four it replaced. Pace it by
// character instead, at the original 1.85 characters per second.
const tickerSeconds = Math.round(
  (stack.join("").length + stack.length * 3) / 1.85,
);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let ticking = false;
    function update() {
      const hero = document.getElementById("home");
      const morphing = document.documentElement.hasAttribute(
        "data-desktop-motion",
      );
      setScrolled(
        window.scrollY >
          (morphing
            ? window.innerHeight * 1.05
            : (hero?.clientHeight || 1000) * 0.38),
      );
      const sections = navigation.map((n) => ({
        id: n.id,
        rect: document.getElementById(n.id)?.getBoundingClientRect(),
      }));
      const current = [...sections]
        .reverse()
        .find((s) => s.rect && s.rect.top <= window.innerHeight * 0.42);
      setActive(current?.id || "home");
      const work = document.getElementById("projects")?.getBoundingClientRect();
      setDark(
        !!work &&
          work.top < window.innerHeight * 0.5 &&
          work.bottom > window.innerHeight * 0.5,
      );
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }
  const navLinks = (mobile = false) =>
    navigation.map((n) => (
      <a
        key={n.id}
        href={`#${n.id}`}
        className={`nav-link ${active === n.id ? "is-active" : ""}`}
        aria-current={active === n.id ? "location" : undefined}
        onClick={() => mobile && setMenu(false)}
      >
        <Icon name={n.icon} size={17} />
        <span className="rolling-label">
          <span>{n.label}</span>
          <span aria-hidden="true">{n.label}</span>
        </span>
      </a>
    ));
  return (
    <>
      <header className="mobile-header">
        <a href="#home" aria-label="Ram Kumar, home" className="brand-chip">
          <Wordmark />
        </a>
        <div className="mobile-actions">
          <ContactButton />
          <button
            className={`menu-button ${menu ? "is-open" : ""}`}
            aria-label="Open navigation"
            aria-expanded={menu}
            aria-controls="mobile-navigation"
            onClick={() => setMenu(true)}
          >
            <i />
            <i />
            <i />
            <i />
          </button>
        </div>
      </header>
      <aside
        className={`sidebar ${scrolled ? "is-visible" : ""} ${dark ? "is-dark" : ""}`}
        aria-label="Portfolio sidebar"
        inert={!scrolled}
      >
        <div className="sidebar-intro glass">
          <div className="sidebar-top">
            <a className="brand-chip" href="#home" aria-label="Ram Kumar, home">
              <Wordmark />
            </a>
            <div className="socials">{socialLinks()}</div>
            <span className="status-dot" title="Sample portfolio" />
          </div>
          <p>{profile.shortIntro}</p>
        </div>
        <div className="sidebar-stats glass">
          <div>
            <Icon name="code" size={38} />
            <strong>{projects.length} built</strong>
            <span>projects</span>
          </div>
          <div>
            <b>4+</b>
            <strong>Connected</strong>
            <span>tools</span>
          </div>
        </div>
        <nav aria-label="Main navigation" className="sidebar-nav glass">
          {navLinks()}
        </nav>
        <div
          className="stack-ticker glass"
          role="img"
          aria-label="Technologies and tools I work with"
        >
          {/* Two copies, because the loop translates by -50%. The duration
              scales with the list so the scroll speed stays constant however
              many skills are listed. */}
          <div
            aria-hidden="true"
            style={{ animationDuration: `${tickerSeconds}s` }}
          >
            {[0, 1].map((copy) => (
              <span key={copy}>
                {stack.map((item, i) => (
                  <Fragment key={item}>
                    {item} <b>{glyphs[i % glyphs.length]}</b>{" "}
                  </Fragment>
                ))}
              </span>
            ))}
          </div>
        </div>
        <div className="sidebar-contact glass">
          {profile.email ? (
            <button onClick={copyEmail}>
              {copied ? "Email copied" : profile.email}
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          ) : (
            <span>
              <span className="status-dot" />
              {profile.location}
            </span>
          )}
        </div>
        <ContactButton className="sidebar-cta" />
      </aside>
      <Modal
        open={menu}
        onClose={() => setMenu(false)}
        title="Navigation"
        className="navigation-modal"
      >
        <div id="mobile-navigation">
          <Wordmark />
          <p className="muted">
            A little about me.
            <br />A closer look at the work.
          </p>
          <nav aria-label="Mobile navigation">{navLinks(true)}</nav>
          <div className="socials menu-socials">{socialLinks()}</div>
          <p className="menu-location">
            {profile.location} <ArrowUpRight size={16} />
          </p>
        </div>
      </Modal>
    </>
  );
}
