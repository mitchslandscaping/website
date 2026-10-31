import { pageMetadata, serviceSeo, breadcrumbs, businessId, siteUrl } from '@/lib/seo';
import StructuredData from '@/components/structured-data';
import SiteFooter from "@/components/site-footer";
import Image from "next/image";
import HeroImage from "@/components/hero-image";
import { notFound } from "next/navigation";
import { ArrowUpRight, Camera, Trees, Shovel, Fence, Sprout } from "lucide-react";
import { getWebsiteContent } from "@/lib/website-content";
import ServicePageHeader from "@/components/service-page-header";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { serviceGroups } = await getWebsiteContent();
  const { slug } = await params;
  const group = serviceGroups.find((item) => item.slug === slug);
  if (!group) return { title: 'Service not found', robots: {index: false} };
  const seo = serviceSeo[slug] ?? {title: `${group.title} | Mitch’s Landscaping`, description: group.description};
  return pageMetadata(seo.title, seo.description, `/services/${slug}`);
}
const introductions: Record<string, string> = {
  maintenance: "Property care that keeps things looking their best.",
  "design-build": "Thoughtful design. Outdoor spaces to enjoy.",
  construction: "Practical improvements. Built around your property.",
  "fencing-access-control": "Privacy, boundaries, and a better way in.",
};
const serviceImages: Record<string, { src: string; alt: string; position?: string }> = {
  "Sports Field Fencing & Backstops": { src: "/images/optimized/sports-field-fencing.webp", alt: "Baseball field with tall backstop netting and perimeter fencing", position: "center 52%" },
  "Landscape Design and Architecture": { src: "/images/optimized/landscape-design-architecture.webp", alt: "Landscape plans, tracing paper, drafting rulers, and planting templates on a design table", position: "center 55%" },
  "Arbor Care": { src: "/images/optimized/arbor-care-project.webp", alt: "Arbor care crew and equipment working beside a tree stump at a commercial property", position: "center 44%" },
  "Access control": { src: "/images/optimized/access-control-project.webp", alt: "Chain-link sliding entrance gate at a commercial property", position: "center 50%" },
  "Fencing": { src: "/images/optimized/fencing-detail-project.webp", alt: "Chain-link security fencing around industrial pipework", position: "center 55%" },
};
const anchor = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { serviceGroups } = await getWebsiteContent();
  const { slug } = await params;
  const group = serviceGroups.find((item) => item.slug === slug);
  if (!group) notFound();
  const Icon = slug === "maintenance" ? Trees : slug === "design-build" ? Sprout : slug === "construction" ? Shovel : Fence;
  return (
    <div className="division-page division-reference">
      <StructuredData data={breadcrumbs([{name: 'Home', path: '/'}, {name: group.title, path: `/services/${slug}`}])} />
      <StructuredData data={{'@context': 'https://schema.org', '@type': 'Service', name: group.title, description: group.description, url: `${siteUrl}/services/${slug}`, provider: {'@id': businessId}}} />
      <a className="skip-link" href="#division-main">Skip to content</a>
      <ServicePageHeader />
      <main id="division-main">
        <section className="division-banner">
          {group.image && <HeroImage src={group.image} alt={group.alt} />}
          <div className="container">
            <nav aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/#services">Services</a><span>/</span><span>{group.title}</span></nav>
            <h1>{group.title}</h1>
          </div>
        </section>
        <section className="division-intro container">
          <div><h2>{((group as typeof group & {introHeading?: string}).introHeading || introductions[slug])}</h2><p>{group.description}</p><a className="button button-blue" href="/#estimate">Get in touch <ArrowUpRight size={17} /></a></div>
          <nav className="division-index" aria-label="Services on this page"><p>ON THIS PAGE</p><ol>{group.services.map((service, index) => <li key={service.name}><a href={`#${anchor(service.name)}`}><span>{String(index + 1).padStart(2, "0")}</span>{service.name}</a></li>)}</ol></nav>
        </section>
        <section className="division-detail-area" aria-label={`${group.title} services`}>
          <div className="container">
            {group.services.map((service, index) => {
              const photo = (service as typeof service & {image?: string;alt?:string}).image ? {src:(service as typeof service & {image:string}).image,alt:(service as typeof service & {alt:string}).alt ?? service.name} : serviceImages[service.name] ?? (service.name === "Drainage solutions" ? { src: group.image, alt: group.alt } : null);
              return <article className="division-detail-section" id={anchor(service.name)} key={service.name}>
                {photo ? (
                  <div className="division-detail-photo">
                    <Image src={photo.src} alt={photo.alt} style={{ objectPosition: photo.position ?? "center" }} fill sizes="(max-width: 1320px) 100vw, 1320px" />
                  </div>
                ) : (
                  <div className="division-detail-photo photo-pending"><Camera size={32} aria-hidden="true" /><span>Photo coming soon</span></div>
                )}
                <div className="division-detail-body">
                  <div><div className="division-detail-title"><span>{String(index + 1).padStart(2, "0")}</span><span className="division-service-icon"><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></span><h2>{service.name}</h2></div><p>{service.description} We’ll talk through your goals and the conditions on site, then help you decide on the next step for your property.</p></div>
                  <aside className="division-included"><p>WHAT WE’LL DISCUSS</p><ul><li>Your goals for {service.name.toLowerCase()}</li><li>Property conditions and access</li><li>The scope of work and your priorities</li><li>Timing and a free estimate</li></ul><a href="/#estimate">Talk with our team <ArrowUpRight size={16} /></a></aside>
                </div>
              </article>;
            })}
          </div>
        </section>
        <section className="division-contact">
          <div className="container"><p className="company-eyebrow">LET’S GET STARTED</p><h2>Let’s talk about<br />your property.</h2><p>Tell us what you have in mind. Our team will help you work through your priorities, the scope of work, and the next step.</p><a className="button button-white" href="/#estimate">Request a free estimate <ArrowUpRight size={18} /></a></div>
        </section>
        <section className="division-related container"><p className="company-eyebrow">MORE FROM MITCH’S</p><h2>One team. More possibilities.</h2><div>{serviceGroups.filter((item) => item.id !== group.id).map((item) => <a href={`/services/${item.slug}`} key={item.id}>{item.title}<ArrowUpRight size={20} /></a>)}</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
