import 'server-only';
import {createClient} from '@sanity/client';
import {createImageUrlBuilder} from '@sanity/image-url';
import {z} from 'zod';
import {OwnerError} from './auth';
import type {OwnerData,OwnerRecord} from './types';
const base={projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2026-10-29',useCdn:false,perspective:'raw' as const};
export function ownerClient(write=false){
 const token=write?process.env.SANITY_API_WRITE_TOKEN:process.env.SANITY_API_WRITE_TOKEN||process.env.SANITY_API_READ_TOKEN;
 if(!base.projectId||!token)throw new OwnerError(write?'Publishing is not connected yet. Your editor is ready, but its server connection still needs activation.':'The content connection is not configured.',503);
 return createClient({...base,token});
}
type Doc=Record<string,any>;
const publicId=(id:string)=>id.replace(/^drafts\./,'');
function pair(docs:Doc[],id:string){return {published:docs.find(d=>d._id===id),draft:docs.find(d=>d._id===`drafts.${id}`)};}
function photoUrl(image:unknown,fallback=''){
 return (image as {asset?:{_ref?:string}})?.asset?._ref?createImageUrlBuilder(base).image(image as Parameters<ReturnType<typeof createImageUrlBuilder>['image']>[0]).width(1200).url():fallback;
}
function record(docs:Doc[],id:string):OwnerRecord{
 const {published,draft}=pair(docs,id);const d=draft||published!;
 return {id,revision:d._rev,publishedRevision:published?._rev||null,draft:!!draft,published:!!published,title:d.title||'',active:d.active!==false,order:d.order||0,division:d.division||'',slug:d.slug?.current||'',spotlight:!!d.spotlight,serviceSlug:d.serviceSlug||'design-build',description:d.description||'',city:d.city||'',completed:d.completed||'',propertyType:d.propertyType||'',services:d.services||[],photos:(d.photos||[]).map((p:Doc)=>({...p,src:photoUrl(p.srcUpload,p.src||'')}))};
}
export async function ownerData():Promise<OwnerData>{
 const docs:Doc[]=await ownerClient().fetch('*[_id in ["website","drafts.website"] || _type in ["project","position"]]',{},{cache:'no-store'});
 const site=pair(docs,'website');const current=site.draft||site.published;
 if(!current)throw new OwnerError('The team content could not be found.',503);
 const ids=(type:string)=>[...new Set(docs.filter(d=>d._type===type).map(d=>publicId(d._id)))];
 return {team:{revision:current._rev,publishedRevision:site.published?._rev||null,draft:!!site.draft,members:(current.site?.team||[]).map((m:Doc)=>({...m,active:m.active!==false,photo:photoUrl(m.photoUpload,m.photo||'')}))},projects:ids('project').map(id=>record(docs,id)).sort((a,b)=>a.order-b.order),careers:ids('position').map(id=>record(docs,id)).sort((a,b)=>a.order-b.order),canWrite:!!process.env.SANITY_API_WRITE_TOKEN};
}
const small=(max:number)=>z.string().trim().max(max);
const upload=z.object({_type:z.literal('image'),asset:z.object({_type:z.literal('reference'),_ref:z.string().regex(/^image-[a-zA-Z0-9]+-\d+x\d+-[a-z0-9]+$/)})});
const photo=z.object({_key:z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),alt:small(250),src:z.string().max(2000).optional(),srcUpload:upload.optional()});
const member=z.object({_key:z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),name:small(100).min(1,'Enter an employee name.'),role:small(100),active:z.boolean(),photo:z.string().max(2000).optional(),photoUpload:upload.optional()});
const division=z.enum(['maintenance','design-build','construction','fencing-access-control']);
const project=z.object({title:small(160).min(1,'Enter a project name.'),slug:small(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,'Use a page address with lowercase letters, numbers, and hyphens.'),active:z.boolean(),order:z.number().int().min(0).max(9999),spotlight:z.boolean(),serviceSlug:division,description:small(4000),city:small(160),completed:small(50),propertyType:small(100),services:z.array(small(160)).max(30),photos:z.array(photo).max(60)});
const position=z.object({title:small(160).min(1,'Enter a position title.'),division:small(100).min(1,'Enter the division.'),active:z.boolean(),order:z.number().int().min(0).max(9999)});
const change=z.object({kind:z.enum(['team','project','position']),mode:z.enum(['draft','publish']),id:z.string().max(150),revision:z.string().nullable(),publishedRevision:z.string().nullable(),value:z.unknown()});
function parse<T>(schema:z.ZodType<T>,value:unknown):T{const p=schema.safeParse(value);if(!p.success)throw new OwnerError(p.error.issues[0]?.message||'Please check these details.');return p.data;}
function originalPhoto(path:string|undefined,existing:Doc[],field:'photo'|'src'){
 if(!path)return '';
 if(!path.startsWith('/images/')||!existing.some(p=>p[field]===path))throw new OwnerError('Please upload the photo again.');
 return path;
}
function documentFields(d:Doc){const {_id,_rev,_createdAt,_updatedAt,...fields}=d;return fields;}
export async function saveOwnerContent(input:unknown){
 const request=parse(change,input);const {kind,mode,revision,publishedRevision}=request;
 const id=kind==='team'?'website':request.id;
 if(kind!=='team'&&!new RegExp(`^${kind==='project'?'project':'position'}-[a-zA-Z0-9_-]+$`).test(id))throw new OwnerError('Invalid content identifier.');
 const client=ownerClient(true);const docs:Doc[]=await client.fetch('*[_id in $ids]',{ids:[id,`drafts.${id}`]});
 const {published,draft}=pair(docs,id);const selected=draft||published;
 if((selected?._rev||null)!==revision||(published?._rev||null)!==publishedRevision)throw new OwnerError('This item changed in another window. Reload before saving so those changes are kept.',409);
 const expectedType=kind==='team'?'website':kind;
 if(selected&&selected._type!==expectedType)throw new OwnerError('This content cannot be edited here.',403);
 let fields:Doc;
 if(kind==='team'){
  const members=parse(z.array(member).max(100),request.value);
  if(new Set(members.map(m=>m._key)).size!==members.length)throw new OwnerError('Employee identifiers must be unique.');
  const existing=selected?.site?.team||[];
  fields={'site.team':members.map(m=>({...m,_type:'teamMember',photo:m.photoUpload?'':originalPhoto(m.photo,existing,'photo')}))};
 }else if(kind==='project'){
  const p=parse(project,request.value);
  if(new Set(p.photos.map(p=>p._key)).size!==p.photos.length)throw new OwnerError('Photo identifiers must be unique.');
  const duplicate=await client.fetch('count(*[_type=="project" && slug.current==$slug && !(_id in $ids)])',{slug:p.slug,ids:[id,`drafts.${id}`]});
  if(duplicate)throw new OwnerError('Another project uses this page address. Please choose another.');
  const labels={'maintenance':'Maintenance Services','design-build':'Design / Build','construction':'Construction','fencing-access-control':'Fencing & Access Control'};
  fields={...p,slug:{_type:'slug',current:p.slug},category:labels[p.serviceSlug],photos:p.photos.map(photo=>({...photo,_type:'projectPhoto',src:photo.srcUpload?'':originalPhoto(photo.src,selected?.photos||[],'src')}))};
 }else fields=parse(position,request.value);
 // Keep the revision check and publish/delete operation in one transaction.
 let tx=client.transaction();
 if(mode==='draft'){
  if(draft)tx=tx.patch(draft._id,p=>p.ifRevisionId(draft._rev).set(fields));
  else {
   const doc={...(published?documentFields(published):{}),_id:`drafts.${id}`,_type:expectedType};
   if(kind==='team')Object.assign(doc,{site:{...(published?.site||{}),team:fields['site.team']}});else Object.assign(doc,fields);
   tx=tx.create(doc);
  }
 }else{
  if(published)tx=tx.patch(id,p=>p.ifRevisionId(published._rev).set(fields));
  else tx=tx.create({_id:id,_type:expectedType,...fields});
  if(draft)tx=tx.patch(draft._id,p=>p.ifRevisionId(draft._rev).set({_ownerPublishGuard:true})).delete(draft._id);
 }
 try{await tx.commit();}catch(error){if((error as {statusCode?:number}).statusCode===409)throw new OwnerError('This item was updated elsewhere. Reload before saving.',409);throw error;}
 return ownerData();
}
