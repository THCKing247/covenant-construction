import { ContactForm } from "@/components/ContactForm";
import { FooterYear } from "@/components/FooterYear";
import { ProjectGallery } from "@/components/ProjectGallery";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">Residential &amp; Commercial Construction</div>
            <h1>
              BUILDING A<br />
              HIGHER STANDARD
            </h1>
            <div className="rule" />
            <p>
              Residential and commercial building, remodeling, design-build and repairs throughout California’s
              Central Coast.
            </p>
            <a className="btn" href="#contact">
              Get a Quote →
            </a>
          </div>
        </section>

        <section className="service-strip" id="services">
          <div className="service">
            <svg viewBox="0 0 48 48">
              <path d="M5 23 24 7l19 16M11 20v22h26V20M20 42V29h9v13" />
            </svg>
            <div>
              <b>Residential Building</b>
              <small>New construction &amp; improvements</small>
            </div>
          </div>
          <div className="service">
            <svg viewBox="0 0 48 48">
              <path d="M8 42V16h14v26M22 42V7h18v35M13 22h4m-4 7h4m-4 7h4m13-22h4m-4 8h4m-4 8h4M4 42h40" />
            </svg>
            <div>
              <b>Commercial Building</b>
              <small>Build-outs &amp; tenant improvements</small>
            </div>
          </div>
          <div className="service">
            <svg viewBox="0 0 48 48">
              <path d="M8 34 34 8l6 6-26 26-6-6ZM26 8l6-4 12 12-4 6M6 6l10 10" />
            </svg>
            <div>
              <b>Remodeling &amp; Design-Build</b>
              <small>From concept through construction</small>
            </div>
          </div>
          <div className="service">
            <svg viewBox="0 0 48 48">
              <path d="M6 42 30 18M27 7l14 14M24 10l6-6 14 14-6 6M5 35l8 8" />
            </svg>
            <div>
              <b>Repairs &amp; Improvements</b>
              <small>Property repairs &amp; upgrades</small>
            </div>
          </div>
        </section>

        <ProjectGallery />
        <p className="portfolio-disclaimer">
          Portfolio visuals are digitally staged representations inspired by project photography; final installed
          details may vary.
        </p>

        <section className="intro">
          <div>
            <div className="kicker">Our Service Area</div>
            <h2>
              PROUDLY SERVING THE
              <br />
              CENTRAL COAST OF CALIFORNIA
            </h2>
            <div className="counties">San Luis Obispo County{" \u00A0 | \u00A0 "}Santa Barbara County</div>
          </div>
          <div className="summary">
            At Covenant Construction of CA, we bring your vision to life with exceptional craftsmanship, clear
            communication, and a commitment to quality. From residential building to commercial projects, remodeling,
            design-build and repairs, we serve communities throughout the Central Coast.
          </div>
          <div className="intro-links">
            <a className="btn" href="#process">
              Our Process →
            </a>
            <a className="text-link" href="#about">
              LEARN MORE ABOUT US
            </a>
          </div>
        </section>

        <section className="details dark" id="about">
          <div className="kicker">About Covenant Construction</div>
          <h2>QUALITY. INTEGRITY. RESULTS.</h2>
          <p>
            We approach every project with thoughtful planning, transparent communication and respect for the details.
            Whether you are planning a new build, renovating an existing space or improving a commercial property, our
            focus is dependable craftsmanship and a collaborative experience.
          </p>
          <div className="detail-grid">
            <article>
              <h3>Residential Building</h3>
              <p>New homes, additions and property improvements.</p>
            </article>
            <article>
              <h3>Commercial Building</h3>
              <p>Commercial construction, build-outs and tenant improvements.</p>
            </article>
            <article>
              <h3>Remodeling &amp; Design-Build</h3>
              <p>Kitchens, bathrooms, whole-property renovations and coordinated design-build projects.</p>
            </article>
            <article>
              <h3>Repairs</h3>
              <p>Residential and commercial property repairs and upgrades.</p>
            </article>
          </div>
        </section>

        <section className="details" id="process">
          <div className="kicker">Our Process</div>
          <h2>A CLEAR PATH FROM IDEA TO COMPLETION</h2>
          <div className="process-grid">
            <article>
              <strong>01 / DISCOVER</strong>
              <h3>Share Your Vision</h3>
              <p>Tell us about your goals, property and priorities.</p>
            </article>
            <article>
              <strong>02 / PLAN</strong>
              <h3>Define the Scope</h3>
              <p>Review your project needs, schedule and next steps.</p>
            </article>
            <article>
              <strong>03 / BUILD</strong>
              <h3>Bring It to Life</h3>
              <p>Focused construction and communication from start to finish.</p>
            </article>
          </div>
        </section>

        <section className="details dark" id="testimonials">
          <div className="kicker">Client Experience</div>
          <h2>BUILT ON TRUST</h2>
          <p>
            We value lasting relationships and take pride in treating each project with care. Verified client
            testimonials can be featured here as they become available.
          </p>
        </section>

        <section className="details contact" id="contact">
          <div className="contact-inner">
            <div>
              <div className="kicker">Let&apos;s Talk</div>
              <h2>START YOUR NEXT PROJECT</h2>
              <p>Serving San Luis Obispo County and Santa Barbara County, California.</p>
              <p>
                <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer>
        <a href="#home">
          <img src="/images/logo.webp" alt="Covenant Construction of CA official logo" />
        </a>
        <div>
          Serving San Luis Obispo &amp; Santa Barbara Counties
          <br />
          California Contractor License #1160030
        </div>
        <div>
          <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
          <br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <br />© <FooterYear /> Covenant Construction of CA
        </div>
      </footer>
    </>
  );
}
