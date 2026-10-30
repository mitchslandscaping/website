import postgres from 'postgres';
import {readFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
const url=process.env.OWNER_DATABASE_ADMIN_URL;
if(!url)throw Error('Set a private OWNER_DATABASE_ADMIN_URL for this operator command only. Never add it to Vercel runtime variables.');
const parsed=new URL(url);for(const key of ['sslmode','ssl','sslcert','sslkey','sslrootcert'])parsed.searchParams.delete(key);
const sql=postgres(parsed.toString(),{max:1,ssl:{rejectUnauthorized:true},onnotice:()=>{}});
try{await sql.unsafe(await readFile(new URL('../database/owner-auth.sql',import.meta.url),'utf8'));await sql`INSERT INTO mitch_owner.settings (id,user_id) VALUES (1,${randomBytes(32).toString('base64url')}) ON CONFLICT (id) DO NOTHING`;console.log('Owner schema initialized. Use a restricted runtime role; no passkey has been registered.');}finally{await sql.end();}
