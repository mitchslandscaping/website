// Node-only private storage. Never import this module from a client component.
import {DatabaseSync} from 'node:sqlite';
import {PostgresOwnerStore} from './postgres-store.ts';
import {mkdirSync,chmodSync} from 'node:fs';
import {dirname,join,resolve,isAbsolute,relative} from 'node:path';
import {randomBytes,createHash} from 'node:crypto';

export const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
export const randomToken=()=>randomBytes(32).toString('base64url');
export const SESSION_SECONDS=60*60;
export type StoredCredential={id:string;publicKey:string;counter:number;transports:string[];deviceType:string;backedUp:boolean;origin:string;rpID:string};
export type Challenge={challenge:string;purpose:'register'|'login';origin:string;rpID:string;enrollment:string|null};
const stores=new Map<string,OwnerStore>();
let managedStore:PostgresOwnerStore|undefined;
export function ownerStore():OwnerStore|PostgresOwnerStore|null{
 if(process.env.OWNER_DATABASE_URL){managedStore??=new PostgresOwnerStore(process.env.OWNER_DATABASE_URL);return managedStore;}
 // Vercel's local filesystem is ephemeral. Never fall back to SQLite there.
 if(process.env.VERCEL)return null;
 const configured=process.env.OWNER_AUTH_DB;
 // Production must explicitly opt into a durable, private database.
 if(process.env.NODE_ENV==='production'&&!configured)return null;
 if(configured&&!isAbsolute(configured))throw Error('OWNER_AUTH_DB must be absolute.');
 const path=resolve(configured||join(process.cwd(),'.owner','passkeys.sqlite'));
 for(const folder of ['public','.next']){const r=relative(resolve(folder),path);if(r!=='..'&&!r.startsWith('../')&&!isAbsolute(r))throw Error('Owner database must be outside public and build folders.');}
 let store=stores.get(path);if(!store){store=new OwnerStore(path);stores.set(path,store);}return store;
}
export class OwnerStore {
 private db:DatabaseSync;
 constructor(path:string){
  mkdirSync(dirname(path),{recursive:true,mode:0o700});
  this.db=new DatabaseSync(path);chmodSync(path,0o600);
  this.db.exec(`PRAGMA busy_timeout=5000;
   CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY CHECK(id=1), user_id TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS credential (id INTEGER PRIMARY KEY CHECK(id=1), value TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS enrollment (id INTEGER PRIMARY KEY CHECK(id=1), token TEXT NOT NULL, expires INTEGER NOT NULL);
   CREATE TABLE IF NOT EXISTS challenges (nonce TEXT PRIMARY KEY, value TEXT NOT NULL, expires INTEGER NOT NULL);
   CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, credential_id TEXT NOT NULL, expires INTEGER NOT NULL);
   CREATE TABLE IF NOT EXISTS attempts (id INTEGER PRIMARY KEY CHECK(id=1), count INTEGER NOT NULL, until INTEGER NOT NULL);
  `);
  this.db.prepare('INSERT OR IGNORE INTO settings VALUES (1,?)').run(randomToken());
 }
 close(){this.db.close();}
 private atomic<T>(fn:()=>T):T{this.db.exec('BEGIN IMMEDIATE');try{const result=fn();this.db.exec('COMMIT');return result;}catch(error){this.db.exec('ROLLBACK');throw error;}}
 userID(){return (this.db.prepare('SELECT user_id FROM settings WHERE id=1').get() as {user_id:string}).user_id;}
 credential():StoredCredential|null {const row=this.db.prepare('SELECT value FROM credential WHERE id=1').get() as {value:string}|undefined;return row?JSON.parse(row.value):null;}
 invite(){return this.atomic(()=>{if(this.credential())throw Error('A passkey already exists. Additional enrollment is disabled.');const token=randomToken();this.db.prepare('INSERT OR REPLACE INTO enrollment VALUES (1,?,?)').run(digest(token),Date.now()+15*60*1000);return token;});}
 enrollmentValid(token:string){return !this.credential()&&!!this.db.prepare('SELECT id FROM enrollment WHERE id=1 AND token=? AND expires>?').get(digest(token),Date.now());}
 challenge(value:Challenge){this.db.prepare('DELETE FROM challenges WHERE expires<=?').run(Date.now());const nonce=randomToken();this.db.prepare('INSERT INTO challenges VALUES (?,?,?)').run(digest(nonce),JSON.stringify(value),Date.now()+5*60*1000);return nonce;}
 takeChallenge(nonce:string,purpose:Challenge['purpose']):Challenge|null{
  // DELETE RETURNING makes challenges single-use across concurrent requests/processes.
  const row=this.db.prepare('DELETE FROM challenges WHERE nonce=? RETURNING value,expires').get(digest(nonce)) as {value:string;expires:number}|undefined;
  if(!row||row.expires<=Date.now())return null;const value=JSON.parse(row.value) as Challenge;return value.purpose===purpose?value:null;
 }
 register(value:StoredCredential,enrollmentHash:string){this.atomic(()=>{
  if(this.credential()||!this.db.prepare('SELECT id FROM enrollment WHERE id=1 AND token=? AND expires>?').get(enrollmentHash,Date.now()))throw Error('Enrollment is no longer available.');
  this.db.prepare('INSERT INTO credential VALUES (1,?)').run(JSON.stringify(value));
  this.db.exec('DELETE FROM enrollment; DELETE FROM challenges; DELETE FROM sessions;');
 });}
 updateCounter(previous:StoredCredential,counter:number,backedUp:boolean){
  // Compare the complete previous record: two authentications cannot overwrite each other.
  const result=this.db.prepare('UPDATE credential SET value=? WHERE id=1 AND value=?').run(JSON.stringify({...previous,counter,backedUp}),JSON.stringify(previous));
  if(result.changes!==1)throw Error('Credential changed. Please sign in again.');
 }
 newSession(){const credential=this.credential();if(!credential)throw Error('Owner is not configured.');const token=randomToken();this.db.prepare('DELETE FROM sessions WHERE expires<=?').run(Date.now());this.db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(digest(token),credential.id,Date.now()+SESSION_SECONDS*1000);return token;}
 validSession(token:string){const credential=this.credential();return !!credential&&!!this.db.prepare('SELECT token FROM sessions WHERE token=? AND credential_id=? AND expires>?').get(digest(token),credential.id,Date.now());}
 revoke(token:string){this.db.prepare('DELETE FROM sessions WHERE token=?').run(digest(token));}
 limited(){const row=this.db.prepare('SELECT count,until FROM attempts WHERE id=1').get() as {count:number;until:number}|undefined;return !!row&&row.until>Date.now()&&row.count>=10;}
 attempt(){const now=Date.now();this.db.prepare('INSERT INTO attempts VALUES (1,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN until>? THEN count+1 ELSE 1 END, until=CASE WHEN until>? THEN until ELSE excluded.until END').run(now+15*60*1000,now,now);}
 clearAttempts(){this.db.exec('DELETE FROM attempts');}
}
