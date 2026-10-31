import { pageMetadata, breadcrumbs } from '@/lib/seo';
import StructuredData from '@/components/structured-data';
import { getWebsiteContent } from "@/lib/website-content";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ImageIcon } from "lucide-react";
import ServicePageHeader from "@/components/service-page-header";
import SiteFooter from "@/components/site-footer";
import ProjectPhotoCarousel from "@/components/project-photo-carousel";
import { previousProjectSlugs } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { projects: portfolioProjects } = await getWebsiteContent();
  const { slug } = await params;
  const project = portfolioProjects.find(p => p.slug === (previousProjectSlugs[slug] ?? slug));
  if (!project) return {title: 'Project not found', robots: {index: false}};
  return pageMetadata(`${project.title} | Mitch’s Landscaping`, project.description, `/portfolio/${project.slug}`);
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { projects: portfolioProjects } = await getWebsiteContent();
  const { slug } = await params;
  if (previousProjectSlugs[slug]) redirect(`/portfolio/${previousProjectSlugs[slug]}`);
  const project = portfolioProjects.find(p => p.slug === slug);
  if (!project) notFound();
  const additionalPhotos = project.photos?.slice(1) ?? [];
  return <div className="portfolio-page portfolio-project-page">
    <StructuredData data={breadcrumbs([{name: 'Home', path: '/'}, {name: 'Portfolio', path: '/portfolio'}, {name: project.title, path: `/portfolio/${project.slug}`}])} />
    <a className="skip-link" href="#project-main">Skip to content</a>
    <ServicePageHeader />
    <main id="project-main" className="portfolio-detail project-clean project-standard container">
      <Link className="portfolio-back" href="/portfolio"><ArrowLeft size={17} aria-hidden="true" /> All projects</Link>
      <header className="case-heading">
        <div><p className="company-eyebrow">{project.category}</p><h1>{project.title}</h1></div>
      </header>
      <div className="case-feature">
        <figure className="case-spotlight">
          {project.photos?.length ? <><div className="case-photo"><Image unoptimized={project.photos[0].src.startsWith('/api/media/')} src={project.photos[0].src} alt={project.photos[0].alt} fill priority sizes="(max-width: 850px) 100vw, 45vw" /></div></> : <div className="case-photo photo-pending"><ImageIcon size={34} strokeWidth={1.4} aria-hidden="true" /><span>Project photo coming soon</span></div>}
        </figure>
        <aside className="case-brief" aria-labelledby="case-brief-heading">
          <h2 id="case-brief-heading">The project</h2>
          <p>{project.description}</p>
          <dl className="case-job-data">
            {project.propertyType && <div><dt>Property type</dt><dd>{project.propertyType}</dd></div>}
            {project.services?.length ? <div><dt>Services</dt><dd>{project.services.join(", ")}</dd></div> : null}
            <div><dt>Location</dt><dd>{project.city ?? "Location to be added"}</dd></div>
            <div><dt>Completed</dt><dd>{project.completed ?? "Month to be added"}</dd></div>
          </dl>
        </aside>
      </div>
      {additionalPhotos.length ? <ProjectPhotoCarousel photos={additionalPhotos} /> : null}
    </main>
    <SiteFooter />
  </div>;
}
