"use client";

import { editAttribute } from '@/sanity/edit-attribute';
import Image from "next/image";
import ProjectCards from "./project-cards";
import TeamMemberCard from "./team-member-card";
import CareersBoard from "./careers-board";
import SiteFooter from "./site-footer";
import ServicesMenu from "./services-menu";
import Dialog from "./dialog";
import { useQuote } from "./quote-provider";
import HeroVideo from "./hero-video";
import TrustedBy, { useTrustedBy } from "./trusted-by";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  Plus,
  House,
  Check,
  Phone,
  Shovel,
  Trees,
  MessageSquare,
  Camera,
} from "lucide-react";
import { estimateSteps } from "@/lib/content";
import { useWebsiteContent } from "./website-content";

function serviceExploreLabel(title: string) {
  const name = title.replace(" & ", " / ");
  return `Explore ${name}${name.endsWith("Services") ? "" : " Services"}`;
}

const links = [
  { href: "#services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "#about", label: "About" },
  { href: "#careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Home() {
  const { site, serviceGroups, home } = useWebsiteContent();
  const ownerIndex = site.team.findIndex(member => member.active !== false && member.role === "Owner");
  const { openQuote: showQuote } = useQuote();
  const trusted = useTrustedBy(site.trustedBy);
  const [serviceDetail, setServiceDetail] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState<"privacy" | null>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1025px)");
    const closeDesktopMenu = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeDesktopMenu);
    return () => desktop.removeEventListener("change", closeDesktopMenu);
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);

    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const openHashDialog = () => {
      if (window.location.hash === "#privacy") setModal("privacy");
      if (window.location.hash === "#owner") window.location.assign("/owner");
    };
    openHashDialog();
    window.addEventListener("hashchange", openHashDialog);
    return () => window.removeEventListener("hashchange", openHashDialog);
  }, []);
  function openQuote() {
    setMenuOpen(false);
    showQuote();
  }
  function chooseService(name: string) {
    setServiceDetail(null);
    setMenuOpen(false);
    showQuote(name);
  }
  return (
    <div
      onClick={(event) => {
        const link = (event.target as HTMLElement).closest(
          'a[href="#estimate"]',
        );
        if (link) {
          event.preventDefault();
          openQuote();
        }
      }}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {site.announcement.enabled && (
        <div
          className={`announcement ${scrolled ? "announcement-hidden" : ""}`}
          aria-hidden={scrolled}
        >
          <button
            className="announcement-pill"
            onClick={() => chooseService(site.announcement.service)}
            tabIndex={scrolled ? -1 : 0}
            aria-haspopup="dialog"
          >
            <span>
              {site.announcement.message}{" "}
              <strong>{site.announcement.action}</strong>
            </span>
            <span className="announcement-arrow" aria-hidden="true">
              <ArrowRight size={14} />
            </span>
          </button>
        </div>
      )}
      <header
        className={`site-header ${site.announcement.enabled ? "has-announcement" : ""} ${scrolled ? "scrolled" : ""}`}
      >
        <div className="header-inner">
          <a
            href="#top"
            className="brand"
            aria-label="Mitch’s Landscaping home"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src={site.logo}
              alt="Mitch’s Landscaping"
              width={220}
              height={53}
              priority
              unoptimized
            />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <ServicesMenu home />
            {links.filter((link) => link.label !== "Services").map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="button button-blue header-estimate"
              onClick={openQuote}
              aria-label="Request Quote"
            >
              <span>Request Quote</span>
            </button>
            <button
              className="menu-toggle icon-button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
          >
            <ServicesMenu home />
            {links.filter((link) => link.label !== "Services").map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                <ArrowUpRight size={18} />
              </a>
            ))}
            <a
              href="#estimate"
              aria-haspopup="dialog"
              onClick={() => setMenuOpen(false)}
            >
              Request Quote
              <ArrowUpRight size={18} />
            </a>
            {site.phone && (
              <a href={`tel:${site.phone}`}>
                Call Mitch’s
                <Phone size={18} />
              </a>
            )}
          </nav>
        )}
      </header>
      <main id="main">
        <section className="landing-hero" id="top" aria-labelledby="hero-heading">
          <HeroVideo src={site.hero.video} poster={site.hero.image} />
          <div className="landing-hero-overlay" aria-hidden="true" />
          <div className="landing-hero-grid">
            <div className="landing-hero-copy">
              <p className="landing-hero-label">{site.hero.label}</p>
              <h1 id="hero-heading">
                {site.hero.headline.map((line) => <span key={line}>{line}</span>)}
              </h1>
            </div>
            <div className="landing-hero-details">
              <p className="landing-hero-description">{site.hero.description}</p>
              <div className="landing-hero-actions">
                <a href="#estimate" aria-haspopup="dialog" className="button landing-hero-quote">
                  Request Quote
                </a>
                <a href="#services" className="landing-hero-services">
                  Our services <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
              <p className="landing-hero-note">{site.hero.note}</p>
            </div>
          </div>
        </section>

        <TrustedBy content={trusted.content} />

        <section className="intro-strip" aria-label="Mitch’s services at a glance">
          <div className="container intro-inner">
            <div className="intro-stat">
              <strong>1989</strong>
              <span>SERVING OUR<br />COMMUNITY SINCE</span>
            </div>
            <div className="intro-stat">
              <strong>40<span className="intro-stat-plus">+</span></strong>
              <span>YEARS OF INDUSTRY<br />EXPERIENCE</span>
            </div>
            <div className="intro-stat">
              <strong>100<span className="intro-stat-plus">+</span></strong>
              <span>COMMERCIAL CLIENTS</span>
            </div>
            <div className="intro-stat">
              <strong className="intro-stat-response" aria-label="12 hours">12<span className="intro-stat-hour-badge">HR</span></strong>
              <span>AVERAGE ESTIMATE<br />RESPONSE TIME</span>
            </div>
          </div>
        </section>

        <section className="company-section company-owner-section" id="about" aria-labelledby="about-heading">
          <div className="container company-layout">
            {site.aboutPhoto.src ? (
              <figure className="company-photo">
                <Image src={site.aboutPhoto.src} alt={site.aboutPhoto.alt} fill sizes="(max-width: 800px) 100vw, 45vw" style={{ objectPosition: site.aboutPhoto.position }} />
              </figure>
            ) : (
              <div className="company-photo photo-pending"><Camera size={32} aria-hidden="true" /><span>Company photo coming soon</span></div>
            )}
            <div className="company-copy">
              <p className="company-eyebrow">ABOUT MITCH’S</p>
              <h2 id="about-heading">{home.aboutHeading.split("\n").map((line,i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</h2>
              <p className="company-owner-intro">{home.aboutIntro}</p>
              <p className="company-description">{site.story || "Mitch’s has been part of this community since 1989. From the grounds you care for every day to the improvements you’ve been planning, we’re here to help you take the next step."}</p>
              <p className="company-description company-owner-detail">{home.aboutDetail}</p>
              <div className="company-owner-footer"><span>Serving our community since <strong>1989</strong></span><span>Residential & commercial</span></div>
              <div className="company-action">
                <a className="button button-blue" href="#estimate" aria-haspopup="dialog">Talk with our team <ArrowUpRight size={19} /></a>
                <span>Let’s start with a free estimate.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section" aria-labelledby="team-heading">
          <div className="container">
            <div className="team-grid">
              <div className="team-heading">
                <p className="company-eyebrow">OUR TEAM</p>
                <h2 id="team-heading">{home.teamHeading}</h2>
                <p className="team-introduction">{home.teamIntro}</p>
              </div>
              {ownerIndex >= 0 && <TeamMemberCard member={site.team[ownerIndex]} index={ownerIndex} featured />}
            </div>
            <div className="team-roster">
              {site.team.map((member,index) => member.active === false || index === ownerIndex ? null : <TeamMemberCard key={member._key || `${member.name}-${index}`} member={member} index={index} />)}
            </div>
          </div>
        </section>

        <section
          className="section services-section service-overview services-divisions"
          id="services"
          aria-labelledby="services-heading"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span className="blue-dash" /> WHAT WE DO
                </p>
                <h2 id="services-heading">{home.servicesHeading}</h2>
              </div>
              <p>
                {home.servicesIntro}
              </p>
            </div>
            <div className="services-grid">
              {serviceGroups.map((group) => (
                <a className="service-card" key={group.id} href={`/services/${group.slug}`} aria-label={serviceExploreLabel(group.title)}>
                  {group.image ? <div className="service-photo">
                    <Image
                      src={group.image}
                      alt={group.alt}
                      style={{ objectPosition: "center" }}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 1050px) 50vw, 25vw"
                    />
                  </div> : <div className="service-photo photo-pending"><Camera size={28} aria-hidden="true" /><span>Photo coming soon</span></div>}
                  <div className="service-details">
                    <h3>{group.title.replace("\n", " ")}</h3>
                    <p className="division-description">{group.cardDescription}</p>
                    <ul className="service-card-list">
                    {group.services.map((service) => (
                      <li key={service.name}>{service.name}</li>
                    ))}
                    </ul>
                    <span className="division-explore">Explore <ArrowUpRight size={18} /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="customer-stories" id="reviews" aria-labelledby="reviews-heading">
          <div className="container">
            <div className="customer-stories-heading">
              <div><p className="company-eyebrow">CUSTOMER REVIEWS</p><h2 id="reviews-heading">Good work. In their words.</h2></div>
              <a href={site.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="button button-outline">Read our Google reviews <ArrowUpRight size={18} /></a>
            </div>
            <div className="customer-stories-grid">
              {site.reviews.map((review) => (
                <figure className="customer-story" key={review.author}>
                  <div className="customer-stars" aria-label="5 out of 5 stars">★★★★★</div>
                  <blockquote>“{review.quote}”</blockquote>
                  <figcaption><strong>{review.author}</strong><a href={site.googleBusinessUrl} target="_blank" rel="noopener noreferrer">Google review <ArrowUpRight size={14} /></a></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="portfolio-section" id="work" aria-labelledby="portfolio-heading">
          <div className="container">
            <div className="portfolio-heading">
              <div><p className="company-eyebrow">OUR WORK</p><h2 id="portfolio-heading">{home.portfolioHeading}</h2></div>
              <a className="text-link" href="/portfolio">View All Projects <ArrowUpRight size={18} /></a>
            </div>
            <ProjectCards />
          </div>
        </section>

        <section
          className="process-section section property-timeline"
          id="process"
          aria-labelledby="process-heading"
        >
          <div className="container">
            <div className="section-heading centered-heading">
              <div>
                <p className="eyebrow">HOW IT WORKS</p>
                <h2 id="process-heading">
                  A clear path to
                  <br />
                  a better property.
                </h2>
              </div>

            </div>
            <ol className="process-grid">
              {estimateSteps.map((step, i) => (
                <li key={step.title}>
                  <span className="process-number">{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {site.serviceAreas.length > 0 && (
          <section className="section service-area" id="service-area">
            <div className="container">
              <p className="eyebrow">CLOSE TO HOME</p>
              <h2>Proud to work in your neighborhood.</h2>
              <p>{site.serviceAreas.join(" · ")}</p>
            </div>
          </section>
        )}

        <CareersBoard />

        <section
          className="estimate-section section"
          id="estimate"
          aria-labelledby="estimate-heading"
        >
          <div className="container closing-cta">
            <p className="eyebrow">LANDSCAPING. LAWN CARE. CONSTRUCTION.</p>
            <h2 id="estimate-heading">
              {home.closingHeading}
            </h2>
            <p>
              {home.closingIntro}
            </p>
            <div className="closing-actions">
              <button className="button button-white" onClick={openQuote}>
                Request Quote <ArrowRight size={18} />
              </button>
              {site.phone && (
                <a className="button button-glass" href={`tel:${site.phone}`}>
                  <Phone size={18} />
                  Call {site.phone}
                </a>
              )}
            </div>
            <small>{home.responseNote}</small>
          </div>
        </section>
      </main>
      <div onClick={(event) => {
        const link = (event.target as HTMLElement).closest("a");
        if (link?.getAttribute("href") === "#privacy") {
          event.preventDefault();
          setModal("privacy");
        }
      }}><SiteFooter home /></div>

      {serviceDetail !== null && (
        <Dialog
          title={serviceGroups[serviceDetail].title.replace("\n", " ")}
          onClose={() => setServiceDetail(null)}
          className="service-dialog"
        >
          <p className="eyebrow">OUR SERVICES</p>
          <h2>{serviceGroups[serviceDetail].title.replace("\n", " ")}</h2>
          <p>{serviceGroups[serviceDetail].description}</p>
          <div className="service-list">
            {serviceGroups[serviceDetail].services.map((service) => (
              <details key={service.name}>
                <summary>
                  {service.name}
                  <Plus size={17} />
                </summary>
                <div className="service-detail">
                  <p>{service.description}</p>
                  <button
                    className="text-link"
                    onClick={() => chooseService(service.name)}
                  >
                    Get a quote for this service <ArrowRight size={16} />
                  </button>
                </div>
              </details>
            ))}
          </div>
        </Dialog>
      )}
      {modal === "privacy" && (
        <Dialog
          title="Privacy information"
          onClose={() => setModal(null)}
        >
          <p className="eyebrow">PRIVACY</p>
          <h2>Your information.</h2>
          <p>
            Employment applications are processed and stored through Fillout.
            The contact details, answers, and optional résumé you submit are shared
            with Mitch’s Landscaping to review your application and contact you.
            Application notifications are sent to our company inbox.
          </p>
          <p>
            Quote requests are processed and stored through Fillout. Your contact
            information, property details, and optional photos are shared with
            Mitch’s Landscaping to review and respond to your request.
          </p>
          <p>
            Links to Google open an external website with its own privacy
            practices. You can review <a href="https://www.fillout.com/privacy" target="_blank" rel="noopener noreferrer">Fillout’s privacy policy</a> or email <a href={`mailto:${site.email}`}>{site.email}</a> with questions about your submitted information.
          </p>
          <button className="button button-blue" onClick={() => setModal(null)}>
            Got it
            <Check size={18} />
          </button>
        </Dialog>
      )}
    </div>
  );
}
