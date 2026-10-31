"use client";

import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { useWebsiteContent } from "./website-content";

export default function SiteFooter({ home = false }: { home?: boolean }) {
  const { site, serviceGroups } = useWebsiteContent();
  const anchor = (id: string) => `${home ? "" : "/"}#${id}`;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <a href={home ? "#top" : "/"} aria-label="Mitch’s Landscaping home"><Image src={site.logo} alt="Mitch’s Landscaping" width={230} height={55} unoptimized /></a>
            <p>Serving our community since 1989.</p>
            <p>Based in Larose, LA. Serving communities throughout Lafourche and Terrebonne parishes.</p>
          </div>
          <nav className="site-footer-links" aria-label="Footer company navigation">
            <h2>Company</h2>
            <a href={anchor("about")}>About us</a>
            <a href="/portfolio">Portfolio</a>
            <a href={anchor("careers")}>Careers</a>
            <a href="/contact">Contact</a>
          </nav>
          <nav className="site-footer-links" aria-label="Footer services navigation">
            <h2>Our services</h2>
            {serviceGroups.map(group => <a key={group.slug} href={`/services/${group.slug}`}>{group.title}</a>)}
          </nav>
          <div className="site-footer-project">
            <h2>Let’s get started.</h2>
            <p>Tell us what you have in mind for your property.</p>
            <hr className="site-footer-contact-divider" />
            {site.phone && <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>}
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} Mitch’s Landscaping</span>
          <div><a href="/privacy">Privacy</a><a className="site-footer-owner" href="/owner" aria-label="Owner login" title="Owner login"><LockKeyhole size={14} strokeWidth={1.5} aria-hidden="true" /></a></div>
        </div>
      </div>
    </footer>
  );
}
