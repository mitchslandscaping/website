"use client";

import { useState } from "react";
import ProjectCards from "./project-cards";
import { useWebsiteContent } from "./website-content";

const divisions = [
  { slug: "", label: "All projects" },
  { slug: "maintenance", label: "Maintenance" },
  { slug: "design-build", label: "Design / Build" },
  { slug: "construction", label: "Construction" },
  { slug: "fencing-access-control", label: "Fencing & Access Control" },
];

export default function PortfolioArchive() {
  const { projects: portfolioProjects } = useWebsiteContent();
  const [division, setDivision] = useState("");
  const count = portfolioProjects.filter(project => !project.spotlight && (!division || project.serviceSlug === division)).length;

  return <>
    <div className="portfolio-filters" role="group" aria-label="Filter projects by division">
      {divisions.map(item => <button key={item.slug} type="button" aria-pressed={division === item.slug} aria-controls="filtered-projects" onClick={() => setDivision(item.slug)}>{item.label}</button>)}
    </div>
    <div id="filtered-projects">
      <p className="sr-only" role="status">{count} {count === 1 ? "project" : "projects"} shown.</p>
      {count ? <ProjectCards spotlight={false} compact division={division} /> : <p className="portfolio-empty">More projects in this division are coming soon.</p>}
    </div>
  </>;
}
