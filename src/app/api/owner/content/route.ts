import {requireOwner,sameOrigin,OwnerError,ownerError} from '@/lib/owner/auth';
import {ownerData,saveOwnerContent} from '@/lib/owner/content';
export async function GET(){try{await requireOwner();return Response.json(await ownerData(),{headers:{'Cache-Control':'private, no-store'}});}catch(error){return ownerError(error);}}
export async function POST(request:Request){try{sameOrigin(request);await requireOwner();const text=await request.text();if(text.length>500_000)throw new OwnerError('This update is too large.');return Response.json(await saveOwnerContent(JSON.parse(text)),{headers:{'Cache-Control':'private, no-store'}});}catch(error){return ownerError(error);}}
