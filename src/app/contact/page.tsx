import { pageMetadata } from '@/lib/seo';
import HeroImage from "@/components/hero-image";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import ServicePageHeader from "@/components/service-page-header";
import SiteFooter from "@/components/site-footer";
import { getWebsiteContent } from "@/lib/website-content";

export const metadata = pageMetadata('Contact Mitch’s Landscaping | Larose, LA', 'Call (985) 693-6354 or contact Mitch’s Landscaping at 13957 E Main St, Larose, LA. Office hours: Monday–Friday, 9 AM–4 PM.', '/contact');

export default async function ContactPage() {
  const { site, office, home } = await getWebsiteContent();
  return <div className="contact-page division-reference">
    <a className="skip-link" href="#contact-main">Skip to content</a>
    <ServicePageHeader />
    <main id="contact-main">
      <section className="division-banner contact-banner">
        <HeroImage src={office.banner.src} alt={office.banner.alt} />
        <div className="container">
          <nav aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Contact</span></nav>
          <h1>Contact us</h1>
        </div>
      </section>
      <section className="container contact-main" aria-labelledby="contact-office-title">
        <div className="contact-introduction">
          <p className="company-eyebrow">OUR OFFICE</p>
          <h2 id="contact-office-title">Contact our team.</h2>
          <p>For questions about your property or ongoing service, call or email our office.</p>
          <div className="contact-office-details">
            <div>
              <h3>Office address</h3>
              <address>{office.street}<br />{office.cityLine}</address>
              <a href={office.directionsUrl} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
            <div>
              <h3>Office hours</h3>
              <dl className="contact-hours">
                <div><dt>{office.weekdays}</dt><dd>{office.weekdayHours}</dd></div>
                <div><dt>{office.weekend}</dt><dd>{office.weekendHours}</dd></div>
              </dl>
            </div>
          </div>
        </div>
        <div className="contact-methods">
          {site.phone && <a className="contact-method" href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>
            <Phone className="contact-method-icon" size={22} strokeWidth={1.5} aria-hidden="true" />
            <span><span className="contact-method-label">Call our office</span><span className="contact-method-value">{site.phone}</span></span>
            <ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" />
          </a>}
          {site.email && <a className="contact-method" href={`mailto:${site.email}`}>
            <Mail className="contact-method-icon" size={22} strokeWidth={1.5} aria-hidden="true" />
            <span><span className="contact-method-label">Email our team</span><span className="contact-method-value">{site.email}</span></span>
            <ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" />
          </a>}
          <p className="contact-response">{home.responseNote}</p>
        </div>
      </section>
      <section className="division-contact">
        <div className="container">
          <p className="company-eyebrow">LET’S GET STARTED</p>
          <h2>Let’s talk about<br />your property.</h2>
          <p>Tell us what you have in mind. Our team will help you work through your priorities, the scope of work, and the next step.</p>
          <a className="button button-white" href="/#estimate">Request a free estimate <ArrowUpRight size={18} /></a>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
