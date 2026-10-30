// Operator-only backup. Set OWNER_BACKUP_DATABASE_URL to an administrative connection.
import postgres from 'postgres';
import {createHash,randomUUID} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
export async function exportContent(sql){
 return {version:1,createdAt:new Date().toISOString(),documents:await sql`SELECT * FROM mitch_content.documents ORDER BY id`,history:await sql`SELECT * FROM mitch_content.history ORDER BY sequence`,media:(await sql`SELECT * FROM mitch_content.media ORDER BY id`).map(m=>({...m,bytes:m.bytes.toString('base64')}))};
}
export async function restoreContent(sql,data){
 if(data.version!==1||!Array.isArray(data.documents)||!Array.isArray(data.media)||!data.documents.some(d=>d.id==='team'))throw Error('Invalid content backup.');
 for(const row of data.documents)if(!/^(team|(?:project|position)-[a-zA-Z0-9_-]{1,140})$/.test(row.id))throw Error('Invalid content record.');
 await sql.begin(async tx=>{
  await tx`SELECT pg_advisory_xact_lock(62395821)`;
  for(const m of data.media){
   const bytes=Buffer.from(m.bytes,'base64');
   const [existing]=await tx`SELECT bytes FROM mitch_content.media WHERE id=${m.id}`;
   if(existing&&!existing.bytes.equals(bytes))throw Error('An existing media identifier has different contents.');
   await tx`INSERT INTO mitch_content.media(id,bytes,content_type) VALUES (${m.id},${bytes},${m.content_type}) ON CONFLICT(id) DO NOTHING`;
  }
  for(const row of data.documents){
   await tx`INSERT INTO mitch_content.documents(id,published,draft,published_revision,draft_revision)
   VALUES (${row.id},${row.published===null?null:tx.json(row.published)},${row.draft===null?null:tx.json(row.draft)},${row.published?randomUUID():null},${row.draft?randomUUID():null})
   ON CONFLICT(id) DO UPDATE SET published=EXCLUDED.published,draft=EXCLUDED.draft,published_revision=EXCLUDED.published_revision,draft_revision=EXCLUDED.draft_revision`;
  }
 });
 // Existing audit history and records newer than this backup are deliberately retained.
}
if(process.argv[1]?.endsWith('owner-content-backup.mjs')){
 const [action,path,confirmation]=process.argv.slice(2);const url=process.env.OWNER_BACKUP_DATABASE_URL;
 if(!url||!path||!['export','restore'].includes(action))throw Error('Usage: OWNER_BACKUP_DATABASE_URL=... node scripts/owner-content-backup.mjs export|restore path [--apply]');
 const parsed=new URL(url);const local=['localhost','127.0.0.1'].includes(parsed.hostname);
 for(const key of ['sslmode','ssl','sslcert','sslkey','sslrootcert'])parsed.searchParams.delete(key);
 const sql=postgres(parsed.toString(),{max:1,prepare:false,ssl:local?false:{rejectUnauthorized:true}});
 try{
  if(action==='export'){
   const payload=JSON.stringify(await exportContent(sql));
   await mkdir(dirname(path),{recursive:true,mode:0o700});await writeFile(path,JSON.stringify({sha256:createHash('sha256').update(payload).digest('hex'),payload}),{mode:0o600,flag:'wx'});
   console.log('Backup saved, including drafts, published content, revision history, and uploaded media.');
  }else{
   const envelope=JSON.parse(await readFile(path,'utf8'));
   if(createHash('sha256').update(envelope.payload).digest('hex')!==envelope.sha256)throw Error('Backup checksum does not match.');
   const data=JSON.parse(envelope.payload);
   if(confirmation!=='--apply')console.log('Checksum verified. To restore the records in this backup, rerun with --apply. Newer records and audit history are retained.');
   else {await restoreContent(sql,data);console.log('Backup records restored with new revisions. No authentication records were changed.');}
  }
 }finally{await sql.end();}
}
