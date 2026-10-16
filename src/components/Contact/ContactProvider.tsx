"use client";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type FormEvent,
} from "react";
import { ArrowUpRight, Download, Check, Mail } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { profile } from "@/data/site";

const ContactContext = createContext<(service?: string) => void>(() => {});
export const useContact = () => useContext(ContactContext);
export function ContactButton({
  children = "Let’s talk",
  className = "",
  service = "",
}: {
  children?: ReactNode;
  className?: string;
  service?: string;
}) {
  const open = useContact();
  return (
    <button
      className={`button button-yellow ${className}`}
      onClick={() => open(service)}
    >
      <span>{children}</span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </button>
  );
}
export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState("");
  const [saved, setSaved] = useState(false);
  function download(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const brief = `PROJECT BRIEF\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nProject: ${data.get("service")}\n\n${data.get("message")}\n\nPrepared locally. This brief has not been sent.\n`;
    const url = URL.createObjectURL(
      new Blob([brief], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "project-brief.txt";
    link.click();
    URL.revokeObjectURL(url);
    setSaved(true);
  }
  return (
    <ContactContext.Provider
      value={(value = "") => {
        setService(value);
        setSaved(false);
        setOpen(true);
      }}
    >
      {children}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Let’s talk"
        className="contact-modal"
      >
        <span className="eyebrow">A good place to start</span>
        <h2>
          What are you
          <br />
          thinking about?
        </h2>
        <p className="muted">
          {profile.email
            ? "Put your idea into a short brief. Save it or start a conversation."
            : "This is a sample portfolio. Prepare and download your brief here; nothing is sent or stored on a server."}
        </p>
        <form onSubmit={download} onChange={() => setSaved(false)}>
          <div className="form-row">
            <label>
              Your name
              <input
                name="name"
                autoComplete="name"
                placeholder="Name"
                required
                maxLength={100}
              />
            </label>
            <label>
              Your email
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                maxLength={254}
              />
            </label>
          </div>
          <label>
            What do you have in mind?
            <select
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">Let’s figure it out</option>
              <option>Keep growing</option>
              <option>Start something</option>
              <option>Go further</option>
            </select>
          </label>
          <label>
            A little about the idea
            <textarea
              name="message"
              rows={4}
              required
              minLength={10}
              maxLength={5000}
              placeholder="The idea, the people it’s for, and what you’d like to achieve…"
            />
          </label>
          <button className="button button-yellow" type="submit">
            {saved ? <Check size={18} /> : <Download size={18} />}
            <span>{saved ? "Brief downloaded" : "Download project brief"}</span>
          </button>
          <p role="status" className="form-status">
            {saved
              ? "Saved to your downloads. Your details have not been submitted."
              : "Your brief stays on this device."}
          </p>
        </form>
        {profile.email && (
          <a className="text-link" href={`mailto:${profile.email}`}>
            <Mail size={16} /> Email {profile.name}
          </a>
        )}
        {profile.bookingUrl && (
          <a
            className="button button-yellow"
            href={profile.bookingUrl}
            target="_blank"
            rel="noreferrer"
          >
            Book a call <ArrowUpRight size={18} />
          </a>
        )}
      </Modal>
    </ContactContext.Provider>
  );
}
