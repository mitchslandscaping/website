import type { Metadata } from 'next';

export const siteUrl = 'https://www.mitchlandscaping.com';
export const businessId = `${siteUrl}/#business`;
export const homeTitle = 'Mitch’s Landscaping | Landscape Fencing Construction';
export const homeDescription = 'Landscaping, fencing, and outdoor construction across Lafourche and Terrebonne parishes. Based in Larose, LA. Request a free estimate from Mitch’s Landscaping.';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: {
      type: 'website', siteName: 'Mitch’s Landscaping', title, description, url: path,
      images: [{ url: '/images/mitchs-landscaping-share.png', width: 1200, height: 630, alt: 'Mitch’s Landscaping logo' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/mitchs-landscaping-share.png'] },
  };
}

export const serviceSeo: Record<string, {title: string; description: string}> = {
  maintenance: {title: 'Lawn & Landscape Maintenance | Mitch’s Landscaping', description: 'Lawn care, landscape upkeep, arbor care, and herbicide treatments from Mitch’s Landscaping, serving Lafourche and Terrebonne parishes. Request a free maintenance estimate.'},
  'design-build': {title: 'Landscape Design & Architecture | Mitch’s Landscaping', description: 'Landscape design, architecture, and installation for your outdoor space. Talk with Mitch’s Landscaping about your property in Lafourche or Terrebonne Parish. Free estimates.'},
  construction: {title: 'Outdoor Construction & Court Surfacing | Mitch’s Landscaping', description: 'Patios, retaining walls, drainage, and tennis and pickleball court surfacing. Discuss your outdoor construction project with Mitch’s Landscaping in Lafourche and Terrebonne parishes.'},
  'fencing-access-control': {title: 'Fencing & Access Control | Mitch’s Landscaping', description: 'Residential and commercial fencing, access control, sports field fencing, and backstops from Mitch’s Landscaping, serving Lafourche and Terrebonne parishes. Free estimates.'},
};

export function breadcrumbs(items: {name: string; path: string}[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({'@type': 'ListItem', position: index + 1, name: item.name, item: `${siteUrl}${item.path}`})) };
}
