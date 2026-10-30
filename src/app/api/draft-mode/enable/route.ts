import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { sanityClient } from '@/sanity/content';
export async function GET(request: Request) {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!sanityClient || !token) return new Response('Private draft preview has not been configured yet.', {status:503});
  return defineEnableDraftMode({client:sanityClient.withConfig({token})}).GET(request);
}
