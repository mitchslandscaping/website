import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity/config';
export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';
export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return <main style={{padding:40}}>The company editor is being connected. Please return to the website while setup is completed.</main>;
  return <NextStudio config={config} />;
}
