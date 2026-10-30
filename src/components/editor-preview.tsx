'use client';
import {usePathname} from 'next/navigation';
export default function EditorPreview({owner=false}:{owner?:boolean}){
 const pathname=usePathname();
 if(!owner||pathname.startsWith('/owner'))return null;
 return <div className="editor-preview-banner">Owner preview — unpublished changes <a href="/owner">Back to owner area</a> <a href="/api/draft-mode/disable">Exit preview</a></div>;
}
