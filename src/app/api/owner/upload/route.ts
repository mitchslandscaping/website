import {requireOwner,sameOrigin,OwnerError,ownerError} from '@/lib/owner/auth';
import {ownerClient} from '@/lib/owner/content';
export async function POST(request:Request){try{
 sameOrigin(request);await requireOwner();const client=ownerClient(true);
 if(Number(request.headers.get('content-length'))>11*1024*1024)throw new OwnerError('Choose an image smaller than 10 MB.');
 const form=await request.formData();const file=form.get('file');
 if(!(file instanceof File)||file.size>10*1024*1024||!file.size)throw new OwnerError('Choose an image smaller than 10 MB.');
 const bytes=Buffer.from(await file.arrayBuffer());
 const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const webp=bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
 if(!jpeg&&!png&&!webp)throw new OwnerError('Please choose a JPG, PNG, or WebP image.');
 const asset=await client.assets.upload('image',bytes,{filename:`website-photo.${jpeg?'jpg':png?'png':'webp'}`,contentType:jpeg?'image/jpeg':png?'image/png':'image/webp'});
 return Response.json({image:{_type:'image',asset:{_type:'reference',_ref:asset._id}},url:asset.url},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return ownerError(error);}}
