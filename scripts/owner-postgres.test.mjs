import {test} from 'node:test';
import assert from 'node:assert/strict';
import postgres from 'postgres';
import {readFile} from 'node:fs/promises';
import {randomBytes,createHash} from 'node:crypto';
import {PostgresOwnerStore} from '../src/lib/owner/postgres-store.ts';
const connection=process.env.OWNER_QA_POSTGRES_URL;
// Refuse external databases: this suite creates and drops its isolated fixture schema.
if(connection&&!['localhost','127.0.0.1'].includes(new URL(connection).hostname))throw Error('Use a disposable loopback Postgres database only.');
test('managed owner store: real Postgres transactions, restricted role, one passkey and single-use challenges',{skip:!connection},async()=>{
 const previous=process.env.NODE_ENV;process.env.NODE_ENV='test';
 const admin=postgres(connection,{max:1});let first,second,runtime;const clock=Date.now;
 const digest=value=>createHash('sha256').update(value).digest('hex');
 try{
  assert.equal((await admin`SELECT current_database() AS name`)[0].name,'postgres');
  await admin.unsafe(await readFile(new URL('../database/owner-auth.sql',import.meta.url),'utf8'));
  await admin`INSERT INTO mitch_owner.settings (id,user_id) VALUES (1,${randomBytes(32).toString('base64url')})`;
  await admin.unsafe('CREATE ROLE mitch_owner_test_runtime LOGIN; GRANT USAGE ON SCHEMA mitch_owner TO mitch_owner_test_runtime; GRANT SELECT,UPDATE(id) ON mitch_owner.settings TO mitch_owner_test_runtime; GRANT SELECT,INSERT,UPDATE,DELETE ON mitch_owner.credential,mitch_owner.enrollment,mitch_owner.challenges,mitch_owner.sessions,mitch_owner.attempts TO mitch_owner_test_runtime;');
  const url=new URL(connection);url.username='mitch_owner_test_runtime';runtime=postgres(url.toString(),{max:1});
  await assert.rejects(runtime`CREATE TABLE mitch_owner.forbidden (id integer)`);
  await assert.rejects(runtime`UPDATE mitch_owner.settings SET user_id='forbidden'`);
  first=new PostgresOwnerStore(url.toString());second=new PostgresOwnerStore(url.toString());
  assert.equal(await first.credential(),null);assert.equal(await first.userID(),await second.userID());
  const code=await first.invite();assert(await second.enrollmentValid(code));assert.equal(await first.enrollmentValid('guessed'),false);
  const nonce=await first.challenge({challenge:'random',purpose:'login',origin:'https://owner.test',rpID:'owner.test',enrollment:null});
  const attempts=await Promise.all([first.takeChallenge(nonce,'login'),second.takeChallenge(nonce,'login')]);assert.equal(attempts.filter(Boolean).length,1);
  const expired=await first.challenge({challenge:'random',purpose:'login',origin:'https://owner.test',rpID:'owner.test',enrollment:null});
  Date.now=()=>clock()+16*60*1000;assert.equal(await first.enrollmentValid(code),false);assert.equal(await first.takeChallenge(expired,'login'),null);Date.now=clock;
  const invitation=await first.invite();const credential={id:randomBytes(24).toString('base64url'),publicKey:'fixture',counter:0,transports:[],deviceType:'multiDevice',backedUp:true,origin:'https://owner.test',rpID:'owner.test'};
  const registration=await Promise.allSettled([first.register(credential,digest(invitation)),second.register({...credential,id:'another'},digest(invitation))]);assert.equal(registration.filter(r=>r.status==='fulfilled').length,1);
  await assert.rejects(first.invite());assert.equal(await first.enrollmentValid(invitation),false);
  const active=await first.credential();assert(active);
  const session=await first.newSession();assert(await second.validSession(session));await second.revoke(session);assert.equal(await first.validSession(session),false);
  const expires=await first.newSession();Date.now=()=>clock()+61*60*1000;assert.equal(await first.validSession(expires),false);Date.now=clock;
  const counters=await Promise.allSettled([first.updateCounter(active,1,true),second.updateCounter(active,2,true)]);assert.equal(counters.filter(r=>r.status==='fulfilled').length,1);
  await Promise.all(Array.from({length:10},(_,i)=>(i%2?first:second).attempt()));assert(await first.limited());await second.clearAttempts();assert.equal(await first.limited(),false);
 }finally{
  Date.now=clock;if(first)await first.close();if(second)await second.close();if(runtime)await runtime.end();
  await admin.unsafe('DROP SCHEMA IF EXISTS mitch_owner CASCADE; DROP ROLE IF EXISTS mitch_owner_test_runtime;');await admin.end();if(previous===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=previous;
 }
});
