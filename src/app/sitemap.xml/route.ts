import { getWebsiteContent } from '@/lib/website-content';
export async function GET() {
  const { serviceGroups, projects } = await getWebsiteContent();
  const paths = ['/', '/contact', '/portfolio', '/privacy', ...serviceGroups.map(s => `/services/${s.slug}`), ...projects.filter(p => p.photos?.length).map(p => `/portfolio/${p.slug}`)];
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + paths.map(path => `<url><loc>${escape(`https://www.mitchlandscaping.com${path}`)}</loc></url>`).join('') + '</urlset>', {headers: {'Content-Type':'application/xml; charset=utf-8'}});
}
