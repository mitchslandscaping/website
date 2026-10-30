import 'server-only';
import {cache} from 'react';
import {draftMode} from 'next/headers';
import {unstable_rethrow} from 'next/navigation';
import {isOwner} from './owner/auth';
import {contentStore} from './owner/content-store';
import snapshot from '@/data/website-snapshot.json';
import type {WebsiteContent} from './website-defaults';
export const getWebsiteContent=cache(async():Promise<WebsiteContent>=>{
 const base=structuredClone(snapshot) as unknown as WebsiteContent;
 if(!process.env.OWNER_DATABASE_URL)return base;
 try{
  const preview=(await draftMode()).isEnabled&&await isOwner();
  const rows=await contentStore().rows();
  const value=(row:typeof rows[number])=>preview?(row.draft||row.published):row.published;
  const team=rows.find(r=>r.id==='team');
  if(!team)throw Error('Content is not initialized.');
  base.site.team=value(team).members;
  base.projects=rows.filter(r=>r.id.startsWith('project-')&&value(r)&&value(r).active!==false).map(r=>({...value(r),_id:r.id})).sort((a,b)=>a.order-b.order);
  base.positions=rows.filter(r=>r.id.startsWith('position-')&&value(r)).map(r=>({...value(r),id:r.id})).sort((a,b)=>a.order-b.order);
  return base;
 }catch(error){unstable_rethrow(error);console.error('Editable website content is unavailable; showing the preserved website snapshot.');return base;}
});
