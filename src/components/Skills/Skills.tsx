import { skills } from "@/data/site";
import { Icon } from "@/components/ui/Icon";

export function Skills() {
  return (
    <section
      id="skills"
      className="skills section-offset"
      aria-labelledby="skills-title"
    >
      <div className="section-intro" data-reveal>
        <span className="eyebrow">Tools and technologies</span>
        <h2 id="skills-title">
          The stack.
          <br />
          End to end.
        </h2>
        <p>
          What I reach for across the interface, the server, and everything
          that gets a project deployed and keeps it running.
        </p>
      </div>
      <div className="skill-grid">
        {skills.map((group) => (
          <article className="skill-card glass" key={group.title}>
            <h3>
              <span className="skill-icon">
                <Icon name={group.icon} size={20} />
              </span>
              {group.title}
            </h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
