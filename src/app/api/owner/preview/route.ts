import {cookies,draftMode} from 'next/headers';
import {requireOwner,sameOrigin,ownerError} from '@/lib/owner/auth';
export async function POST(request:Request){try{
 sameOrigin(request);await requireOwner();const {path}=await request.json();
 const safe=typeof path==='string'&&/^\/(?:#team-heading|#careers|portfolio(?:\/[a-z0-9-]+)?)?$/.test(path)?path:'/';
 (await draftMode()).enable();(await cookies()).set('mitch_owner_preview','1',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/'});return Response.json({url:safe},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return ownerError(error);}}
