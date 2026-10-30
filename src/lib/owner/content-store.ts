import postgres from 'postgres';
import {randomUUID} from 'node:crypto';
export type ContentRow={id:string;published:any;draft:any;published_revision:string|null;draft_revision:string|null};
export class ContentConflict extends Error {}
export class ContentStore {
 sql:ReturnType<typeof postgres>;
 constructor(url:string){
  const parsed=new URL(url);if(!['postgres:','postgresql:'].includes(parsed.protocol))throw Error('Postgres connection required.');
  const local=['localhost','127.0.0.1'].includes(parsed.hostname);
  for(const key of ['sslmode','ssl','sslcert','sslkey','sslrootcert'])parsed.searchParams.delete(key);
  this.sql=postgres(parsed.toString(),{max:1,idle_timeout:5,connect_timeout:10,prepare:false,ssl:local&&process.env.NODE_ENV!=='production'?false:{rejectUnauthorized:true},onnotice:()=>{}});
 }
 async close(){await this.sql.end({timeout:5});}
 async rows():Promise<ContentRow[]>{return this.sql<ContentRow[]>`SELECT * FROM mitch_content.documents ORDER BY id`;}
 async save(id:string,revision:string|null,publishedRevision:string|null,mode:'draft'|'publish',build:(existing:any,hasMedia:(id:string)=>Promise<boolean>)=>Promise<any>){
  await this.sql.begin(async sql=>{
   // Serialize edits including first creation and uniqueness checks.
   await sql`SELECT pg_advisory_xact_lock(62395821)`;
   const [row]=await sql<ContentRow[]>`SELECT * FROM mitch_content.documents WHERE id=${id} FOR UPDATE`;
   if((row?.draft_revision||row?.published_revision||null)!==revision||(row?.published_revision||null)!==publishedRevision)throw new ContentConflict('This item changed in another window. Reload before saving.');
   const value=await build(row?.draft||row?.published,async asset=>!!(await sql`SELECT id FROM mitch_content.media WHERE id=${asset}`).length);
   if(id.startsWith('project-')){
    const duplicates=await sql`SELECT id FROM mitch_content.documents WHERE id<>${id} AND id LIKE 'project-%' AND (published->>'slug'=${value.slug} OR draft->>'slug'=${value.slug})`;
    if(duplicates.length)throw new ContentConflict('Another project uses this page address. Choose another.');
   }
   if(mode==='draft')await sql`INSERT INTO mitch_content.documents(id,draft,draft_revision) VALUES (${id},${sql.json(value)},${randomUUID()}) ON CONFLICT(id) DO UPDATE SET draft=EXCLUDED.draft,draft_revision=EXCLUDED.draft_revision`;
   else await sql`INSERT INTO mitch_content.documents(id,published,published_revision) VALUES (${id},${sql.json(value)},${randomUUID()}) ON CONFLICT(id) DO UPDATE SET published=EXCLUDED.published,published_revision=EXCLUDED.published_revision,draft=NULL,draft_revision=NULL`;
  });
 }
 async putMedia(bytes:Buffer){
  const id=randomUUID();await this.sql.begin(async sql=>{
   await sql`SELECT pg_advisory_xact_lock(62395822)`;
   const [usage]=await sql`SELECT coalesce(sum(octet_length(bytes)),0)::bigint AS size FROM mitch_content.media`;
   if(Number(usage.size)+bytes.length>200*1024*1024)throw Error('Photo storage is full. Contact your developer to archive unused photos.');
   await sql`INSERT INTO mitch_content.media(id,bytes,content_type) VALUES (${id},${bytes},'image/webp')`;
  });return id;
 }
 async hasMedia(id:string){return !!(await this.sql`SELECT id FROM mitch_content.media WHERE id=${id}`).length;}
 async media(id:string,owner=false){
  // Unpublished uploads cannot be viewed by unauthenticated visitors.
  const path=`/api/media/${id}`;
  const [row]=await this.sql`SELECT bytes,content_type FROM mitch_content.media WHERE id=${id} AND (${owner} OR EXISTS(SELECT 1 FROM mitch_content.documents WHERE published::text LIKE ${'%'+path+'%'}))`;
  return row;
 }
}
let current:ContentStore|undefined;
export function contentStore(){if(!process.env.OWNER_DATABASE_URL)throw Error('Content storage is not configured.');return current??=new ContentStore(process.env.OWNER_DATABASE_URL);}
