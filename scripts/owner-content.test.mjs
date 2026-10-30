import {test} from 'node:test';
import assert from 'node:assert/strict';
import postgres from 'postgres';
import {exportContent,restoreContent} from './owner-content-backup.mjs';
import {readFile} from 'node:fs/promises';
import {ContentStore,ContentConflict} from '../src/lib/owner/content-store.ts';
const url=process.env.OWNER_QA_POSTGRES_URL;
if(url&&!['localhost','127.0.0.1'].includes(new URL(url).hostname))throw Error('Disposable loopback database required.');
test('content permissions, concurrency, draft isolation, media privacy, and revision restore',{skip:!url},async()=>{
 const admin=postgres(url,{max:1});let store,second;
 try{
  await admin.unsafe('CREATE ROLE mitch_owner_runtime LOGIN;');
  await admin.unsafe(await readFile('database/owner-content.sql','utf8'));
  await admin.unsafe(await readFile('database/owner-content-seed.sql','utf8'));
  const runtime=new URL(url);runtime.username='mitch_owner_runtime';store=new ContentStore(runtime.toString());second=new ContentStore(runtime.toString());
  assert.equal((await store.rows()).length,8);
  for(const statement of ['DELETE FROM mitch_content.documents','TRUNCATE mitch_content.documents','DELETE FROM mitch_content.history','UPDATE mitch_content.history SET snapshot=\'{}\'','CREATE TABLE mitch_content.forbidden(id int)','ALTER TABLE mitch_content.documents ADD COLUMN forbidden text'])await assert.rejects(store.sql.unsafe(statement));
  await assert.rejects(store.sql`INSERT INTO mitch_content.documents(id,published,published_revision) VALUES ('website','{}',gen_random_uuid())`);
  const team=(await store.rows()).find(r=>r.id==='team');
  const changed={members:[...team.published.members,{_key:'test',name:'Temporary employee',role:'QA',active:true,photo:''}]};
  const results=await Promise.allSettled([store.save('team',team.published_revision,team.published_revision,'draft',async()=>changed),second.save('team',team.published_revision,team.published_revision,'draft',async()=>changed)]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert(results.find(r=>r.status==='rejected').reason instanceof ContentConflict);
  const draft=(await store.rows()).find(r=>r.id==='team');assert.deepEqual(draft.published,team.published);assert.deepEqual(draft.draft,changed);
  const asset=await store.putMedia(Buffer.from('test-image'));assert.equal(await store.media(asset),undefined);assert(await store.media(asset,true));
  await store.save('position-qa',null,null,'draft',async()=>({title:'QA draft',active:true,order:0,division:'Testing'}));
  assert.equal((await store.rows()).find(r=>r.id==='position-qa').published,null);
  const published={members:[{_key:'test',name:'QA',role:'Tester',active:true,photo:`/api/media/${asset}`}]};
  await store.save('team',draft.draft_revision,team.published_revision,'publish',async()=>published);
  assert(await store.media(asset));const after=(await store.rows()).find(r=>r.id==='team');assert.equal(after.draft,null);
  await store.save('project-qa',null,null,'publish',async()=>({slug:'unique-qa',title:'QA'}));
  await assert.rejects(store.save('project-duplicate',null,null,'publish',async()=>({slug:'unique-qa'})),ContentConflict);
  const [history]=await admin`SELECT snapshot FROM mitch_content.history WHERE document_id='team' ORDER BY sequence LIMIT 1`;
  assert.deepEqual(history.snapshot.published,team.published);
  // Restore from the immutable original snapshot as an administrator.
  await admin`UPDATE mitch_content.documents SET published=${admin.json(history.snapshot.published)},draft=NULL,published_revision=gen_random_uuid(),draft_revision=NULL WHERE id='team'`;
  assert.deepEqual((await store.rows()).find(r=>r.id==='team').published,team.published);
  assert.equal(await store.media(asset),undefined);assert(await store.media(asset,true));
  assert.equal(Number((await admin`SELECT count(*) AS n FROM mitch_content.history WHERE document_id='team'`)[0].n),4);
  const backup=await exportContent(admin);
  await admin`UPDATE mitch_content.documents SET published='{}' WHERE id='team'`;
  await restoreContent(admin,JSON.parse(JSON.stringify(backup)));
  assert.deepEqual((await store.rows()).find(r=>r.id==='team').published,team.published);
  assert.deepEqual((await store.media(asset,true)).bytes,Buffer.from('test-image'));
  await assert.rejects(store.sql`UPDATE mitch_content.media SET bytes='bad'`);
  await assert.rejects(store.sql`DELETE FROM mitch_content.media`);
 }finally{
  if(store)await store.close();if(second)await second.close();
  await admin.unsafe('DROP SCHEMA IF EXISTS mitch_content CASCADE; DROP ROLE IF EXISTS mitch_owner_runtime;');await admin.end();
 }
});
