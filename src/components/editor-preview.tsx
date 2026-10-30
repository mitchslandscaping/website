'use client';
import { VisualEditing } from 'next-sanity/visual-editing';
import { usePathname, useRouter } from 'next/navigation';
export default function EditorPreview({owner = false}: {owner?:boolean}) {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname.startsWith('/studio') || pathname.startsWith('/owner')) return null;
  return <><div className="editor-preview-banner">{owner ? 'Owner preview — unpublished changes' : 'Draft preview — unpublished changes'} {owner && <a href="/owner">Back to owner area</a>} <a href="/api/draft-mode/disable">Exit preview</a></div>{!owner && <VisualEditing refresh={() => { router.refresh(); return new Promise(resolve => setTimeout(resolve, 500)); }} />}</>;
}
