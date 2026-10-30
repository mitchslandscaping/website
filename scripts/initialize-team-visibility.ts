import {getCliClient} from 'sanity/cli';
const client=getCliClient({apiVersion:'2026-10-29'}).withConfig({useCdn:false});
if(client.config().projectId!=='kjf580ay') throw Error('Unexpected project');
async function main(){
 const docs=await client.fetch('*[_id in ["website","drafts.website"]]');
 for(const doc of docs){
  const updates:Record<string,boolean>={};
  for(const member of doc.site?.team || []){
   if(member.active===undefined) updates[`site.team[_key==${JSON.stringify(member._key)}].active`]=true;
  }
  if(Object.keys(updates).length) await client.patch(doc._id).ifRevisionId(doc._rev).set(updates).commit();
  console.log('Team visibility initialized:',doc._id);
 }
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
