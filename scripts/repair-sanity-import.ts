import { getCliClient } from 'sanity/cli';
const client = getCliClient({apiVersion:'2026-10-29'}).withConfig({useCdn:false});
if(client.config().projectId !== 'kjf580ay') throw Error('Unexpected project');
async function main(){
 const docs=await client.fetch('*[_type in ["website","project","position","serviceDivision"]]');
 for(const doc of docs){
  const updates:Record<string,unknown>={};
  const typed=(items:any[],type:string)=>items.map(item=>({...item,_type:type}));
  if(doc._type==='website'){
   if(doc.site?.team) updates['site.team']=typed(doc.site.team,'teamMember');
   if(doc.site?.trustedBy?.logos) updates['site.trustedBy.logos']=typed(doc.site.trustedBy.logos,'customerLogo');
   if(doc.site?.reviews) updates['site.reviews']=typed(doc.site.reviews,'object');
  }
  if(doc._type==='project'&&doc.photos) updates.photos=typed(doc.photos,'projectPhoto');
  if(doc._type==='serviceDivision'&&doc.services) updates.services=typed(doc.services,'divisionService');
  let patch=client.patch(doc._id).ifRevisionId(doc._rev).set(updates);
  if(doc._type==='website'&&Array.isArray(doc.site?.projects)&&!doc.site.projects.length) patch=patch.unset(['site.projects']);
  await patch.commit();
  console.log('Validated editor fields:',doc._id);
 }
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
