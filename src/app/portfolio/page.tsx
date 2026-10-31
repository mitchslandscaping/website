import { pageMetadata } from '@/lib/seo';
import { getWebsiteContent } from "@/lib/website-content";
import ServicePageHeader from "@/components/service-page-header";
import SiteFooter from "@/components/site-footer";
import PortfolioArchive from "@/components/portfolio-archive";
import ProjectCards from "@/components/project-cards";

export const metadata = pageMetadata('Landscaping & Fencing Projects | Mitch’s Landscaping', 'Explore completed landscape installations, fencing, and outdoor projects by Mitch’s Landscaping. See project photos, locations, and the work involved.', '/portfolio');
export default async function PortfolioPage() {
  const { home } = await getWebsiteContent();
  return <div className="portfolio-page">
    <a className="skip-link" href="#portfolio-main">Skip to content</a>
    <ServicePageHeader />
    <main id="portfolio-main" className="container portfolio-index">
      <p className="company-eyebrow">OUR WORK</p>
      <h1>Portfolio</h1>
      <p className="portfolio-intro">{home.portfolioIntro}</p>
      <section className="portfolio-spotlight" aria-labelledby="spotlight-heading">
        <h2 id="spotlight-heading" className="portfolio-section-title">Spotlight projects</h2>
        <ProjectCards />
      </section>
      <section className="portfolio-archive" aria-labelledby="more-projects-heading">
        <h2 id="more-projects-heading" className="portfolio-section-title">More projects</h2>
        <PortfolioArchive />
      </section>
    </main>
    <SiteFooter />
  </div>;
}
