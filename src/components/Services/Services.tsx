import { Check } from "lucide-react";
import { services } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { ContactButton } from "@/components/Contact/ContactProvider";

export function Services() {
  return (
    <section
      id="services"
      className="services section-offset"
      aria-labelledby="services-title"
    >
      <div className="section-intro" data-reveal>
        <span className="eyebrow">Ways to work together</span>
        <h2 id="services-title">
          The right start.
          <br />
          For your next step.
        </h2>
        <p>
          A focused first build, an ambitious new product, or an extra pair of
          hands. There’s a way forward for each.
        </p>
      </div>
      <div className="service-grid glass">
        {services.map((service, i) => (
          <article
            className={`service-card ${i === 0 ? "is-featured" : ""}`}
            key={service.title}
          >
            <h3>
              <span className="service-icon">
                <Icon name={service.icon} size={24} />
              </span>
              {service.title}
            </h3>
            <div className="service-value">
              {service.value}
              <span>{service.caption}</span>
            </div>
            <p>{service.description}</p>
            <ul>
              {service.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="service-fit">{service.fit}</p>
            <ContactButton service={service.title}>{service.cta}</ContactButton>
          </article>
        ))}
      </div>
      <p className="sample-note">
        Sample service options. Scope, availability, and pricing are agreed
        individually.
      </p>
    </section>
  );
}
