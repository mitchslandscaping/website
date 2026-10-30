// Private, durable owner authentication for Vercel. Schema is installed offline.
import postgres from 'postgres';
import {randomBytes,createHash} from 'node:crypto';
import type {StoredCredential} from './passkey-store';
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
const token=()=>randomBytes(32).toString('base64url');
type Challenge={challenge:string;purpose:'register'|'login';origin:string;rpID:string;enrollment:string|null};
export class PostgresOwnerStore {
 private sql:ReturnType<typeof postgres>;
 constructor(url:string){
  const parsed=new URL(url);
  if(!['postgres:','postgresql:'].includes(parsed.protocol))throw Error('Owner database URL must use Postgres.');
  const local=['localhost','127.0.0.1'].includes(parsed.hostname);
  // Never accept a URL option that weakens certificate verification.
  for(const key of ['sslmode','ssl','sslcert','sslkey','sslrootcert'])parsed.searchParams.delete(key);
  this.sql=postgres(parsed.toString(),{max:1,idle_timeout:5,connect_timeout:10,prepare:false,ssl:local&&process.env.NODE_ENV!=='production'?false:{rejectUnauthorized:true},onnotice:()=>{}});
 }
 async close(){await this.sql.end({timeout:5});}
 async userID(){const rows=await this.sql`SELECT user_id FROM mitch_owner.settings WHERE id=1`;if(!rows.length)throw Error('Owner database needs initialization.');return rows[0].user_id as string;}
 async credential():Promise<StoredCredential|null>{const rows=await this.sql`SELECT value FROM mitch_owner.credential WHERE id=1`;return rows[0]?JSON.parse(rows[0].value):null;}
 async invite(){return this.sql.begin(async sql=>{
  await sql`SELECT id FROM mitch_owner.settings WHERE id=1 FOR UPDATE`;
  if((await sql`SELECT id FROM mitch_owner.credential WHERE id=1`).length)throw Error('A passkey already exists. Additional enrollment is disabled.');
  const code=token();await sql`INSERT INTO mitch_owner.enrollment (id,token,expires) VALUES (1,${digest(code)},${Date.now()+15*60*1000}) ON CONFLICT (id) DO UPDATE SET token=EXCLUDED.token,expires=EXCLUDED.expires`;return code;
 });}
 async enrollmentValid(code:string){return !!(await this.sql`SELECT id FROM mitch_owner.enrollment WHERE id=1 AND token=${digest(code)} AND expires>${Date.now()} AND NOT EXISTS (SELECT 1 FROM mitch_owner.credential WHERE id=1)`).length;}
 async challenge(value:Challenge){await this.sql`DELETE FROM mitch_owner.challenges WHERE expires<=${Date.now()}`;const nonce=token();await this.sql`INSERT INTO mitch_owner.challenges (nonce,value,expires) VALUES (${digest(nonce)},${JSON.stringify(value)},${Date.now()+5*60*1000})`;return nonce;}
 async takeChallenge(nonce:string,purpose:Challenge['purpose']):Promise<Challenge|null>{
  const rows=await this.sql`DELETE FROM mitch_owner.challenges WHERE nonce=${digest(nonce)} RETURNING value,expires`;
  if(!rows.length||Number(rows[0].expires)<=Date.now())return null;const value=JSON.parse(rows[0].value) as Challenge;return value.purpose===purpose?value:null;
 }
 async register(value:StoredCredential,enrollmentHash:string){await this.sql.begin(async sql=>{
  // This row lock serializes invitation replacement and enrollment across functions.
  await sql`SELECT id FROM mitch_owner.settings WHERE id=1 FOR UPDATE`;
  if((await sql`SELECT id FROM mitch_owner.credential WHERE id=1`).length||!(await sql`SELECT id FROM mitch_owner.enrollment WHERE id=1 AND token=${enrollmentHash} AND expires>${Date.now()}`).length)throw Error('Enrollment is no longer available.');
  await sql`INSERT INTO mitch_owner.credential (id,value) VALUES (1,${JSON.stringify(value)})`;
  await sql`DELETE FROM mitch_owner.enrollment`;await sql`DELETE FROM mitch_owner.challenges`;await sql`DELETE FROM mitch_owner.sessions`;
 });}
 async updateCounter(previous:StoredCredential,counter:number,backedUp:boolean){const result=await this.sql`UPDATE mitch_owner.credential SET value=${JSON.stringify({...previous,counter,backedUp})} WHERE id=1 AND value=${JSON.stringify(previous)}`;if(result.count!==1)throw Error('Credential changed. Please sign in again.');}
 async newSession(){const credential=await this.credential();if(!credential)throw Error('Owner is not configured.');const code=token();await this.sql`DELETE FROM mitch_owner.sessions WHERE expires<=${Date.now()}`;await this.sql`INSERT INTO mitch_owner.sessions (token,credential_id,expires) VALUES (${digest(code)},${credential.id},${Date.now()+60*60*1000})`;return code;}
 async validSession(code:string){return !!(await this.sql`SELECT s.token FROM mitch_owner.sessions s JOIN mitch_owner.credential c ON c.id=1 WHERE s.token=${digest(code)} AND s.credential_id=(c.value::jsonb->>'id') AND s.expires>${Date.now()}`).length;}
 async revoke(code:string){await this.sql`DELETE FROM mitch_owner.sessions WHERE token=${digest(code)}`;}
 async limited(){return !!(await this.sql`SELECT id FROM mitch_owner.attempts WHERE id=1 AND until_at>${Date.now()} AND count>=10`).length;}
 async attempt(){const now=Date.now();await this.sql`INSERT INTO mitch_owner.attempts (id,count,until_at) VALUES (1,1,${now+15*60*1000}) ON CONFLICT (id) DO UPDATE SET count=CASE WHEN mitch_owner.attempts.until_at>${now} THEN mitch_owner.attempts.count+1 ELSE 1 END,until_at=CASE WHEN mitch_owner.attempts.until_at>${now} THEN mitch_owner.attempts.until_at ELSE EXCLUDED.until_at END`;}
 async clearAttempts(){await this.sql`DELETE FROM mitch_owner.attempts`;}
}
