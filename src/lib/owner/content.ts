import 'server-only';
import {z} from 'zod';
import {OwnerError} from './auth';
import {contentStore,ContentConflict,type ContentRow} from './content-store';
import type {OwnerData,OwnerRecord} from './types';
function record(row:ContentRow):OwnerRecord {
 const d=row.draft||row.published;
 return {title:'',active:true,order:0,division:'',slug:'',spotlight:false,serviceSlug:'design-build',description:'',city:'',completed:'',propertyType:'',services:[],photos:[],...d,id:row.id,revision:row.draft_revision||row.published_revision,publishedRevision:row.published_revision,draft:!!row.draft,published:!!row.published};
}
export async function ownerData():Promise<OwnerData>{
 const rows=await contentStore().rows();const team=rows.find(r=>r.id==='team');
 if(!team)throw new OwnerError('Your content is being connected. Please try again shortly.',503);
 const sorted=(prefix:string)=>rows.filter(r=>r.id.startsWith(prefix)).map(record).sort((a,b)=>a.order-b.order);
 return {team:{revision:(team.draft_revision||team.published_revision)!,publishedRevision:team.published_revision,draft:!!team.draft,members:(team.draft||team.published).members},projects:sorted('project-'),careers:sorted('position-'),canWrite:true};
}
const small=(max:number)=>z.string().trim().max(max);
const upload=z.object({_type:z.literal('image'),asset:z.object({_type:z.literal('reference'),_ref:z.string().uuid()})});
const photo=z.object({_key:z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),alt:small(250),src:z.string().max(2000).optional(),srcUpload:upload.optional()});
const member=z.object({_key:z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),name:small(100).min(1,'Enter an employee name.'),role:small(100),active:z.boolean(),photo:z.string().max(2000).optional(),photoUpload:upload.optional()});
const division=z.enum(['maintenance','design-build','construction','fencing-access-control']);
const project=z.object({title:small(160).min(1,'Enter a project name.'),slug:small(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,'Use a page address with lowercase letters, numbers, and hyphens.'),active:z.boolean(),order:z.number().int().min(0).max(9999),spotlight:z.boolean(),serviceSlug:division,description:small(4000),city:small(160),completed:small(50),propertyType:small(100),services:z.array(small(160)).max(30),photos:z.array(photo).max(60)});
const position=z.object({title:small(160).min(1,'Enter a position title.'),division:small(100).min(1,'Enter the division.'),active:z.boolean(),order:z.number().int().min(0).max(9999)});
const change=z.object({kind:z.enum(['team','project','position']),mode:z.enum(['draft','publish']),id:z.string().max(150),revision:z.string().nullable(),publishedRevision:z.string().nullable(),value:z.unknown()});
function parse<T>(schema:z.ZodType<T>,value:unknown):T{const p=schema.safeParse(value);if(!p.success)throw new OwnerError(p.error.issues[0]?.message||'Please check these details.');return p.data;}

async function media(path:string|undefined,upload: {asset:{_ref:string}}|undefined,existing:Record<string,any>[],field:string,hasMedia:(id:string)=>Promise<boolean>){
 if(upload){if(!await hasMedia(upload.asset._ref))throw new OwnerError('Please upload the photo again.');return `/api/media/${upload.asset._ref}`;}
 if(!path)return '';
 if(!existing.some(item=>item[field]===path))throw new OwnerError('Please upload the photo again.');
 return path;
}
export async function saveOwnerContent(input:unknown){
 const {kind,mode,id:requestedId,revision,publishedRevision,value}=parse(change,input);
 const id=kind==='team'?'team':requestedId;
 if(kind!=='team'&&!new RegExp(`^${kind}-[a-zA-Z0-9_-]{1,140}$`).test(id))throw new OwnerError('Invalid content identifier.');
 try{await contentStore().save(id,revision,publishedRevision,mode,async (existing,hasMedia)=>{
  if(kind==='team'){
   const members=parse(z.array(member).max(100),value);
   if(new Set(members.map(m=>m._key)).size!==members.length)throw new OwnerError('Employee identifiers must be unique.');
   return {members:await Promise.all(members.map(async m=>{const {photoUpload,...fields}=m;return {...fields,photo:await media(m.photo,photoUpload,existing?.members||[],'photo',hasMedia)};}))};
  }
  if(kind==='position')return parse(position,value);
  const p=parse(project,value);
  if(new Set(p.photos.map(p=>p._key)).size!==p.photos.length)throw new OwnerError('Photo identifiers must be unique.');
  const labels={'maintenance':'Maintenance Services','design-build':'Design / Build','construction':'Construction','fencing-access-control':'Fencing & Access Control'};
  return {...existing,...p,category:labels[p.serviceSlug],photos:await Promise.all(p.photos.map(async photo=>{const {srcUpload,...fields}=photo;return {...fields,src:await media(photo.src,srcUpload,existing?.photos||[],'src',hasMedia)};}))};
 });}catch(error){if(error instanceof ContentConflict)throw new OwnerError(error.message,409);throw error;}
 return ownerData();
}
