import { getCliClient } from 'sanity/cli';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defaultContent } from '../src/lib/website-defaults';

const client = getCliClient({apiVersion:'2026-10-29'}).withConfig({useCdn:false});
const references = new Map<string, {_type:string;asset:{_type:string;_ref:string}}>();
const project = client.config().projectId;
if (project !== 'kjf580ay') throw new Error('Refusing to seed an unexpected Sanity project.');
const detailPhotos: Record<string,{image:string;alt:string;position:string}> = {
  'Sports Field Fencing & Backstops':{image:'/images/sports-field-fencing.jpg',alt:'Baseball field with tall backstop netting and perimeter fencing',position:'center 52%'},
  'Arbor Care':{image:'/images/arbor-care-project.jpg',alt:'Arbor care crew and equipment working beside a tree stump at a commercial property',position:'center 44%'},
  'Access control':{image:'/images/access-control-project.jpg',alt:'Chain-link sliding entrance gate at a commercial property',position:'center 50%'},
  Fencing:{image:'/images/fencing-detail-project.jpg',alt:'Chain-link security fencing around industrial pipework',position:'center 55%'},
};
const intro:Record<string,string> = {maintenance:'Property care that keeps things looking their best.','design-build':'Thoughtful design. Outdoor spaces to enjoy.',construction:'Practical improvements. Built around your property.','fencing-access-control':'Privacy, boundaries, and a better way in.'};
async function upload(src: string) {
  if (references.has(src)) return references.get(src)!;
  if (!src.startsWith('/images/') && !src.startsWith('/videos/')) throw new Error(`Unexpected asset path: ${src}`);
  const path = resolve('public',src.slice(1));
  const kind = src.startsWith('/videos/') ? 'file' : 'image';
  const data = await readFile(path);
  const asset = await client.assets.upload(kind,data,{filename:src.split('/').pop()!,source:{id:src,name:'Approved website content'}});
  const ref = {_type:kind,asset:{_type:'reference',_ref:asset._id}};
  references.set(src,ref);
  console.log(`Imported ${src} (${Math.round((await stat(path)).size/1024)} KB)`);
  return ref;
}
async function hydrate(value:unknown, field = ''):Promise<unknown> {
  if (Array.isArray(value)) return Promise.all(value.map(async (item,i) => {
    const next = await hydrate(item);
    const itemType = ({team:'teamMember',logos:'customerLogo',reviews:'object',photos:'projectPhoto',services:'divisionService'} as Record<string,string>)[field];
    return next && typeof next === 'object' && !Array.isArray(next) ? {...next,...(itemType ? {_type:itemType} : {}),_key:`item-${i}`}  : next;
  }));
  if (!value || typeof value !== 'object') return value;
  const next:Record<string,unknown> = {};
  for (const [key,item] of Object.entries(value)) {
    next[key] = await hydrate(item,key);
    if (['src','image','logo','photo','video'].includes(key) && typeof item === 'string' && item.startsWith('/')) next[key+'Upload'] = await upload(item);
  }
  return next;
}
async function seed() {
  const records:Record<string,unknown>[] = [
    {_id:'website',_type:'website',site:{...defaultContent.site,projects:undefined,story:defaultContent.site.story || 'Mitch’s has been part of this community since 1989. From the grounds you care for every day to the improvements you’ve been planning, we’re here to help you take the next step.'},office:defaultContent.office,home:defaultContent.home},
    ...defaultContent.serviceGroups.map((group,i)=>({_id:`division-${group.slug}`,_type:'serviceDivision',...group,slug:{_type:'slug',current:group.slug},order:i,introHeading:intro[group.slug],services:group.services.map(service=>({...service,...detailPhotos[service.name]}))})),
    ...defaultContent.projects.map((item,i)=>({_id:`project-${item.slug}`,_type:'project',...item,slug:{_type:'slug',current:item.slug},active:true,order:i})),
    ...defaultContent.positions.map((item,i)=>({_id:`position-${item.id}`,_type:'position',...item,order:i})),
  ];
  for (const record of records) {
    const existing = await client.getDocument(record._id as string);
    if (existing) {console.log(`Kept existing ${record._id}`);continue;}
    const doc = await hydrate(record) as typeof record;
    await client.createIfNotExists(doc as {_id:string;_type:string});
    console.log(`Created ${record._id}`);
  }
  console.log('Content import complete. Existing documents were not overwritten.');
}
seed().catch(error=>{console.error(error.message);process.exitCode=1;});
