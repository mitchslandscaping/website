import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {request as httpRequest} from 'node:http';
import {generateKeyPairSync,randomBytes,createHash,sign} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {isoCBOR} from '@simplewebauthn/server/helpers';
const encodeCBOR=isoCBOR.encode;
import {OwnerStore,digest,ownerStore} from '../src/lib/owner/passkey-store.ts';

const fixture=()=>({id:randomBytes(24).toString('base64url'),publicKey:'fixture',counter:0,transports:[],deviceType:'multiDevice',backedUp:true,origin:'https://owner.test',rpID:'owner.test'});
test('production storage fails closed and rejects public database paths',()=>{
 const previous={node:process.env.NODE_ENV,db:process.env.OWNER_AUTH_DB};
 try{process.env.NODE_ENV='production';delete process.env.OWNER_AUTH_DB;assert.equal(ownerStore(),null);
  process.env.OWNER_AUTH_DB='relative.sqlite';assert.throws(()=>ownerStore());
  process.env.OWNER_AUTH_DB=join(process.cwd(),'public','secret.sqlite');assert.throws(()=>ownerStore());
 }finally{if(previous.node===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=previous.node;if(previous.db===undefined)delete process.env.OWNER_AUTH_DB;else process.env.OWNER_AUTH_DB=previous.db;}
});

test('private store: one credential, expiring invitations/challenges, session revocation, atomic enrollment',()=>{
 const dir=mkdtempSync(join(tmpdir(),'mitch-store-test-'));const path=join(dir,'auth.sqlite');const store=new OwnerStore(path);const other=new OwnerStore(path);const clock=Date.now;
 try{
  assert.equal(statSync(path).mode&0o777,0o600);
  const code=store.invite();assert.equal(store.enrollmentValid('incorrect'),false);assert(store.enrollmentValid(code));
  const nonce=store.challenge({challenge:'random',purpose:'register',origin:'https://owner.test',rpID:'owner.test',enrollment:digest(code)});
  assert.equal(other.takeChallenge(nonce,'login'),null);assert.equal(store.takeChallenge(nonce,'register'),null);
  const expired=store.challenge({challenge:'random',purpose:'login',origin:'https://owner.test',rpID:'owner.test',enrollment:null});
  Date.now=()=>clock()+16*60*1000;assert.equal(store.takeChallenge(expired,'login'),null);assert.equal(store.enrollmentValid(code),false);Date.now=clock;
  const invitation=store.invite();const credential=fixture();store.register(credential,digest(invitation));
  assert.throws(()=>other.register(fixture(),digest(invitation)));assert.throws(()=>store.invite());assert.equal(store.enrollmentValid(invitation),false);
  const session=store.newSession();assert(other.validSession(session));other.revoke(session);assert.equal(store.validSession(session),false);
  const expires=store.newSession();Date.now=()=>clock()+61*60*1000;assert.equal(store.validSession(expires),false);Date.now=clock;
  store.updateCounter(credential,1,true);assert.throws(()=>other.updateCounter(credential,2,true));
  for(let i=0;i<10;i++)store.attempt();assert(other.limited());store.clearAttempts();assert.equal(other.limited(),false);
 }finally{Date.now=clock;other.close();store.close();rmSync(dir,{recursive:true,force:true});}
});

// A software authenticator used only against a disposable database. No real passkeys are created.
function authenticator(){
 const {privateKey,publicKey}=generateKeyPairSync('ec',{namedCurve:'prime256v1'});const jwk=publicKey.export({format:'jwk'});const id=randomBytes(32);
 const publicCose=Buffer.from(encodeCBOR(new Map([[1,2],[3,-7],[-1,1],[-2,new Uint8Array(Buffer.from(jwk.x,'base64url'))],[-3,new Uint8Array(Buffer.from(jwk.y,'base64url'))]])));
 const b64=value=>Buffer.from(value).toString('base64url');
 const hash=value=>createHash('sha256').update(value).digest();
 const data=(options,type,origin)=>Buffer.from(JSON.stringify({type,challenge:options.challenge,origin,crossOrigin:false}));
 return {
  register(options,{origin='https://owner.test',rpID='owner.test',uv=true}={}){
   const length=Buffer.alloc(2);length.writeUInt16BE(id.length);
   const authData=Buffer.concat([hash(rpID),Buffer.from([uv?0x45:0x41]),Buffer.alloc(4),Buffer.alloc(16),length,id,publicCose]);
   const attestation=encodeCBOR(new Map([['fmt','none'],['attStmt',new Map()],['authData',new Uint8Array(authData)]]));
   return {id:b64(id),rawId:b64(id),type:'public-key',clientExtensionResults:{credProps:{rk:true}},response:{clientDataJSON:b64(data(options,'webauthn.create',origin)),attestationObject:b64(attestation),transports:['internal']}};
  },
  login(options,{origin='https://owner.test',rpID='owner.test',uv=true,counter=1,forge=false,crossOrigin=false}={}){
   const client=Buffer.from(JSON.stringify({type:'webauthn.get',challenge:options.challenge,origin,crossOrigin}));const count=Buffer.alloc(4);count.writeUInt32BE(counter);
   const authData=Buffer.concat([hash(rpID),Buffer.from([uv?5:1]),count]);
   const signature=sign('sha256',Buffer.concat([authData,hash(client)]),privateKey);
   if(forge)signature[signature.length-1]^=1;
   return {id:b64(id),rawId:b64(id),type:'public-key',clientExtensionResults:{},response:{clientDataJSON:b64(client),authenticatorData:b64(authData),signature:b64(signature)}};
  }
 };
}

test('production HTTP flow: verified passkey only, no public enrollment/fallback, replay/CSRF protection and revoked sessions',{timeout:120000},async()=>{
 const dir=mkdtempSync(join(tmpdir(),'mitch-http-test-'));const path=join(dir,'auth.sqlite');const store=new OwnerStore(path);const auth=authenticator();
 const port=Number(process.env.OWNER_QA_PORT||43017);const base=`http://127.0.0.1:${port}`;
 let output='';const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,NODE_ENV:'production',OWNER_AUTH_DB:path,OWNER_SITE_ORIGIN:'https://owner.test',SANITY_API_WRITE_TOKEN:''},stdio:['ignore','pipe','pipe']});
 child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>output+=chunk);
 let cookie='';
 async function post(body,{origin='https://owner.test',host='owner.test',cookies=cookie}={}){
  const result=await new Promise((resolve,reject)=>{const req=httpRequest(`${base}/api/owner/auth`,{method:'POST',headers:{origin,host,'content-type':'application/json',cookie:cookies}},res=>{let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>{try{resolve({status:res.statusCode,data:JSON.parse(body),set:res.headers['set-cookie']||[]});}catch(error){reject(error);}});});req.on('error',reject);req.end(JSON.stringify(body));});
  for(const value of result.set){const pair=value.split(';')[0];const key=pair.split('=')[0];cookie=cookie.split('; ').filter(v=>v&&!v.startsWith(`${key}=`)).concat(pair).join('; ');}
  return result;
 }
 async function content(cookies=cookie){return fetch(`${base}/api/owner/content`,{headers:{host:'owner.test',cookie:cookies}});}
 try{
  for(let i=0;i<100;i++){if(child.exitCode!==null)throw Error(output);try{await fetch(`${base}/owner`);break;}catch{await new Promise(r=>setTimeout(r,100));if(i===99)throw Error(output);}}
  const unauthenticated=await content();assert.equal(unauthenticated.status,401,output+'\n'+await unauthenticated.text());
  const page=await fetch(`${base}/owner`);assert.equal(page.headers.get('x-frame-options'),'DENY');assert.match(page.headers.get('cache-control'),/no-store/);
  {const result=await post({action:'setup',username:'owner',password:'anything'});assert.equal(result.status,400,JSON.stringify(result));}
  assert.equal((await post({action:'register-options'})).status,403);
  assert.equal((await post({action:'register-options',setupCode:'guessed'})).status,403);
  assert.equal((await post({action:'login-options'},{origin:'https://evil.test'})).status,403);
  assert.equal((await post({action:'login-options'},{origin:'https://evil.test',host:'evil.test'})).status,403);
  const code=store.invite();
  let options=await post({action:'register-options',setupCode:code});assert.equal(options.status,200);assert.equal(options.data.authenticatorSelection.userVerification,'required');
  assert.equal((await post({action:'register-verify',response:auth.register(options.data,{uv:false})})).status,401);assert.equal(store.credential(),null);
  options=await post({action:'register-options',setupCode:code});
  assert.equal((await post({action:'register-verify',response:auth.register(options.data,{origin:'https://evil.test'})})).status,401);assert.equal(store.credential(),null);
  options=await post({action:'register-options',setupCode:code});
  const enrolled=await post({action:'register-verify',response:auth.register(options.data)});assert.equal(enrolled.status,200,JSON.stringify(enrolled.data));
  assert(enrolled.set.some(v=>v.startsWith('__Host-mitch_owner=')&&/HttpOnly/i.test(v)&&/Secure/i.test(v)&&/SameSite=strict/i.test(v)));
  assert.equal((await content()).status,200);const data=await (await content()).json();assert.equal(data.canWrite,false);
  const writes=await new Promise((resolve,reject)=>{const req=httpRequest(`${base}/api/owner/content`,{method:'POST',headers:{origin:'https://owner.test',host:'owner.test','content-type':'application/json',cookie}},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});req.on('error',reject);req.end(JSON.stringify({kind:'team',mode:'publish',id:'website',revision:data.team.revision,publishedRevision:data.team.publishedRevision,value:data.team.members}));});assert.equal(writes,503);
  assert.equal((await post({action:'register-options',setupCode:code})).status,403);assert.throws(()=>store.invite());
  const oldSession=cookie;assert.equal((await post({action:'logout'})).status,200);assert.equal((await content(oldSession)).status,401);
  for(const failure of [{uv:false},{origin:'https://evil.test'},{rpID:'evil.test'},{forge:true},{crossOrigin:true}]){
   store.clearAttempts();options=await post({action:'login-options'});assert.equal(options.status,200);assert.equal(options.data.userVerification,'required');
   assert.equal((await post({action:'login-verify',response:auth.login(options.data,failure)})).status,401);
  }
  store.clearAttempts();options=await post({action:'login-options'});
  const unknown=authenticator();assert.equal((await post({action:'login-verify',response:unknown.login(options.data)})).status,401);
  options=await post({action:'login-options'});const before=cookie;const response=auth.login(options.data);
  assert.equal((await post({action:'login-verify',response})).status,200);
  assert.equal((await post({action:'login-verify',response},{cookies:before})).status,401);
  const validSession=cookie;assert.equal((await content(validSession.replace(/(__Host-mitch_owner=)[^;]+/,'$1tampered'))).status,401);
  const sql=new DatabaseSync(path);sql.exec('UPDATE sessions SET expires=0');sql.close();assert.equal((await content(validSession)).status,401);
  store.clearAttempts();for(let i=0;i<10;i++)assert.equal((await post({action:'login-options'})).status,200);
  assert.equal((await post({action:'login-options'})).status,429);
 }finally{
  child.kill('SIGTERM');await new Promise(resolve=>{if(child.exitCode!==null)resolve();else child.once('exit',resolve);});store.close();rmSync(dir,{recursive:true,force:true});
 }
});
