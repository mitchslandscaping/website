import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import postgres from 'postgres';
import {randomBytes,createHash} from 'node:crypto';
import sharp from 'sharp';
const url=process.env.OWNER_QA_POSTGRES_URL;
if(url&&!['localhost','127.0.0.1'].includes(new URL(url).hostname))throw Error('Disposable loopback database required.');
test('HTTP editor authorization, validation, drafts, publishing and private uploads',{skip:!url,timeout:120000},async()=>{
 const sql=postgres(url,{max:1,onnotice:()=>{}});const origin='http://127.0.0.1:3118';let child;
 try{
  await sql.unsafe('CREATE ROLE mitch_owner_runtime LOGIN');
  await sql.unsafe(await readFile('database/owner-auth.sql','utf8'));
  await sql.unsafe(await readFile('database/owner-content.sql','utf8'));
  await sql.unsafe(await readFile('database/owner-content-seed.sql','utf8'));
  await sql.unsafe('GRANT USAGE ON SCHEMA mitch_owner TO mitch_owner_runtime; GRANT SELECT,UPDATE(id) ON mitch_owner.settings TO mitch_owner_runtime; GRANT SELECT,INSERT,UPDATE,DELETE ON mitch_owner.credential,mitch_owner.enrollment,mitch_owner.challenges,mitch_owner.sessions,mitch_owner.attempts TO mitch_owner_runtime');
  await sql`INSERT INTO mitch_owner.settings VALUES (1,'test-owner')`;
  await sql`INSERT INTO mitch_owner.credential VALUES (1,${JSON.stringify({id:'qa-only'})})`;
  const secret=randomBytes(32).toString('base64url');const cookie=`mitch_owner=${secret}`;
  await sql`INSERT INTO mitch_owner.sessions VALUES (${createHash('sha256').update(secret).digest('hex')},'qa-only',${Date.now()+3600000})`;
  const runtime=new URL(url);runtime.username='mitch_owner_runtime';
  let logs='';child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack','--hostname','127.0.0.1','--port','3118'],{env:{...process.env,NODE_ENV:'development',OWNER_QA_DIST_DIR:'1',OWNER_DATABASE_URL:runtime.toString(),OWNER_SITE_ORIGIN:origin},stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
  for(let i=0;i<90;i++){if(child.exitCode!==null)throw Error('Test server exited: '+logs.slice(-1000));try{const r=await fetch(origin+'/api/owner/content');if(r.status===401)break;}catch{}if(i===89)throw Error('Test server did not start.');await new Promise(r=>setTimeout(r,500));}
  const get=async()=>{const r=await fetch(origin+'/api/owner/content',{headers:{cookie}});assert.equal(r.status,200);return r.json();};
  const post=(body,options={})=>fetch(origin+'/api/owner/content',{method:'POST',headers:{cookie,origin,'Content-Type':'application/json',...options},body:JSON.stringify(body)});
  const initial=await get();assert.equal(initial.team.members.length,4);assert.equal(initial.projects.length,5);assert.equal(initial.careers.length,2);
  const command={kind:'team',mode:'draft',id:'website',revision:initial.team.revision,publishedRevision:initial.team.publishedRevision,value:initial.team.members.map((m,i)=>i?m:{...m,name:'Private draft QA'})};
  assert.equal((await post(command,{origin:'https://untrusted.test'})).status,403);
  assert.equal((await post(command,{cookie:''})).status,401);
  assert.equal((await post({...command,kind:'website'})).status,400);
  assert.equal((await post({...command,value:[{...initial.team.members[0],photo:'https://untrusted.test/a.jpg'}]})).status,400);
  assert.equal((await post(command)).status,200);assert.equal((await post(command)).status,409);
  let current=await get();assert.equal(current.team.draft,true);
  assert(!(await (await fetch(origin)).text()).includes('Private draft QA'));
  const form=new FormData();form.set('file',new Blob(['<svg/>'],{type:'image/svg+xml'}),'bad.svg');
  assert.equal((await fetch(origin+'/api/owner/upload',{method:'POST',headers:{cookie,origin},body:form})).status,400);
  const image=await sharp({create:{width:40,height:30,channels:3,background:'#2467db'}}).png().toBuffer();
  const valid=new FormData();valid.set('file',new Blob([image],{type:'image/png'}),'test.png');
  const result=await fetch(origin+'/api/owner/upload',{method:'POST',headers:{cookie,origin},body:valid});assert.equal(result.status,200);const uploaded=await result.json();
  assert.equal((await fetch(origin+uploaded.url)).status,404);assert.equal((await fetch(origin+uploaded.url,{headers:{cookie}})).status,200);
  const members=current.team.members.map((m,i)=>i?m:{...m,name:'Published QA',photo:uploaded.url,photoUpload:uploaded.image});
  assert.equal((await post({...command,mode:'publish',revision:current.team.revision,value:members})).status,200);
  current=await get();assert.equal(current.team.draft,false);assert.equal(current.team.members[0].name,'Published QA');
  assert.equal((await fetch(origin+uploaded.url)).status,200);
  assert((await (await fetch(origin)).text()).includes('Published QA'));
  const create={kind:'position',mode:'publish',id:'position-http-test',revision:null,publishedRevision:null,value:{title:'QA opening',division:'QA',order:12,active:true,layout:'forbidden'}};
  assert.equal((await post(create)).status,200);const career=(await get()).careers.find(r=>r.id===create.id);assert.equal(career.layout,undefined);
  assert.equal((await post({...create,revision:career.revision,publishedRevision:career.publishedRevision,value:{...career,active:false}})).status,200);
 }finally{
  if(child){if(child.exitCode===null){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}}
  await sql.unsafe('DROP SCHEMA IF EXISTS mitch_content CASCADE; DROP SCHEMA IF EXISTS mitch_owner CASCADE; DROP ROLE IF EXISTS mitch_owner_runtime');await sql.end();
 }
});
