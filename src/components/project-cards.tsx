"use client";

import { editAttribute } from '@/sanity/edit-attribute';
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { useWebsiteContent } from "./website-content";

export default function ProjectCards({ exclude, spotlight = true, compact = false, division }: { exclude?: string; spotlight?: boolean; compact?: boolean; division?: string }) {
  const { projects: portfolioProjects } = useWebsiteContent();
  return <div className={`portfolio-grid${compact ? " portfolio-grid-compact" : ""}`}>
    {portfolioProjects.filter(project => project.slug !== exclude && Boolean(project.spotlight) === spotlight && (!division || project.serviceSlug === division)).map(project => (
      <Link className="portfolio-card" href={`/portfolio/${project.slug}`} key={project.slug}>
        {project.photos ? <div className="portfolio-card-photo" data-sanity={editAttribute(project, "photos[0].srcUpload")}><Image src={project.photos[0].src} alt={project.photos[0].alt} fill sizes="(max-width: 700px) 100vw, 33vw" /></div> : <div className="portfolio-card-photo photo-pending"><ImageIcon size={30} strokeWidth={1.4} aria-hidden="true" /><span>Coming soon</span></div>}
        <div className="portfolio-card-copy">
          <p>{project.category}</p>
          <h3>{project.title}</h3>
          <span>{project.photos && !project.example ? "View Project" : "Preview Project"} <ArrowUpRight size={18} aria-hidden="true" /></span>
        </div>
      </Link>
    ))}
  </div>;
}
