"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, ArrowRight } from "lucide-react";
import { useWebsiteContent } from "./website-content";
import ServicesMenu from "./services-menu";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#about", label: "About" },
  { href: "/#careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];
export default function ServicePageHeader() {
  const { site } = useWebsiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 36);
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    const desktop = window.matchMedia("(min-width:1025px)");
    const resize = () => { if (desktop.matches) setMenuOpen(false); };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("keydown", key);
    desktop.addEventListener("change", resize);
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("keydown", key); desktop.removeEventListener("change", resize); };
  }, []);
  return <>
    {site.announcement.enabled && <div className={`announcement ${scrolled ? "announcement-hidden" : ""}`} aria-hidden={scrolled}>
      <a className="announcement-pill" href={`/?service=${encodeURIComponent(site.announcement.service)}#estimate`} tabIndex={scrolled ? -1 : 0}>
        <span>{site.announcement.message}{" "}<strong>{site.announcement.action}</strong></span>
        <span className="announcement-arrow" aria-hidden="true"><ArrowRight size={14} /></span>
      </a>
    </div>}
    <header className={`site-header ${site.announcement.enabled ? "has-announcement" : ""} service-page-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        <a href="/" className="brand" aria-label="Mitch’s Landscaping home"><Image src={site.logo} alt="Mitch’s Landscaping" width={220} height={53} priority unoptimized /></a>
        <nav className="desktop-nav" aria-label="Main navigation"><ServicesMenu />{links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>
        <div className="header-actions"><a href="/#estimate" className="button button-blue header-estimate">Request Quote</a><button className="menu-toggle icon-button" aria-expanded={menuOpen} aria-controls="service-mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
      </div>
      {menuOpen && <nav id="service-mobile-menu" className="mobile-menu" aria-label="Mobile navigation"><ServicesMenu />{links.map((link) => <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={18} /></a>)}<a href="/#estimate">Request Quote <ArrowUpRight size={18} /></a></nav>}
    </header>
  </>;
}
