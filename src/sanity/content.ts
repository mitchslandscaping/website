import 'server-only';
import { cache } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { isOwner } from '@/lib/owner/auth';
import { cookies, draftMode } from 'next/headers';
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { defaultContent, type WebsiteContent } from '@/lib/website-defaults';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const sanityClient = projectId ? createClient({ projectId, dataset, apiVersion: '2026-10-29', useCdn: false, perspective: 'published' }) : null;
// The CMS contains public website content only. Applications stay in Fillout.
function resolveMedia(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(resolveMedia);
  if (!value || typeof value !== 'object') return value;
  const record = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(record)) {
    if (!key.endsWith('Upload')) result[key] = resolveMedia(item);
  }
  for (const [key, item] of Object.entries(record)) {
    if (!key.endsWith('Upload') || !item || typeof item !== 'object') continue;
    const asset = (item as {asset?: {_ref?: string}}).asset?._ref;
    if (!asset || !sanityClient) continue;
    if (asset.startsWith('image-')) result[key.slice(0,-6)] = createImageUrlBuilder(sanityClient).image(key === 'photoUpload' ? asset : item as Parameters<ReturnType<typeof createImageUrlBuilder>['image']>[0]).url();
    else if (asset.startsWith('file-')) {
      const [,hash,extension] = asset.split('-');
      result[key.slice(0,-6)] = `https://cdn.sanity.io/files/${projectId}/${dataset}/${hash}.${extension}`;
    }
  }
  if (record.slug && typeof record.slug === 'object') result.slug = (record.slug as {current?:string}).current;
  return result;
}
function merge<T>(base: T, incoming: unknown): T {
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) return (incoming ?? base) as T;
  const result = {...base} as Record<string, unknown>;
  for (const [key,value] of Object.entries(incoming)) {
    if (value !== null && value !== undefined) result[key] = typeof value === 'object' && !Array.isArray(value) ? merge(result[key] ?? {}, value) : value;
  }
  return result as T;
}
export const getWebsiteContent = cache(async (): Promise<WebsiteContent> => {
  if (!sanityClient) return defaultContent;
  try {
    const ownerPreview = (await cookies()).has('mitch_owner_preview');
    const preview = (await draftMode()).isEnabled && !!process.env.SANITY_API_READ_TOKEN && (!ownerPreview || await isOwner());
    const client = preview ? sanityClient.withConfig({token: process.env.SANITY_API_READ_TOKEN,perspective:'drafts',stega:{enabled:true,studioUrl:'/studio',filter: context => {
      // Fixed site copy has no visual edit links. Team fields use explicit attributes.
      if (!['project','position'].includes(context.sourceDocument._type)) return false;
      const last=context.sourcePath[context.sourcePath.length-1];
      return /^(title|description|city|completed|propertyType)$/.test(String(last)) && context.filterDefault(context);
    }}}) : sanityClient;
    const raw = await client.fetch(`{
      "website": *[_id == "website"][0],
      "serviceGroups": *[_type == "serviceDivision"] | order(order asc),
      "projects": *[_type == "project" && active != false] | order(order asc),
      "positions": *[_type == "position"] | order(order asc)
    }`, {}, { cache: 'no-store' });
    if (!raw.website) return defaultContent;
    const content = resolveMedia(raw) as {website: Partial<WebsiteContent>; serviceGroups: WebsiteContent['serviceGroups'];projects:WebsiteContent['projects'];positions:WebsiteContent['positions']};
    return {
      ...defaultContent,
      site: {...merge(defaultContent.site, content.website.site), team: content.website.site?.team ?? []},
      office: merge(defaultContent.office, content.website.office),
      home: merge(defaultContent.home, content.website.home),
      serviceGroups: content.serviceGroups,
      projects: content.projects.map(project => ({...project, photos: project.photos?.length ? project.photos : undefined})),
      positions: content.positions.map(position => ({...position, id: position.id || (position as unknown as {_id:string})._id})),
    };
  } catch (error) {
    unstable_rethrow(error);
    console.error('Website content could not be loaded from Sanity.', error instanceof Error ? error.message : 'Unknown error');
    return defaultContent;
  }
});
