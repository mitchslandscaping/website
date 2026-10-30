import { createDataAttribute } from 'next-sanity';
/** Public content identifiers only; no credentials enter the browser. */
export function editAttribute(document: unknown, path: string) {
  const id = typeof document === 'string' ? document : (document as {_id?: string})?._id;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!id || !projectId) return undefined;
  return createDataAttribute({id, type:typeof document === 'string' ? 'website' : (document as {_type?:string})?._type || 'project', path, projectId, dataset:process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', baseUrl:'/studio'}).toString();
}
