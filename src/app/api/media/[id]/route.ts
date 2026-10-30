import {contentStore} from '@/lib/owner/content-store';
import {isOwner} from '@/lib/owner/auth';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id))return new Response(null,{status:404});
 const owner=await isOwner();
 const media=await contentStore().media(id,owner);
 if(!media)return new Response(null,{status:404,headers:{'Cache-Control':'no-store'}});
 return new Response(new Uint8Array(media.bytes),{headers:{'Content-Type':'image/webp','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
