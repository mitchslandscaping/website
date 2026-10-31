import Home from "@/components/home";
import { pageMetadata, homeTitle, homeDescription, businessId, siteUrl } from '@/lib/seo';
import StructuredData from '@/components/structured-data';
import { getWebsiteContent } from '@/lib/website-content';

export const metadata = pageMetadata(homeTitle, homeDescription, '/');
export default async function Page() {
  const {site, office} = await getWebsiteContent();
  const business = {
    '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', '@id': businessId,
    name: 'Mitch’s Landscaping', url: siteUrl, description: homeDescription,
    telephone: site.phone, email: site.email, logo: `${siteUrl}${site.logo}`,
    image: `${siteUrl}/images/mitchs-landscaping-share.png`,
    address: {'@type': 'PostalAddress', streetAddress: office.street, addressLocality: 'Larose', addressRegion: 'LA', postalCode: '70373', addressCountry: 'US'},
    areaServed: ['Lafourche Parish, Louisiana', 'Terrebonne Parish, Louisiana'].map(name => ({'@type': 'AdministrativeArea', name})),
    hasMap: office.directionsUrl, sameAs: [site.googleBusinessUrl],
    openingHoursSpecification: [{'@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '16:00'}],
  };
  return <><StructuredData data={business} /><Home /></>;
}
